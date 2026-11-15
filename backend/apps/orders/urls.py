from django.urls import path

from .views import MyOrdersView

app_name = 'orders'

urlpatterns = [
    path('', MyOrdersView.as_view(), name='my-orders'),
]
