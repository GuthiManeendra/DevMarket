from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order, OrderItem

from .models import CartItem
from .serializers import CartItemSerializer
from .services import calculate_quote, get_cart, merge_guest_cart


def cart_for_request(request):
    return get_cart(request.user, request.headers.get('X-Guest-Token', ''))


def quote_response(cart, coupon=''):
    quote = calculate_quote(cart, coupon)
    quote.pop('coupon', None)
    return quote


class CartView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        cart = cart_for_request(request)
        return Response({'cart_id': cart.id, 'guest_token': cart.guest_token if not request.user.is_authenticated else None, **quote_response(cart)})


class CartItemCreateView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CartItemSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        cart = cart_for_request(request)
        data = serializer.validated_data
        item = CartItem(
            cart=cart,
            project_id=data.get('project_id'),
            portfolio_template_id=data.get('portfolio_template_id'),
            quantity=1,
            selected_customization_options=data.get('selected_customization_options', []),
        )
        try:
            item.full_clean()
            item.save()
            calculate_quote(cart)
        except (DjangoValidationError, ValueError) as error:
            return Response({'detail': error.message_dict if hasattr(error, 'message_dict') else str(error)}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'id': item.id, **quote_response(cart)}, status=status.HTTP_201_CREATED)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = CartItemSerializer
    http_method_names = ['patch', 'delete']

    def get_queryset(self):
        return CartItem.objects.filter(cart=cart_for_request(self.request))

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
        cart = merge_guest_cart(request.user, request.data.get('guest_token', ''))
        return Response({'cart_id': cart.id, **quote_response(cart)})


class QuoteView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            return Response({'success': True, **quote_response(cart_for_request(request), request.data.get('coupon_code', ''))})
        except DjangoValidationError as error:
            return Response({'success': False, 'errors': error.message_dict if hasattr(error, 'message_dict') else {'detail': error.messages}}, status=status.HTTP_400_BAD_REQUEST)


class CouponValidateView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        try:
            quote = calculate_quote(cart_for_request(request), request.data.get('code', ''))
        except DjangoValidationError as error:
            return Response({'valid': False, 'errors': error.message_dict if hasattr(error, 'message_dict') else {'detail': error.messages}}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'valid': True, 'discount': f'{quote["discount"]:.2f}', 'currency': quote['currency']})


class CreateOrderView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        cart = cart_for_request(request)
        key = request.headers.get('Idempotency-Key') or request.data.get('idempotency_key')
        if not key:
            return Response({'detail': 'Idempotency-Key is required.'}, status=status.HTTP_400_BAD_REQUEST)
        existing = Order.objects.filter(idempotency_key=key).first()
        if existing:
            return Response({'order_number': existing.order_number, 'status': existing.status, 'total_amount': f'{existing.total_amount:.2f}'})
        try:
            quote = calculate_quote(cart, request.data.get('coupon_code', ''))
        except DjangoValidationError as error:
            return Response({'detail': error.message_dict if hasattr(error, 'message_dict') else error.messages}, status=status.HTTP_400_BAD_REQUEST)
        if not quote['items']:
            return Response({'detail': 'Your cart is empty.'}, status=status.HTTP_400_BAD_REQUEST)
        order = Order.objects.create(
            user=request.user if request.user.is_authenticated else None,
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
            coupon_code_snapshot=request.data.get('coupon_code', ''),
            tax_configuration_snapshot=quote['taxes'],
        )
        for item in quote['items']:
            OrderItem.objects.create(order=order, product_type=item['product_type'], product_id=item['product_id'], product_title_snapshot=item['title'], product_slug_snapshot=item['slug'], base_price_snapshot=item['base_price'], customization_snapshot={'total': str(item['customization_total'])}, quantity=item['quantity'], total_snapshot=item['total'])
        if quote['coupon']:
            from .models import Coupon

            coupon = Coupon.objects.select_for_update().get(pk=quote['coupon'].pk)
            coupon.total_used += 1
            coupon.save(update_fields=['total_used', 'updated_at'])
        return Response({'order_number': order.order_number, 'status': order.status, 'currency': order.currency, 'total_amount': f'{order.total_amount:.2f}'}, status=status.HTTP_201_CREATED)
