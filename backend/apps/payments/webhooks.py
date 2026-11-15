
import hashlib
import hmac
import json
import logging

from django.db import transaction
from django.utils import timezone

from apps.orders.models import Order
from apps.cart.services import record_coupon_redemption

from .config import get_razorpay_credentials
from .models import (
    Payment,
    PaymentStatus,
    PaymentWebhookEvent,
    ProcessingStatus,
)
from .services import inr_to_paise

logger = logging.getLogger(__name__)


class WebhookVerificationError(Exception):
    """Raised when webhook signature verification fails."""
    pass


def verify_razorpay_webhook_signature(raw_body: bytes, signature: str) -> bool:
    if not signature or not raw_body:
        return False

    _, _, webhook_secret = get_razorpay_credentials()

    if not webhook_secret:
        logger.error('Razorpay webhook secret is not configured.')
        return False

    generated_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        raw_body,
        hashlib.sha256,
    ).hexdigest()

    return hmac.compare_digest(generated_signature, signature)


def process_razorpay_webhook_event(raw_body: bytes, signature: str) -> dict:
    if not verify_razorpay_webhook_signature(raw_body, signature):
        raise WebhookVerificationError(
            'Webhook signature verification failed.'
        )

    try:
        data = json.loads(raw_body.decode('utf-8'))
    except Exception as exc:
        raise WebhookVerificationError(
            f'Invalid JSON payload: {exc}'
        ) from exc

    event_id = data.get('id') or data.get('event_id', '')
    event_type = data.get('event', '')

    if not event_id:
        event_id = (
            f'evt_unidentified_'
            f'{hashlib.sha256(raw_body).hexdigest()[:16]}'
        )

    existing_event = PaymentWebhookEvent.objects.filter(
        gateway_event_id=event_id
    ).first()

    if (
        existing_event
        and existing_event.processing_status == ProcessingStatus.PROCESSED
    ):
        return {
            'status': 'already_processed',
            'event_id': event_id,
            'event_type': event_type,
        }

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
                entity = (
                    data.get('payload', {})
                    .get('payment', {})
                    .get('entity', {})
                )

                gateway_order_id = entity.get('order_id')
                payment_id = entity.get('id')
                amount = entity.get('amount')
                currency = entity.get('currency')
                method = entity.get('method', '')

                if not gateway_order_id or not payment_id:
                    raise ValueError(
                        'Missing order_id or payment ID in captured event.'
                    )

                payment = Payment.objects.select_for_update().filter(
                    gateway_order_id=gateway_order_id
                ).first()

                if not payment:
                    webhook_event.processing_status = ProcessingStatus.IGNORED
                    webhook_event.processing_error = (
                        f'No Payment record for gateway order {gateway_order_id}.'
                    )
                    webhook_event.save(update_fields=[
                        'processing_status',
                        'processing_error',
                    ])

                    return {
                        'status': 'ignored',
                        'detail': webhook_event.processing_error,
                    }

                order = Order.objects.select_for_update().get(
                    pk=payment.order_id
                )

                duplicate = Payment.objects.filter(
                    gateway_payment_id=payment_id
                ).exclude(pk=payment.pk).first()

                if duplicate:
                    raise ValueError(
                        f'Payment ID {payment_id} is already applied elsewhere.'
                    )

                expected_paise = inr_to_paise(order.total_amount)

                if (
                    int(amount or 0) != expected_paise
                    or currency != order.currency
                ):
                    raise ValueError(
                        'Payment amount or currency does not match the order.'
                    )

                if payment.status != PaymentStatus.CAPTURED:
                    payment.status = PaymentStatus.CAPTURED
                    payment.gateway_payment_id = payment_id
                    payment.payment_method = method
                    payment.verified_at = timezone.now()
                    payment.failure_reason = ''

                    payment.save(update_fields=[
                        'status',
                        'gateway_payment_id',
                        'payment_method',
                        'verified_at',
                        'failure_reason',
                        'updated_at',
                    ])

                order.status = Order.Status.PAID
                order.save(update_fields=['status', 'updated_at'])

                record_coupon_redemption(order)

            elif event_type == 'payment.failed':
                entity = (
                    data.get('payload', {})
                    .get('payment', {})
                    .get('entity', {})
                )

                gateway_order_id = entity.get('order_id')
                error_desc = (
                    entity.get('error_description') or 'Payment failed'
                )

                if gateway_order_id:
                    payment = Payment.objects.select_for_update().filter(
                        gateway_order_id=gateway_order_id
                    ).first()

                    if payment:
                        order = Order.objects.select_for_update().get(
                            pk=payment.order_id
                        )

                        if (
                            order.status == Order.Status.PAID
                            or payment.status == PaymentStatus.CAPTURED
                        ):
                            webhook_event.processing_status = ProcessingStatus.IGNORED
                            webhook_event.processing_error = (
                                'Already paid; failure event ignored.'
                            )
                            webhook_event.processed_at = timezone.now()
                            webhook_event.save(update_fields=[
                                'processing_status',
                                'processing_error',
                                'processed_at',
                            ])

                            return {
                                'status': 'ignored',
                                'detail': webhook_event.processing_error,
                            }

                        payment.status = PaymentStatus.FAILED
                        payment.failure_reason = error_desc
                        payment.save(update_fields=[
                            'status',
                            'failure_reason',
                            'updated_at',
                        ])

                        order.status = Order.Status.PAYMENT_FAILED
                        order.save(update_fields=['status', 'updated_at'])

            elif event_type == 'order.paid':
                entity = (
                    data.get('payload', {})
                    .get('order', {})
                    .get('entity', {})
                )

                gateway_order_id = entity.get('id')
                amount_paid = entity.get('amount_paid')

                payment = Payment.objects.select_for_update().filter(
                    gateway_order_id=gateway_order_id
                ).first() if gateway_order_id else None

                if not payment:
                    webhook_event.processing_status = ProcessingStatus.IGNORED
                    webhook_event.processing_error = (
                        f'No Payment found for order ID {gateway_order_id}.'
                    )
                    webhook_event.save(update_fields=[
                        'processing_status',
                        'processing_error',
                    ])

                    return {
                        'status': 'ignored',
                        'detail': webhook_event.processing_error,
                    }

                order = Order.objects.select_for_update().get(
                    pk=payment.order_id
                )

                expected_paise = inr_to_paise(order.total_amount)

                if int(amount_paid or 0) != expected_paise:
                    raise ValueError(
                        'Amount paid does not match the expected order amount.'
                    )

                if payment.status != PaymentStatus.CAPTURED:
                    payment.status = PaymentStatus.CAPTURED
                    payment.verified_at = timezone.now()
                    payment.save(update_fields=[
                        'status',
                        'verified_at',
                        'updated_at',
                    ])

                order.status = Order.Status.PAID
                order.save(update_fields=['status', 'updated_at'])

                record_coupon_redemption(order)

            else:
                webhook_event.processing_status = ProcessingStatus.IGNORED
                webhook_event.processing_error = (
                    'Unsupported or non-critical event.'
                )

            if webhook_event.processing_status != ProcessingStatus.IGNORED:
                webhook_event.processing_status = ProcessingStatus.PROCESSED
                webhook_event.processed_at = timezone.now()
                webhook_event.processing_error = ''

            webhook_event.save(update_fields=[
                'processing_status',
                'processed_at',
                'processing_error',
            ])

    except Exception as exc:
        logger.error(
            'Error processing webhook event %s: %s',
            event_id,
            exc,
            exc_info=True,
        )

        webhook_event.processing_status = ProcessingStatus.FAILED
        webhook_event.processing_error = str(exc)
        webhook_event.save(update_fields=[
            'processing_status',
            'processing_error',
        ])

        raise

    return {
        'status': 'processed',
        'event_id': event_id,
        'event_type': event_type,
    }
