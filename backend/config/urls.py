"""
URL configuration for config project.
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from apps.cart.views import CouponValidateView, CreateOrderView, QuoteView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.core.urls')),
    path('api/projects/', include('apps.products.urls')),
    path('api/pricing/', include('apps.pricing.urls')),
    path('api/portfolios/', include('apps.portfolios.urls')),
    path('api/cart/', include('apps.cart.urls')),
    path('api/checkout/quote/', QuoteView.as_view()),
    path('api/checkout/create-order/', CreateOrderView.as_view()),
    path('api/coupons/validate/', CouponValidateView.as_view()),
    path('api/payments/', include('apps.payments.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
