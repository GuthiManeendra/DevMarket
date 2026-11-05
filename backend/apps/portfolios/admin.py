from django.contrib import admin

from .models import PortfolioCategory, PortfolioCustomizationOption, PortfolioPreview, PortfolioTemplate


@admin.register(PortfolioCategory)
class PortfolioCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'portfolio_type', 'is_active', 'display_order']
    list_filter = ['portfolio_type', 'is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    ordering = ['display_order', 'name']


class PortfolioPreviewInline(admin.TabularInline):
    model = PortfolioPreview
    extra = 0


class PortfolioCustomizationOptionInline(admin.TabularInline):
    model = PortfolioCustomizationOption
    extra = 0


@admin.register(PortfolioTemplate)
class PortfolioTemplateAdmin(admin.ModelAdmin):
    inlines = [PortfolioPreviewInline, PortfolioCustomizationOptionInline]
    list_display = ['title', 'portfolio_type', 'category', 'base_price', 'publication_status', 'is_featured', 'is_active']
    list_filter = ['portfolio_type', 'publication_status', 'is_active', 'is_featured', 'responsive_support', 'dark_mode_support', 'category']
    search_fields = ['title', 'short_description', 'full_description', 'template_code']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']
