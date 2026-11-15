"""
URL configuration for config project.
"""

from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from apps.cart.views import CouponValidateView, CreateOrderView, QuoteView
from apps.core.seo import robots_txt, sitemap_xml

urlpatterns = [
    path('admin/', admin.site.urls),

    # SEO endpoints (served for the frontend origin via proxy in production)
    path('sitemap.xml', sitemap_xml, name='sitemap'),
    path('robots.txt', robots_txt, name='robots-txt'),

    # Authentication
    path('api/auth/', include('apps.core.auth_urls')),

    # Existing APIs
    path('api/', include('apps.core.urls')),
    path('api/projects/', include('apps.products.urls')),
    path('api/pricing/', include('apps.pricing.urls')),
    path('api/portfolios/', include('apps.portfolios.urls')),
    path('api/cart/', include('apps.cart.urls')),

    # Checkout
    path('api/checkout/quote/', QuoteView.as_view()),
    path('api/checkout/create-order/', CreateOrderView.as_view()),

    # Coupons
    path('api/coupons/validate/', CouponValidateView.as_view()),

    # Payments
    path('api/payments/', include('apps.payments.urls')),

    # Customer orders / purchases
    path('api/orders/', include('apps.orders.urls')),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )