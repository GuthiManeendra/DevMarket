from decimal import Decimal

from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils.text import slugify


def validate_portfolio_image(value):
    if value.size > 5 * 1024 * 1024:
        raise ValidationError('Portfolio images must be 5 MB or smaller.')


class PortfolioCategory(models.Model):
    class PortfolioType(models.TextChoices):
        STANDARD = 'standard', 'Standard Professional'
        PREMIUM_ANIMATED = 'premium_animated', 'Premium Animated'

    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True)
    description = models.TextField(blank=True)
    portfolio_type = models.CharField(max_length=30, choices=PortfolioType.choices)
    image = models.ImageField(
        upload_to='portfolio-categories/',
        blank=True,
        null=True,
        validators=[validate_portfolio_image, FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])],
    )
    icon = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    display_order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['display_order', 'name']

    def __str__(self):
        return self.name


class PortfolioTemplate(models.Model):
    class PortfolioType(models.TextChoices):
        STANDARD = 'standard', 'Standard Professional'
        PREMIUM_ANIMATED = 'premium_animated', 'Premium Animated'

    class DifficultyLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    class PublicationStatus(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    short_description = models.CharField(max_length=320)
    full_description = models.TextField()
    category = models.ForeignKey(PortfolioCategory, on_delete=models.PROTECT, related_name='templates')
    portfolio_type = models.CharField(max_length=30, choices=PortfolioType.choices)
    template_code = models.CharField(max_length=100, unique=True)
    version = models.CharField(max_length=30, default='1.0.0')
    difficulty_level = models.CharField(max_length=30, choices=DifficultyLevel.choices)
    frontend_technology = models.CharField(max_length=100)
    backend_technology = models.CharField(max_length=100, blank=True)
    programming_languages = models.JSONField(default=list, blank=True)
    frameworks = models.JSONField(default=list, blank=True)
    libraries = models.JSONField(default=list, blank=True)
    animation_technology = models.JSONField(default=list, blank=True)
    supported_devices = models.JSONField(default=list, blank=True)
    features = models.JSONField(default=list, blank=True)
    included_sections = models.JSONField(default=list, blank=True)
    customization_options = models.JSONField(default=list, blank=True)
    responsive_support = models.BooleanField(default=True)
    seo_support = models.BooleanField(default=False)
    dark_mode_support = models.BooleanField(default=False)
    documentation_included = models.BooleanField(default=False)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.00'))])
    compare_at_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(Decimal('0.00'))],
    )
    currency = models.CharField(max_length=3, default='INR')
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    publication_status = models.CharField(
        max_length=20,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['portfolio_type', 'publication_status', 'is_active']),
            models.Index(fields=['category', 'publication_status']),
            models.Index(fields=['base_price']),
        ]

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse('portfolio-template-detail', kwargs={'slug': self.slug})

    def clean(self):
        errors = {}
        if self.category_id and self.category.portfolio_type != self.portfolio_type:
            errors['portfolio_type'] = 'Portfolio type must match the selected category.'
        if self.compare_at_price is not None and self.compare_at_price < self.base_price:
            errors['compare_at_price'] = 'Compare-at price must be greater than or equal to base price.'
        if self.publication_status == self.PublicationStatus.PUBLISHED:
            required = {
                'title': self.title,
                'short_description': self.short_description,
                'full_description': self.full_description,
                'template_code': self.template_code,
                'frontend_technology': self.frontend_technology,
            }
            errors.update({field: 'This field is required for publication.' for field, value in required.items() if not value})
            if not self.is_active:
                errors['publication_status'] = 'An inactive portfolio cannot be published.'
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        self.full_clean()
        return super().save(*args, **kwargs)


class PortfolioPreview(models.Model):
    class PreviewType(models.TextChoices):
        LIVE_DEMO = 'live_demo', 'Live demo'
        VIDEO = 'video', 'Video'
        SCREENSHOT = 'screenshot', 'Screenshot'
        IMAGE_GALLERY = 'image_gallery', 'Image gallery'

    portfolio_template = models.ForeignKey(PortfolioTemplate, on_delete=models.CASCADE, related_name='previews')
    preview_type = models.CharField(max_length=30, choices=PreviewType.choices)
    preview_url = models.URLField(blank=True)
    thumbnail_image = models.ImageField(
        upload_to='portfolio-previews/',
        blank=True,
        null=True,
        validators=[validate_portfolio_image, FileExtensionValidator(['jpg', 'jpeg', 'png', 'webp'])],
    )
    description = models.CharField(max_length=255, blank=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['display_order', 'created_at']

    def clean(self):
        if not self.preview_url and not self.thumbnail_image:
            raise ValidationError('A preview URL or thumbnail image is required.')

    def __str__(self):
        return f'{self.portfolio_template.title} - {self.get_preview_type_display()}'


class PortfolioCustomizationOption(models.Model):
    class OptionType(models.TextChoices):
        CONTENT = 'content', 'Content'
        DESIGN = 'design', 'Design'
        FEATURE = 'feature', 'Feature'
        DEPLOYMENT = 'deployment', 'Deployment'

    portfolio_template = models.ForeignKey(
        PortfolioTemplate,
        on_delete=models.CASCADE,
        related_name='customization_services',
    )
    option_name = models.CharField(max_length=150)
    description = models.TextField(blank=True)
    option_type = models.CharField(max_length=30, choices=OptionType.choices)
    additional_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
    )
    is_required = models.BooleanField(default=False)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['option_name']
        constraints = [
            models.UniqueConstraint(
                fields=['portfolio_template', 'option_name'],
                name='unique_portfolio_customization_option',
            ),
        ]

    def __str__(self):
        return f'{self.portfolio_template.title} - {self.option_name}'
