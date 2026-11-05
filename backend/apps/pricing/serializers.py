from decimal import Decimal

from rest_framework import serializers

from apps.products.models import Project, ProjectCategory

from .models import PriceHistory, PricingConfiguration
from .services import get_active_configuration, get_minimum_allowed_price, validate_project_price


class PricingConfigurationSerializer(serializers.ModelSerializer):
    class Meta:
        model = PricingConfiguration
        fields = [
            'id', 'configuration_name', 'ai_minimum_price', 'currency',
            'is_active', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_ai_minimum_price(self, value):
        if value < Decimal('7500.00'):
            raise serializers.ValidationError('The AI minimum cannot be below INR 7500.00.')
        return value


class PriceValidationSerializer(serializers.Serializer):
    category_slug = serializers.SlugField()
    price = serializers.DecimalField(max_digits=10, decimal_places=2)

    def validate(self, attrs):
        try:
            category = ProjectCategory.objects.get(slug=attrs['category_slug'])
        except ProjectCategory.DoesNotExist as error:
            raise serializers.ValidationError({'category_slug': 'Category not found.'}) from error
        validate_project_price(category, attrs['price'])
        attrs['category'] = category
        return attrs


class PriceHistorySerializer(serializers.ModelSerializer):
    changed_by = serializers.StringRelatedField()

    class Meta:
        model = PriceHistory
        fields = ['id', 'project', 'old_price', 'new_price', 'changed_by', 'change_reason', 'created_at']
