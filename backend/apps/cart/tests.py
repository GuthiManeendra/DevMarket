from decimal import Decimal

from django.test import TestCase
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from apps.products.models import Project, ProjectCategory

from .models import Cart, CartItem, Coupon, FeeConfiguration, TaxRule
from .services import calculate_quote, get_cart


class CartPricingTests(TestCase):
    def setUp(self):
        self.category = ProjectCategory.objects.create(name='AI', slug='artificial-intelligence')
        self.project = Project.objects.create(
            title='AI project',
            slug='ai-project',
            short_description='AI',
            description='AI project',
            category=self.category,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.INTERMEDIATE,
            price=Decimal('7500.00'),
            publication_status=Project.PublicationStatus.PUBLISHED,
        )
        FeeConfiguration.objects.create(
            effective_from=timezone.now(),
            platform_fee_percentage=Decimal('3.00'),
            convenience_fee_percentage=Decimal('4.00'),
        )

    def test_example_fee_calculation(self):
        cart = get_cart(guest_token='guest-example')
        CartItem.objects.create(cart=cart, project=self.project)
        quote = calculate_quote(cart)
        self.assertEqual(quote['subtotal'], Decimal('7500.00'))
        self.assertEqual(quote['platform_fee'], Decimal('225.00'))
        self.assertEqual(quote['convenience_fee'], Decimal('300.00'))
        self.assertEqual(quote['total'], Decimal('8025.00'))

    def test_discount_is_applied_before_fees(self):
        Coupon.objects.create(
            code='SAVE10',
            discount_type=Coupon.DiscountType.PERCENTAGE,
            discount_value=Decimal('10.00'),
            start_date=timezone.now(),
            expiry_date=timezone.now() + timezone.timedelta(days=1),
        )
        cart = get_cart(guest_token='guest-discount')
        CartItem.objects.create(cart=cart, project=self.project)
        quote = calculate_quote(cart, 'SAVE10')
        self.assertEqual(quote['discounted_subtotal'], Decimal('6750.00'))
        self.assertEqual(quote['platform_fee'], Decimal('202.50'))
        self.assertEqual(quote['convenience_fee'], Decimal('270.00'))

    def test_tax_is_reported_as_incomplete_without_active_rule(self):
        cart = get_cart(guest_token='guest-tax')
        CartItem.objects.create(cart=cart, project=self.project)
        self.assertTrue(calculate_quote(cart)['tax_configuration_incomplete'])

    def test_configured_tax_is_included(self):
        TaxRule.objects.create(
            name='Accountant-approved tax',
            rate=Decimal('10.0000'),
            effective_date=timezone.now(),
            is_active=True,
        )
        cart = get_cart(guest_token='guest-tax-active')
        CartItem.objects.create(cart=cart, project=self.project)
        quote = calculate_quote(cart)
        self.assertEqual(quote['tax_total'], Decimal('750.00'))


class CartApiTests(APITestCase):
    def setUp(self):
        self.category = ProjectCategory.objects.create(name='Web', slug='web')
        self.project = Project.objects.create(
            title='Web project',
            slug='web-project',
            short_description='Web',
            description='Web project',
            category=self.category,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.BEGINNER,
            price=Decimal('1000.00'),
            publication_status=Project.PublicationStatus.PUBLISHED,
        )
        FeeConfiguration.objects.create(effective_from=timezone.now())

    def test_guest_cart_isolated_by_token(self):
        response = self.client.post(
            '/api/cart/items/',
            {'project_id': self.project.id},
            HTTP_X_GUEST_TOKEN='guest-a',
            format='json',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        other = self.client.get('/api/cart/', HTTP_X_GUEST_TOKEN='guest-b')
        self.assertEqual(other.data['items'], [])

    def test_duplicate_product_is_rejected(self):
        headers = {'HTTP_X_GUEST_TOKEN': 'guest-duplicate'}
        self.client.post('/api/cart/items/', {'project_id': self.project.id}, format='json', **headers)
        response = self.client.post('/api/cart/items/', {'project_id': self.project.id}, format='json', **headers)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_order_requires_idempotency_key(self):
        response = self.client.post('/api/checkout/create-order/', {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
