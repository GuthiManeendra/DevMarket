import logging
from django.conf import settings
import razorpay

logger = logging.getLogger(__name__)


class RazorpayConfigError(Exception):
    """Raised when Razorpay configuration or credentials are missing or invalid."""
    pass


def get_razorpay_mode() -> str:
    """Return the active Razorpay mode ('test' or 'live'). Defaults to 'test'."""
    mode = getattr(settings, 'RAZORPAY_MODE', 'test')
    return mode.lower() if mode else 'test'


def get_razorpay_credentials():
    """
    Return a tuple of (key_id, key_secret, webhook_secret) based on the active mode.
    Ensures test and live credentials are never accidentally mixed.
    """
    mode = get_razorpay_mode()

    if mode == 'live':
        key_id = getattr(settings, 'RAZORPAY_LIVE_KEY_ID', '') or getattr(settings, 'RAZORPAY_KEY_ID', '')
        key_secret = getattr(settings, 'RAZORPAY_LIVE_KEY_SECRET', '') or getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        webhook_secret = getattr(settings, 'RAZORPAY_LIVE_WEBHOOK_SECRET', '') or getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')
    else:
        key_id = getattr(settings, 'RAZORPAY_TEST_KEY_ID', '') or getattr(settings, 'RAZORPAY_KEY_ID', '')
        key_secret = getattr(settings, 'RAZORPAY_TEST_KEY_SECRET', '') or getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        webhook_secret = getattr(settings, 'RAZORPAY_TEST_WEBHOOK_SECRET', '') or getattr(settings, 'RAZORPAY_WEBHOOK_SECRET', '')

    return key_id.strip(), key_secret.strip(), webhook_secret.strip()


def validate_razorpay_configuration():
    """
    Validate that Razorpay credentials are configured properly.
    Raises RazorpayConfigError if credentials are missing or invalid for current mode.
    """
    mode = get_razorpay_mode()
    key_id, key_secret, _ = get_razorpay_credentials()

    if not key_id or not key_secret:
        raise RazorpayConfigError(
            f"Razorpay credentials are not configured for mode '{mode}'. "
            "Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment variables."
        )

    if mode == 'live':
        if not key_id.startswith('rzp_live_'):
            raise RazorpayConfigError(
                "RAZORPAY_MODE is set to 'live', but RAZORPAY_KEY_ID does not start with 'rzp_live_'."
            )
        if getattr(settings, 'DEBUG', False):
            logger.warning("Running Razorpay Live mode with DEBUG=True is dangerous!")
    elif mode == 'test':
        # Accept dummy test keys in development / mock tests
        if key_id.startswith('rzp_live_'):
            raise RazorpayConfigError(
                "RAZORPAY_MODE is set to 'test', but a live key ('rzp_live_...') was provided. "
                "Do not mix live keys in test mode."
            )

    return True


def get_razorpay_client():
    """
    Return an initialized Razorpay Client instance.
    Raises RazorpayConfigError if credentials are missing.
    """
    validate_razorpay_configuration()
    key_id, key_secret, _ = get_razorpay_credentials()
    client = razorpay.Client(auth=(key_id, key_secret))
    return client

