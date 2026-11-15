from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator, MaxValueValidator, MinValueValidator
from django.db import models
from django.utils.text import slugify

from .constants import AI_CATEGORY_SLUGS


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class ProjectCategory(TimeStampedModel):
    name = models.CharField(max_length=150, unique=True)
    slug = models.SlugField(max_length=170, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)
    image = models.ImageField(upload_to='project-categories/', blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'Project categories'

    def __str__(self):
        return self.name


class Project(TimeStampedModel):
    class PublicationStatus(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        PUBLISHED = 'published', 'Published'
        ARCHIVED = 'archived', 'Archived'

    class ProjectType(models.TextChoices):
        ACADEMIC = 'academic', 'Academic'
        PROFESSIONAL = 'professional', 'Professional'
        STARTER = 'starter', 'Starter'

    class DifficultyLevel(models.TextChoices):
        BEGINNER = 'beginner', 'Beginner'
        INTERMEDIATE = 'intermediate', 'Intermediate'
        ADVANCED = 'advanced', 'Advanced'

    title = models.CharField(max_length=220)
    slug = models.SlugField(max_length=240, unique=True)
    short_description = models.CharField(max_length=320)
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)
    description = models.TextField()
    category = models.ForeignKey(ProjectCategory, on_delete=models.PROTECT, related_name='projects')
    project_type = models.CharField(max_length=30, choices=ProjectType.choices)
    difficulty_level = models.CharField(max_length=30, choices=DifficultyLevel.choices)
    programming_languages = models.JSONField(default=list, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    frameworks = models.JSONField(default=list, blank=True)
    database_technologies = models.JSONField(default=list, blank=True)
    tools_used = models.JSONField(default=list, blank=True)
    problem_statement = models.TextField(blank=True)
    proposed_solution = models.TextField(blank=True)
    key_features = models.JSONField(default=list, blank=True)
    architecture_description = models.TextField(blank=True)
    requirements = models.JSONField(default=list, blank=True)
    installation_instructions = models.TextField(blank=True)
    documentation_description = models.TextField(blank=True)
    demo_video_url = models.URLField(blank=True)
    live_demo_url = models.URLField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    compare_at_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        blank=True,
        null=True,
        validators=[MinValueValidator(0)],
    )
    is_featured = models.BooleanField(default=False)
    is_bestseller = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    publication_status = models.CharField(
        max_length=20,
        choices=PublicationStatus.choices,
        default=PublicationStatus.DRAFT,
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['publication_status', 'is_active']),
            models.Index(fields=['category', 'publication_status']),
            models.Index(fields=['price']),
        ]

    def __str__(self):
        return self.title

    @property
    def discount_percentage(self):
        if not self.compare_at_price or self.compare_at_price <= self.price:
            return 0
        return round((self.compare_at_price - self.price) * 100 / self.compare_at_price, 2)

    @property
    def pricing_is_valid(self):
        from apps.pricing.services import validate_project_price

        try:
            validate_project_price(self.category, self.price)
        except ValidationError:
            return False
        return True

    def clean(self):
        errors = {}
        if self.compare_at_price is not None and self.compare_at_price < self.price:
            errors['compare_at_price'] = 'Compare-at price must be greater than or equal to price.'
        if self.category_id:
            from apps.pricing.services import validate_project_price

            try:
                validate_project_price(self.category, self.price)
            except ValidationError as error:
                errors.update(error.message_dict)
        if self.publication_status == self.PublicationStatus.PUBLISHED and not self.is_active:
            errors['publication_status'] = 'An inactive project cannot be published.'
        if errors:
            raise ValidationError(errors)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        changed_by = kwargs.pop('changed_by', None)
        change_reason = kwargs.pop('change_reason', '')
        old_price = None
        if self.pk:
            old_price = type(self).objects.only('price').get(pk=self.pk).price
        self.full_clean()
        result = super().save(*args, **kwargs)
        if old_price is not None and old_price != self.price:
            from apps.pricing.services import record_price_change

            record_price_change(self, old_price, self.price, changed_by, change_reason)
        return result


def validate_project_image(value):
    allowed_extensions = {'jpg', 'jpeg', 'png', 'webp'}
    extension = value.name.rsplit('.', 1)[-1].lower() if '.' in value.name else ''
    if extension not in allowed_extensions:
        raise ValidationError('Only JPG, JPEG, PNG, and WEBP images are allowed.')
    if value.size > 5 * 1024 * 1024:
        raise ValidationError('Project images must be 5 MB or smaller.')


class ProjectImage(TimeStampedModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(
        upload_to='projects/images/',
        validators=[
            validate_project_image,
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp']),
        ],
    )
    alt_text = models.CharField(max_length=220)
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', 'created_at']

    def __str__(self):
        return f'{self.project.title} image'
