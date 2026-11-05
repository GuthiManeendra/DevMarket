import uuid

from django.conf import settings
from django.db import models


def generate_order_number():
    return f'DM-{uuid.uuid4().hex[:12].upper()}'


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING_PAYMENT = 'pending_payment', 'Pending payment'
        PAYMENT_PROCESSING = 'payment_processing', 'Payment processing'
        PAID = 'paid', 'Paid'
        PAYMENT_FAILED = 'payment_failed', 'Payment failed'
        CANCELLED = 'cancelled', 'Cancelled'
        REFUNDED = 'refunded', 'Refunded'

    order_number = models.CharField(max_length=40, unique=True, default=generate_order_number)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, null=True, blank=True, related_name='orders')
    guest_token = models.CharField(max_length=128, blank=True)
    idempotency_key = models.CharField(max_length=128, unique=True)
    currency = models.CharField(max_length=3, default='INR')
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2)
    discounted_subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    platform_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=12, decimal_places=2)
    convenience_fee_percentage = models.DecimalField(max_digits=5, decimal_places=2)
    convenience_fee = models.DecimalField(max_digits=12, decimal_places=2)
    tax_total = models.DecimalField(max_digits=12, decimal_places=2)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    coupon_code_snapshot = models.CharField(max_length=50, blank=True)
    pricing_configuration_snapshot = models.JSONField(default=dict, blank=True)
    tax_configuration_snapshot = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=30, choices=Status.choices, default=Status.PENDING_PAYMENT)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.PROTECT, related_name='items')
    product_type = models.CharField(max_length=30)
    product_id = models.PositiveIntegerField(null=True, blank=True)
    product_title_snapshot = models.CharField(max_length=220)
    product_slug_snapshot = models.CharField(max_length=240)
    base_price_snapshot = models.DecimalField(max_digits=12, decimal_places=2)
    customization_snapshot = models.JSONField(default=dict, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    discount_snapshot = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_snapshot = models.DecimalField(max_digits=12, decimal_places=2)
