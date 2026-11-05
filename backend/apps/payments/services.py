from decimal import Decimal
import hashlib
import hmac
import logging
from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
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
    """
    Accurately convert INR Decimal amount to integer paise.
    Does not use floating-point arithmetic.
    Example: Decimal('8025.00') -> 802500 paise.
    """
    if not isinstance(amount, Decimal):
        amount = Decimal(str(amount))
    return int((amount * Decimal('100')).quantize(Decimal('1')))


def verify_razorpay_payment_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
    """
    Verify Razorpay payment signature using HMAC-SHA256 and constant-time comparison.
    """
    if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
        return False

    _, key_secret, _ = get_razorpay_credentials()
    if not key_secret:
        logger.error("Razorpay key secret is not configured; cannot verify signature.")
        return False

    message = f"{razorpay_order_id}|{razorpay_payment_id}".encode('utf-8')
    generated_signature = hmac.new(
        key_secret.encode('utf-8'),
        message,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(generated_signature, razorpay_signature)


def create_razorpay_order_for_devmarket_order(
    order: Order,
    idempotency_key: str = '',
    razorpay_client=None
) -> tuple[Payment, dict]:
    """
    Create a Razorpay order for an existing pending DevMarket order.
    Reuses existing CREATED payment if already initialized and pending.
    """
    if order.status == Order.Status.PAID:
        raise PaymentServiceError("This order has already been paid.")

    if order.status == Order.Status.CANCELLED:
        raise PaymentServiceError("This order has been cancelled.")

    if order.currency != 'INR':
        raise PaymentServiceError(f"Unsupported currency: {order.currency}. DevMarket requires INR.")

    # Idempotent check: If there is already an existing payment record in CREATED state with a valid gateway_order_id, reuse it
    existing_created_payment = Payment.objects.filter(
        order=order,
        status=PaymentStatus.CREATED
    ).exclude(gateway_order_id='').first()

    key_id, _, _ = get_razorpay_credentials()
    amount_paise = inr_to_paise(order.total_amount)

    if existing_created_payment:
        checkout_payload = {
            'key_id': key_id,
            'razorpay_order_id': existing_created_payment.gateway_order_id,
            'amount': amount_paise,
            'currency': order.currency,
            'devmarket_order_number': order.order_number,
            'customer': {
                'name': (f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username) if order.user else '',
                'email': order.user.email if order.user else '',
            }
        }
        return existing_created_payment, checkout_payload

    # Initialize client and create order at Razorpay
    client = razorpay_client or get_razorpay_client()
    rzp_order_params = {
        'amount': amount_paise,
        'currency': order.currency,
        'receipt': order.order_number,
        'notes': {
            'order_number': order.order_number,
            'source': 'DevMarket',
        }
    }

    try:
        rzp_order = client.order.create(data=rzp_order_params)
    except Exception as exc:
        logger.error(f"Failed to create Razorpay order for DevMarket order {order.order_number}: {exc}")
        raise PaymentServiceError(f"Payment gateway order creation failed: {exc}")

    gateway_order_id = rzp_order.get('id')
    if not gateway_order_id:
        raise PaymentServiceError("Invalid response from Razorpay order creation.")

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
            'name': (f"{order.user.first_name} {order.user.last_name}".strip() or order.user.username) if order.user else '',
            'email': order.user.email if order.user else '',
        }
    }

    return payment, checkout_payload


def verify_and_settle_payment(
    razorpay_order_id: str,
    razorpay_payment_id: str,
    razorpay_signature: str,
    razorpay_client=None
) -> dict:
    """
    Verify payment signature and settlement with Razorpay.
    Only marks DevMarket order PAID upon verified payment capture.
    Guarantees idempotency and duplicate payment protection.
    """
    if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
        raise PaymentVerificationError("Missing payment verification parameters.")

    try:
        with transaction.atomic():
            # Select for update to avoid race conditions
            payment = Payment.objects.select_for_update().filter(gateway_order_id=razorpay_order_id).first()
            if not payment:
                raise PaymentVerificationError(f"No payment record found for gateway order {razorpay_order_id}.")

            order = Order.objects.select_for_update().get(pk=payment.order_id)

            # Idempotency check: If this exact payment is already CAPTURED on this payment record
            if payment.status == PaymentStatus.CAPTURED and payment.gateway_payment_id == razorpay_payment_id:
                return {
                    'status': 'success',
                    'message': 'Payment already verified and settled.',
                    'order_number': order.order_number,
                    'payment_status': payment.status,
                    'already_processed': True,
                }

            # Duplicate payment protection: Ensure this payment ID was not already used on a different payment/order
            duplicate_payment = Payment.objects.filter(gateway_payment_id=razorpay_payment_id).exclude(pk=payment.pk).first()
            if duplicate_payment:
                logger.error(
                    f"Fraud/Collision attempt: Razorpay payment {razorpay_payment_id} was already used on payment {duplicate_payment.id}!"
                )
                raise PaymentVerificationError("This payment ID has already been applied to another transaction.")

            # Signature verification
            if not verify_razorpay_payment_signature(razorpay_order_id, razorpay_payment_id, razorpay_signature):
                raise PaymentVerificationError("Invalid payment signature.")

            # Fetch payment details from Razorpay to verify against trusted gateway data
            client = razorpay_client or get_razorpay_client()
            try:
                gateway_payment = client.payment.fetch(razorpay_payment_id)
            except Exception as exc:
                logger.error(f"Failed to fetch payment details from Razorpay for {razorpay_payment_id}: {exc}")
                raise PaymentVerificationError(f"Could not retrieve payment details from gateway: {exc}")

            # Verify gateway payment corresponds to the expected order ID
            gw_order_id = gateway_payment.get('order_id')
            if gw_order_id != razorpay_order_id:
                raise PaymentVerificationError(f"Gateway order ID mismatch: expected {razorpay_order_id}, got {gw_order_id}.")

            # Verify currency
            gw_currency = gateway_payment.get('currency')
            if gw_currency != order.currency:
                raise PaymentVerificationError("Currency mismatch between gateway and order.")

            # Verify amount in paise
            expected_paise = inr_to_paise(order.total_amount)
            gw_amount = gateway_payment.get('amount')
            if int(gw_amount) != expected_paise:
                raise PaymentVerificationError("Payment amount mismatch between gateway and order.")

            # Check gateway payment status
            gw_status = gateway_payment.get('status')

            if gw_status == 'captured':
                payment.status = PaymentStatus.CAPTURED
                payment.gateway_payment_id = razorpay_payment_id
                payment.gateway_signature = razorpay_signature
                payment.payment_method = gateway_payment.get('method', '')
                payment.verified_at = timezone.now()
                payment.failure_reason = ''
                payment.save(update_fields=['status', 'gateway_payment_id', 'gateway_signature', 'payment_method', 'verified_at', 'failure_reason', 'updated_at'])

                order.status = Order.Status.PAID
                order.save(update_fields=['status', 'updated_at'])

                return {
                    'status': 'success',
                    'message': 'Payment verified and captured successfully.',
                    'order_number': order.order_number,
                    'payment_status': payment.status,
                    'already_processed': False,
                }

            elif gw_status == 'authorized':
                payment.status = PaymentStatus.AUTHORIZED
                payment.gateway_payment_id = razorpay_payment_id
                payment.gateway_signature = razorpay_signature
                payment.payment_method = gateway_payment.get('method', '')
                payment.save(update_fields=['status', 'gateway_payment_id', 'gateway_signature', 'payment_method', 'updated_at'])

                order.status = Order.Status.PAYMENT_PROCESSING
                order.save(update_fields=['status', 'updated_at'])

                return {
                    'status': 'authorized',
                    'message': 'Payment authorized but not yet captured.',
                    'order_number': order.order_number,
                    'payment_status': payment.status,
                    'already_processed': False,
                }

            else:
                raise PaymentVerificationError(f"Payment is not captured. Status: {gw_status}.")

    except PaymentVerificationError as exc:
        # Record failure state on the payment record for audit purposes
        fail_payment = Payment.objects.filter(gateway_order_id=razorpay_order_id).first()
        if fail_payment and fail_payment.status != PaymentStatus.CAPTURED:
            fail_payment.status = PaymentStatus.FAILED
            fail_payment.failure_reason = str(exc)
            fail_payment.save(update_fields=['status', 'failure_reason', 'updated_at'])
        raise
