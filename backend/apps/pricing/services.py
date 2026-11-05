from decimal import Decimal

from django.core.exceptions import ValidationError
from django.db import transaction

from apps.products.constants import AI_CATEGORY_SLUGS, AI_MINIMUM_PRICE

from .models import PriceHistory, PricingConfiguration


def get_active_configuration():
    return PricingConfiguration.objects.filter(is_active=True).first()


def get_minimum_allowed_price(category=None):
    if category is None or category.slug not in AI_CATEGORY_SLUGS:
        return Decimal('0.00')
    configuration = get_active_configuration()
    return max(
        configuration.ai_minimum_price if configuration else AI_MINIMUM_PRICE,
        AI_MINIMUM_PRICE,
    )


def is_ai_category(category):
    return bool(category and category.slug in AI_CATEGORY_SLUGS)


def validate_project_price(category, price):
    if price is None:
        return
    minimum = get_minimum_allowed_price(category)
    if price < minimum:
        raise ValidationError({
            'price': [
                f'AI-related projects must have a minimum price of '
                f'{category and getattr(get_active_configuration(), "currency", "INR") or "INR"} '
                f'{minimum:.2f}.'
            ],
        })


def validate_category_change(category, price):
    validate_project_price(category, price)


def validate_bulk_price_updates(projects, price):
    errors = {}
    for project in projects:
        try:
            validate_project_price(project.category, price)
        except ValidationError as error:
            errors[str(project.pk)] = error.message_dict
    if errors:
        raise ValidationError(errors)


def validate_before_publication(project):
    if not project.is_active:
        raise ValidationError({'publication_status': 'An inactive project cannot be published.'})
    validate_project_price(project.category, project.price)


@transaction.atomic
def update_project_price(project, new_price, changed_by=None, change_reason=''):
    validate_project_price(project.category, new_price)
    old_price = project.price
    if old_price == new_price:
        return project
    project.price = new_price
    project.save(changed_by=changed_by, change_reason=change_reason)
    return project


def record_price_change(project, old_price, new_price, changed_by=None, change_reason=''):
    if old_price != new_price:
        PriceHistory.objects.create(
            project=project,
            old_price=old_price,
            new_price=new_price,
            changed_by=changed_by,
            change_reason=change_reason,
        )


def get_final_displayed_base_price(project):
    return project.price
