from rest_framework import serializers

from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = [
            'id',
            'product_type',
            'product_id',
            'product_title_snapshot',
            'product_slug_snapshot',
            'base_price_snapshot',
            'quantity',
            'total_snapshot',
        ]
        read_only_fields = fields


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payment_id = serializers.SerializerMethodField()
    payment_method = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'order_number',
            'status',
            'currency',
            'subtotal',
            'discount',
            'total_amount',
            'coupon_code_snapshot',
            'created_at',
            'updated_at',
            'items',
            'payment_id',
            'payment_method',
        ]
        read_only_fields = fields

    def get_latest_payment(self, obj):
        return obj.payments.order_by('-created_at').first()

    def get_payment_id(self, obj):
        payment = self.get_latest_payment(obj)
        return payment.gateway_payment_id if payment else None

    def get_payment_method(self, obj):
        payment = self.get_latest_payment(obj)
        return payment.payment_method if payment else ''
