from django.db import connection
from django.db.utils import DatabaseError
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK, HTTP_503_SERVICE_UNAVAILABLE


@api_view(['GET'])
def health_check(request):
    try:
        connection.ensure_connection()
    except DatabaseError:
        return Response(
            {
                'status': 'error',
                'message': 'DevMarket API is running, but the database is unavailable',
                'database': 'disconnected',
            },
            status=HTTP_503_SERVICE_UNAVAILABLE,
        )

    return Response(
        {
            'status': 'success',
            'message': 'DevMarket API is running',
            'database': 'connected',
        },
        status=HTTP_200_OK,
    )
