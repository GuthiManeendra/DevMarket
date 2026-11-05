from django.urls import path
from .views import (
    PaymentStatusView,
    RazorpayCreateOrderView,
    RazorpayVerifyPaymentView,
    RazorpayWebhookView,
)

app_name = 'payments'

urlpatterns = [
    path('create/', RazorpayCreateOrderView.as_view(), name='payment-create'),
    path('verify/', RazorpayVerifyPaymentView.as_view(), name='payment-verify'),
    path('webhook/', RazorpayWebhookView.as_view(), name='payment-webhook'),
    path('status/<str:order_number>/', PaymentStatusView.as_view(), name='payment-status'),
]

