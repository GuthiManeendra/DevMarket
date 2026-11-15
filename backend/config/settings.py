
"""
Django settings for config project.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# --------------------------------------------------
# BASE DIRECTORY AND ENVIRONMENT
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from backend/.env
# Load environment variables from project root .env
# BASE_DIR is backend/; the .env lives one directory above at the project root.
_env_path = BASE_DIR.parent / '.env'
if not _env_path.exists():
    # Fallback: look for .env inside backend/ itself
    _env_path = BASE_DIR / '.env'
load_dotenv(_env_path)


# --------------------------------------------------
# EMAIL CONFIGURATION - GMAIL SMTP
# --------------------------------------------------

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_TIMEOUT = 20

EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


# --------------------------------------------------
# SECURITY SETTINGS
# --------------------------------------------------

SECRET_KEY = os.getenv(
    'DJANGO_SECRET_KEY',
    'django-insecure-development-only-change-me'
)

DEBUG = os.getenv(
    'DJANGO_DEBUG', 'True'
).lower() in {'1', 'true', 'yes', 'on'}

ALLOWED_HOSTS = [
    host.strip()
    for host in os.getenv(
        'DJANGO_ALLOWED_HOSTS',
        '127.0.0.1,localhost'
    ).split(',')
    if host.strip()
]

# Public site URL used for canonical links and the XML sitemap.
SITE_URL = os.getenv('SITE_URL', 'http://127.0.0.1:5173').rstrip('/')


# --------------------------------------------------
# APPLICATIONS
# --------------------------------------------------

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'corsheaders',
    'rest_framework',
    'rest_framework.authtoken',

    'apps.core',
    'apps.products',
    'apps.pricing',
    'apps.portfolios',
    'apps.cart',
    'apps.orders',
    'apps.payments',
]


# --------------------------------------------------
# MIDDLEWARE
# --------------------------------------------------

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',

    'corsheaders.middleware.CorsMiddleware',

    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]


# --------------------------------------------------
# URL CONFIGURATION
# --------------------------------------------------

ROOT_URLCONF = 'config.urls'


# --------------------------------------------------
# TEMPLATES
# --------------------------------------------------

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]


# --------------------------------------------------
# WSGI
# --------------------------------------------------

WSGI_APPLICATION = 'config.wsgi.application'


# --------------------------------------------------
# DATABASE CONFIGURATION
# --------------------------------------------------

DB_ENGINE = os.getenv(
    'DB_ENGINE',
    'django.db.backends.sqlite3'
)

if DB_ENGINE == 'django.db.backends.mysql':

    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': os.getenv('DB_NAME', 'devmarket_db'),
            'USER': os.getenv('DB_USER', ''),
            'PASSWORD': os.getenv('DB_PASSWORD', ''),
            'HOST': os.getenv('DB_HOST', '127.0.0.1'),
            'PORT': os.getenv('DB_PORT', '3306'),
            'OPTIONS': {
                'charset': 'utf8mb4',
            },
        }
    }

else:

    DATABASES = {
        'default': {
            'ENGINE': DB_ENGINE,
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }


# --------------------------------------------------
# PASSWORD VALIDATION
# --------------------------------------------------

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# --------------------------------------------------
# INTERNATIONALIZATION
# --------------------------------------------------

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# --------------------------------------------------
# STATIC AND MEDIA FILES
# --------------------------------------------------

STATIC_URL = 'static/'

MEDIA_URL = '/media/'

MEDIA_ROOT = BASE_DIR / 'media'


# --------------------------------------------------
# REST FRAMEWORK
# --------------------------------------------------

REST_FRAMEWORK = {

    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],

    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],

    'DEFAULT_PAGINATION_CLASS': (
        'rest_framework.pagination.PageNumberPagination'
    ),

    'PAGE_SIZE': 12,

    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
}


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

CORS_ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173'
        if DEBUG else ''
    ).split(',')
    if origin.strip()
]


# --------------------------------------------------
# RAZORPAY CONFIGURATION
# --------------------------------------------------

RAZORPAY_MODE = os.getenv(
    'RAZORPAY_MODE',
    'test'
).lower()


# Test credentials

RAZORPAY_TEST_KEY_ID = os.getenv(
    'RAZORPAY_TEST_KEY_ID',
    ''
) or os.getenv(
    'RAZORPAY_KEY_ID',
    ''
)

RAZORPAY_TEST_KEY_SECRET = os.getenv(
    'RAZORPAY_TEST_KEY_SECRET',
    ''
) or os.getenv(
    'RAZORPAY_KEY_SECRET',
    ''
)

RAZORPAY_TEST_WEBHOOK_SECRET = os.getenv(
    'RAZORPAY_TEST_WEBHOOK_SECRET',
    ''
) or os.getenv(
    'RAZORPAY_WEBHOOK_SECRET',
    ''
)


# Live credentials

RAZORPAY_LIVE_KEY_ID = os.getenv(
    'RAZORPAY_LIVE_KEY_ID',
    ''
) or os.getenv(
    'RAZORPAY_KEY_ID',
    ''
)

RAZORPAY_LIVE_KEY_SECRET = os.getenv(
    'RAZORPAY_LIVE_KEY_SECRET',
    ''
) or os.getenv(
    'RAZORPAY_KEY_SECRET',
    ''
)

RAZORPAY_LIVE_WEBHOOK_SECRET = os.getenv(
    'RAZORPAY_LIVE_WEBHOOK_SECRET',
    ''
) or os.getenv(
    'RAZORPAY_WEBHOOK_SECRET',
    ''
)


# Generic credentials with test-mode fallbacks

RAZORPAY_KEY_ID = os.getenv(
    'RAZORPAY_KEY_ID',
    RAZORPAY_TEST_KEY_ID
)

RAZORPAY_KEY_SECRET = os.getenv(
    'RAZORPAY_KEY_SECRET',
    RAZORPAY_TEST_KEY_SECRET
)

RAZORPAY_WEBHOOK_SECRET = os.getenv(
    'RAZORPAY_WEBHOOK_SECRET',
    RAZORPAY_TEST_WEBHOOK_SECRET
)


# --------------------------------------------------
# WHATSAPP CLOUD API CONFIGURATION
# --------------------------------------------------

WHATSAPP_ACCESS_TOKEN = os.getenv('WHATSAPP_ACCESS_TOKEN', '')
WHATSAPP_PHONE_NUMBER_ID = os.getenv('WHATSAPP_PHONE_NUMBER_ID', '')
WHATSAPP_ADMIN_NUMBER = os.getenv('WHATSAPP_ADMIN_NUMBER', '')

# Template details – must match exactly what is approved in Meta Business Manager
WHATSAPP_TEMPLATE_NAME = 'devmarket_new_registration'
WHATSAPP_TEMPLATE_LANGUAGE = 'en_US'

# API endpoint (v25.0 as requested)
WHATSAPP_API_URL = (
    'https://graph.facebook.com/v25.0/'
    '{phone_number_id}/messages'
)

# Request timeout in seconds (connect, read)
WHATSAPP_API_TIMEOUT = (10, 20)


# --------------------------------------------------
# LOGGING CONFIGURATION
# --------------------------------------------------

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '[{asctime}] {levelname} {name}: {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': 'INFO',
    },
    'loggers': {
        'apps': {
            'handlers': ['console'],
            'level': 'DEBUG' if DEBUG else 'INFO',
            'propagate': False,
        },
    },
}
