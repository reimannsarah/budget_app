import pytest
from decimal import Decimal
from datetime import date
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from django.core.cache import cache
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from finance.models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription

User = get_user_model()


class BaseFinanceAPITest(APITestCase):
    """Base class for finance API tests"""

    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
        self.other_user = User.objects.create_user(username='otheruser', email='other@example.com')
        self.client = APIClient()

        # Authenticate as main test user
        refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(refresh.access_token)}')

        # Create client for other user
        self.other_client = APIClient()
        other_refresh = RefreshToken.for_user(self.other_user)
        self.other_client.credentials(HTTP_AUTHORIZATION=f'Bearer {str(other_refresh.access_token)}')

    def tearDown(self):
        cache.clear()


class BudgetItemAPITest(BaseFinanceAPITest):
    def setUp(self):
        super().setUp()
        self.url = '/api/budget-items/'
        self.valid_data = {
            'amount': '500.00',
            'category': 'Groceries',
            'percentage_of_income': '15.50'
        }

    def test_create_budget_item(self):
        """Test creating a budget item via API"""
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(BudgetItem.objects.count(), 1)

        budget_item = BudgetItem.objects.first()
        self.assertEqual(budget_item.user, self.user)
        self.assertEqual(budget_item.amount, Decimal('500.00'))
        self.assertEqual(budget_item.category, 'Groceries')
        self.assertEqual(budget_item.percentage_of_income, Decimal('15.50'))

    def test_list_budget_items(self):
        """Test listing budget items returns only user's items"""
        # Create budget item for main user
        BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('300.00'),
            category='Entertainment',
            percentage_of_income=Decimal('10.00')
        )

        # Create budget item for other user
        BudgetItem.objects.create(
            user=self.other_user,
            amount=Decimal('200.00'),
            category='Food',
            percentage_of_income=Decimal('5.00')
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['category'], 'Entertainment')

    def test_retrieve_budget_item(self):
        """Test retrieving a specific budget item"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('400.00'),
            category='Transport',
            percentage_of_income=Decimal('12.00')
        )

        response = self.client.get(f'{self.url}{budget_item.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['category'], 'Transport')

    def test_update_budget_item(self):
        """Test updating a budget item"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('100.00'),
            category='Miscellaneous',
            percentage_of_income=Decimal('3.00')
        )

        update_data = {
            'amount': '150.00',
            'category': 'Updated Category',
            'percentage_of_income': '4.50'
        }

        response = self.client.put(f'{self.url}{budget_item.id}/', update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        budget_item.refresh_from_db()
        self.assertEqual(budget_item.amount, Decimal('150.00'))
        self.assertEqual(budget_item.category, 'Updated Category')

    def test_delete_budget_item(self):
        """Test deleting a budget item"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('50.00'),
            category='Delete Me',
            percentage_of_income=Decimal('1.00')
        )

        response = self.client.delete(f'{self.url}{budget_item.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(BudgetItem.objects.count(), 0)

    def test_cannot_access_other_user_budget_item(self):
        """Test that users cannot access other users' budget items"""
        other_budget_item = BudgetItem.objects.create(
            user=self.other_user,
            amount=Decimal('100.00'),
            category='Private',
            percentage_of_income=Decimal('2.00')
        )

        response = self.client.get(f'{self.url}{other_budget_item.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access_denied(self):
        """Test that unauthenticated requests are denied"""
        self.client.credentials()  # Remove credentials
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_percentage_validation(self):
        """Test validation for percentage of income"""
        invalid_data = self.valid_data.copy()
        invalid_data['percentage_of_income'] = '150.00'  # > 100%

        response = self.client.post(self.url, invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class CreditCardAPITest(BaseFinanceAPITest):
    def setUp(self):
        super().setUp()
        self.url = '/api/credit-cards/'
        self.valid_data = {
            'annual_fee': '95.00',
            'credit_limit': 5000,
            'due_date': '2024-01-15',
            'name': 'Chase Sapphire',
            'minimum_monthly_payment': '25.00',
            'statement_date': '2024-01-01'
        }

    def test_create_credit_card(self):
        """Test creating a credit card via API"""
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CreditCard.objects.count(), 1)

        credit_card = CreditCard.objects.first()
        self.assertEqual(credit_card.user, self.user)
        self.assertEqual(credit_card.name, 'Chase Sapphire')
        self.assertEqual(credit_card.credit_limit, 5000)

    def test_list_credit_cards_user_restricted(self):
        """Test that users only see their own credit cards"""
        # User's credit card
        CreditCard.objects.create(
            user=self.user,
            annual_fee=Decimal('0.00'),
            credit_limit=2000,
            due_date=date(2024, 1, 15),
            name='User Card',
            minimum_monthly_payment=Decimal('25.00'),
            statement_date=date(2024, 1, 1)
        )

        # Other user's credit card
        CreditCard.objects.create(
            user=self.other_user,
            annual_fee=Decimal('100.00'),
            credit_limit=3000,
            due_date=date(2024, 1, 15),
            name='Other User Card',
            minimum_monthly_payment=Decimal('30.00'),
            statement_date=date(2024, 1, 1)
        )

        response = self.client.get(self.url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], 'User Card')


class IncomeAPITest(BaseFinanceAPITest):
    def setUp(self):
        super().setUp()
        self.url = '/api/incomes/'
        self.valid_data = {
            'amount': '5000.00',
            'source': 'Software Engineering Job'
        }

    def test_create_income(self):
        """Test creating an income via API"""
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Income.objects.count(), 1)

        income = Income.objects.first()
        self.assertEqual(income.user, self.user)
        self.assertEqual(income.amount, Decimal('5000.00'))
        self.assertEqual(income.source, 'Software Engineering Job')

    def test_update_income(self):
        """Test updating an income record"""
        income = Income.objects.create(
            user=self.user,
            amount=Decimal('4000.00'),
            source='Previous Job'
        )

        update_data = {
            'amount': '5500.00',
            'source': 'New Job'
        }

        response = self.client.put(f'{self.url}{income.id}/', update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        income.refresh_from_db()
        self.assertEqual(income.amount, Decimal('5500.00'))
        self.assertEqual(income.source, 'New Job')


class LoanAPITest(BaseFinanceAPITest):
    def setUp(self):
        super().setUp()
        self.url = '/api/loans/'
        self.valid_data = {
            'amount': '15000.00',
            'due_date': '2024-12-31',
            'minimum_monthly_payment': '300.00',
            'name': 'Student Loan'
        }

    def test_create_loan(self):
        """Test creating a loan via API"""
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Loan.objects.count(), 1)

        loan = Loan.objects.first()
        self.assertEqual(loan.user, self.user)
        self.assertEqual(loan.amount, Decimal('15000.00'))
        self.assertEqual(loan.name, 'Student Loan')


class PaymentMethodAPITest(BaseFinanceAPITest):
    def setUp(self):
        super().setUp()
        self.url = '/api/payment-methods/'
        self.valid_data = {
            'name': 'Bank of America Checking',
            'type': 'Bank Account'
        }

    def test_create_payment_method(self):
        """Test creating a payment method via API"""
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PaymentMethod.objects.count(), 1)

        payment_method = PaymentMethod.objects.first()
        self.assertEqual(payment_method.user, self.user)
        self.assertEqual(payment_method.name, 'Bank of America Checking')
        self.assertEqual(payment_method.type, 'Bank Account')


class SubscriptionAPITest(BaseFinanceAPITest):
    def setUp(self):
        super().setUp()
        self.url = '/api/subscriptions/'
        self.credit_card = CreditCard.objects.create(
            user=self.user,
            annual_fee=Decimal('0.00'),
            credit_limit=2000,
            due_date=date(2024, 1, 15),
            name='Test Card',
            minimum_monthly_payment=Decimal('25.00'),
            statement_date=date(2024, 1, 1)
        )
        self.payment_method = PaymentMethod.objects.create(
            user=self.user,
            name='Test Payment',
            type='Credit Card'
        )
        self.valid_data = {
            'amount': '15.99',
            'due_date': '2024-01-15',
            'name': 'Netflix',
            'credit_card': self.credit_card.id,
            'payment_method': self.payment_method.id
        }

    def test_create_subscription(self):
        """Test creating a subscription via API"""
        response = self.client.post(self.url, self.valid_data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Subscription.objects.count(), 1)

        subscription = Subscription.objects.first()
        self.assertEqual(subscription.user, self.user)
        self.assertEqual(subscription.name, 'Netflix')
        self.assertEqual(subscription.amount, Decimal('15.99'))
        self.assertEqual(subscription.credit_card, self.credit_card)
        self.assertEqual(subscription.payment_method, self.payment_method)

    def test_create_subscription_without_optional_fields(self):
        """Test creating subscription without credit card or payment method"""
        data = {
            'amount': '9.99',
            'due_date': '2024-01-15',
            'name': 'Spotify'
        }

        response = self.client.post(self.url, data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        subscription = Subscription.objects.first()
        self.assertEqual(subscription.name, 'Spotify')
        self.assertIsNone(subscription.credit_card)
        self.assertIsNone(subscription.payment_method)


class UserIsolationAPITest(BaseFinanceAPITest):
    """Test that user data is properly isolated across all endpoints"""

    def setUp(self):
        super().setUp()

        # Create test data for both users
        self.create_test_data(self.user, 'User1')
        self.create_test_data(self.other_user, 'User2')

    def create_test_data(self, user, prefix):
        """Create test data for a user"""
        BudgetItem.objects.create(
            user=user,
            amount=Decimal('100.00'),
            category=f'{prefix}_Budget',
            percentage_of_income=Decimal('10.00')
        )

        Income.objects.create(
            user=user,
            amount=Decimal('1000.00'),
            source=f'{prefix}_Job'
        )

        CreditCard.objects.create(
            user=user,
            annual_fee=Decimal('0.00'),
            credit_limit=1000,
            due_date=date(2024, 1, 15),
            name=f'{prefix}_Card',
            minimum_monthly_payment=Decimal('25.00'),
            statement_date=date(2024, 1, 1)
        )

        PaymentMethod.objects.create(
            user=user,
            name=f'{prefix}_Payment',
            type='Credit Card'
        )

        Loan.objects.create(
            user=user,
            amount=Decimal('5000.00'),
            due_date=date(2024, 12, 31),
            minimum_monthly_payment=Decimal('100.00'),
            name=f'{prefix}_Loan'
        )

    def test_all_endpoints_return_only_user_data(self):
        """Test that all API endpoints return only the authenticated user's data"""
        endpoints = [
            '/api/budget-items/',
            '/api/incomes/',
            '/api/credit-cards/',
            '/api/payment-methods/',
            '/api/loans/',
        ]

        for endpoint in endpoints:
            with self.subTest(endpoint=endpoint):
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(len(response.data), 1)

                # Verify it's the correct user's data
                if 'category' in response.data[0]:  # BudgetItem
                    self.assertTrue(response.data[0]['category'].startswith('User1'))
                elif 'source' in response.data[0]:  # Income
                    self.assertTrue(response.data[0]['source'].startswith('User1'))
                elif 'credit_limit' in response.data[0]:  # CreditCard
                    self.assertTrue(response.data[0]['name'].startswith('User1'))
                elif 'type' in response.data[0]:  # PaymentMethod
                    self.assertTrue(response.data[0]['name'].startswith('User1'))
                elif 'minimum_monthly_payment' in response.data[0]:  # Loan
                    self.assertTrue(response.data[0]['name'].startswith('User1'))

    def test_cross_user_access_denied(self):
        """Test that users cannot access other users' data by ID"""
        # Get IDs of other user's data
        other_budget_item = BudgetItem.objects.get(user=self.other_user)
        other_income = Income.objects.get(user=self.other_user)
        other_credit_card = CreditCard.objects.get(user=self.other_user)

        test_cases = [
            (f'/api/budget-items/{other_budget_item.id}/', 'budget item'),
            (f'/api/incomes/{other_income.id}/', 'income'),
            (f'/api/credit-cards/{other_credit_card.id}/', 'credit card'),
        ]

        for endpoint, resource_type in test_cases:
            with self.subTest(endpoint=endpoint, resource=resource_type):
                response = self.client.get(endpoint)
                self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class APIValidationTest(BaseFinanceAPITest):
    """Test API validation and error handling"""

    def test_required_field_validation(self):
        """Test that required fields are properly validated"""
        # Test BudgetItem without required fields
        response = self.client.post('/api/budget-items/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # Test Income without required fields
        response = self.client.post('/api/incomes/', {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_decimal_field_validation(self):
        """Test decimal field validation"""
        # Test invalid amount format
        invalid_data = {
            'amount': 'invalid_decimal',
            'category': 'Test',
            'percentage_of_income': '10.00'
        }
        response = self.client.post('/api/budget-items/', invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_date_field_validation(self):
        """Test date field validation"""
        invalid_data = {
            'annual_fee': '0.00',
            'credit_limit': 1000,
            'due_date': 'invalid_date',
            'name': 'Test Card',
            'minimum_monthly_payment': '25.00',
            'statement_date': '2024-01-01'
        }
        response = self.client.post('/api/credit-cards/', invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)