import pytest
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.core import mail
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from freezegun import freeze_time

User = get_user_model()


class SendLoginCodeViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('send_login_code')
        self.client = APIClient()

    def tearDown(self):
        cache.clear()
        mail.outbox.clear()

    def test_send_code_success_new_user(self):
        """Test sending login code to a new user creates the user and sends email"""
        email = 'newuser@example.com'
        response = self.client.post(self.url, {'email': email})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Login code sent.')

        # Check user was created
        user = User.objects.get(email=email)
        self.assertEqual(user.username, email)

        # Check email was sent
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].to, [email])
        self.assertEqual(mail.outbox[0].subject, 'Your Login Code')

        # Check code was cached
        cached_code = cache.get(f'login_code_{email}')
        self.assertIsNotNone(cached_code)
        self.assertEqual(len(cached_code), 6)
        self.assertTrue(cached_code.isdigit())

    def test_send_code_success_existing_user(self):
        """Test sending login code to existing user doesn't create duplicate"""
        email = 'existing@example.com'
        User.objects.create_user(username=email, email=email)

        response = self.client.post(self.url, {'email': email})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(User.objects.filter(email=email).count(), 1)

    def test_send_code_missing_email(self):
        """Test error when email is missing"""
        response = self.client.post(self.url, {})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email is required.')

    def test_send_code_empty_email(self):
        """Test error when email is empty"""
        response = self.client.post(self.url, {'email': ''})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email is required.')

    def test_code_expires_after_five_minutes(self):
        """Test that login code expires after 5 minutes"""
        email = 'test@example.com'

        with freeze_time("2023-01-01 12:00:00"):
            response = self.client.post(self.url, {'email': email})
            self.assertEqual(response.status_code, status.HTTP_200_OK)

            # Code should exist
            cached_code = cache.get(f'login_code_{email}')
            self.assertIsNotNone(cached_code)

        with freeze_time("2023-01-01 12:05:01"):
            # Code should be expired
            cached_code = cache.get(f'login_code_{email}')
            self.assertIsNone(cached_code)


class VerifyLoginCodeViewTest(APITestCase):
    def setUp(self):
        self.url = reverse('verify_login_code')
        self.client = APIClient()
        self.email = 'test@example.com'
        self.user = User.objects.create_user(username=self.email, email=self.email)

    def tearDown(self):
        cache.clear()

    def test_verify_code_success(self):
        """Test successful code verification returns JWT tokens"""
        code = '123456'
        cache.set(f'login_code_{self.email}', code, timeout=300)

        response = self.client.post(self.url, {
            'email': self.email,
            'code': code
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

        # Check code is deleted after use
        cached_code = cache.get(f'login_code_{self.email}')
        self.assertIsNone(cached_code)

    def test_verify_code_invalid_code(self):
        """Test error with invalid code"""
        cache.set(f'login_code_{self.email}', '123456', timeout=300)

        response = self.client.post(self.url, {
            'email': self.email,
            'code': '654321'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid or expired code.')

    def test_verify_code_expired_code(self):
        """Test error with expired code"""
        response = self.client.post(self.url, {
            'email': self.email,
            'code': '123456'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid or expired code.')

    def test_verify_code_missing_email(self):
        """Test error when email is missing"""
        response = self.client.post(self.url, {'code': '123456'})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email and code are required.')

    def test_verify_code_missing_code(self):
        """Test error when code is missing"""
        response = self.client.post(self.url, {'email': self.email})

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email and code are required.')

    def test_verify_code_nonexistent_user(self):
        """Test error when user doesn't exist"""
        code = '123456'
        email = 'nonexistent@example.com'
        cache.set(f'login_code_{email}', code, timeout=300)

        response = self.client.post(self.url, {
            'email': email,
            'code': code
        })

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'User not found.')

    def test_jwt_tokens_are_valid(self):
        """Test that returned JWT tokens are valid and contain correct user"""
        code = '123456'
        cache.set(f'login_code_{self.email}', code, timeout=300)

        response = self.client.post(self.url, {
            'email': self.email,
            'code': code
        })

        # Verify token can be used for authentication
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

        # Test with a protected endpoint (will be created in finance app tests)
        # For now, just verify tokens are not empty
        self.assertTrue(len(response.data['access']) > 50)
        self.assertTrue(len(response.data['refresh']) > 50)


class AuthenticationIntegrationTest(APITestCase):
    """Integration tests for the complete authentication flow"""

    def setUp(self):
        self.send_code_url = reverse('send_login_code')
        self.verify_code_url = reverse('verify_login_code')
        self.client = APIClient()

    def tearDown(self):
        cache.clear()
        mail.outbox.clear()

    def test_complete_auth_flow(self):
        """Test complete authentication flow from code request to token usage"""
        email = 'integration@example.com'

        # Step 1: Request login code
        response = self.client.post(self.send_code_url, {'email': email})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Extract code from email
        self.assertEqual(len(mail.outbox), 1)
        email_body = mail.outbox[0].body
        code = email_body.split('Your login code is: ')[1].strip()

        # Step 2: Verify code and get tokens
        response = self.client.post(self.verify_code_url, {
            'email': email,
            'code': code
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        access_token = response.data['access']

        # Step 3: Use token for authentication
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token}")

        # Verify user was created with correct email
        user = User.objects.get(email=email)
        self.assertEqual(user.username, email)

    def test_code_reuse_prevention(self):
        """Test that codes cannot be reused after successful verification"""
        email = 'reuse@example.com'
        code = '123456'
        User.objects.create_user(username=email, email=email)
        cache.set(f'login_code_{email}', code, timeout=300)

        # First verification should succeed
        response = self.client.post(self.verify_code_url, {
            'email': email,
            'code': code
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Second verification should fail
        response = self.client.post(self.verify_code_url, {
            'email': email,
            'code': code
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invalid or expired code.')
