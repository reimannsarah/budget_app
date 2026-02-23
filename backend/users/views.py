from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core.mail import send_mail
from django.utils.crypto import get_random_string

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny

User = get_user_model()


class SendLoginCodeView(APIView):
    """
    Accepts an email, creates a user if they don't exist,
    generates a one-time code, and sends it via email.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user if they don't exist yet
        user, created = User.objects.get_or_create(email=email, defaults={"username": email})

        # Generate and store a 6-digit login code
        code = get_random_string(6, allowed_chars='0123456789')
        cache.set(f'login_code_{email}', code, timeout=300)  # Valid for 5 minutes

        # Send the code to the user's email
        send_mail(
            subject='Your Login Code',
            message=f'Your login code is: {code}',
            from_email='no-reply@yourapp.com',
            recipient_list=[email],
        )

        return Response({'message': 'Login code sent.'}, status=status.HTTP_200_OK)


class VerifyLoginCodeView(APIView):
    """
    Accepts an email and login code. If valid, returns JWT tokens.
    """
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        code = request.data.get('code')

        if not email or not code:
            return Response({'error': 'Email and code are required.'}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f'login_code_{email}')
        if not cached_code or cached_code != code:
            return Response({'error': 'Invalid or expired code.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        # Remove the code after successful login
        cache.delete(f'login_code_{email}')

        # Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
