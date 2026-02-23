import pytest
from decimal import Decimal
from datetime import date
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from finance.models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription

User = get_user_model()


class BudgetItemModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    def test_budget_item_creation(self):
        """Test creating a budget item with valid data"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('500.00'),
            category='Groceries',
            percentage_of_income=Decimal('15.50')
        )

        self.assertEqual(budget_item.user, self.user)
        self.assertEqual(budget_item.amount, Decimal('500.00'))
        self.assertEqual(budget_item.category, 'Groceries')
        self.assertEqual(budget_item.percentage_of_income, Decimal('15.50'))
        self.assertIsNotNone(budget_item.created_at)
        self.assertIsNotNone(budget_item.updated_at)

    def test_budget_item_str_representation(self):
        """Test the string representation of budget item"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('300.00'),
            category='Entertainment',
            percentage_of_income=Decimal('10.00')
        )
        self.assertEqual(str(budget_item), 'Entertainment')

    def test_percentage_validation_max_100(self):
        """Test percentage of income cannot exceed 100%"""
        with self.assertRaises(ValidationError):
            budget_item = BudgetItem(
                user=self.user,
                amount=Decimal('500.00'),
                category='Invalid',
                percentage_of_income=Decimal('150.00')
            )
            budget_item.full_clean()

    def test_percentage_validation_min_0(self):
        """Test percentage of income cannot be negative"""
        with self.assertRaises(ValidationError):
            budget_item = BudgetItem(
                user=self.user,
                amount=Decimal('500.00'),
                category='Invalid',
                percentage_of_income=Decimal('-10.00')
            )
            budget_item.full_clean()

    def test_user_deletion_cascades(self):
        """Test that budget items are deleted when user is deleted"""
        budget_item = BudgetItem.objects.create(
            user=self.user,
            amount=Decimal('200.00'),
            category='Test',
            percentage_of_income=Decimal('5.00')
        )

        self.user.delete()
        self.assertEqual(BudgetItem.objects.count(), 0)


class CreditCardModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    def test_credit_card_creation(self):
        """Test creating a credit card with valid data"""
        credit_card = CreditCard.objects.create(
            user=self.user,
            annual_fee=Decimal('95.00'),
            credit_limit=5000,
            due_date=date(2024, 1, 15),
            name='Chase Sapphire',
            minimum_monthly_payment=Decimal('25.00'),
            statement_date=date(2024, 1, 1)
        )

        self.assertEqual(credit_card.user, self.user)
        self.assertEqual(credit_card.annual_fee, Decimal('95.00'))
        self.assertEqual(credit_card.credit_limit, 5000)
        self.assertEqual(credit_card.name, 'Chase Sapphire')
        self.assertIsNotNone(credit_card.created_at)
        self.assertIsNotNone(credit_card.updated_at)

    def test_user_deletion_cascades(self):
        """Test that credit cards are deleted when user is deleted"""
        CreditCard.objects.create(
            user=self.user,
            annual_fee=Decimal('0.00'),
            credit_limit=2000,
            due_date=date(2024, 1, 15),
            name='Test Card',
            minimum_monthly_payment=Decimal('25.00'),
            statement_date=date(2024, 1, 1)
        )

        self.user.delete()
        self.assertEqual(CreditCard.objects.count(), 0)


class IncomeModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    def test_income_creation(self):
        """Test creating an income with valid data"""
        income = Income.objects.create(
            user=self.user,
            amount=Decimal('5000.00'),
            source='Software Engineering Job'
        )

        self.assertEqual(income.user, self.user)
        self.assertEqual(income.amount, Decimal('5000.00'))
        self.assertEqual(income.source, 'Software Engineering Job')
        self.assertIsNotNone(income.created_at)
        self.assertIsNotNone(income.updated_at)

    def test_user_deletion_cascades(self):
        """Test that income records are deleted when user is deleted"""
        Income.objects.create(
            user=self.user,
            amount=Decimal('3000.00'),
            source='Freelance'
        )

        self.user.delete()
        self.assertEqual(Income.objects.count(), 0)


class LoanModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    def test_loan_creation(self):
        """Test creating a loan with valid data"""
        loan = Loan.objects.create(
            user=self.user,
            amount=Decimal('15000.00'),
            due_date=date(2024, 12, 31),
            minimum_monthly_payment=Decimal('300.00'),
            name='Student Loan'
        )

        self.assertEqual(loan.user, self.user)
        self.assertEqual(loan.amount, Decimal('15000.00'))
        self.assertEqual(loan.name, 'Student Loan')
        self.assertEqual(loan.minimum_monthly_payment, Decimal('300.00'))
        self.assertIsNotNone(loan.created_at)
        self.assertIsNotNone(loan.updated_at)

    def test_user_deletion_cascades(self):
        """Test that loans are deleted when user is deleted"""
        Loan.objects.create(
            user=self.user,
            amount=Decimal('10000.00'),
            due_date=date(2024, 12, 31),
            minimum_monthly_payment=Decimal('200.00'),
            name='Car Loan'
        )

        self.user.delete()
        self.assertEqual(Loan.objects.count(), 0)


class PaymentMethodModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')

    def test_payment_method_creation(self):
        """Test creating a payment method with valid data"""
        payment_method = PaymentMethod.objects.create(
            user=self.user,
            name='Bank of America Checking',
            type='Bank Account'
        )

        self.assertEqual(payment_method.user, self.user)
        self.assertEqual(payment_method.name, 'Bank of America Checking')
        self.assertEqual(payment_method.type, 'Bank Account')
        self.assertIsNotNone(payment_method.created_at)
        self.assertIsNotNone(payment_method.updated_at)

    def test_user_deletion_cascades(self):
        """Test that payment methods are deleted when user is deleted"""
        PaymentMethod.objects.create(
            user=self.user,
            name='Test Payment',
            type='Credit Card'
        )

        self.user.delete()
        self.assertEqual(PaymentMethod.objects.count(), 0)


class SubscriptionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='test@example.com')
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

    def test_subscription_creation(self):
        """Test creating a subscription with valid data"""
        subscription = Subscription.objects.create(
            user=self.user,
            amount=Decimal('15.99'),
            credit_card=self.credit_card,
            due_date=date(2024, 1, 15),
            name='Netflix',
            payment_method=self.payment_method
        )

        self.assertEqual(subscription.user, self.user)
        self.assertEqual(subscription.amount, Decimal('15.99'))
        self.assertEqual(subscription.name, 'Netflix')
        self.assertEqual(subscription.credit_card, self.credit_card)
        self.assertEqual(subscription.payment_method, self.payment_method)
        self.assertIsNotNone(subscription.created_at)
        self.assertIsNotNone(subscription.updated_at)

    def test_subscription_without_credit_card(self):
        """Test creating subscription without credit card (optional field)"""
        subscription = Subscription.objects.create(
            user=self.user,
            amount=Decimal('9.99'),
            due_date=date(2024, 1, 15),
            name='Spotify',
            payment_method=self.payment_method
        )

        self.assertIsNone(subscription.credit_card)
        self.assertEqual(subscription.payment_method, self.payment_method)

    def test_subscription_without_payment_method(self):
        """Test creating subscription without payment method (optional field)"""
        subscription = Subscription.objects.create(
            user=self.user,
            amount=Decimal('12.99'),
            due_date=date(2024, 1, 15),
            name='Hulu',
            credit_card=self.credit_card
        )

        self.assertEqual(subscription.credit_card, self.credit_card)
        self.assertIsNone(subscription.payment_method)

    def test_credit_card_deletion_sets_null(self):
        """Test that subscription credit_card is set to null when credit card is deleted"""
        subscription = Subscription.objects.create(
            user=self.user,
            amount=Decimal('10.00'),
            credit_card=self.credit_card,
            due_date=date(2024, 1, 15),
            name='Test Subscription'
        )

        self.credit_card.delete()
        subscription.refresh_from_db()
        self.assertIsNone(subscription.credit_card)

    def test_payment_method_deletion_sets_null(self):
        """Test that subscription payment_method is set to null when payment method is deleted"""
        subscription = Subscription.objects.create(
            user=self.user,
            amount=Decimal('10.00'),
            payment_method=self.payment_method,
            due_date=date(2024, 1, 15),
            name='Test Subscription'
        )

        self.payment_method.delete()
        subscription.refresh_from_db()
        self.assertIsNone(subscription.payment_method)

    def test_user_deletion_cascades(self):
        """Test that subscriptions are deleted when user is deleted"""
        Subscription.objects.create(
            user=self.user,
            amount=Decimal('5.99'),
            due_date=date(2024, 1, 15),
            name='Test Subscription'
        )

        self.user.delete()
        self.assertEqual(Subscription.objects.count(), 0)


class ModelRelationshipTest(TestCase):
    """Test relationships between models"""

    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', email='user1@example.com')
        self.user2 = User.objects.create_user(username='user2', email='user2@example.com')

    def test_models_are_user_specific(self):
        """Test that all models are properly associated with specific users"""
        # Create data for user1
        budget_item1 = BudgetItem.objects.create(
            user=self.user1, amount=Decimal('100.00'),
            category='Test', percentage_of_income=Decimal('10.00')
        )
        income1 = Income.objects.create(
            user=self.user1, amount=Decimal('1000.00'), source='Job'
        )

        # Create data for user2
        budget_item2 = BudgetItem.objects.create(
            user=self.user2, amount=Decimal('200.00'),
            category='Test2', percentage_of_income=Decimal('20.00')
        )
        income2 = Income.objects.create(
            user=self.user2, amount=Decimal('2000.00'), source='Job2'
        )

        # Verify data isolation
        self.assertEqual(BudgetItem.objects.filter(user=self.user1).count(), 1)
        self.assertEqual(BudgetItem.objects.filter(user=self.user2).count(), 1)
        self.assertEqual(Income.objects.filter(user=self.user1).count(), 1)
        self.assertEqual(Income.objects.filter(user=self.user2).count(), 1)

        # Verify correct associations
        self.assertEqual(BudgetItem.objects.get(user=self.user1), budget_item1)
        self.assertEqual(BudgetItem.objects.get(user=self.user2), budget_item2)
        self.assertEqual(Income.objects.get(user=self.user1), income1)
        self.assertEqual(Income.objects.get(user=self.user2), income2)