from rest_framework import serializers
from .models import Payment, PaymentWebhookEvent


class PaymentCreateSerializer(serializers.Serializer):
    order_number = serializers.CharField(max_length=40, required=True)
    guest_token = serializers.CharField(max_length=128, required=False, allow_blank=True)


class PaymentVerifySerializer(serializers.Serializer):
    razorpay_order_id = serializers.CharField(max_length=100, required=True)
    razorpay_payment_id = serializers.CharField(max_length=100, required=True)
    razorpay_signature = serializers.CharField(max_length=255, required=True)


class PaymentSerializer(serializers.ModelSerializer):
    order_number = serializers.CharField(source='order.order_number', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id',
            'order_number',
            'gateway',
            'gateway_order_id',
            'gateway_payment_id',
            'amount',
            'currency',
            'status',
            'payment_method',
            'failure_reason',
            'created_at',
            'updated_at',
            'verified_at',
        ]
        read_only_fields = fields


class PaymentWebhookEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentWebhookEvent
        fields = [
            'id',
            'gateway_event_id',
            'event_type',
            'signature_verified',
            'processing_status',
            'processing_error',
            'received_at',
            'processed_at',
        ]
        read_only_fields = fields

