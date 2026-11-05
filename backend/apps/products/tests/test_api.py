from decimal import Decimal

from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.products.models import Project, ProjectCategory


class ProjectApiTests(APITestCase):
    def setUp(self):
        self.category = ProjectCategory.objects.create(
            name='Python Projects',
            slug='python-projects',
            is_active=True,
        )
        self.other_category = ProjectCategory.objects.create(
            name='Web Development',
            slug='web-development',
            is_active=True,
        )
        self.published_project = Project.objects.create(
            title='Published Python Project',
            slug='published-python-project',
            short_description='Published project',
            description='Published description',
            category=self.category,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.INTERMEDIATE,
            programming_languages=['Python'],
            technologies=['Django'],
            price=Decimal('1200.00'),
            publication_status=Project.PublicationStatus.PUBLISHED,
            is_active=True,
            is_featured=True,
        )
        Project.objects.create(
            title='Draft Python Project',
            slug='draft-python-project',
            short_description='Draft project',
            description='Draft description',
            category=self.category,
            project_type=Project.ProjectType.ACADEMIC,
            difficulty_level=Project.DifficultyLevel.BEGINNER,
            price=Decimal('800.00'),
            publication_status=Project.PublicationStatus.DRAFT,
            is_active=True,
        )
        Project.objects.create(
            title='Published Web Project',
            slug='published-web-project',
            short_description='Web project',
            description='Web description',
            category=self.other_category,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.ADVANCED,
            price=Decimal('2200.00'),
            publication_status=Project.PublicationStatus.PUBLISHED,
            is_active=True,
        )

    def test_project_list_exposes_only_published_active_projects(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        self.assertEqual(response.data['results'][0]['slug'], 'published-web-project')

    def test_project_detail_uses_slug(self):
        response = self.client.get(
            reverse('project-detail', kwargs={'slug': self.published_project.slug}),
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['slug'], self.published_project.slug)

    def test_category_filter_and_search(self):
        response = self.client.get('/api/projects/', {'category': 'python-projects'})
        self.assertEqual(response.data['count'], 1)
        response = self.client.get('/api/projects/', {'search': 'Published Web'})
        self.assertEqual(response.data['count'], 1)

    def test_price_filter_and_ordering(self):
        response = self.client.get('/api/projects/', {'min_price': '2000', 'ordering': 'price'})
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['slug'], 'published-web-project')

    def test_featured_endpoint(self):
        response = self.client.get('/api/projects/featured/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_categories_endpoint(self):
        response = self.client.get('/api/projects/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_public_write_is_forbidden(self):
        response = self.client.post('/api/projects/', {})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_staff_can_create_project(self):
        user = get_user_model().objects.create_user(
            username='catalog-admin',
            password='strong-test-password',
            is_staff=True,
        )
        self.client.force_authenticate(user=user)
        response = self.client.post('/api/projects/', {
            'title': 'Staff-created project',
            'slug': 'staff-created-project',
            'short_description': 'A staff project',
            'description': 'A staff project description',
            'category': self.category.pk,
            'project_type': Project.ProjectType.PROFESSIONAL,
            'difficulty_level': Project.DifficultyLevel.BEGINNER,
            'price': '900.00',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_invalid_price_filter_is_rejected(self):
        response = self.client.get('/api/projects/', {'min_price': 'not-a-price'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
