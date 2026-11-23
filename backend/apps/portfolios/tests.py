from decimal import Decimal

from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from .models import (
    PortfolioCategory,
    PortfolioCustomizationOption,
    PortfolioPreview,
    PortfolioTemplate,
)


class PortfolioModelTests(TestCase):
    def setUp(self):
        self.standard_category = PortfolioCategory.objects.create(
            name='Minimal Developer Portfolio',
            slug='minimal-developer',
            portfolio_type=PortfolioCategory.PortfolioType.STANDARD,
        )
        self.premium_category = PortfolioCategory.objects.create(
            name='3D Interactive Portfolio',
            slug='3d-interactive',
            portfolio_type=PortfolioCategory.PortfolioType.PREMIUM_ANIMATED,
        )

    def template(self, category, portfolio_type=None, **kwargs):
        values = {
            'title': 'Developer portfolio',
            'slug': f'developer-{category.slug}',
            'short_description': 'A portfolio template',
            'full_description': 'A complete portfolio template',
            'category': category,
            'portfolio_type': portfolio_type or category.portfolio_type,
            'template_code': f'code-{category.slug}',
            'difficulty_level': PortfolioTemplate.DifficultyLevel.INTERMEDIATE,
            'frontend_technology': 'React',
            'base_price': Decimal('2500.00'),
        }
        values.update(kwargs)
        return PortfolioTemplate(
            **values,
        )

    def test_standard_and_premium_templates_can_be_created(self):
        self.template(self.standard_category).full_clean()
        self.template(self.premium_category).full_clean()

    def test_category_and_type_must_match(self):
        with self.assertRaises(ValidationError):
            self.template(
                self.standard_category,
                PortfolioTemplate.PortfolioType.PREMIUM_ANIMATED,
            ).full_clean()

    def test_negative_price_is_rejected(self):
        with self.assertRaises(ValidationError):
            self.template(self.standard_category, base_price=Decimal('-1.00')).full_clean()

    def test_published_template_requires_active_valid_information(self):
        template = self.template(
            self.standard_category,
            publication_status=PortfolioTemplate.PublicationStatus.PUBLISHED,
            is_active=False,
        )
        with self.assertRaises(ValidationError):
            template.full_clean()

    def test_preview_requires_url_or_image(self):
        template = self.template(self.standard_category)
        template.save()
        with self.assertRaises(ValidationError):
            PortfolioPreview(portfolio_template=template, preview_type='live_demo').full_clean()


class PortfolioApiTests(APITestCase):
    def setUp(self):
        self.category = PortfolioCategory.objects.create(
            name='Frontend Developer Portfolio',
            slug='frontend-developer',
            portfolio_type=PortfolioCategory.PortfolioType.STANDARD,
        )
        self.template = PortfolioTemplate.objects.create(
            title='React portfolio',
            slug='react-portfolio',
            short_description='A React template',
            full_description='A detailed React template',
            category=self.category,
            portfolio_type=PortfolioTemplate.PortfolioType.STANDARD,
            template_code='react-portfolio-v1',
            difficulty_level=PortfolioTemplate.DifficultyLevel.BEGINNER,
            frontend_technology='React',
            frameworks=['Vite'],
            base_price=Decimal('3000.00'),
            publication_status=PortfolioTemplate.PublicationStatus.PUBLISHED,
        )
        PortfolioPreview.objects.create(
            portfolio_template=self.template,
            preview_type=PortfolioPreview.PreviewType.LIVE_DEMO,
            preview_url='https://example.com/demo',
        )
        PortfolioCustomizationOption.objects.create(
            portfolio_template=self.template,
            option_name='Custom theme',
            option_type=PortfolioCustomizationOption.OptionType.DESIGN,
            additional_price=Decimal('500.00'),
        )
        PortfolioTemplate.objects.create(
            title='Draft portfolio',
            slug='draft-portfolio',
            short_description='Draft',
            full_description='Draft',
            category=self.category,
            portfolio_type=PortfolioTemplate.PortfolioType.STANDARD,
            template_code='draft-portfolio-v1',
            difficulty_level=PortfolioTemplate.DifficultyLevel.BEGINNER,
            frontend_technology='React',
            base_price=Decimal('100.00'),
        )

    def test_public_listing_and_detail_only_expose_published_templates(self):
        response = self.client.get('/api/portfolios/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        detail = self.client.get('/api/portfolios/react-portfolio/')
        self.assertEqual(detail.status_code, status.HTTP_200_OK)
        self.assertNotIn('source_code', detail.data)
        self.assertEqual(len(detail.data['previews']), 1)

    def test_featured_standard_premium_and_filters(self):
        self.template.is_featured = True
        self.template.save()
        self.assertEqual(self.client.get('/api/portfolios/featured/').data['count'], 1)
        self.assertEqual(self.client.get('/api/portfolios/standard/').data['count'], 1)
        self.assertEqual(self.client.get('/api/portfolios/premium/').data['count'], 0)
        self.assertEqual(self.client.get('/api/portfolios/', {'technology': 'React'}).data['count'], 1)
        self.assertEqual(self.client.get('/api/portfolios/', {'min_price': '3000'}).data['count'], 1)
        self.assertEqual(self.client.get('/api/portfolios/', {'max_price': '2999'}).data['count'], 0)

    def test_preview_and_customization_endpoints(self):
        previews = self.client.get('/api/portfolios/react-portfolio/previews/')
        options = self.client.get('/api/portfolios/react-portfolio/customization-options/')
        self.assertEqual(previews.status_code, status.HTTP_200_OK)
        self.assertEqual(options.status_code, status.HTTP_200_OK)
        self.assertEqual(options.data[0]['additional_price'], '500.00')

    def test_staff_only_writes(self):
        # Anonymous requests are rejected at authentication (401).
        response = self.client.post('/api/portfolios/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        # Authenticated non-staff users are rejected by permissions (403).
        regular = get_user_model().objects.create_user(
            username='regular', password='password'
        )
        self.client.force_authenticate(user=regular)
        response = self.client.post('/api/portfolios/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        user = get_user_model().objects.create_user(username='staff', password='password', is_staff=True)
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/portfolios/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
