from decimal import Decimal
import logging

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator
from django.db import models

from apps.products.constants import AI_MINIMUM_PRICE

logger = logging.getLogger(__name__)


class PricingConfiguration(models.Model):
    configuration_name = models.CharField(max_length=100, unique=True)
    ai_minimum_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(AI_MINIMUM_PRICE)],
        default=AI_MINIMUM_PRICE,
    )
    currency = models.CharField(max_length=3, default='INR')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_active', '-updated_at']

    def clean(self):
        errors = {}
        if self.ai_minimum_price < AI_MINIMUM_PRICE:
            errors['ai_minimum_price'] = (
                f'AI minimum price cannot be below {AI_MINIMUM_PRICE}.'
            )
        if self.is_active:
            active = PricingConfiguration.objects.filter(is_active=True).exclude(pk=self.pk)
            if active.exists():
                errors['is_active'] = 'Only one active pricing configuration is allowed.'
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        self.full_clean()
        result = super().save(*args, **kwargs)
        logger.info(
            'Pricing configuration saved: id=%s minimum=%s currency=%s active=%s',
            self.pk,
            self.ai_minimum_price,
            self.currency,
            self.is_active,
        )
        return result

    def __str__(self):
        return f'{self.configuration_name} ({self.currency} {self.ai_minimum_price})'


class PriceHistory(models.Model):
    project = models.ForeignKey(
        'products.Project',
        on_delete=models.PROTECT,
        related_name='price_history',
    )
    old_price = models.DecimalField(max_digits=10, decimal_places=2)
    new_price = models.DecimalField(max_digits=10, decimal_places=2)
    changed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='project_price_changes',
    )
    change_reason = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.CheckConstraint(
                condition=~models.Q(old_price=models.F('new_price')),
                name='price_history_prices_must_change',
            ),
        ]

    def __str__(self):
        return f'{self.project} {self.old_price} -> {self.new_price}'
