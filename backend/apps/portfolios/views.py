from django.db.models import Q
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .filters import filter_portfolios
from .models import PortfolioCategory, PortfolioTemplate
from .permissions import PublicReadStaffWrite
from .serializers import (
    PortfolioCategorySerializer,
    PortfolioCustomizationOptionSerializer,
    PortfolioDetailSerializer,
    PortfolioListSerializer,
    PortfolioPreviewSerializer,
    PortfolioWriteSerializer,
)
from .services import public_portfolio_queryset


class PortfolioCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    serializer_class = PortfolioCategorySerializer
    permission_classes = [AllowAny]
    pagination_class = None
    queryset = PortfolioCategory.objects.filter(is_active=True)


class PortfolioTemplateViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [PublicReadStaffWrite]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'short_description', 'full_description']
    ordering_fields = ['base_price', 'created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = public_portfolio_queryset() if not self.request.user.is_staff else PortfolioTemplate.objects.select_related('category').prefetch_related('previews', 'customization_services')
        queryset = filter_portfolios(queryset, self.request.query_params)
        if self.action == 'retrieve' and not self.request.user.is_staff:
            return queryset
        return queryset

    def get_serializer_class(self):
        if self.action in {'create', 'update', 'partial_update'}:
            return PortfolioWriteSerializer
        if self.action == 'retrieve':
            return PortfolioDetailSerializer
        return PortfolioListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    def _filtered_action(self, request, **filters):
        queryset = self.filter_queryset(self.get_queryset().filter(**filters))
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        return self._filtered_action(request, is_featured=True)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        return self._filtered_action(request)

    @action(detail=False, methods=['get'])
    def standard(self, request):
        return self._filtered_action(request, portfolio_type=PortfolioTemplate.PortfolioType.STANDARD)

    @action(detail=False, methods=['get'])
    def premium(self, request):
        return self._filtered_action(request, portfolio_type=PortfolioTemplate.PortfolioType.PREMIUM_ANIMATED)

    @action(detail=True, methods=['get'], url_path='customization-options')
    def customization_options(self, request, slug=None):
        template = self.get_object()
        options = template.customization_services.filter(is_available=True)
        return Response(PortfolioCustomizationOptionSerializer(options, many=True).data)

    @action(detail=True, methods=['get'])
    def previews(self, request, slug=None):
        template = self.get_object()
        previews = template.previews.filter(is_active=True)
        return Response(PortfolioPreviewSerializer(previews, many=True).data)
