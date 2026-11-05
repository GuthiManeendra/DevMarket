from django.urls import path

from .views import (
    AIMinimumPriceView,
    PriceValidationView,
    PricingConfigurationUpdateView,
    PricingConfigurationView,
    ProjectPriceHistoryView,
)

urlpatterns = [
    path('configuration/', PricingConfigurationView.as_view(), name='pricing-configuration'),
    path('configuration/update/', PricingConfigurationUpdateView.as_view(), name='pricing-configuration-update'),
    path('ai-minimum/', AIMinimumPriceView.as_view(), name='pricing-ai-minimum'),
    path('validate/', PriceValidationView.as_view(), name='pricing-validate'),
    path('projects/<int:project_id>/history/', ProjectPriceHistoryView.as_view(), name='project-price-history'),
]
