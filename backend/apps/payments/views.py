import logging
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.orders.models import Order
from .models import Payment
from .permissions import has_order_access
from .serializers import (
    PaymentCreateSerializer,
    PaymentSerializer,
    PaymentVerifySerializer,
)
from .services import (
    PaymentServiceError,
    PaymentVerificationError,
    create_razorpay_order_for_devmarket_order,
    verify_and_settle_payment,
    inr_to_paise,
)
from .webhooks import (
    WebhookVerificationError,
    process_razorpay_webhook_event,
)
from .config import get_razorpay_credentials

logger = logging.getLogger(__name__)


class RazorpayCreateOrderView(APIView):
    """
    POST /api/payments/create/
    Initializes a Razorpay order for an existing pending DevMarket order.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PaymentCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        order_number = serializer.validated_data['order_number']
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({'detail': f"Order '{order_number}' not found."}, status=status.HTTP_404_NOT_FOUND)

        if not has_order_access(order, request):
            return Response(
                {'detail': 'You do not have permission to access or pay for this order.'},
                status=status.HTTP_403_FORBIDDEN
            )

        if order.status == Order.Status.PAID:
            return Response({'detail': 'This order has already been paid.'}, status=status.HTTP_400_BAD_REQUEST)

        if order.status == Order.Status.CANCELLED:
            return Response({'detail': 'This order has been cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        idempotency_key = (
            request.headers.get('Idempotency-Key')
            or request.data.get('idempotency_key', '')
        )

        # Check for existing payment with same idempotency key to prevent duplicate requests
        if idempotency_key:
            existing_payment = Payment.objects.filter(
                order=order,
                idempotency_key=idempotency_key
            ).exclude(
                status__in=['failed', 'captured']
            ).first()
            if existing_payment and existing_payment.gateway_order_id:
                key_id, _, _ = get_razorpay_credentials()
                checkout_payload = {
                    'key_id': key_id,
                    'razorpay_order_id': existing_payment.gateway_order_id,
                    'amount': inr_to_paise(order.total_amount),
                    'currency': order.currency,
                    'devmarket_order_number': order.order_number,
                    'customer': {
                        'name': (
                            f'{order.user.first_name} {order.user.last_name}'.strip()
                            or order.user.username
                        ) if order.user else '',
                        'email': order.user.email if order.user else '',
                    },
                }
                return Response(checkout_payload, status=status.HTTP_200_OK)

        try:
            payment, checkout_payload = create_razorpay_order_for_devmarket_order(
                order=order,
                idempotency_key=idempotency_key
            )
            return Response(checkout_payload, status=status.HTTP_201_CREATED)
        except PaymentServiceError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error(f"Unexpected error creating Razorpay payment order: {exc}", exc_info=True)
            return Response(
                {'detail': 'Unable to initialize payment gateway session. Please try again later.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class RazorpayVerifyPaymentView(APIView):
    """
    POST /api/payments/verify/
    Verifies payment signature from Razorpay Checkout callback and confirms capture.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PaymentVerifySerializer(data=request.data)
        if not serializer.is_valid():
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            result = verify_and_settle_payment(
                razorpay_order_id=data['razorpay_order_id'],
                razorpay_payment_id=data['razorpay_payment_id'],
                razorpay_signature=data['razorpay_signature'],
            )
            return Response(result, status=status.HTTP_200_OK)
        except PaymentVerificationError as exc:
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error(f"Unexpected error verifying Razorpay payment: {exc}", exc_info=True)
            return Response(
                {'detail': 'Payment verification encountered an unexpected error.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@method_decorator(csrf_exempt, name='dispatch')
class RazorpayWebhookView(APIView):
    """
    POST /api/payments/webhook/
    Webhook endpoint called by Razorpay servers.
    Verifies X-Razorpay-Signature against raw body using RAZORPAY_WEBHOOK_SECRET.
    """
    permission_classes = [permissions.AllowAny]
    authentication_classes = []

    def post(self, request):
        signature = request.headers.get('X-Razorpay-Signature', '')
        if not signature:
            return Response({'detail': 'Missing X-Razorpay-Signature header.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = process_razorpay_webhook_event(
                raw_body=request.body,
                signature=signature
            )
            return Response(result, status=status.HTTP_200_OK)
        except WebhookVerificationError as exc:
            logger.warning(f"Webhook signature verification failed: {exc}")
            return Response({'detail': str(exc)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as exc:
            logger.error(f"Webhook handling error: {exc}", exc_info=True)
            return Response({'detail': 'Internal error processing webhook.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PaymentStatusView(APIView):
    """
    GET /api/payments/status/<order_number>/
    Retrieve the payment status and history for a given order.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, order_number):
        order = Order.objects.filter(order_number=order_number).first()
        if not order:
            return Response({'detail': 'Order not found.'}, status=status.HTTP_404_NOT_FOUND)

        if not has_order_access(order, request):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        payments = order.payments.all()
        return Response({
            'order_number': order.order_number,
            'status': order.status,
            'currency': order.currency,
            'total_amount': f"{order.total_amount:.2f}",
            'is_paid': order.status == Order.Status.PAID,
            'payments': PaymentSerializer(payments, many=True).data
        })

