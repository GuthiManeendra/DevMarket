from django.contrib import admin

from .models import Project, ProjectCategory, ProjectImage


class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 0


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    inlines = [ProjectImageInline]
    list_display = ['title', 'category', 'price', 'pricing_status', 'publication_status', 'is_featured', 'is_active']
    list_filter = ['publication_status', 'is_active', 'is_featured', 'is_bestseller', 'category']
    search_fields = ['title', 'short_description', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at']

    @admin.display(description='Pricing status', boolean=True)
    def pricing_status(self, obj):
        return obj.pricing_is_valid

    def save_model(self, request, obj, form, change):
        obj.save(changed_by=request.user, change_reason=form.cleaned_data.get('change_reason', ''))

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        from django import forms

        if 'change_reason' not in form.base_fields:
            form.base_fields['change_reason'] = forms.CharField(required=False, max_length=255)
        return form


@admin.register(ProjectImage)
class ProjectImageAdmin(admin.ModelAdmin):
    list_display = ['project', 'alt_text', 'is_primary', 'display_order']
    list_filter = ['is_primary']
    search_fields = ['project__title', 'alt_text']
