from django.contrib import admin
from .models import Payment, PaymentWebhookEvent


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'order',
        'gateway',
        'gateway_order_id',
        'gateway_payment_id',
        'amount',
        'currency',
        'status',
        'payment_method',
        'created_at',
        'verified_at',
    ]
    list_filter = ['status', 'gateway', 'currency', 'created_at']
    search_fields = [
        'gateway_order_id',
        'gateway_payment_id',
        'order__order_number',
        'order__user__username',
    ]
    readonly_fields = [field.name for field in Payment._meta.fields]

    def has_add_permission(self, request):
        # Payments should only be created via the API / gateway workflow
        return False

    def has_change_permission(self, request, obj=None):
        # Disallow direct status alteration without controlled reconciliation
        return False

    def has_delete_permission(self, request, obj=None):
        # Preserve payment audit trail
        return False


@admin.register(PaymentWebhookEvent)
class PaymentWebhookEventAdmin(admin.ModelAdmin):
    list_display = [
        'gateway_event_id',
        'event_type',
        'signature_verified',
        'processing_status',
        'received_at',
        'processed_at',
    ]
    list_filter = [
        'event_type',
        'signature_verified',
        'processing_status',
        'received_at',
    ]
    search_fields = ['gateway_event_id', 'event_type', 'processing_error']
    readonly_fields = [field.name for field in PaymentWebhookEvent._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

