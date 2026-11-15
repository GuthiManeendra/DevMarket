"""
DevMarket – WhatsApp Cloud API notification service.

Sends a WhatsApp template message to the configured admin number
whenever a new customer registers on DevMarket.

Template: devmarket_new_registration  (en_US, UTILITY category)
Variables:
    {{1}} – Customer full name
    {{2}} – Customer phone number  (or "Not provided")
    {{3}} – Customer email
    {{4}} – Registration date  (e.g. "12 November 2026")

Usage:
    from apps.core.whatsapp_service import send_registration_whatsapp
    send_registration_whatsapp(user)

This function NEVER raises – failures are logged and silently swallowed
so that a WhatsApp error can never interrupt account creation.
"""

import logging
from datetime import date

import requests
from django.conf import settings

logger = logging.getLogger(__name__)

# Human-readable month names for date formatting
_MONTHS = {
    1: 'January', 2: 'February', 3: 'March', 4: 'April',
    5: 'May', 6: 'June', 7: 'July', 8: 'August',
    9: 'September', 10: 'October', 11: 'November', 12: 'December',
}


def _format_date(d: date) -> str:
    """Return a date string like '12 November 2026'."""
    return f"{d.day} {_MONTHS[d.month]} {d.year}"


def _build_payload(name: str, phone: str, email: str, reg_date: str) -> dict:
    """
    Build the WhatsApp Cloud API request body.

    Variable order MUST match the approved template exactly:
        {{1}} name  {{2}} phone  {{3}} email  {{4}} date
    """
    admin_number = settings.WHATSAPP_ADMIN_NUMBER

    return {
        "messaging_product": "whatsapp",
        "to": admin_number,
        "type": "template",
        "template": {
            "name": settings.WHATSAPP_TEMPLATE_NAME,
            "language": {
                "code": settings.WHATSAPP_TEMPLATE_LANGUAGE,
            },
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": name},    # {{1}}
                        {"type": "text", "text": phone},   # {{2}}
                        {"type": "text", "text": email},   # {{3}}
                        {"type": "text", "text": reg_date},# {{4}}
                    ],
                }
            ],
        },
    }


def send_registration_whatsapp(user) -> bool:
    """
    Send a WhatsApp registration-notification to the admin number.

    Parameters
    ----------
    user : Django User instance
        The newly registered customer.  Must already be committed to DB.

    Returns
    -------
    bool
        True  – message accepted by Meta API (HTTP 200/201).
        False – any error (network, auth, bad template, etc.).
    """
    # ------------------------------------------------------------------ #
    # 1.  Validate configuration – bail out early with a clear log message #
    # ------------------------------------------------------------------ #
    missing = [
        var for var in (
            'WHATSAPP_ACCESS_TOKEN',
            'WHATSAPP_PHONE_NUMBER_ID',
            'WHATSAPP_ADMIN_NUMBER',
        )
        if not getattr(settings, var, '').strip()
    ]
    if missing:
        logger.error(
            "WhatsApp notification skipped – missing settings: %s. "
            "Set them in .env and restart Django.",
            ', '.join(missing),
        )
        return False

    # ------------------------------------------------------------------ #
    # 2.  Collect customer details                                         #
    # ------------------------------------------------------------------ #
    name = user.get_full_name().strip() or user.username

    # Phone number: DevMarket registration does not collect a phone number.
    # The field is included in the template for future use; "Not provided"
    # is used until a phone field is added to the registration form.
    phone = getattr(user, 'phone_number', None) or 'Not provided'

    email = user.email
    reg_date = _format_date(
        user.date_joined.date() if hasattr(user, 'date_joined')
        else date.today()
    )

    # ------------------------------------------------------------------ #
    # 3.  Build request                                                    #
    # ------------------------------------------------------------------ #
    url = settings.WHATSAPP_API_URL.format(
        phone_number_id=settings.WHATSAPP_PHONE_NUMBER_ID
    )
    headers = {
        'Authorization': f'Bearer {settings.WHATSAPP_ACCESS_TOKEN}',
        'Content-Type': 'application/json',
    }
    payload = _build_payload(name, phone, email, reg_date)

    # ------------------------------------------------------------------ #
    # 4.  Send & handle response                                           #
    # ------------------------------------------------------------------ #
    try:
        response = requests.post(
            url,
            headers=headers,
            json=payload,
            timeout=settings.WHATSAPP_API_TIMEOUT,
        )

        if response.status_code in (200, 201):
            logger.info(
                "WhatsApp notification sent for new registration: "
                "user_id=%s email=%s",
                user.pk,
                email,
            )
            return True

        # Non-2xx – parse error details from Meta's response
        error_data = {}
        try:
            error_data = response.json()
        except Exception:
            pass

        error_obj = error_data.get('error', {})
        error_code = error_obj.get('code', response.status_code)
        error_msg = error_obj.get('message', response.text[:300])
        error_subcode = error_obj.get('error_subcode', '')

        # Provide actionable guidance for common failure codes
        _log_api_error(error_code, error_subcode, error_msg, email, user.pk)
        return False

    except requests.exceptions.ConnectionError as exc:
        logger.error(
            "WhatsApp API connection failed for user_id=%s (%s): %s",
            user.pk, email, exc,
        )
    except requests.exceptions.Timeout:
        logger.error(
            "WhatsApp API request timed out for user_id=%s (%s).",
            user.pk, email,
        )
    except requests.exceptions.RequestException as exc:
        logger.error(
            "WhatsApp API request error for user_id=%s (%s): %s",
            user.pk, email, exc,
        )
    except Exception as exc:  # noqa: BLE001
        logger.error(
            "Unexpected error in WhatsApp service for user_id=%s (%s): %s",
            user.pk, email, exc,
            exc_info=True,
        )

    return False


# ------------------------------------------------------------------ #
# Internal helper – maps Meta error codes to clear log messages        #
# ------------------------------------------------------------------ #

def _log_api_error(code, subcode, message, email, user_id):
    """Log a human-readable explanation for Meta API error codes."""
    _known = {
        190: "Access token is invalid or expired. Regenerate it in Meta for Developers.",
        4:   "API rate limit hit. The notification will not be retried automatically.",
        100: (
            "Invalid parameter – check WHATSAPP_PHONE_NUMBER_ID, "
            "WHATSAPP_ADMIN_NUMBER and template variable count."
        ),
        131030: "Recipient number is not a valid WhatsApp account.",
        132000: (
            f"Template '{settings.WHATSAPP_TEMPLATE_NAME}' not found or not approved. "
            "Submit and get the template approved in Meta Business Manager before "
            "this notification will work in production."
        ),
        132001: (
            f"Template '{settings.WHATSAPP_TEMPLATE_NAME}' exists but is not approved "
            "yet. Wait for Meta's approval (usually 24–72 hours)."
        ),
    }
    hint = _known.get(int(code) if str(code).isdigit() else code, '')
    logger.error(
        "WhatsApp API error for user_id=%s (%s) – code=%s subcode=%s: %s%s",
        user_id, email, code, subcode, message,
        f" | HINT: {hint}" if hint else "",
    )
