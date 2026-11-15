import logging

from django.conf import settings
from django.core.mail import send_mail

logger = logging.getLogger(__name__)


def send_welcome_email(user):
    """
    Send a welcome email to a newly registered DevMarket customer.

    Returns True on success, False on failure.
    Email failures are logged but never raised — they must never
    block or undo account creation.
    """
    name = user.get_full_name() or user.username

    subject = "Welcome to DevMarket \u2013 Registration Successful!"

    message = (
        f"Hello {name},\n\n"
        "Congratulations!\n\n"
        "Your DevMarket account has been successfully created.\n\n"
        "Welcome to DevMarket!\n\n"
        "You can now explore:\n\n"
        "- Professional Portfolios\n"
        "- Premium Animated Portfolios\n"
        "- Development Projects\n"
        "- Exclusive Offers and Discounts\n\n"
        "Thank you for joining DevMarket.\n\n"
        "Best Regards,\n"
        "Team DevMarket\n"
    )

    try:
        send_mail(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        logger.info(
            "Welcome email sent successfully to %s (user_id=%s).",
            user.email,
            user.pk,
        )
        return True

    except Exception as exc:  # noqa: BLE001
        logger.error(
            "Failed to send welcome email to %s (user_id=%s): %s",
            user.email,
            user.pk,
            exc,
            exc_info=True,
        )
        return False
