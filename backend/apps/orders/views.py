from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Order
from .serializers import OrderSerializer


class MyOrdersView(APIView):
    """
    GET /api/orders/
    Returns the authenticated customer's orders, newest first.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        orders = (
            Order.objects.filter(user=request.user)
            .prefetch_related('items', 'payments')
        )
        serializer = OrderSerializer(orders, many=True)
        return Response({'results': serializer.data})
