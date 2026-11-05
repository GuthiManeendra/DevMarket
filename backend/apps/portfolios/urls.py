from rest_framework.routers import DefaultRouter

from .views import PortfolioCategoryViewSet, PortfolioTemplateViewSet

router = DefaultRouter()
router.register('categories', PortfolioCategoryViewSet, basename='portfolio-category')
router.register('', PortfolioTemplateViewSet, basename='portfolio-template')

urlpatterns = router.urls
