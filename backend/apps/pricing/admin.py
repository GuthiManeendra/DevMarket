from django.contrib import admin

from .models import PriceHistory, PricingConfiguration


@admin.register(PricingConfiguration)
class PricingConfigurationAdmin(admin.ModelAdmin):
    list_display = ['configuration_name', 'ai_minimum_price', 'currency', 'is_active', 'updated_at']
    list_filter = ['is_active', 'currency']
    readonly_fields = ['created_at', 'updated_at']

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = ['project', 'old_price', 'new_price', 'changed_by', 'change_reason', 'created_at']
    list_filter = ['created_at']
    search_fields = ['project__title', 'change_reason', 'changed_by__username']
    readonly_fields = [field.name for field in PriceHistory._meta.fields]

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
