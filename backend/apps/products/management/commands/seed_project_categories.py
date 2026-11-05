from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.products.models import ProjectCategory


CATEGORY_NAMES = [
    'Artificial Intelligence',
    'Machine Learning',
    'Deep Learning',
    'Generative AI',
    'Large Language Models (LLM)',
    'Natural Language Processing',
    'Computer Vision',
    'AI Chatbot',
    'Agentic AI',
    'Python Projects',
    'Java Projects',
    'Full Stack Development',
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Internet of Things',
    'Cloud Computing',
    'Android Development',
]


class Command(BaseCommand):
    help = 'Create the initial project categories without duplicating existing records.'

    def handle(self, *args, **options):
        created = 0
        for name in CATEGORY_NAMES:
            _, was_created = ProjectCategory.objects.get_or_create(
                name=name,
                defaults={'slug': slugify(name)},
            )
            created += int(was_created)
        self.stdout.write(self.style.SUCCESS(f'Category seed complete. Created {created} categories.'))
