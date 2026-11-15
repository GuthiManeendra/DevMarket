
import logging

from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import transaction

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .email_service import send_welcome_email
from .whatsapp_service import send_registration_whatsapp

logger = logging.getLogger(__name__)

User = get_user_model()


def user_response_data(user):
    return {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        full_name = request.data.get('full_name', '').strip()
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not full_name or not email or not password:
            return Response(
                {'message': 'Name, email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {'message': 'An account with this email already exists.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            validate_password(password)
        except DjangoValidationError as error:
            return Response(
                {'message': error.messages},
                status=status.HTTP_400_BAD_REQUEST,
            )

        names = full_name.split()
        first_name = names[0]
        last_name = ' '.join(names[1:])

        base_username = email.split('@')[0][:140]
        username = base_username
        counter = 1

        while User.objects.filter(username=username).exists():
            username = f'{base_username[:135]}{counter}'
            counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
        )

        token, _ = Token.objects.get_or_create(user=user)

        # Capture identifiers before the on_commit closures capture them.
        # Both callbacks re-fetch the user from DB for safety.
        user_id = user.pk
        user_email = user.email

        # -------------------------------------------------------------- #
        # 1. Welcome email – fires only after successful DB commit         #
        # -------------------------------------------------------------- #
        def _send_email():
            try:
                fresh_user = User.objects.get(pk=user_id)
                send_welcome_email(fresh_user)
            except User.DoesNotExist:
                logger.warning(
                    "Welcome email skipped: user %s no longer exists.", user_id
                )
            except Exception as exc:  # noqa: BLE001
                logger.error(
                    "Unexpected error in on_commit welcome email for %s: %s",
                    user_email,
                    exc,
                    exc_info=True,
                )

        transaction.on_commit(_send_email)

        # -------------------------------------------------------------- #
        # 2. WhatsApp admin notification – fires only after DB commit      #
        #    Completely independent of the email callback; a failure in    #
        #    either never affects the other or the registration response.  #
        # -------------------------------------------------------------- #
        def _send_whatsapp():
            try:
                fresh_user = User.objects.get(pk=user_id)
                send_registration_whatsapp(fresh_user)
            except User.DoesNotExist:
                logger.warning(
                    "WhatsApp notification skipped: user %s no longer exists.",
                    user_id,
                )
            except Exception as exc:  # noqa: BLE001
                logger.error(
                    "Unexpected error in on_commit WhatsApp notification for %s: %s",
                    user_email,
                    exc,
                    exc_info=True,
                )

        transaction.on_commit(_send_whatsapp)

        logger.info(
            "New customer registered: %s (user_id=%s).", user_email, user_id
        )

        return Response(
            {
                'message': 'Registration successful.',
                'token': token.key,
                'user': user_response_data(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'message': 'Email and password are required.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = User.objects.filter(email__iexact=email).first()

        if not user:
            return Response(
                {'message': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        authenticated_user = authenticate(
            request,
            username=user.username,
            password=password,
        )

        if authenticated_user is None:
            return Response(
                {'message': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token, _ = Token.objects.get_or_create(
            user=authenticated_user
        )

        return Response({
            'message': 'Login successful.',
            'token': token.key,
            'user': user_response_data(authenticated_user),
        })


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.auth.delete()

        return Response({
            'message': 'Logout successful.',
        })


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'user': user_response_data(request.user),
        })
