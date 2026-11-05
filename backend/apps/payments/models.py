from django.db import models
from django.utils import timezone


class PaymentStatus(models.TextChoices):
    CREATED = 'created', 'Created'
    AUTHORIZED = 'authorized', 'Authorized'
    CAPTURED = 'captured', 'Captured'
    FAILED = 'failed', 'Failed'
    CANCELLED = 'cancelled', 'Cancelled'


class ProcessingStatus(models.TextChoices):
    PENDING = 'pending', 'Pending'
    PROCESSED = 'processed', 'Processed'
    FAILED = 'failed', 'Failed'
    IGNORED = 'ignored', 'Ignored'


class Payment(models.Model):
    order = models.ForeignKey(
        'orders.Order',
        on_delete=models.PROTECT,
        related_name='payments',
        help_text='Associated DevMarket order.'
    )
    gateway = models.CharField(max_length=30, default='razorpay')
    gateway_order_id = models.CharField(max_length=100, db_index=True, help_text='Razorpay Order ID.')
    gateway_payment_id = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        help_text='Razorpay Payment ID (unique per successful or attempted payment).'
    )
    gateway_signature = models.CharField(max_length=255, blank=True, help_text='Payment signature received from gateway.')
    amount = models.DecimalField(max_digits=12, decimal_places=2, help_text='Amount in INR Decimal.')
    currency = models.CharField(max_length=3, default='INR')
    status = models.CharField(
        max_length=30,
        choices=PaymentStatus.choices,
        default=PaymentStatus.CREATED,
        db_index=True
    )
    payment_method = models.CharField(max_length=50, blank=True, help_text='e.g. card, upi, netbanking')
    failure_reason = models.TextField(blank=True)
    idempotency_key = models.CharField(max_length=128, db_index=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    verified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['gateway_order_id', 'status']),
            models.Index(fields=['order', 'status']),
        ]

    def __str__(self):
        return f"Payment {self.id} for Order {self.order.order_number} ({self.status}) - {self.currency} {self.amount}"

    def save(self, *args, **kwargs):
        # Prevent empty strings from colliding with unique constraint on gateway_payment_id
        if not self.gateway_payment_id:
            self.gateway_payment_id = None
        super().save(*args, **kwargs)


class PaymentWebhookEvent(models.Model):
    gateway_event_id = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        help_text='Razorpay Event ID (e.g. event_xxxxx)'
    )
    event_type = models.CharField(max_length=100, db_index=True, help_text='e.g. payment.captured, payment.failed')
    payload = models.JSONField(default=dict, help_text='Full raw webhook event JSON.')
    signature_verified = models.BooleanField(default=False)
    processing_status = models.CharField(
        max_length=30,
        choices=ProcessingStatus.choices,
        default=ProcessingStatus.PENDING,
        db_index=True
    )
    processing_error = models.TextField(blank=True)
    received_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-received_at']
        indexes = [
            models.Index(fields=['event_type', 'processing_status']),
        ]

    def __str__(self):
        return f"WebhookEvent {self.gateway_event_id} ({self.event_type}) - {self.processing_status}"

