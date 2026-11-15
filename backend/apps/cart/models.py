
from decimal import Decimal

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

class Cart(models.Model):
    class Status(models.TextChoices):
        ACTIVE = 'active', 'Active'
        CONVERTED = 'converted', 'Converted'
        ABANDONED = 'abandoned', 'Abandoned'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='carts',
    )
    guest_token = models.CharField(max_length=128, blank=True, null=True, db_index=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    currency = models.CharField(max_length=3, default='INR')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'status'],
                condition=models.Q(status='active'),
                name='one_active_cart_per_user',
            ),
            models.UniqueConstraint(
                fields=['guest_token', 'status'],
                condition=models.Q(status='active'),
                name='one_active_cart_per_guest',
            ),
        ]

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    project = models.ForeignKey(
        'products.Project',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='cart_items',
    )
    portfolio_template = models.ForeignKey(
        'portfolios.PortfolioTemplate',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='cart_items',
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(1)],
    )
    selected_customization_options = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=(
                    models.Q(project__isnull=False, portfolio_template__isnull=True)
                    | models.Q(project__isnull=True, portfolio_template__isnull=False)
                ),
                name='cart_item_exactly_one_product',
            ),
            models.UniqueConstraint(
                fields=['cart', 'project'],
                name='unique_project_in_cart',
            ),
            models.UniqueConstraint(
                fields=['cart', 'portfolio_template'],
                name='unique_portfolio_in_cart',
            ),
        ]

    def clean(self):
        if bool(self.project_id) == bool(self.portfolio_template_id):
            raise ValidationError(
                'A cart item must reference exactly one supported product.'
            )

        if self.project_id and self.selected_customization_options:
            raise ValidationError('Projects do not support customization options.')

        if self.portfolio_template_id:
            valid = set(
                self.portfolio_template.customization_services.filter(
                    is_available=True
                ).values_list('id', flat=True)
            )
            selected = set(self.selected_customization_options or [])

            if not selected.issubset(valid):
                raise ValidationError(
                    'One or more customization options are unavailable.'
                )

class FeeConfiguration(models.Model):
    platform_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('3.00'),
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    convenience_fee_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('4.00'),
        validators=[MinValueValidator(0), MaxValueValidator(100)],
    )
    currency = models.CharField(max_length=3, default='INR')
    is_active = models.BooleanField(default=True)
    effective_from = models.DateTimeField()
    updated_at = models.DateTimeField(auto_now=True)
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='fee_configuration_changes',
    )

    class Meta:
        ordering = ['-is_active', '-effective_from']

    def clean(self):
        if self.is_active and FeeConfiguration.objects.filter(
            is_active=True
        ).exclude(pk=self.pk).exists():
            raise ValidationError(
                'Only one active fee configuration is allowed.'
            )

class Coupon(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'percentage', 'Percentage'
        FIXED = 'fixed', 'Fixed amount'

    code = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255, blank=True)
    discount_type = models.CharField(
        max_length=20,
        choices=DiscountType.choices,
    )
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)],
    )
    minimum_order_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(0)],
    )
    maximum_discount_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
    )
    start_date = models.DateTimeField()
    expiry_date = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    per_user_usage_limit = models.PositiveIntegerField(null=True, blank=True)
    total_used = models.PositiveIntegerField(default=0)
    applicable_product_types = models.JSONField(default=list, blank=True)
    applicable_categories = models.JSONField(default=list, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.code = self.code.strip().upper()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.code

class CouponRedemption(models.Model):
    coupon = models.ForeignKey(
        Coupon,
        on_delete=models.PROTECT,
        related_name='redemptions',
    )
    order = models.OneToOneField(
        'orders.Order',
        on_delete=models.PROTECT,
        related_name='coupon_redemption',
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='coupon_redemptions',
    )
    guest_token = models.CharField(max_length=128, blank=True, db_index=True)
    redeemed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-redeemed_at']

    def __str__(self):
        return f'{self.coupon.code} - {self.order.order_number}'

class TaxRule(models.Model):
    class TaxType(models.TextChoices):
        PERCENTAGE = 'percentage', 'Percentage'
        FIXED = 'fixed', 'Fixed amount'

    name = models.CharField(max_length=100)
    rate = models.DecimalField(
        max_digits=7,
        decimal_places=4,
        validators=[MinValueValidator(0)],
    )
    tax_type = models.CharField(
        max_length=20,
        choices=TaxType.choices,
        default=TaxType.PERCENTAGE,
    )
    applicable_product_categories = models.JSONField(default=list, blank=True)
    applies_to_platform_fee = models.BooleanField(default=False)
    applies_to_convenience_fee = models.BooleanField(default=False)
    applies_to_product_subtotal = models.BooleanField(default=True)
    is_inclusive = models.BooleanField(default=False)
    effective_date = models.DateTimeField()
    is_active = models.BooleanField(default=False)

    class Meta:
        ordering = ['name']