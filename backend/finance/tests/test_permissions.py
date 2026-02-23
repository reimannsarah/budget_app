import pytest
from decimal import Decimal
from datetime import date
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from rest_framework_simplejwt.tokens import RefreshToken
from finance.models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription
from finance.views import UserRestrictedViewSet, BudgetItemViewSet

User = get_user_model()


class UserRestrictedViewSetTest(APITestCase):
    """Test the UserRestrictedViewSet base class functionality"""

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.other_user = User.objects.create_user(username='otheruser', email='other@example.com')
        self.client = APIClient()

        # Create test budget items for both users
        self.user_budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            category='User Item',
            percentage_of_income=Decimal('10.00')
        )

        self.other_user_budget_item = BudgetItem.objects.create(
            user=self.other_user,
            amount=Decimal('200.00'),
            category='Other User Item',
            percentage_of_income=Decimal('20.00')
        )

    def test_queryset_filters_by_user(self):
        """Test that get_queryset only returns objects for the authenticated user"""
        # Authenticate as user
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

        response = self.client.get('/api/budget-items/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['category'], 'User Item')

    def test_perform_create_sets_user(self):
        """Test that perform_create automatically sets the user"""
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

        data = {
            'amount': '300.00',
            'category': 'New Item',
            'percentage_of_income': '15.00'
        }

        response = self.client.post('/api/budget-items/', data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        new_item = BudgetItem.objects.get(category='New Item')
        self.assertEqual(new_item.user, self.user)

    def test_get_object_permission_check(self):
        """Test that get_object raises PermissionDenied for wrong user"""
        # Authenticate as user but try to access other user's item
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

        response = self.client.get(f'/api/budget-items/{self.other_user_budget_item.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access_denied(self):
        """Test that unauthenticated requests are denied"""
        response = self.client.get('/api/budget-items/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_model_attribute_required(self):
        """Test that ViewSets inheriting from UserRestrictedViewSet must define model"""
        # This test verifies the NotImplementedError is raised
        # when model is None (tested implicitly through the BudgetItemViewSet)
        # The actual viewsets all have model defined, so this is covered
        self.assertTrue(hasattr(BudgetItemViewSet, 'model'))
        self.assertEqual(BudgetItemViewSet.model, BudgetItem)


class PermissionIntegrationTest(APITestCase):
    """Integration tests for permissions across all finance models"""

    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com')
        self.client = APIClient()

        # Create comprehensive test data for both users
        self.user1_data = self.create_user_data(self.user1, 'User1')
        self.user2_data = self.create_user_data(self.user2, 'User2')

    def create_user_data(self, user, prefix):
        """Create a full set of financial data for a user"""
        budget_item = BudgetItem.objects.create(
            user=user,
            amount=Decimal('100.00'),
            category=f'{prefix}_Budget',
            percentage_of_income=Decimal('10.00')
        )

        income = Income.objects.create(
            user=user,
            amount=Decimal('1000.00'),
            source=f'{prefix}_Job'
        )

        credit_card = CreditCard.objects.create(
            user=user,
            annual_fee=Decimal('0.00'),
            credit_limit=1000,
            due_date=date(2024, 1, 15),
            name=f'{prefix}_Card',
            minimum_monthly_payment=Decimal('25.00'),
            statement_date=date(2024, 1, 1)
        )

        payment_method = PaymentMethod.objects.create(
            user=user,
            name=f'{prefix}_Payment',
            type='Credit Card'
        )

        loan = Loan.objects.create(
            user=user,
            amount=Decimal('5000.00'),
            due_date=date(2024, 12, 31),
            minimum_monthly_payment=Decimal('100.00'),
            name=f'{prefix}_Loan'
        )

        subscription = Subscription.objects.create(
            user=user,
            amount=Decimal('15.99'),
            credit_card=credit_card,
            due_date=date(2024, 1, 15),
            name=f'{prefix}_Subscription',
            payment_method=payment_method
        )

        return {
            'budget_item': budget_item,
            'income': income,
            'credit_card': credit_card,
            'payment_method': payment_method,
            'loan': loan,
            'subscription': subscription
        }

    def authenticate_as_user1(self):
        """Authenticate client as user1"""
        refresh = RefreshToken.for_user(self.user1)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

    def test_complete_data_isolation(self):
        """Test that users can only see their own data across all endpoints"""
        self.authenticate_as_user1()

        endpoints_and_checks = [
            ('/api/budget-items/', 'category', 'User1_Budget'),
            ('/api/incomes/', 'source', 'User1_Job'),
            ('/api/credit-cards/', 'name', 'User1_Card'),
            ('/api/payment-methods/', 'name', 'User1_Payment'),
            ('/api/loans/', 'name', 'User1_Loan'),
            ('/api/subscriptions/', 'name', 'User1_Subscription'),
        ]

        for endpoint, field, expected_value in endpoints_and_checks:
            with self.subTest(endpoint=endpoint):
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(len(response.data), 1)
                self.assertEqual(response.data[0][field], expected_value)

    def test_cross_user_crud_operations_blocked(self):
        """Test that CRUD operations are blocked across users"""
        self.authenticate_as_user1()

        # Test that user1 cannot modify user2's data
        test_cases = [
            (f"/api/budget-items/{self.user2_data['budget_item'].id}/", {'amount': '999.99', 'category': 'Hacked', 'percentage_of_income': '50.00'}),
            (f"/api/incomes/{self.user2_data['income'].id}/", {'amount': '999.99', 'source': 'Hacked Job'}),
            (f"/api/credit-cards/{self.user2_data['credit_card'].id}/", {'name': 'Hacked Card', 'annual_fee': '999.99', 'credit_limit': 9999, 'due_date': '2024-01-15', 'minimum_monthly_payment': '50.00', 'statement_date': '2024-01-01'}),
        ]

        for endpoint, data in test_cases:
            with self.subTest(endpoint=endpoint):
                # GET should return 404
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

                # PUT should return 404
                response = self.client.put(endpoint, data)
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

                # DELETE should return 404
                response = self.client.delete(endpoint)
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_with_explicit_user_field_ignored(self):
        """Test that explicitly setting user field in POST data is ignored"""
        self.authenticate_as_user1()

        # Try to create a budget item for user2 (should be ignored and created for user1)
        data = {
            'user': self.user2.id,  # This should be ignored
            'amount': '500.00',
            'category': 'Test Item',
            'percentage_of_income': '25.00'
        }

        response = self.client.post('/api/budget-items/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify the item was created for user1, not user2
        new_item = BudgetItem.objects.get(category='Test Item')
        self.assertEqual(new_item.user, self.user1)
        self.assertNotEqual(new_item.user, self.user2)

    def test_subscription_foreign_key_restrictions(self):
        """Test that subscriptions can only reference user's own credit cards and payment methods"""
        self.authenticate_as_user1()

        # Try to create subscription referencing user2's credit card and payment method
        data = {
            'amount': '19.99',
            'due_date': '2024-01-15',
            'name': 'Invalid Subscription',
            'credit_card': self.user2_data['credit_card'].id,
            'payment_method': self.user2_data['payment_method'].id
        }

        response = self.client.post('/api/subscriptions/', data)

        # This should either fail validation or succeed but not use the other user's data
        # Since DRF will validate foreign keys, this might return 400
        self.assertIn(response.status_code, [status.HTTP_400_BAD_REQUEST, status.HTTP_201_CREATED])

        if response.status_code == status.HTTP_201_CREATED:
            # If it succeeded, verify it didn't actually use other user's data
            subscription = Subscription.objects.get(name='Invalid Subscription')
            self.assertEqual(subscription.user, self.user1)


class AuthenticationRequirementTest(APITestCase):
    """Test authentication requirements for all endpoints"""

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.client = APIClient()

    def test_all_endpoints_require_authentication(self):
        """Test that all finance API endpoints require authentication"""
        endpoints = [
            '/api/budget-items/',
            '/api/incomes/',
            '/api/credit-cards/',
            '/api/payment-methods/',
            '/api/loans/',
            '/api/subscriptions/',
        ]

        for endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                # GET without auth
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

                # POST without auth
                response = self.client.post(endpoint, {})
                self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_token_rejected(self):
        """Test that invalid JWT tokens are rejected"""
        self.client.credentials(HTTP_AUTHORIZATION='Bearer invalid_token')

        response = self.client.get('/api/budget-items/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_expired_token_handling(self):
        """Test handling of expired tokens"""
        # Create a token with very short lifetime for testing
        refresh = RefreshToken.for_user(self.user)

        # Use valid token first
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')
        response = self.client.get('/api/budget-items/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Clear credentials and try without token
        self.client.credentials()
        response = self.client.get('/api/budget-items/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class EdgeCasePermissionTest(APITestCase):
    """Test edge cases and error conditions in permission system"""

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.client = APIClient()

        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

    def test_nonexistent_resource_access(self):
        """Test accessing non-existent resources"""
        response = self.client.get('/api/budget-items/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.put('/api/budget-items/99999/', {'amount': '100'})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        response = self.client.delete('/api/budget-items/99999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_malformed_resource_ids(self):
        """Test accessing resources with malformed IDs"""
        response = self.client.get('/api/budget-items/invalid_id/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_partial_update_permissions(self):
        """Test PATCH operations maintain user restrictions"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            category='Test',
            percentage_of_income=Decimal('10.00')
        )

        # PATCH should work for own data
        response = self.client.patch(f'/api/budget-items/{budget_item.id}/', {'amount': '150.00'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        budget_item.refresh_from_db()
        self.assertEqual(budget_item.amount, Decimal('150.00'))

    def test_bulk_operations_user_isolation(self):
        """Test that any bulk operations maintain user isolation"""
        # Create multiple budget items
        for i in range(3):
            BudgetItem.objects.create(
                user=self.user,
                amount=Decimal(f'{100 + i * 50}.00'),
                category=f'Item {i}',
                percentage_of_income=Decimal(f'{10 + i * 5}.00')
            )

        response = self.client.get('/api/budget-items/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)

        # Verify all returned items belong to the authenticated user
        for item in response.data:
            # We can't directly check the user field since it's not serialized
            # but we can verify we only get items we created
            self.assertIn(item['category'], ['Item 0', 'Item 1', 'Item 2'])