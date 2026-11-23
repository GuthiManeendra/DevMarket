from decimal import Decimal
import hashlib
import hmac
from unittest.mock import MagicMock, patch
from django.contrib.auth import get_user_model
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

from apps.orders.models import Order
from apps.payments.models import Payment, PaymentStatus

User = get_user_model()


@override_settings(
    RAZORPAY_MODE='test',
    RAZORPAY_KEY_ID='rzp_test_api_key',
    RAZORPAY_KEY_SECRET='api_secret_key_123',
    RAZORPAY_WEBHOOK_SECRET='api_webhook_secret_456',
    RAZORPAY_TEST_KEY_ID='rzp_test_api_key',
    RAZORPAY_TEST_KEY_SECRET='api_secret_key_123',
    RAZORPAY_TEST_WEBHOOK_SECRET='api_webhook_secret_456',
)
class PaymentAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='buyer1',
            email='buyer1@example.com',
            password='Password123!',
            first_name='John',
            last_name='Doe'
        )
        self.other_user = User.objects.create_user(
            username='buyer2',
            email='buyer2@example.com',
            password='Password123!'
        )

        self.user_order = Order.objects.create(
            user=self.user,
            idempotency_key='user-order-key-1',
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

        self.guest_order = Order.objects.create(
            guest_token='guest_valid_token_123',
            idempotency_key='guest-order-key-1',
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

    @patch('apps.payments.services.get_razorpay_client')
    def test_create_payment_order_api(self, mock_get_client):
        """Test POST /api/payments/create/ with authorized user."""
        mock_client = MagicMock()
        mock_client.order.create.return_value = {
            'id': 'order_rzp_api_1',
            'amount': 802500,
            'currency': 'INR',
        }
        mock_get_client.return_value = mock_client

        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/payments/create/', {
            'order_number': self.user_order.order_number
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['razorpay_order_id'], 'order_rzp_api_1')
        self.assertEqual(response.data['amount'], 802500)
        self.assertEqual(response.data['customer']['email'], 'buyer1@example.com')

    def test_22_prevention_of_unauthorized_order_access(self):
        """Test 22: Unauthorized users and incorrect guest tokens cannot create payment sessions."""
        # 1. Unauthenticated request to a user order
        response = self.client.post('/api/payments/create/', {
            'order_number': self.user_order.order_number
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # 2. Authenticated as different user
        self.client.force_authenticate(user=self.other_user)
        response = self.client.post('/api/payments/create/', {
            'order_number': self.user_order.order_number
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # 3. Guest request with wrong token
        self.client.force_authenticate(user=None)
        response = self.client.post(
            '/api/payments/create/',
            {'order_number': self.guest_order.order_number},
            format='json',
            HTTP_X_GUEST_TOKEN='wrong_token_456'
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        # 4. Guest request with correct token succeeds
        with patch('apps.payments.services.get_razorpay_client') as mock_get_client:
            mock_client = MagicMock()
            mock_client.order.create.return_value = {'id': 'order_rzp_guest_1', 'amount': 802500}
            mock_get_client.return_value = mock_client

            response = self.client.post(
                '/api/payments/create/',
                {'order_number': self.guest_order.order_number},
                format='json',
                HTTP_X_GUEST_TOKEN='guest_valid_token_123'
            )
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_23_no_order_marked_paid_from_frontend_callback_alone(self):
        """Test 23: Merely calling create-order or frontend callback does NOT mark order paid without verification."""
        payment = Payment.objects.create(
            order=self.guest_order,
            gateway='razorpay',
            gateway_order_id='order_rzp_callback_test',
            amount=self.guest_order.total_amount,
            status=PaymentStatus.CREATED,
        )

        # Order must remain pending_payment
        self.guest_order.refresh_from_db()
        self.assertEqual(self.guest_order.status, Order.Status.PENDING_PAYMENT)
        self.assertEqual(payment.status, PaymentStatus.CREATED)

    @patch('apps.payments.services.get_razorpay_client')
    def test_verify_payment_api_success(self, mock_get_client):
        """Test POST /api/payments/verify/ with valid signature and captured status."""
        payment = Payment.objects.create(
            order=self.guest_order,
            gateway='razorpay',
            gateway_order_id='order_verify_api_1',
            amount=self.guest_order.total_amount,
            status=PaymentStatus.CREATED,
        )

        order_id = 'order_verify_api_1'
        payment_id = 'pay_verify_api_1'
        msg = f"{order_id}|{payment_id}".encode('utf-8')
        sig = hmac.new(b'api_secret_key_123', msg, hashlib.sha256).hexdigest()

        mock_client = MagicMock()
        mock_client.payment.fetch.return_value = {
            'id': payment_id,
            'order_id': order_id,
            'amount': 802500,
            'currency': 'INR',
            'status': 'captured',
            'method': 'upi',
        }
        mock_get_client.return_value = mock_client

        response = self.client.post('/api/payments/verify/', {
            'razorpay_order_id': order_id,
            'razorpay_payment_id': payment_id,
            'razorpay_signature': sig,
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')

        self.guest_order.refresh_from_db()
        self.assertEqual(self.guest_order.status, Order.Status.PAID)

        payment.refresh_from_db()
        self.assertEqual(payment.status, PaymentStatus.CAPTURED)
        self.assertEqual(payment.gateway_payment_id, payment_id)
        self.assertEqual(payment.payment_method, 'upi')

    def test_verify_payment_api_invalid_signature(self):
        """Test POST /api/payments/verify/ with invalid signature rejected with 400."""
        Payment.objects.create(
            order=self.guest_order,
            gateway='razorpay',
            gateway_order_id='order_verify_fail',
            amount=self.guest_order.total_amount,
            status=PaymentStatus.CREATED,
        )

        response = self.client.post('/api/payments/verify/', {
            'razorpay_order_id': 'order_verify_fail',
            'razorpay_payment_id': 'pay_verify_fail',
            'razorpay_signature': 'invalid_bad_sig',
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Invalid payment signature", response.data['detail'])

        self.guest_order.refresh_from_db()
        self.assertNotEqual(self.guest_order.status, Order.Status.PAID)

    def test_payment_status_endpoint(self):
        """Test GET /api/payments/status/<order_number>/."""
        Payment.objects.create(
            order=self.guest_order,
            gateway='razorpay',
            gateway_order_id='order_stat_1',
            amount=self.guest_order.total_amount,
            status=PaymentStatus.CREATED,
        )

        response = self.client.get(
            f'/api/payments/status/{self.guest_order.order_number}/',
            HTTP_X_GUEST_TOKEN='guest_valid_token_123'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['order_number'], self.guest_order.order_number)
        self.assertFalse(response.data['is_paid'])
        self.assertEqual(len(response.data['payments']), 1)
