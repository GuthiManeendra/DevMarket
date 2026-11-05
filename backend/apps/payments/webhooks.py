from decimal import Decimal
import hashlib
import hmac
import json
import logging
from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
from .config import get_razorpay_credentials
from .models import Payment, PaymentStatus, PaymentWebhookEvent, ProcessingStatus
from .services import inr_to_paise

logger = logging.getLogger(__name__)


class WebhookVerificationError(Exception):
    """Raised when webhook signature verification fails."""
    pass


def verify_razorpay_webhook_signature(raw_body: bytes, signature: str) -> bool:
    """
    Verify the X-Razorpay-Signature header using RAZORPAY_WEBHOOK_SECRET.
    Never uses the API Key Secret.
    """
    if not signature or not raw_body:
        return False

    _, _, webhook_secret = get_razorpay_credentials()
    if not webhook_secret:
        logger.error("RAZORPAY_WEBHOOK_SECRET is not configured; rejecting webhook.")
        return False

    generated_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        raw_body,
        hashlib.sha256
    ).hexdigest()

    return hmac.compare_digest(generated_signature, signature)


def process_razorpay_webhook_event(raw_body: bytes, signature: str) -> dict:
    """
    Validate, record, and idempotently process an incoming Razorpay webhook event.
    """
    if not verify_razorpay_webhook_signature(raw_body, signature):
        raise WebhookVerificationError("Webhook signature verification failed.")

    try:
        data = json.loads(raw_body.decode('utf-8'))
    except Exception as exc:
        raise WebhookVerificationError(f"Invalid JSON payload: {exc}")

    event_id = data.get('id') or data.get('event_id', '')
    event_type = data.get('event', '')

    if not event_id:
        # Fallback event ID for logging if missing
        event_id = f"evt_unidentified_{hashlib.sha256(raw_body).hexdigest()[:16]}"

    # Prevent duplicate event processing
    existing_event = PaymentWebhookEvent.objects.filter(gateway_event_id=event_id).first()
    if existing_event and existing_event.processing_status == ProcessingStatus.PROCESSED:
        logger.info(f"Webhook event {event_id} ({event_type}) was already processed. Returning idempotently.")
        return {
            'status': 'already_processed',
            'event_id': event_id,
            'event_type': event_type,
        }

    # Record or retrieve webhook event log
    if not existing_event:
        webhook_event = PaymentWebhookEvent.objects.create(
            gateway_event_id=event_id,
            event_type=event_type,
            payload=data,
            signature_verified=True,
            processing_status=ProcessingStatus.PENDING,
        )
    else:
        webhook_event = existing_event
        webhook_event.signature_verified = True
        webhook_event.save(update_fields=['signature_verified'])

    try:
        with transaction.atomic():
            if event_type == 'payment.captured':
                payment_entity = data.get('payload', {}).get('payment', {}).get('entity', {})
                order_id = payment_entity.get('order_id')
                payment_id = payment_entity.get('id')
                amount = payment_entity.get('amount')
                currency = payment_entity.get('currency')
                method = payment_entity.get('method', '')

                if not order_id:
                    webhook_event.processing_status = ProcessingStatus.FAILED
                    webhook_event.processing_error = "Missing order_id in payment.captured payload."
                    webhook_event.save(update_fields=['processing_status', 'processing_error'])
                    return {'status': 'failed', 'detail': webhook_event.processing_error}

                payment = Payment.objects.select_for_update().filter(gateway_order_id=order_id).first()
                if not payment:
                    webhook_event.processing_status = ProcessingStatus.IGNORED
                    webhook_event.processing_error = f"No Payment record for gateway order {order_id}."
                    webhook_event.save(update_fields=['processing_status', 'processing_error'])
                    return {'status': 'ignored', 'detail': webhook_event.processing_error}

                order = Order.objects.select_for_update().get(pk=payment.order_id)

                # Check duplicate payment across other orders
                duplicate_payment = Payment.objects.filter(gateway_payment_id=payment_id).exclude(pk=payment.pk).first()
                if duplicate_payment:
                    webhook_event.processing_status = ProcessingStatus.FAILED
                    webhook_event.processing_error = f"Payment ID {payment_id} already applied to another payment ({duplicate_payment.id})."
                    webhook_event.save(update_fields=['processing_status', 'processing_error'])
                    return {'status': 'failed', 'detail': webhook_event.processing_error}

                # Verify amount and currency
                expected_paise = inr_to_paise(order.total_amount)
                if int(amount) != expected_paise or currency != order.currency:
                    webhook_event.processing_status = ProcessingStatus.FAILED
                    webhook_event.processing_error = (
                        f"Amount or currency mismatch: received {amount} {currency}, "
                        f"expected {expected_paise} {order.currency}."
                    )
                    webhook_event.save(update_fields=['processing_status', 'processing_error'])
                    return {'status': 'failed', 'detail': webhook_event.processing_error}

                # Update payment
                payment.status = PaymentStatus.CAPTURED
                payment.gateway_payment_id = payment_id
                payment.payment_method = method
                payment.verified_at = timezone.now()
                payment.failure_reason = ''
                payment.save(update_fields=['status', 'gateway_payment_id', 'payment_method', 'verified_at', 'failure_reason', 'updated_at'])

                # Update order to PAID
                order.status = Order.Status.PAID
                order.save(update_fields=['status', 'updated_at'])

                webhook_event.processing_status = ProcessingStatus.PROCESSED
                webhook_event.processed_at = timezone.now()
                webhook_event.processing_error = ''
                webhook_event.save(update_fields=['processing_status', 'processed_at', 'processing_error'])

            elif event_type == 'payment.failed':
                payment_entity = data.get('payload', {}).get('payment', {}).get('entity', {})
                order_id = payment_entity.get('order_id')
                error_desc = payment_entity.get('error_description') or 'Payment failed'

                if order_id:
                    payment = Payment.objects.select_for_update().filter(gateway_order_id=order_id).first()
                    if payment:
                        order = Order.objects.select_for_update().get(pk=payment.order_id)
                        # Rule: Do not allow payment.failed to downgrade an already-paid order!
                        if order.status == Order.Status.PAID or payment.status == PaymentStatus.CAPTURED:
                            logger.warning(
                                f"Received payment.failed for order {order.order_number} which is already PAID. Ignoring downgrade."
                            )
                            webhook_event.processing_status = ProcessingStatus.IGNORED
                            webhook_event.processing_error = "Order or payment is already marked as PAID; failure event ignored."
                            webhook_event.processed_at = timezone.now()
                            webhook_event.save(update_fields=['processing_status', 'processing_error', 'processed_at'])
                            return {'status': 'ignored', 'detail': webhook_event.processing_error}
                        else:
                            payment.status = PaymentStatus.FAILED
                            payment.failure_reason = error_desc
                            payment.save(update_fields=['status', 'failure_reason', 'updated_at'])

                            order.status = Order.Status.PAYMENT_FAILED
                            order.save(update_fields=['status', 'updated_at'])

                webhook_event.processing_status = ProcessingStatus.PROCESSED
                webhook_event.processed_at = timezone.now()
                webhook_event.processing_error = ''
                webhook_event.save(update_fields=['processing_status', 'processed_at', 'processing_error'])

            elif event_type == 'order.paid':
                order_entity = data.get('payload', {}).get('order', {}).get('entity', {})
                order_id = order_entity.get('id')
                amount_paid = order_entity.get('amount_paid')

                if order_id:
                    payment = Payment.objects.select_for_update().filter(gateway_order_id=order_id).first()
                    if payment:
                        order = Order.objects.select_for_update().get(pk=payment.order_id)
                        expected_paise = inr_to_paise(order.total_amount)

                        if int(amount_paid) == expected_paise:
                            if payment.status != PaymentStatus.CAPTURED:
                                payment.status = PaymentStatus.CAPTURED
                                payment.verified_at = timezone.now()
                                payment.save(update_fields=['status', 'verified_at', 'updated_at'])

                            order.status = Order.Status.PAID
                            order.save(update_fields=['status', 'updated_at'])

                            webhook_event.processing_status = ProcessingStatus.PROCESSED
                            webhook_event.processed_at = timezone.now()
                            webhook_event.processing_error = ''
                            webhook_event.save(update_fields=['processing_status', 'processed_at', 'processing_error'])
                        else:
                            webhook_event.processing_status = ProcessingStatus.FAILED
                            webhook_event.processing_error = f"Amount paid mismatch in order.paid: got {amount_paid}, expected {expected_paise}."
                            webhook_event.save(update_fields=['processing_status', 'processing_error'])
                            return {'status': 'failed', 'detail': webhook_event.processing_error}
                    else:
                        webhook_event.processing_status = ProcessingStatus.IGNORED
                        webhook_event.processing_error = f"No Payment found for order ID {order_id}."
                        webhook_event.save(update_fields=['processing_status', 'processing_error'])
                else:
                    webhook_event.processing_status = ProcessingStatus.IGNORED
                    webhook_event.save(update_fields=['processing_status'])

            else:
                # Unsupported or non-critical event
                webhook_event.processing_status = ProcessingStatus.IGNORED
                webhook_event.processed_at = timezone.now()
                webhook_event.save(update_fields=['processing_status', 'processed_at'])

    except Exception as exc:
        logger.error(f"Error processing webhook event {event_id}: {exc}", exc_info=True)
        webhook_event.processing_status = ProcessingStatus.FAILED
        webhook_event.processing_error = str(exc)
        webhook_event.save(update_fields=['processing_status', 'processing_error'])
        raise

    return {
        'status': 'processed',
        'event_id': event_id,
        'event_type': event_type,
    }

