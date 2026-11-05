from decimal import Decimal

from django.core.exceptions import ValidationError
from django.test import TestCase

from apps.products.models import Project, ProjectCategory


class ProjectModelTests(TestCase):
    def setUp(self):
        self.ai_category = ProjectCategory.objects.create(
            name='Artificial Intelligence',
            slug='artificial-intelligence',
        )
        self.web_category = ProjectCategory.objects.create(
            name='Web Development',
            slug='web-development',
        )

    def project(self, category, price):
        return Project(
            title='Test project',
            slug=f'test-project-{category.slug}',
            short_description='A test project',
            description='A test project description',
            category=category,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.INTERMEDIATE,
            price=price,
        )

    def test_ai_project_below_minimum_price_is_rejected(self):
        with self.assertRaises(ValidationError) as error:
            self.project(self.ai_category, Decimal('7499.99')).full_clean()
        self.assertIn('price', error.exception.message_dict)

    def test_ai_project_at_minimum_price_is_allowed(self):
        project = self.project(self.ai_category, Decimal('7500.00'))
        project.full_clean()

    def test_category_change_rechecks_price(self):
        project = self.project(self.web_category, Decimal('1000.00'))
        project.save()
        project.category = self.ai_category
        with self.assertRaises(ValidationError):
            project.save()

    def test_compare_at_price_cannot_be_less_than_price(self):
        project = self.project(self.web_category, Decimal('1000.00'))
        project.compare_at_price = Decimal('999.99')
        with self.assertRaises(ValidationError):
            project.full_clean()
