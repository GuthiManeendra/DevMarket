from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ValidationError
from django.test import TestCase
from PIL import Image

from apps.products.models import Project, ProjectCategory, ProjectImage


class ProjectImageValidationTests(TestCase):
    def setUp(self):
        category = ProjectCategory.objects.create(name='Python', slug='python')
        self.project = Project.objects.create(
            title='Image test project',
            slug='image-test-project',
            short_description='Image test',
            description='Image test',
            category=category,
            project_type=Project.ProjectType.PROFESSIONAL,
            difficulty_level=Project.DifficultyLevel.BEGINNER,
            price=100,
        )

    def test_valid_png_image_is_accepted(self):
        image_buffer = BytesIO()
        Image.new('RGB', (10, 10), 'blue').save(image_buffer, format='PNG')
        image = SimpleUploadedFile('preview.png', image_buffer.getvalue(), content_type='image/png')
        project_image = ProjectImage(project=self.project, image=image, alt_text='Preview')
        project_image.full_clean()

    def test_non_image_extension_is_rejected(self):
        image = SimpleUploadedFile('source.zip', b'not an image', content_type='application/zip')
        project_image = ProjectImage(project=self.project, image=image, alt_text='Source')
        with self.assertRaises(ValidationError):
            project_image.full_clean()
