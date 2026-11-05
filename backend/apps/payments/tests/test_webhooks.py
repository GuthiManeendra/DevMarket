from decimal import Decimal
import hashlib
import hmac
import json
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from apps.orders.models import Order
from apps.payments.models import (
    Payment,
    PaymentStatus,
    PaymentWebhookEvent,
    ProcessingStatus,
)


@override_settings(
    RAZORPAY_MODE='test',
    RAZORPAY_KEY_ID='rzp_test_webhook_key',
    RAZORPAY_KEY_SECRET='key_secret_not_used_for_webhook',
    RAZORPAY_WEBHOOK_SECRET='dedicated_webhook_secret_999',
)
class RazorpayWebhookTests(APITestCase):
    def setUp(self):
        self.webhook_secret = 'dedicated_webhook_secret_999'
        self.order = Order.objects.create(
            guest_token='guest_webhook_123',
            idempotency_key='order-wh-1',
            currency='INR',
            subtotal=Decimal('7500.00'),
            discount=Decimal('0.00'),
            discounted_subtotal=Decimal('7500.00'),
            platform_fee_percentage=Decimal('3.00'),
            platform_fee=Decimal('225.00'),
            convenience_fee_percentage=Decimal('4.00'),
            convenience_fee=Decimal('300.00'),
            tax_total=Decimal('0.00'),
            total_amount=Decimal('8025.00'),
            status=Order.Status.PENDING_PAYMENT,
        )

        self.payment = Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_rzp_wh_1',
            amount=self.order.total_amount,
            status=PaymentStatus.CREATED,
        )

    def _sign_payload(self, body_bytes: bytes, secret: str = None) -> str:
        s = secret or self.webhook_secret
        return hmac.new(s.encode('utf-8'), body_bytes, hashlib.sha256).hexdigest()

    def test_15_invalid_webhook_signature(self):
        """Test 15: Webhook with invalid signature is rejected with 400 Bad Request."""
        payload = {'id': 'evt_invalid_sig', 'event': 'payment.captured'}
        body = json.dumps(payload).encode('utf-8')

        response = self.client.post(
            '/api/payments/webhook/',
            data=body,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE='tampered_invalid_signature'
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("signature verification failed", response.data['detail'])

    def test_webhook_rejects_key_secret_as_signature(self):
        """Rule: Never verify webhook signatures using API Key Secret."""
        payload = {'id': 'evt_wrong_secret', 'event': 'payment.captured'}
        body = json.dumps(payload).encode('utf-8')
        sig_with_key_secret = self._sign_payload(body, secret='key_secret_not_used_for_webhook')

        response = self.client.post(
            '/api/payments/webhook/',
            data=body,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE=sig_with_key_secret
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_16_payment_captured_handling(self):
        """Test 16: payment.captured event marks payment CAPTURED and order PAID."""
        payload = {
            'id': 'evt_captured_1',
            'event': 'payment.captured',
            'payload': {
                'payment': {
                    'entity': {
                        'id': 'pay_wh_captured_1',
                        'order_id': 'order_rzp_wh_1',
                        'amount': 802500,
                        'currency': 'INR',
                        'status': 'captured',
                        'method': 'card',
                    }
                }
            }
        }
        body = json.dumps(payload).encode('utf-8')
        sig = self._sign_payload(body)

        response = self.client.post(
            '/api/payments/webhook/',
            data=body,
            content_type='application/json',
            HTTP_X_RAZORPAY_SIGNATURE=sig
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'processed')

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, PaymentStatus.CAPTURED)
        self.assertEqual(self.payment.gateway_payment_id, 'pay_wh_captured_1')
        self.assertEqual(self.payment.payment_method, 'card')

        # Check webhook event log
        event_log = PaymentWebhookEvent.objects.get(gateway_event_id='evt_captured_1')
        self.assertTrue(event_log.signature_verified)
        self.assertEqual(event_log.processing_status, ProcessingStatus.PROCESSED)

    def test_14_duplicate_webhook_event(self):
        """Test 14: Duplicate webhook event does not reprocess or cause duplicate effects."""
        payload = {
            'id': 'evt_duplicate_test',
            'event': 'payment.captured',
            'payload': {
                'payment': {
                    'entity': {
                        'id': 'pay_wh_dup_1',
                        'order_id': 'order_rzp_wh_1',
                        'amount': 802500,
                        'currency': 'INR',
                        'status': 'captured',
                    }
                }
            }
        }
        body = json.dumps(payload).encode('utf-8')
        sig = self._sign_payload(body)

        # First call
        res1 = self.client.post('/api/payments/webhook/', data=body, content_type='application/json', HTTP_X_RAZORPAY_SIGNATURE=sig)
        self.assertEqual(res1.status_code, status.HTTP_200_OK)
        self.assertEqual(res1.data['status'], 'processed')

        # Second duplicate call
        res2 = self.client.post('/api/payments/webhook/', data=body, content_type='application/json', HTTP_X_RAZORPAY_SIGNATURE=sig)
        self.assertEqual(res2.status_code, status.HTTP_200_OK)
        self.assertEqual(res2.data['status'], 'already_processed')

    def test_17_payment_failed_handling(self):
        """Test 17: payment.failed event marks payment FAILED and order PAYMENT_FAILED."""
        payload = {
            'id': 'evt_failed_1',
            'event': 'payment.failed',
            'payload': {
                'payment': {
                    'entity': {
                        'id': 'pay_wh_fail_1',
                        'order_id': 'order_rzp_wh_1',
                        'amount': 802500,
                        'currency': 'INR',
                        'error_description': 'Card expired or insufficient balance',
                    }
                }
            }
        }
        body = json.dumps(payload).encode('utf-8')
        sig = self._sign_payload(body)

        response = self.client.post('/api/payments/webhook/', data=body, content_type='application/json', HTTP_X_RAZORPAY_SIGNATURE=sig)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAYMENT_FAILED)

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, PaymentStatus.FAILED)
        self.assertEqual(self.payment.failure_reason, 'Card expired or insufficient balance')

    def test_18_order_paid_handling(self):
        """Test 18: order.paid webhook marks order as PAID."""
        payload = {
            'id': 'evt_order_paid_1',
            'event': 'order.paid',
            'payload': {
                'order': {
                    'entity': {
                        'id': 'order_rzp_wh_1',
                        'amount_paid': 802500,
                        'status': 'paid',
                    }
                }
            }
        }
        body = json.dumps(payload).encode('utf-8')
        sig = self._sign_payload(body)

        response = self.client.post('/api/payments/webhook/', data=body, content_type='application/json', HTTP_X_RAZORPAY_SIGNATURE=sig)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)

        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, PaymentStatus.CAPTURED)

    def test_19_out_of_order_webhook_events(self):
        """Test 19: payment.failed arriving AFTER order is already marked PAID does NOT downgrade order."""
        # Order is already PAID
        self.order.status = Order.Status.PAID
        self.order.save()
        self.payment.status = PaymentStatus.CAPTURED
        self.payment.gateway_payment_id = 'pay_already_captured'
        self.payment.save()

        # Delayed / out-of-order payment.failed event arrives
        payload = {
            'id': 'evt_delayed_fail',
            'event': 'payment.failed',
            'payload': {
                'payment': {
                    'entity': {
                        'id': 'pay_failed_later',
                        'order_id': 'order_rzp_wh_1',
                        'amount': 802500,
                        'error_description': 'Late timeout callback',
                    }
                }
            }
        }
        body = json.dumps(payload).encode('utf-8')
        sig = self._sign_payload(body)

        response = self.client.post('/api/payments/webhook/', data=body, content_type='application/json', HTTP_X_RAZORPAY_SIGNATURE=sig)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Order must remain PAID!
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)

        # Payment must remain CAPTURED!
        self.payment.refresh_from_db()
        self.assertEqual(self.payment.status, PaymentStatus.CAPTURED)

        # Event logged as ignored
        event = PaymentWebhookEvent.objects.get(gateway_event_id='evt_delayed_fail')
        self.assertEqual(event.processing_status, ProcessingStatus.IGNORED)

