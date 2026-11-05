from django.db.models import Prefetch, Q
from rest_framework import filters, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .filters import filter_public_projects
from .models import Project, ProjectCategory
from .permissions import PublicReadStaffWrite
from .serializers import (
    ProjectCategorySerializer,
    ProjectDetailSerializer,
    ProjectListSerializer,
    ProjectWriteSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = 'slug'
    pagination_class = None
    permission_classes = [AllowAny]
    serializer_class = ProjectCategorySerializer
    queryset = ProjectCategory.objects.filter(is_active=True)


class ProjectViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    permission_classes = [PublicReadStaffWrite]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'short_description']
    ordering_fields = ['price', 'created_at', 'title']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Project.objects.select_related('category').prefetch_related('images')
        if not self.request.user.is_staff:
            queryset = queryset.filter(
                is_active=True,
                publication_status=Project.PublicationStatus.PUBLISHED,
            )
        queryset = filter_public_projects(queryset, self.request.query_params)
        if self.action == 'retrieve':
            return queryset
        return queryset

    def get_serializer_class(self):
        if self.action in {'create', 'update', 'partial_update'}:
            return ProjectWriteSerializer
        if self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectListSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        if page is not None:
            return self.get_paginated_response(serializer.data)
        return Response(serializer.data)

    def _flagged_list(self, flag):
        queryset = self.filter_queryset(self.get_queryset().filter(**{flag: True}))
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)

    @action(detail=False, methods=['get'])
    def featured(self, request):
        return self._flagged_list('is_featured')

    @action(detail=False, methods=['get'])
    def popular(self, request):
        return self._flagged_list('is_bestseller')

    @action(detail=False, methods=['get'])
    def latest(self, request):
        queryset = self.filter_queryset(self.get_queryset().order_by('-created_at'))
        page = self.paginate_queryset(queryset)
        serializer = self.get_serializer(page if page is not None else queryset, many=True)
        return self.get_paginated_response(serializer.data) if page is not None else Response(serializer.data)
