from django.urls import path

from .views import CartClearView, CartItemCreateView, CartItemDetailView, CartMergeView, CartView, CouponValidateView, CreateOrderView, QuoteView

urlpatterns = [
    path('', CartView.as_view(), name='cart'),
    path('items/', CartItemCreateView.as_view(), name='cart-item-create'),
    path('items/<int:pk>/', CartItemDetailView.as_view(), name='cart-item-detail'),
    path('clear/', CartClearView.as_view(), name='cart-clear'),
    path('merge/', CartMergeView.as_view(), name='cart-merge'),
    path('checkout/quote/', QuoteView.as_view(), name='checkout-quote'),
    path('checkout/create-order/', CreateOrderView.as_view(), name='checkout-create-order'),
    path('coupons/validate/', CouponValidateView.as_view(), name='coupon-validate'),
]
