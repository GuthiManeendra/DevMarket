from decimal import Decimal, InvalidOperation

from rest_framework.exceptions import ValidationError


def filter_portfolios(queryset, params):
    for parameter, lookup in (('min_price', 'base_price__gte'), ('max_price', 'base_price__lte')):
        value = params.get(parameter)
        if value:
            try:
                amount = Decimal(value)
            except InvalidOperation as error:
                raise ValidationError({parameter: 'Must be a valid decimal amount.'}) from error
            if amount < 0:
                raise ValidationError({parameter: 'Must be zero or greater.'})
            queryset = queryset.filter(**{lookup: amount})
    if params.get('category'):
        queryset = queryset.filter(category__slug=params['category'])
    if params.get('portfolio_type'):
        queryset = queryset.filter(portfolio_type=params['portfolio_type'])
    if params.get('technology'):
        queryset = queryset.filter(frontend_technology__icontains=params['technology']) | queryset.filter(
            programming_languages__icontains=params['technology']
        ) | queryset.filter(frameworks__icontains=params['technology']) | queryset.filter(
            libraries__icontains=params['technology']
        )
    if params.get('framework'):
        queryset = queryset.filter(frameworks__icontains=params['framework'])
    if params.get('animation_technology'):
        queryset = queryset.filter(animation_technology__icontains=params['animation_technology'])
    if params.get('responsive') in {'true', '1'}:
        queryset = queryset.filter(responsive_support=True)
    if params.get('dark_mode') in {'true', '1'}:
        queryset = queryset.filter(dark_mode_support=True)
    if params.get('featured') in {'true', '1'}:
        queryset = queryset.filter(is_featured=True)
    return queryset.distinct()
