from decimal import Decimal
from django.core.management.base import BaseCommand
from django.utils.text import slugify

from apps.products.models import Project, ProjectCategory

AI_PROJECTS_DATA = [
    {
        'title': 'NeuroX AI',
        'subtitle': 'Intelligent Autonomous AI Agent Platform',
        'technologies': ['Python', 'Django', 'React.js', 'Ollama', 'LangChain', 'FAISS', 'SQLite'],
        'description': (
            'An intelligent autonomous AI agent platform designed to perform tasks, process information, '
            'and provide AI-powered assistance using language models and retrieval-based capabilities.'
        ),
        'category_name': 'Agentic AI',
        'price': Decimal('8999.00'),
        'compare_at_price': Decimal('11999.00'),
    },
    {
        'title': 'SynapX AI',
        'subtitle': 'Collaborative Multi-Agent Intelligence System',
        'technologies': ['Python', 'Django', 'React.js', 'CrewAI', 'LangGraph', 'Ollama', 'PostgreSQL'],
        'description': (
            'A collaborative multi-agent AI system where multiple intelligent agents work together to solve complex '
            'tasks, coordinate workflows, and generate intelligent results.'
        ),
        'category_name': 'Agentic AI',
        'price': Decimal('9499.00'),
        'compare_at_price': Decimal('12999.00'),
    },
    {
        'title': 'Aether AI',
        'subtitle': 'Personal AI Assistant with Long-Term Memory',
        'technologies': ['Python', 'Django', 'React.js', 'Ollama', 'ChromaDB', 'Sentence Transformers'],
        'description': (
            'A personalized AI assistant designed to provide intelligent conversations and retain relevant '
            'information using long-term memory and semantic search.'
        ),
        'category_name': 'AI Chatbot',
        'price': Decimal('7999.00'),
        'compare_at_price': Decimal('10499.00'),
    },
    {
        'title': 'Cognix AI',
        'subtitle': 'Intelligent Knowledge Management System',
        'technologies': ['Python', 'Django', 'React.js', 'RAG', 'LangChain', 'FAISS', 'PyMuPDF'],
        'description': (
            'An AI-powered knowledge management system that processes documents, extracts valuable information, '
            'and enables intelligent question answering using Retrieval-Augmented Generation.'
        ),
        'category_name': 'Generative AI',
        'price': Decimal('8499.00'),
        'compare_at_price': Decimal('10999.00'),
    },
    {
        'title': 'Nexora AI',
        'subtitle': 'Predictive Analytics and Intelligence Platform',
        'technologies': ['Python', 'Django', 'React.js', 'Pandas', 'NumPy', 'Scikit-learn', 'XGBoost'],
        'description': (
            'A predictive analytics platform that analyzes datasets, identifies patterns, and generates data-driven '
            'predictions using machine learning algorithms.'
        ),
        'category_name': 'Machine Learning',
        'price': Decimal('7999.00'),
        'compare_at_price': Decimal('9999.00'),
    },
    {
        'title': 'OmniX AI',
        'subtitle': 'Autonomous Workflow Automation System',
        'technologies': ['Python', 'Django', 'React.js', 'Activepieces', 'Ollama', 'REST APIs', 'PostgreSQL'],
        'description': (
            'An intelligent workflow automation platform designed to automate repetitive tasks, connect applications, '
            'and integrate AI-powered capabilities into business workflows.'
        ),
        'category_name': 'Artificial Intelligence',
        'price': Decimal('8999.00'),
        'compare_at_price': Decimal('11499.00'),
    },
    {
        'title': 'Mindora AI',
        'subtitle': 'Personalized AI Learning Platform',
        'technologies': ['Python', 'Django', 'React.js', 'Ollama', 'Scikit-learn', 'FAISS', 'SQLite'],
        'description': (
            'An AI-powered learning platform that provides personalized learning experiences, intelligent '
            'recommendations, and adaptive educational assistance.'
        ),
        'category_name': 'Artificial Intelligence',
        'price': Decimal('7500.00'),
        'compare_at_price': Decimal('9500.00'),
    },
    {
        'title': 'Vortex AI',
        'subtitle': 'Real-Time Computer Vision and Video Analytics',
        'technologies': ['Python', 'Django', 'React.js', 'OpenCV', 'YOLO', 'PyTorch'],
        'description': (
            'A real-time computer vision platform that analyzes images and video streams to detect objects and extract '
            'meaningful visual information using deep learning.'
        ),
        'category_name': 'Computer Vision',
        'price': Decimal('9999.00'),
        'compare_at_price': Decimal('13499.00'),
    },
    {
        'title': 'Quantix AI',
        'subtitle': 'Intelligent Financial Analytics Platform',
        'technologies': ['Python', 'Django', 'React.js', 'Pandas', 'Scikit-learn', 'XGBoost', 'Recharts'],
        'description': (
            'An intelligent financial analytics platform that analyzes financial datasets, identifies trends, '
            'generates predictive insights, and visualizes analytical results.'
        ),
        'category_name': 'Data Science',
        'price': Decimal('8499.00'),
        'compare_at_price': Decimal('11000.00'),
    },
    {
        'title': 'Zynexa AI',
        'subtitle': 'AI-Powered Cybersecurity Threat Detection System',
        'technologies': ['Python', 'Django', 'React.js', 'Scikit-learn', 'XGBoost', 'Scapy', 'PostgreSQL'],
        'description': (
            'An AI-powered cybersecurity platform designed to analyze network traffic, identify suspicious patterns, '
            'and support threat detection using machine learning techniques.'
        ),
        'category_name': 'Cybersecurity',
        'price': Decimal('8999.00'),
        'compare_at_price': Decimal('11999.00'),
    },
]


class Command(BaseCommand):
    help = 'Seed the 10 production AI projects into the database'

    def handle(self, *args, **options):
        # Also ensure Web Application Projects category exists
        web_cat, _ = ProjectCategory.objects.get_or_create(
            name='Web Application Projects',
            defaults={
                'slug': 'web-application-projects',
                'description': 'Full stack, modern web applications, SaaS architectures, and cloud-ready platforms.',
            },
        )
        self.stdout.write(f'Category checked/created: {web_cat.name}')

        ai_cat, _ = ProjectCategory.objects.get_or_create(
            name='Artificial Intelligence',
            defaults={
                'slug': 'artificial-intelligence',
                'description': 'Intelligent autonomous agents, generative models, and AI platforms.',
            },
        )

        created_count = 0
        updated_count = 0

        for item in AI_PROJECTS_DATA:
            category = ProjectCategory.objects.filter(name=item['category_name']).first() or ai_cat
            slug = slugify(item['title'])
            project, was_created = Project.objects.update_or_create(
                slug=slug,
                defaults={
                    'title': item['title'],
                    'short_description': item['subtitle'],
                    'description': item['description'],
                    'category': category,
                    'project_type': Project.ProjectType.PROFESSIONAL,
                    'difficulty_level': Project.DifficultyLevel.ADVANCED,
                    'programming_languages': ['Python', 'JavaScript'],
                    'technologies': item['technologies'],
                    'frameworks': ['Django', 'React.js'],
                    'tools_used': item['technologies'],
                    'price': item['price'],
                    'compare_at_price': item['compare_at_price'],
                    'is_featured': True,
                    'is_bestseller': True,
                    'is_active': True,
                    'publication_status': Project.PublicationStatus.PUBLISHED,
                },
            )
            if was_created:
                created_count += 1
            else:
                updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f'Seed complete. Created {created_count} projects, updated {updated_count} projects.'
            )
        )
