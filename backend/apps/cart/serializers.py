from rest_framework import serializers

from .models import CartItem


class CartItemSerializer(serializers.ModelSerializer):
    project_id = serializers.IntegerField(required=False, allow_null=True)
    portfolio_template_id = serializers.IntegerField(required=False, allow_null=True)

    class Meta:
        model = CartItem
        fields = ['id', 'project_id', 'portfolio_template_id', 'quantity', 'selected_customization_options']
        read_only_fields = ['id']

    def validate(self, attrs):
        if self.instance and 'project_id' not in attrs and 'portfolio_template_id' not in attrs:
            return attrs
        if bool(attrs.get('project_id')) == bool(attrs.get('portfolio_template_id')):
            raise serializers.ValidationError('Provide exactly one project_id or portfolio_template_id.')
        if attrs.get('quantity', 1) != 1:
            raise serializers.ValidationError({'quantity': 'Digital products have a quantity of one.'})
        return attrs
