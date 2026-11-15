
import logging
import secrets
from decimal import Decimal, ROUND_HALF_UP

from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils import timezone

from apps.portfolios.models import PortfolioTemplate
from apps.products.models import Project

from .models import (
    Cart,
    CartItem,
    Coupon,
    CouponRedemption,
    FeeConfiguration,
    TaxRule,
)

logger = logging.getLogger(__name__)

MONEY = Decimal('0.01')

def money(value):
    return Decimal(value).quantize(MONEY, rounding=ROUND_HALF_UP)

def get_cart(user=None, guest_token=''):
    if user and user.is_authenticated:
        return (
            Cart.objects.filter(user=user, status=Cart.Status.ACTIVE).first()
            or Cart.objects.create(user=user, guest_token=None)
        )

    if not guest_token:
        guest_token = secrets.token_urlsafe(32)

    return (
        Cart.objects.filter(
            guest_token=guest_token,
            status=Cart.Status.ACTIVE,
        ).first()
        or Cart.objects.create(guest_token=guest_token, user=None)
    )

def assert_product_available(item):
    if item.project_id:
        product = item.project

        if (
            not product.is_active
            or product.publication_status != Project.PublicationStatus.PUBLISHED
        ):
            raise ValidationError(
                f'Project "{product.title}" is no longer available.'
            )

        from apps.pricing.services import validate_project_price

        validate_project_price(product.category, product.price)

        return (
            product.price,
            product.title,
            product.slug,
            'project',
            product.category.slug,
        )

    product = item.portfolio_template

    if (
        not product.is_active
        or product.publication_status
        != PortfolioTemplate.PublicationStatus.PUBLISHED
    ):
        raise ValidationError(
            f'Portfolio "{product.title}" is no longer available.'
        )

    return (
        product.base_price,
        product.title,
        product.slug,
        'portfolio',
        product.category.slug,
    )

def validate_coupon(
    coupon_code,
    subtotal,
    user=None,
    product_types=None,
    categories=None,
    guest_token='',
):
    if not coupon_code:
        return None, Decimal('0.00')

    try:
        coupon = Coupon.objects.get(code=coupon_code.strip().upper())
    except Coupon.DoesNotExist as error:
        raise ValidationError({'coupon': 'Coupon is invalid.'}) from error

    now = timezone.now()

    if not coupon.is_active or not (
        coupon.start_date <= now <= coupon.expiry_date
    ):
        raise ValidationError({'coupon': 'Coupon is inactive or expired.'})

    if coupon.usage_limit is not None and coupon.total_used >= coupon.usage_limit:
        raise ValidationError({
            'coupon': 'Coupon usage limit has been reached.'
        })

    if coupon.per_user_usage_limit:
        redemptions = CouponRedemption.objects.filter(coupon=coupon)

        if user and user.is_authenticated:
            used_count = redemptions.filter(user=user).count()
        elif guest_token:
            used_count = redemptions.filter(guest_token=guest_token).count()
        else:
            used_count = 0

        if used_count >= coupon.per_user_usage_limit:
            raise ValidationError({
                'coupon': 'You have reached this coupon usage limit.'
            })

    if subtotal < coupon.minimum_order_amount:
        raise ValidationError({
            'coupon': f'Minimum order value is {coupon.minimum_order_amount:.2f}.'
        })

    if coupon.applicable_product_types:
        if not set(product_types or []).intersection(
            coupon.applicable_product_types
        ):
            raise ValidationError({
                'coupon': 'Coupon does not apply to these products.'
            })

    if coupon.applicable_categories:
        if not set(categories or []).intersection(
            coupon.applicable_categories
        ):
            raise ValidationError({
                'coupon': 'Coupon does not apply to these categories.'
            })

    if coupon.discount_type == Coupon.DiscountType.PERCENTAGE:
        discount = subtotal * coupon.discount_value / Decimal('100')
    else:
        discount = coupon.discount_value

    if coupon.maximum_discount_amount is not None:
        discount = min(discount, coupon.maximum_discount_amount)

    return coupon, min(money(discount), money(subtotal))

def _item_image_url(item):
    """Best-effort product image URL (relative media path or absolute URL)."""
    if item.project_id:
        images = list(item.project.images.all())
        primary = next((img for img in images if img.is_primary), None)
        chosen = primary or (images[0] if images else None)
        if chosen and chosen.image:
            return chosen.image.url
        return ''

    previews = [
        preview
        for preview in item.portfolio_template.previews.all()
        if preview.is_active
    ]
    with_thumb = next(
        (preview for preview in previews if preview.thumbnail_image),
        None,
    ) or (previews[0] if previews else None)

    if with_thumb:
        if with_thumb.thumbnail_image:
            return with_thumb.thumbnail_image.url
        if with_thumb.preview_url:
            return with_thumb.preview_url
    return ''


def calculate_quote(cart, coupon_code='', item_ids=None):
    items = list(
        cart.items.select_related(
            'project__category',
            'portfolio_template__category',
        ).prefetch_related(
            'portfolio_template__customization_services',
            'project__images',
            'portfolio_template__previews',
        )
    )

    if item_ids is not None:
        allowed = {int(item_id) for item_id in item_ids}
        items = [item for item in items if item.id in allowed]

    subtotal = Decimal('0.00')
    item_rows = []
    product_types = []
    categories = []

    for item in items:
        price, title, slug, product_type, category = assert_product_available(item)

        customization_total = Decimal('0.00')

        if item.portfolio_template_id:
            options = {
                option.id: option
                for option in item.portfolio_template.customization_services.filter(
                    is_available=True
                )
            }

            for option_id in item.selected_customization_options:
                if int(option_id) not in options:
                    raise ValidationError(
                        'A selected customization option is unavailable.'
                    )
                customization_total += options[int(option_id)].additional_price

        line_total = money(price + customization_total) * item.quantity
        subtotal += line_total

        product_types.append(product_type)
        categories.append(category)

        item_rows.append({
            'id': item.id,
            'product_id': item.project_id or item.portfolio_template_id,
            'product_type': product_type,
            'title': title,
            'slug': slug,
            'base_price': money(price),
            'customization_total': money(customization_total),
            'quantity': item.quantity,
            'total': money(line_total),
            'image': _item_image_url(item),
        })

    config = FeeConfiguration.objects.filter(is_active=True).first()

    if config is None:
        raise ValidationError({
            'pricing': (
                'Fee configuration is incomplete. '
                'An authorized administrator must activate one.'
            )
        })

    coupon, discount = validate_coupon(
        coupon_code,
        subtotal,
        cart.user,
        product_types,
        categories,
        cart.guest_token,
    )

    discounted = money(subtotal - discount)

    platform_fee = money(
        discounted * config.platform_fee_percentage / Decimal('100')
    )
    convenience_fee = money(
        discounted * config.convenience_fee_percentage / Decimal('100')
    )

    taxes = []
    tax_total = Decimal('0.00')

    active_taxes = TaxRule.objects.filter(
        is_active=True,
        effective_date__lte=timezone.now(),
    )

    for rule in active_taxes:
        if (
            rule.applicable_product_categories
            and not set(categories).intersection(
                rule.applicable_product_categories
            )
        ):
            continue

        taxable = Decimal('0.00')

        if rule.applies_to_product_subtotal:
            taxable += discounted
        if rule.applies_to_platform_fee:
            taxable += platform_fee
        if rule.applies_to_convenience_fee:
            taxable += convenience_fee

        if rule.tax_type == TaxRule.TaxType.PERCENTAGE:
            amount = money(taxable * rule.rate / Decimal('100'))
        else:
            amount = money(rule.rate)

        if not rule.is_inclusive:
            tax_total += amount

        taxes.append({
            'name': rule.name,
            'rate': f'{rule.rate:.4f}',
            'amount': f'{amount:.2f}',
            'inclusive': rule.is_inclusive,
        })

    return {
        'items': item_rows,
        'subtotal': money(subtotal),
        'discount': money(discount),
        'discounted_subtotal': discounted,
        'platform_fee_percentage': config.platform_fee_percentage,
        'platform_fee': platform_fee,
        'convenience_fee_percentage': config.convenience_fee_percentage,
        'convenience_fee': convenience_fee,
        'taxes': taxes,
        'tax_configuration_incomplete': not active_taxes.exists(),
        'tax_total': money(tax_total),
        'total': money(
            discounted + platform_fee + convenience_fee + tax_total
        ),
        'currency': config.currency,
        'coupon': coupon,
    }

@transaction.atomic
def record_coupon_redemption(order):
    """
    Record one redemption after an order has been paid.
    The order OneToOneField prevents duplicate redemption records.
    """
    from apps.orders.models import Order

    locked_order = Order.objects.select_for_update().get(pk=order.pk)

    if locked_order.status != Order.Status.PAID:
        return None

    existing = CouponRedemption.objects.filter(order=locked_order).first()

    if existing:
        return existing

    code = (locked_order.coupon_code_snapshot or '').strip().upper()

    if not code:
        return None

    coupon = Coupon.objects.select_for_update().filter(code=code).first()

    if not coupon:
        logger.error(
            'Coupon %s not found for paid order %s.',
            code,
            locked_order.order_number,
        )
        return None

    redemption = CouponRedemption.objects.create(
        coupon=coupon,
        order=locked_order,
        user=locked_order.user,
        guest_token=locked_order.guest_token,
    )

    coupon.total_used += 1
    coupon.save(update_fields=['total_used', 'updated_at'])

    logger.info(
        'Coupon %s redeemed for order %s.',
        coupon.code,
        locked_order.order_number,
    )

    return redemption

@transaction.atomic
def merge_guest_cart(user, guest_token):
    guest = Cart.objects.select_for_update().filter(
        guest_token=guest_token,
        status=Cart.Status.ACTIVE,
    ).first()

    target = get_cart(user=user)

    if not guest:
        return target

    for item in guest.items.all():
        existing = target.items.filter(
            project=item.project,
            portfolio_template=item.portfolio_template,
        ).first()

        if existing:
            existing.selected_customization_options = sorted(
                set(
                    existing.selected_customization_options
                    + item.selected_customization_options
                )
            )
            existing.save(
                update_fields=['selected_customization_options', 'updated_at']
            )
        else:
            item.pk = None
            item.cart = target
            item.save()

    guest.status = Cart.Status.CONVERTED
    guest.save(update_fields=['status', 'updated_at'])

    return target