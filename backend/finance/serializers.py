from rest_framework import serializers
from .models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription

class BudgetItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = BudgetItem
        fields = ['id', 'amount', 'category', 'percentage_of_income', 'created_at', 'updated_at']

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreditCard
        fields = ['id', 'annual_fee', 'credit_limit', 'due_date', 'name', 'minimum_monthly_payment', 'statement_date', 'created_at', 'updated_at']

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = ['id', 'amount', 'source', 'created_at', 'updated_at']

class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ['id', 'amount', 'due_date', 'minimum_monthly_payment', 'name', 'created_at', 'updated_at']

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ['id', 'name', 'type', 'created_at', 'updated_at']

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'amount', 'due_date', 'name', 'credit_card', 'payment_method', 'created_at', 'updated_at']