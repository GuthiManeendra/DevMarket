from django.core.exceptions import ValidationError

from .models import PortfolioTemplate


def validate_portfolio_for_publication(template):
    if not template.is_active:
        raise ValidationError({'publication_status': 'An inactive portfolio cannot be published.'})
    template.publication_status = PortfolioTemplate.PublicationStatus.PUBLISHED
    template.full_clean()
    return template


def public_portfolio_queryset():
    return PortfolioTemplate.objects.filter(
        is_active=True,
        publication_status=PortfolioTemplate.PublicationStatus.PUBLISHED,
        category__is_active=True,
    ).select_related('category').prefetch_related('previews', 'customization_services')
