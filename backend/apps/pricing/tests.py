from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.products.models import Project, ProjectCategory

from .models import PriceHistory, PricingConfiguration
from .services import update_project_price


class PricingServiceTests(TestCase):
    def setUp(self):
        self.ai = ProjectCategory.objects.create(
            name='Artificial Intelligence',
            slug='artificial-intelligence',
        )
        self.web = ProjectCategory.objects.create(name='Web', slug='web')
        self.project = Project.objects.create(
            title='Pricing project',
            slug='pricing-project',
            short_description='A project',
            description='A project',
            category=self.web,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.BEGINNER,
            price=Decimal('1000.00'),
        )
        self.admin = get_user_model().objects.create_user(
            username='pricing-admin',
            password='password',
            is_staff=True,
        )

    def test_ai_minimum_boundary_and_values(self):
        self.project.category = self.ai
        self.project.price = Decimal('7500.00')
        self.project.full_clean()
        self.project.price = Decimal('7499.99')
        with self.assertRaises(ValidationError):
            self.project.full_clean()
        self.project.price = Decimal('8000.00')
        self.project.full_clean()

    def test_category_changes_are_revalidated(self):
        self.project.category = self.ai
        with self.assertRaises(ValidationError):
            self.project.save()
        self.project.category = self.ai
        self.project.price = Decimal('7500.00')
        self.project.save()
        self.project.category = self.web
        self.project.price = Decimal('100.00')
        self.project.save()

    def test_price_history_records_changes_once(self):
        update_project_price(self.project, Decimal('1100.00'), self.admin, 'Correction')
        self.assertEqual(PriceHistory.objects.count(), 1)
        update_project_price(self.project, Decimal('1100.00'), self.admin, 'No change')
        self.assertEqual(PriceHistory.objects.count(), 1)

    def test_configuration_cannot_reduce_floor(self):
        config = PricingConfiguration.objects.get(configuration_name='default')
        config.ai_minimum_price = Decimal('8000.00')
        config.save()
        config.ai_minimum_price = Decimal('7499.00')
        with self.assertRaises(ValidationError):
            config.full_clean()


class PricingApiTests(APITestCase):
    def setUp(self):
        self.category = ProjectCategory.objects.create(
            name='Machine Learning',
            slug='machine-learning',
        )

    def test_validation_endpoint(self):
        response = self.client.post('/api/pricing/validate/', {
            'category_slug': self.category.slug,
            'price': '7500.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['minimum_price'], '7500.00')

    def test_invalid_validation_endpoint(self):
        response = self.client.post('/api/pricing/validate/', {
            'category_slug': self.category.slug,
            'price': '7499.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_configuration_update_requires_staff(self):
        # Anonymous requests are rejected at authentication (401).
        response = self.client.post('/api/pricing/configuration/update/', {
            'ai_minimum_price': '8000.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated non-staff users are rejected by permissions (403).
        regular = get_user_model().objects.create_user(
            username='regular-pricing',
            password='password',
        )
        self.client.force_authenticate(user=regular)
        response = self.client.post('/api/pricing/configuration/update/', {
            'ai_minimum_price': '8000.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_update_configuration(self):
        user = get_user_model().objects.create_user(
            username='staff',
            password='password',
            is_staff=True,
        )
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/pricing/configuration/update/', {
            'ai_minimum_price': '8000.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['ai_minimum_price'], '8000.00')
