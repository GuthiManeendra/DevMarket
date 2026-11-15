from rest_framework import serializers

from .services import validate_project_price
from .models import Project, ProjectCategory, ProjectImage


class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'image']


class ProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'display_order']


class ProjectListSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    discount_percentage = serializers.ReadOnlyField()
    primary_image = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'slug', 'short_description', 'seo_title',
            'seo_description', 'category',
            'project_type', 'difficulty_level', 'programming_languages',
            'technologies', 'frameworks', 'price', 'compare_at_price',
            'discount_percentage', 'is_featured', 'is_bestseller',
            'primary_image', 'created_at',
        ]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        return ProjectImageSerializer(image, context=self.context).data if image else None


class ProjectDetailSerializer(ProjectListSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)

    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            'description', 'database_technologies', 'tools_used',
            'problem_statement', 'proposed_solution', 'key_features',
            'architecture_description', 'requirements',
            'installation_instructions', 'documentation_description',
            'demo_video_url', 'live_demo_url', 'images', 'updated_at',
        ]


class ProjectWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate(self, attrs):
        category = attrs.get('category', getattr(self.instance, 'category', None))
        price = attrs.get('price', getattr(self.instance, 'price', None))
        if category and price is not None:
            validate_project_price(category, price)
        return attrs

    def create(self, validated_data):
        return Project.objects.create(**validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        changed_by = getattr(request, 'user', None)
        change_reason = self.context.get('change_reason', '')
        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save(changed_by=changed_by, change_reason=change_reason)
        return instance
