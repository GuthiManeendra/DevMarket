from django.test import SimpleTestCase, override_settings
from apps.payments.config import (
    RazorpayConfigError,
    get_razorpay_credentials,
    get_razorpay_mode,
    validate_razorpay_configuration,
)


class RazorpayConfigTests(SimpleTestCase):
    @override_settings(
        RAZORPAY_MODE='test',
        RAZORPAY_TEST_KEY_ID='rzp_test_12345',
        RAZORPAY_TEST_KEY_SECRET='secret_test_12345',
        RAZORPAY_TEST_WEBHOOK_SECRET='whsec_test_12345',
    )
    def test_01_razorpay_configuration_loading(self):
        """Test 1: Razorpay configuration loads correctly in test mode."""
        self.assertEqual(get_razorpay_mode(), 'test')
        key_id, secret, wh_secret = get_razorpay_credentials()
        self.assertEqual(key_id, 'rzp_test_12345')
        self.assertEqual(secret, 'secret_test_12345')
        self.assertEqual(wh_secret, 'whsec_test_12345')
        self.assertTrue(validate_razorpay_configuration())

    @override_settings(
        RAZORPAY_MODE='test',
        RAZORPAY_TEST_KEY_ID='',
        RAZORPAY_KEY_ID='',
        RAZORPAY_TEST_KEY_SECRET='',
        RAZORPAY_KEY_SECRET='',
    )
    def test_02_missing_credentials(self):
        """Test 2: Missing credentials raise RazorpayConfigError safely."""
        with self.assertRaises(RazorpayConfigError) as ctx:
            validate_razorpay_configuration()
        self.assertIn("Razorpay credentials are not configured", str(ctx.exception))

    @override_settings(
        RAZORPAY_MODE='live',
        RAZORPAY_LIVE_KEY_ID='rzp_live_abc123',
        RAZORPAY_LIVE_KEY_SECRET='live_secret_456',
        RAZORPAY_LIVE_WEBHOOK_SECRET='live_wh_secret_789',
    )
    def test_live_configuration_loading(self):
        """Test live credentials loading when RAZORPAY_MODE is live."""
        self.assertEqual(get_razorpay_mode(), 'live')
        key_id, secret, wh_secret = get_razorpay_credentials()
        self.assertEqual(key_id, 'rzp_live_abc123')
        self.assertEqual(secret, 'live_secret_456')
        self.assertEqual(wh_secret, 'live_wh_secret_789')
        self.assertTrue(validate_razorpay_configuration())

    @override_settings(
        RAZORPAY_MODE='live',
        RAZORPAY_LIVE_KEY_ID='rzp_test_invalid_in_live',
        RAZORPAY_LIVE_KEY_SECRET='live_secret_456',
    )
    def test_live_mode_rejects_test_key_prefix(self):
        """Test live mode requires rzp_live_ key prefix."""
        with self.assertRaises(RazorpayConfigError) as ctx:
            validate_razorpay_configuration()
        self.assertIn("does not start with 'rzp_live_'", str(ctx.exception))

