
from decimal import Decimal
import hashlib
import hmac
import logging

from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
from apps.cart.services import record_coupon_redemption

from .config import get_razorpay_client, get_razorpay_credentials
from .models import Payment, PaymentStatus

logger = logging.getLogger(__name__)


class PaymentServiceError(Exception):
    """Base exception for payment service errors."""
    pass


class PaymentVerificationError(PaymentServiceError):
    """Raised when payment verification fails."""
    pass


def inr_to_paise(amount: Decimal) -> int:
    if not isinstance(amount, Decimal):
        amount = Decimal(str(amount))

    return int((amount * Decimal('100')).quantize(Decimal('1')))


def verify_razorpay_payment_signature(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
) -> bool:
    if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
        return False

    _, key_secret, _ = get_razorpay_credentials()

    if not key_secret:
        logger.error(
            'Razorpay key secret is not configured; cannot verify signature.'
        )
        return False

    message = f'{razorpay_order_id}|{razorpay_payment_id}'.encode('utf-8')

    generated_signature = hmac.new(
        key_secret.encode('utf-8'),
        message,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(generated_signature, razorpay_signature)


def create_razorpay_order_for_devmarket_order(
    order: Order,
    idempotency_key: str = '',
    razorpay_client=None,
) -> tuple[Payment, dict]:

    if order.status == Order.Status.PAID:
        raise PaymentServiceError('This order has already been paid.')

    if order.status == Order.Status.CANCELLED:
        raise PaymentServiceError('This order has been cancelled.')

    if order.currency != 'INR':
        raise PaymentServiceError(
            f'Unsupported currency: {order.currency}. DevMarket requires INR.'
        )

    key_id, _, _ = get_razorpay_credentials()
    amount_paise = inr_to_paise(order.total_amount)

    # Check for any recent payment attempt (not just CREATED) to prevent duplicate gateway calls
    recent_payment = Payment.objects.filter(
        order=order,
    ).exclude(
        status__in=[PaymentStatus.FAILED, PaymentStatus.CAPTURED]
    ).order_by('-created_at').first()

    # If there's a recent payment attempt within the last 60 seconds, reuse it
    if recent_payment and recent_payment.gateway_order_id:
        time_since_creation = (timezone.now() - recent_payment.created_at).total_seconds()
        if time_since_creation < 60:
            checkout_payload = {
                'key_id': key_id,
                'razorpay_order_id': recent_payment.gateway_order_id,
                'amount': amount_paise,
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
            return recent_payment, checkout_payload

    client = razorpay_client or get_razorpay_client()

    rzp_order_params = {
        'amount': amount_paise,
        'currency': order.currency,
        'receipt': order.order_number,
        'notes': {
            'order_number': order.order_number,
            'source': 'DevMarket',
        },
    }

    try:
        rzp_order = client.order.create(data=rzp_order_params)
    except Exception as exc:
        error_str = str(exc).lower()
        logger.error(
            'Failed to create Razorpay order for %s: %s',
            order.order_number,
            exc,
        )

        # Handle rate limiting specifically
        if 'too many requests' in error_str or 'rate limit' in error_str:
            # Check if there's a recent payment we can fall back to
            fallback_payment = Payment.objects.filter(
                order=order,
            ).exclude(
                gateway_order_id=''
            ).order_by('-created_at').first()

            if fallback_payment and fallback_payment.gateway_order_id:
                logger.info(
                    'Rate limited, returning existing Razorpay order %s for %s',
                    fallback_payment.gateway_order_id,
                    order.order_number,
                )
                checkout_payload = {
                    'key_id': key_id,
                    'razorpay_order_id': fallback_payment.gateway_order_id,
                    'amount': amount_paise,
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
                return fallback_payment, checkout_payload

            raise PaymentServiceError(
                'Payment gateway is processing too many requests. Please wait a moment and try again.'
            )

        raise PaymentServiceError(
            f'Payment gateway order creation failed: {exc}'
        )

    gateway_order_id = rzp_order.get('id')

    if not gateway_order_id:
        raise PaymentServiceError(
            'Invalid response from Razorpay order creation.'
        )

    payment = Payment.objects.create(
        order=order,
        gateway='razorpay',
        gateway_order_id=gateway_order_id,
        amount=order.total_amount,
        currency=order.currency,
        status=PaymentStatus.CREATED,
        idempotency_key=idempotency_key,
    )

    checkout_payload = {
        'key_id': key_id,
        'razorpay_order_id': gateway_order_id,
        'amount': amount_paise,
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

    return payment, checkout_payload


def verify_and_settle_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    razorpay_client=None,
) -> dict:

    if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
        raise PaymentVerificationError(
            'Missing payment verification parameters.'
        )

    try:
        with transaction.atomic():
            payment = Payment.objects.select_for_update().filter(
                gateway_order_id=razorpay_order_id
            ).first()

            if not payment:
                raise PaymentVerificationError(
                    f'No payment record found for gateway order {razorpay_order_id}.'
                )

            order = Order.objects.select_for_update().get(
                pk=payment.order_id
            )

            if (
                payment.status == PaymentStatus.CAPTURED
                and payment.gateway_payment_id == razorpay_payment_id
            ):
                return {
                    'status': 'success',
                    'message': 'Payment already verified and settled.',
                    'order_number': order.order_number,
                    'payment_status': payment.status,
                    'already_processed': True,
                }

            duplicate_payment = Payment.objects.filter(
                gateway_payment_id=razorpay_payment_id
            ).exclude(pk=payment.pk).first()

            if duplicate_payment:
                raise PaymentVerificationError(
                    'This payment ID has already been applied to another transaction.'
                )

            if not verify_razorpay_payment_signature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            ):
                raise PaymentVerificationError('Invalid payment signature.')

            client = razorpay_client or get_razorpay_client()

            try:
                gateway_payment = client.payment.fetch(razorpay_payment_id)
            except Exception as exc:
                logger.error('Razorpay payment fetch failed: %s', exc)
                raise PaymentVerificationError(
                    f'Could not retrieve payment details from gateway: {exc}'
                )

            if gateway_payment.get('order_id') != razorpay_order_id:
                raise PaymentVerificationError('Gateway order ID mismatch.')

            if gateway_payment.get('currency') != order.currency:
                raise PaymentVerificationError(
                    'Currency mismatch between gateway and order.'
                )

            expected_paise = inr_to_paise(order.total_amount)

            if int(gateway_payment.get('amount', 0)) != expected_paise:
                raise PaymentVerificationError(
                    'Payment amount mismatch between gateway and order.'
                )

            gateway_status = gateway_payment.get('status')

            if gateway_status == 'captured':
                payment.status = PaymentStatus.CAPTURED
                payment.gateway_payment_id = razorpay_payment_id
                payment.gateway_signature = razorpay_signature
                payment.payment_method = gateway_payment.get('method', '')
                payment.verified_at = timezone.now()
                payment.failure_reason = ''

                payment.save(update_fields=[
                    'status',
                    'gateway_payment_id',
                    'gateway_signature',
                    'payment_method',
                    'verified_at',
                    'failure_reason',
                    'updated_at',
                ])

                order.status = Order.Status.PAID
                order.save(update_fields=['status', 'updated_at'])

                record_coupon_redemption(order)

                return {
                    'status': 'success',
                    'message': 'Payment verified and captured successfully.',
                    'order_number': order.order_number,
                    'payment_status': payment.status,
                    'payment_id': razorpay_payment_id,
                    'payment_method': payment.payment_method,
                    'amount': f'{payment.amount:.2f}',
                    'currency': payment.currency,
                    'already_processed': False,
                }

            if gateway_status == 'authorized':
                payment.status = PaymentStatus.AUTHORIZED
                payment.gateway_payment_id = razorpay_payment_id
                payment.gateway_signature = razorpay_signature
                payment.payment_method = gateway_payment.get('method', '')

                payment.save(update_fields=[
                    'status',
                    'gateway_payment_id',
                    'gateway_signature',
                    'payment_method',
                    'updated_at',
                ])

                order.status = Order.Status.PAYMENT_PROCESSING
                order.save(update_fields=['status', 'updated_at'])

                return {
                    'status': 'authorized',
                    'message': 'Payment authorized but not yet captured.',
                    'order_number': order.order_number,
                    'payment_status': payment.status,
                    'payment_id': razorpay_payment_id,
                    'payment_method': payment.payment_method,
                    'already_processed': False,
                }

            raise PaymentVerificationError(
                f'Payment is not captured. Status: {gateway_status}.'
            )

    except PaymentVerificationError as exc:
        fail_payment = Payment.objects.filter(
            gateway_order_id=razorpay_order_id
        ).first()

        if fail_payment and fail_payment.status != PaymentStatus.CAPTURED:
            fail_payment.status = PaymentStatus.FAILED
            fail_payment.failure_reason = str(exc)
            fail_payment.save(update_fields=[
                'status',
                'failure_reason',
                'updated_at',
            ])

        raise
