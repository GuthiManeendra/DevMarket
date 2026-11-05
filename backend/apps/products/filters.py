from decimal import Decimal, InvalidOperation

from rest_framework.exceptions import ValidationError


def filter_public_projects(queryset, params):
    category = params.get('category')
    if category:
        queryset = queryset.filter(category__slug=category)

    for field in ('project_type', 'difficulty_level'):
        value = params.get(field)
        if value:
            queryset = queryset.filter(**{field: value})

    for parameter, lookup in (('min_price', 'price__gte'), ('max_price', 'price__lte')):
        value = params.get(parameter)
        if value:
            try:
                decimal_value = Decimal(value)
            except InvalidOperation as error:
                raise ValidationError({parameter: 'Must be a valid decimal amount.'}) from error
            if decimal_value < 0:
                raise ValidationError({parameter: 'Must be zero or greater.'})
            queryset = queryset.filter(**{lookup: decimal_value})

    for parameter, field in (
        ('programming_language', 'programming_languages'),
        ('technology', 'technologies'),
    ):
        value = params.get(parameter)
        if value:
            queryset = queryset.filter(**{f'{field}__icontains': value})

    if params.get('featured') in {'true', '1'}:
        queryset = queryset.filter(is_featured=True)
    return queryset
