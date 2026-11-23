from decimal import Decimal
import hashlib
import hmac
from unittest.mock import MagicMock
from django.test import TestCase, override_settings
from django.utils import timezone

from apps.orders.models import Order
from apps.payments.models import Payment, PaymentStatus
from apps.payments.services import (
    PaymentServiceError,
    PaymentVerificationError,
    create_razorpay_order_for_devmarket_order,
    inr_to_paise,
    verify_and_settle_payment,
    verify_razorpay_payment_signature,
)


@override_settings(
    RAZORPAY_MODE='test',
    RAZORPAY_KEY_ID='rzp_test_mock_key',
    RAZORPAY_KEY_SECRET='mock_secret_key_123',
    RAZORPAY_WEBHOOK_SECRET='mock_webhook_secret_456',
    RAZORPAY_TEST_KEY_ID='rzp_test_mock_key',
    RAZORPAY_TEST_KEY_SECRET='mock_secret_key_123',
    RAZORPAY_TEST_WEBHOOK_SECRET='mock_webhook_secret_456',
)
class PaymentServicesTests(TestCase):
    def setUp(self):
        self.order = Order.objects.create(
            guest_token='guest_token_abc',
            idempotency_key='test-order-key-1',
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

    def test_04_correct_inr_to_paise_conversion(self):
        """Test 4: Correct INR-to-paise conversion using Decimal."""
        self.assertEqual(inr_to_paise(Decimal('8025.00')), 802500)
        self.assertEqual(inr_to_paise(Decimal('7500.50')), 750050)
        self.assertEqual(inr_to_paise(Decimal('0.01')), 1)
        self.assertEqual(inr_to_paise('100.25'), 10025)

    def test_03_payment_order_creation(self):
        """Test 3: Payment order creation via mocked Razorpay SDK."""
        mock_client = MagicMock()
        mock_client.order.create.return_value = {
            'id': 'order_rzp_test_123',
            'amount': 802500,
            'currency': 'INR',
            'status': 'created',
        }

        payment, checkout = create_razorpay_order_for_devmarket_order(
            self.order,
            razorpay_client=mock_client
        )

        mock_client.order.create.assert_called_once_with(data={
            'amount': 802500,
            'currency': 'INR',
            'receipt': self.order.order_number,
            'notes': {
                'order_number': self.order.order_number,
                'source': 'DevMarket',
            }
        })

        self.assertEqual(payment.gateway_order_id, 'order_rzp_test_123')
        self.assertEqual(payment.amount, Decimal('8025.00'))
        self.assertEqual(payment.currency, 'INR')
        self.assertEqual(payment.status, PaymentStatus.CREATED)
        self.assertEqual(checkout['razorpay_order_id'], 'order_rzp_test_123')
        self.assertEqual(checkout['amount'], 802500)

    def test_05_repeated_payment_creation_requests(self):
        """Test 5: Repeated payment creation requests safely reuse existing valid gateway order."""
        mock_client = MagicMock()
        mock_client.order.create.return_value = {
            'id': 'order_rzp_test_reuse_1',
            'amount': 802500,
            'currency': 'INR',
        }

        # First creation
        payment1, checkout1 = create_razorpay_order_for_devmarket_order(
            self.order,
            razorpay_client=mock_client
        )

        # Second creation should reuse existing payment and not call client.order.create again
        payment2, checkout2 = create_razorpay_order_for_devmarket_order(
            self.order,
            razorpay_client=mock_client
        )

        self.assertEqual(mock_client.order.create.call_count, 1)
        self.assertEqual(payment1.pk, payment2.pk)
        self.assertEqual(checkout1['razorpay_order_id'], checkout2['razorpay_order_id'])

    def test_06_already_paid_order_rejection(self):
        """Test 6: Reject payment order creation for already-paid DevMarket order."""
        self.order.status = Order.Status.PAID
        self.order.save()

        mock_client = MagicMock()
        with self.assertRaises(PaymentServiceError) as ctx:
            create_razorpay_order_for_devmarket_order(self.order, razorpay_client=mock_client)
        self.assertIn("already been paid", str(ctx.exception))
        mock_client.order.create.assert_not_called()

    def test_07_valid_signature_verification(self):
        """Test 7: Valid HMAC-SHA256 signature verification."""
        order_id = 'order_valid_123'
        payment_id = 'pay_valid_456'
        msg = f"{order_id}|{payment_id}".encode('utf-8')
        valid_signature = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        self.assertTrue(verify_razorpay_payment_signature(order_id, payment_id, valid_signature))

    def test_08_invalid_signature_rejection(self):
        """Test 8: Invalid signature rejection."""
        self.assertFalse(
            verify_razorpay_payment_signature('order_1', 'pay_1', 'tampered_fake_signature')
        )

    def test_09_wrong_razorpay_order_id(self):
        """Test 9: Verification fails when Razorpay order ID is unknown or wrong."""
        with self.assertRaises(PaymentVerificationError) as ctx:
            verify_and_settle_payment(
                razorpay_order_id='order_nonexistent_999',
                razorpay_payment_id='pay_some_id',
                razorpay_signature='some_sig'
            )
        self.assertIn("No payment record found", str(ctx.exception))

    def test_10_wrong_payment_to_order_mapping(self):
        """Test 10: Fails when gateway returns a payment belonging to a different order ID."""
        payment = Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_expected_10',
            amount=self.order.total_amount,
            status=PaymentStatus.CREATED,
        )

        msg = f"order_expected_10|pay_10".encode('utf-8')
        sig = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        mock_client = MagicMock()
        mock_client.payment.fetch.return_value = {
            'id': 'pay_10',
            'order_id': 'order_DIFFERENT_than_expected',
            'amount': 802500,
            'currency': 'INR',
            'status': 'captured',
        }

        with self.assertRaises(PaymentVerificationError) as ctx:
            verify_and_settle_payment(
                razorpay_order_id='order_expected_10',
                razorpay_payment_id='pay_10',
                razorpay_signature=sig,
                razorpay_client=mock_client
            )
        self.assertIn("order ID mismatch", str(ctx.exception))
        payment.refresh_from_db()
        self.assertEqual(payment.status, PaymentStatus.FAILED)

    def test_11_amount_mismatch(self):
        """Test 11: Fails when gateway payment amount does not match order total amount."""
        Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_amt_11',
            amount=self.order.total_amount,
            status=PaymentStatus.CREATED,
        )

        msg = f"order_amt_11|pay_11".encode('utf-8')
        sig = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        mock_client = MagicMock()
        mock_client.payment.fetch.return_value = {
            'id': 'pay_11',
            'order_id': 'order_amt_11',
            'amount': 500000, # Only 5000 INR instead of 8025 INR
            'currency': 'INR',
            'status': 'captured',
        }

        with self.assertRaises(PaymentVerificationError) as ctx:
            verify_and_settle_payment(
                razorpay_order_id='order_amt_11',
                razorpay_payment_id='pay_11',
                razorpay_signature=sig,
                razorpay_client=mock_client
            )
        self.assertIn("amount mismatch", str(ctx.exception))
        self.order.refresh_from_db()
        self.assertNotEqual(self.order.status, Order.Status.PAID)

    def test_12_currency_mismatch(self):
        """Test 12: Fails when gateway payment currency does not match order currency."""
        Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_cur_12',
            amount=self.order.total_amount,
            status=PaymentStatus.CREATED,
        )

        msg = f"order_cur_12|pay_12".encode('utf-8')
        sig = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        mock_client = MagicMock()
        mock_client.payment.fetch.return_value = {
            'id': 'pay_12',
            'order_id': 'order_cur_12',
            'amount': 802500,
            'currency': 'USD', # USD instead of INR
            'status': 'captured',
        }

        with self.assertRaises(PaymentVerificationError) as ctx:
            verify_and_settle_payment(
                razorpay_order_id='order_cur_12',
                razorpay_payment_id='pay_12',
                razorpay_signature=sig,
                razorpay_client=mock_client
            )
        self.assertIn("Currency mismatch", str(ctx.exception))

    def test_13_duplicate_payment_verification(self):
        """Test 13: Duplicate payment verification returns existing result idempotently without side-effects."""
        payment = Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_dup_13',
            gateway_payment_id='pay_dup_13',
            amount=self.order.total_amount,
            status=PaymentStatus.CAPTURED,
            verified_at=timezone.now(),
        )
        self.order.status = Order.Status.PAID
        self.order.save()

        msg = f"order_dup_13|pay_dup_13".encode('utf-8')
        sig = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        result = verify_and_settle_payment(
            razorpay_order_id='order_dup_13',
            razorpay_payment_id='pay_dup_13',
            razorpay_signature=sig,
        )

        self.assertEqual(result['status'], 'success')
        self.assertTrue(result['already_processed'])
        self.assertEqual(result['payment_status'], PaymentStatus.CAPTURED)

    def test_20_payment_retry_after_failure(self):
        """Test 20: After a failed payment attempt, user can retry with the same pending order."""
        # First attempt failed
        Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_fail_1',
            amount=self.order.total_amount,
            status=PaymentStatus.FAILED,
            failure_reason='Payment declined by bank',
        )

        mock_client = MagicMock()
        mock_client.order.create.return_value = {
            'id': 'order_retry_2',
            'amount': 802500,
            'currency': 'INR',
        }

        # Second attempt should create a new gateway session for the same order
        new_payment, checkout = create_razorpay_order_for_devmarket_order(
            self.order,
            razorpay_client=mock_client
        )
        self.assertEqual(new_payment.gateway_order_id, 'order_retry_2')
        self.assertEqual(self.order.payments.count(), 2)

        # Settle the new attempt
        msg = f"order_retry_2|pay_success_retry".encode('utf-8')
        sig = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        mock_client.payment.fetch.return_value = {
            'id': 'pay_success_retry',
            'order_id': 'order_retry_2',
            'amount': 802500,
            'currency': 'INR',
            'status': 'captured',
            'method': 'card',
        }

        result = verify_and_settle_payment(
            razorpay_order_id='order_retry_2',
            razorpay_payment_id='pay_success_retry',
            razorpay_signature=sig,
            razorpay_client=mock_client
        )

        self.assertEqual(result['status'], 'success')
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, Order.Status.PAID)

    def test_21_prevention_of_one_payment_settling_multiple_orders(self):
        """Test 21: One Razorpay payment ID cannot be reused to settle another order."""
        # Settle order 1 with pay_single_token_123
        Payment.objects.create(
            order=self.order,
            gateway='razorpay',
            gateway_order_id='order_one_21',
            gateway_payment_id='pay_single_token_123',
            amount=self.order.total_amount,
            status=PaymentStatus.CAPTURED,
        )

        # Create second order
        order2 = Order.objects.create(
            guest_token='guest_token_xyz',
            idempotency_key='test-order-key-2',
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

        Payment.objects.create(
            order=order2,
            gateway='razorpay',
            gateway_order_id='order_two_21',
            amount=order2.total_amount,
            status=PaymentStatus.CREATED,
        )

        msg = f"order_two_21|pay_single_token_123".encode('utf-8')
        sig = hmac.new(b'mock_secret_key_123', msg, hashlib.sha256).hexdigest()

        with self.assertRaises(PaymentVerificationError) as ctx:
            verify_and_settle_payment(
                razorpay_order_id='order_two_21',
                razorpay_payment_id='pay_single_token_123',
                razorpay_signature=sig,
            )
        self.assertIn("already been applied to another transaction", str(ctx.exception))
        order2.refresh_from_db()
        self.assertNotEqual(order2.status, Order.Status.PAID)

