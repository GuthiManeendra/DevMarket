
from django.contrib import admin

from .models import (
    Cart,
    CartItem,
    Coupon,
    CouponRedemption,
    FeeConfiguration,
    TaxRule,
)

admin.site.register(Cart)
admin.site.register(CartItem)

@admin.register(FeeConfiguration)
class FeeConfigurationAdmin(admin.ModelAdmin):
    list_display = [
        'platform_fee_percentage',
        'convenience_fee_percentage',
        'currency',
        'is_active',
        'effective_from',
        'updated_by',
    ]
    list_filter = ['is_active', 'currency']

@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = [
        'code',
        'discount_type',
        'discount_value',
        'is_active',
        'start_date',
        'expiry_date',
        'total_used',
        'usage_limit',
        'per_user_usage_limit',
    ]
    list_filter = ['discount_type', 'is_active']
    search_fields = ['code', 'description']

@admin.register(CouponRedemption)
class CouponRedemptionAdmin(admin.ModelAdmin):
    list_display = [
        'coupon',
        'order',
        'user',
        'guest_token',
        'redeemed_at',
    ]
    list_filter = ['coupon', 'redeemed_at']
    search_fields = [
        'coupon__code',
        'order__order_number',
        'user__email',
    ]
    readonly_fields = [
        'coupon',
        'order',
        'user',
        'guest_token',
        'redeemed_at',
    ]

@admin.register(TaxRule)
class TaxRuleAdmin(admin.ModelAdmin):
    list_display = [
        'name',
        'rate',
        'tax_type',
        'is_active',
        'effective_date',
        'is_inclusive',
    ]
    list_filter = ['is_active', 'tax_type', 'is_inclusive']