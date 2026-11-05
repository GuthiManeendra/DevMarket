from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    can_delete = False
    readonly_fields = [field.name for field in OrderItem._meta.fields]


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderItemInline]
    list_display = ['order_number', 'status', 'currency', 'total_amount', 'coupon_code_snapshot', 'created_at']
    list_filter = ['status', 'currency', 'created_at']
    search_fields = ['order_number', 'coupon_code_snapshot', 'user__username']
    readonly_fields = [field.name for field in Order._meta.fields]

    def has_delete_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'product_type', 'product_title_snapshot', 'base_price_snapshot', 'total_snapshot']
    readonly_fields = [field.name for field in OrderItem._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
