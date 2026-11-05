from rest_framework import serializers

from .models import PortfolioCategory, PortfolioCustomizationOption, PortfolioPreview, PortfolioTemplate
from .services import public_portfolio_queryset


class PortfolioCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCategory
        fields = ['id', 'name', 'slug', 'description', 'portfolio_type', 'image', 'icon', 'display_order']


class PortfolioPreviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioPreview
        fields = ['id', 'preview_type', 'preview_url', 'thumbnail_image', 'description', 'display_order']


class PortfolioCustomizationOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCustomizationOption
        fields = [
            'id', 'option_name', 'description', 'option_type', 'additional_price',
            'is_required', 'is_available',
        ]


class PortfolioListSerializer(serializers.ModelSerializer):
    category = PortfolioCategorySerializer(read_only=True)

    class Meta:
        model = PortfolioTemplate
        fields = [
            'id', 'title', 'slug', 'short_description', 'category', 'portfolio_type',
            'frontend_technology', 'frameworks', 'libraries', 'animation_technology',
            'base_price', 'compare_at_price', 'currency', 'is_featured',
            'is_bestseller', 'responsive_support', 'dark_mode_support', 'created_at',
        ]


class PortfolioDetailSerializer(PortfolioListSerializer):
    previews = serializers.SerializerMethodField()
    customization_options = serializers.SerializerMethodField()

    class Meta(PortfolioListSerializer.Meta):
        fields = PortfolioListSerializer.Meta.fields + [
            'full_description', 'template_code', 'version', 'difficulty_level',
            'backend_technology', 'programming_languages', 'supported_devices',
            'features', 'included_sections', 'seo_support', 'documentation_included',
            'previews', 'customization_options', 'updated_at',
        ]

    def get_previews(self, obj):
        return PortfolioPreviewSerializer(
            obj.previews.filter(is_active=True),
            many=True,
            context=self.context,
        ).data

    def get_customization_options(self, obj):
        return PortfolioCustomizationOptionSerializer(
            obj.customization_services.filter(is_available=True),
            many=True,
            context=self.context,
        ).data


class PortfolioWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioTemplate
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        instance = self.instance
        category = attrs.get('category', getattr(instance, 'category', None))
        portfolio_type = attrs.get('portfolio_type', getattr(instance, 'portfolio_type', None))
        if category and portfolio_type and category.portfolio_type != portfolio_type:
            raise serializers.ValidationError({'portfolio_type': 'Portfolio type must match the selected category.'})
        return attrs
