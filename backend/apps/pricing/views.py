import logging

from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import PriceHistory, PricingConfiguration
from .serializers import (
    PriceHistorySerializer,
    PriceValidationSerializer,
    PricingConfigurationSerializer,
)
from .services import get_active_configuration, get_minimum_allowed_price

logger = logging.getLogger(__name__)


class PricingConfigurationView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PricingConfigurationSerializer

    def get_object(self):
        return get_active_configuration()

    def retrieve(self, request, *args, **kwargs):
        configuration = self.get_object()
        if configuration is None:
            return Response({
                'configuration_name': 'default',
                'ai_minimum_price': '7500.00',
                'currency': 'INR',
                'is_active': True,
            })
        return super().retrieve(request, *args, **kwargs)


class AIMinimumPriceView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, *args, **kwargs):
        configuration = get_active_configuration()
        return Response({
            'minimum_price': '7500.00' if configuration is None else f'{configuration.ai_minimum_price:.2f}',
            'currency': configuration.currency if configuration else 'INR',
        })


class PricingConfigurationUpdateView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = PricingConfigurationSerializer
    queryset = PricingConfiguration.objects.all()

    def get_object(self):
        return get_active_configuration() or PricingConfiguration.objects.get_or_create(
            configuration_name='default',
            defaults={'ai_minimum_price': '7500.00', 'currency': 'INR'},
        )[0]

    def perform_update(self, serializer):
        configuration = serializer.save()
        logger.info(
            'Pricing configuration changed: id=%s minimum=%s currency=%s user=%s',
            configuration.pk,
            configuration.ai_minimum_price,
            configuration.currency,
            self.request.user,
        )

    def post(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)


class PriceValidationView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = PriceValidationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.validated_data['category']
        price = serializer.validated_data['price']
        minimum = get_minimum_allowed_price(category)
        configuration = get_active_configuration()
        return Response({
            'success': True,
            'minimum_price': f'{minimum:.2f}',
            'submitted_price': f'{price:.2f}',
            'currency': configuration.currency if configuration else 'INR',
            'message': 'Price is valid.',
        })


class ProjectPriceHistoryView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    serializer_class = PriceHistorySerializer

    def get_queryset(self):
        return PriceHistory.objects.filter(project_id=self.kwargs['project_id']).select_related('changed_by')
