
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from django.utils import timezone

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order, OrderItem

from .models import CartItem, Coupon, CouponRedemption
from .serializers import CartItemSerializer
from .services import calculate_quote, get_cart, merge_guest_cart

def cart_for_request(request):
    return get_cart(
        request.user,
        request.headers.get('X-Guest-Token', ''),
    )

def quote_response(cart, coupon='', item_ids=None):
    quote = calculate_quote(cart, coupon, item_ids=item_ids)
    quote.pop('coupon', None)
    return quote

class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = cart_for_request(request)
        return Response({
            'cart_id': cart.id,
            'guest_token': (
                cart.guest_token
                if not request.user.is_authenticated
                else None
            ),
            **quote_response(cart),
        })

class CartItemCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = cart_for_request(request)
        data = serializer.validated_data

        existing_item = cart.items.filter(
            project_id=data.get('project_id'),
            portfolio_template_id=data.get('portfolio_template_id'),
        ).first()

        if existing_item:
            return Response(
                {'id': existing_item.id, **quote_response(cart)},
                status=status.HTTP_200_OK,
            )

        item = CartItem(
            cart=cart,
            project_id=data.get('project_id'),
            portfolio_template_id=data.get('portfolio_template_id'),
            quantity=1,
            selected_customization_options=data.get(
                'selected_customization_options',
                [],
            ),
        )

        try:
            item.full_clean()
            item.save()
            calculate_quote(cart)
        except (DjangoValidationError, ValueError) as error:
            return Response(
                {
                    'detail': (
                        error.message_dict
                        if hasattr(error, 'message_dict')
                        else str(error)
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {'id': item.id, **quote_response(cart)},
            status=status.HTTP_201_CREATED,
        )

class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CartItemSerializer
    http_method_names = ['patch', 'delete']

    def get_queryset(self):
        return CartItem.objects.filter(
            cart=cart_for_request(self.request)
        )

    def patch(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)

    def perform_update(self, serializer):
        serializer.save()
        serializer.instance.full_clean()

class CartClearView(APIView):
    permission_classes = [permissions.AllowAny]

    def delete(self, request):
        cart = cart_for_request(request)
        cart.items.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class CartMergeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart = merge_guest_cart(
            request.user,
            request.data.get('guest_token', ''),
        )
        return Response({
            'cart_id': cart.id,
            **quote_response(cart),
        })

def _requested_item_ids(request):
    """Optional list of cart item IDs to scope a quote/order to (Buy Now flow)."""
    raw = request.data.get('item_ids')
    if raw is None:
        single = request.data.get('item_id')
        raw = [single] if single else None
    if raw is None:
        return None
    if not isinstance(raw, list):
        raise DjangoValidationError({'item_ids': 'Must be a list of cart item IDs.'})
    try:
        return [int(value) for value in raw]
    except (TypeError, ValueError) as error:
        raise DjangoValidationError({'item_ids': 'Must contain integer cart item IDs.'}) from error


class QuoteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            item_ids = _requested_item_ids(request)
            return Response({
                'success': True,
                **quote_response(
                    cart_for_request(request),
                    request.data.get('coupon_code', ''),
                    item_ids=item_ids,
                ),
            })
        except DjangoValidationError as error:
            return Response(
                {
                    'success': False,
                    'errors': (
                        error.message_dict
                        if hasattr(error, 'message_dict')
                        else {'detail': error.messages}
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            quote = calculate_quote(
                cart_for_request(request),
                request.data.get('code', ''),
            )
        except DjangoValidationError as error:
            return Response(
                {
                    'valid': False,
                    'errors': (
                        error.message_dict
                        if hasattr(error, 'message_dict')
                        else {'detail': error.messages}
                    ),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response({
            'valid': True,
            'discount': f'{quote["discount"]:.2f}',
            'currency': quote['currency'],
        })

class ActiveOffersView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        now = timezone.now()
        guest_token = request.headers.get('X-Guest-Token', '')

        coupons = Coupon.objects.filter(
            is_active=True,
            start_date__lte=now,
            expiry_date__gte=now,
        ).order_by('-created_at')

        offers = []

        for coupon in coupons:
            if (
                coupon.usage_limit is not None
                and coupon.total_used >= coupon.usage_limit
            ):
                continue

            if coupon.per_user_usage_limit:
                redemptions = CouponRedemption.objects.filter(
                    coupon=coupon
                )

                if request.user.is_authenticated:
                    used_count = redemptions.filter(
                        user=request.user
                    ).count()
                elif guest_token:
                    used_count = redemptions.filter(
                        guest_token=guest_token
                    ).count()
                else:
                    used_count = 0

                if used_count >= coupon.per_user_usage_limit:
                    continue

            offers.append({
                'id': coupon.id,
                'code': coupon.code,
                'description': coupon.description,
                'discount_type': coupon.discount_type,
                'discount_value': str(coupon.discount_value),
                'minimum_order_amount': str(coupon.minimum_order_amount),
                'maximum_discount_amount': (
                    str(coupon.maximum_discount_amount)
                    if coupon.maximum_discount_amount is not None
                    else None
                ),
                'start_date': coupon.start_date,
                'expiry_date': coupon.expiry_date,
                'applicable_product_types': coupon.applicable_product_types,
                'applicable_categories': coupon.applicable_categories,
            })

        return Response({'offers': offers})

class CreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        cart = cart_for_request(request)

        key = (
            request.headers.get('Idempotency-Key')
            or request.data.get('idempotency_key')
        )

        if not key:
            return Response(
                {'detail': 'Idempotency-Key is required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        existing = Order.objects.filter(idempotency_key=key).first()

        if existing:
            return Response({
                'order_number': existing.order_number,
                'status': existing.status,
                'total_amount': f'{existing.total_amount:.2f}',
            })

        coupon_code = request.data.get('coupon_code', '')

        try:
            item_ids = _requested_item_ids(request)
            quote = calculate_quote(cart, coupon_code, item_ids=item_ids)
        except DjangoValidationError as error:
            return Response(
                {
                    'detail': (
                        error.message_dict
                        if hasattr(error, 'message_dict')
                        else error.messages
                    )
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not quote['items']:
            return Response(
                {'detail': 'Your cart is empty.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        order = Order.objects.create(
            user=(
                request.user
                if request.user.is_authenticated
                else None
            ),
            guest_token=cart.guest_token,
            idempotency_key=key,
            currency=quote['currency'],
            subtotal=quote['subtotal'],
            discount=quote['discount'],
            discounted_subtotal=quote['discounted_subtotal'],
            platform_fee_percentage=quote['platform_fee_percentage'],
            platform_fee=quote['platform_fee'],
            convenience_fee_percentage=quote['convenience_fee_percentage'],
            convenience_fee=quote['convenience_fee'],
            tax_total=quote['tax_total'],
            total_amount=quote['total'],
            coupon_code_snapshot=(
                quote['coupon'].code if quote['coupon'] else ''
            ),
            tax_configuration_snapshot=quote['taxes'],
        )

        for item in quote['items']:
            OrderItem.objects.create(
                order=order,
                product_type=item['product_type'],
                product_id=item['product_id'],
                product_title_snapshot=item['title'],
                product_slug_snapshot=item['slug'],
                base_price_snapshot=item['base_price'],
                customization_snapshot={
                    'total': str(item['customization_total'])
                },
                quantity=item['quantity'],
                total_snapshot=item['total'],
            )

        return Response(
            {
                'order_number': order.order_number,
                'status': order.status,
                'currency': order.currency,
                'total_amount': f'{order.total_amount:.2f}',
            },
            status=status.HTTP_201_CREATED,
        )