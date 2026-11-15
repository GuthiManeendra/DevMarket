
from rest_framework import serializers

from .models import (
    PortfolioCategory,
    PortfolioTemplate,
    PortfolioPreview,
    PortfolioCustomizationOption,
)


class PortfolioCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCategory
        fields = '__all__'


class PortfolioPreviewSerializer(serializers.ModelSerializer):
    thumbnail_image = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioPreview
        fields = [
            'id',
            'preview_type',
            'preview_url',
            'thumbnail_image',
            'description',
            'display_order',
        ]

    def get_thumbnail_image(self, obj):
        if not obj.thumbnail_image:
            return None

        request = self.context.get('request')
        image_url = obj.thumbnail_image.url

        if request:
            return request.build_absolute_uri(image_url)

        return image_url


class PortfolioCustomizationOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioCustomizationOption
        fields = '__all__'


class PortfolioListSerializer(serializers.ModelSerializer):
    category = PortfolioCategorySerializer(read_only=True)
    previews = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioTemplate
        fields = [
            'id',
            'title',
            'slug',
            'short_description',
            'category',
            'portfolio_type',
            'frontend_technology',
            'frameworks',
            'libraries',
            'animation_technology',
            'base_price',
            'currency',
            'is_featured',
            'is_bestseller',
            'responsive_support',
            'dark_mode_support',
            'created_at',
            'previews',
        ]

    def get_previews(self, obj):
        previews = obj.previews.filter(
            is_active=True
        ).order_by('display_order')

        return PortfolioPreviewSerializer(
            previews,
            many=True,
            context=self.context,
        ).data


class PortfolioDetailSerializer(serializers.ModelSerializer):
    category = PortfolioCategorySerializer(read_only=True)
    previews = serializers.SerializerMethodField()
    customization_options = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioTemplate
        fields = '__all__'

    def get_previews(self, obj):
        previews = obj.previews.filter(
            is_active=True
        ).order_by('display_order')

        return PortfolioPreviewSerializer(
            previews,
            many=True,
            context=self.context,
        ).data

    def get_customization_options(self, obj):
        options = obj.customization_services.all()

        return PortfolioCustomizationOptionSerializer(
            options,
            many=True,
            context=self.context,
        ).data


class PortfolioWriteSerializer(serializers.ModelSerializer):

    class Meta:
        model = PortfolioTemplate
        fields = '__all__'

    def validate(self, attrs):
        category = attrs.get(
            'category',
            self.instance.category if self.instance else None
        )

        portfolio_type = attrs.get(
            'portfolio_type',
            self.instance.portfolio_type if self.instance else None
        )

        if category and portfolio_type:
            if category.portfolio_type != portfolio_type:
                raise serializers.ValidationError({
                    'category': (
                        'Category type must match portfolio type.'
                    )
                })

        return attrs
