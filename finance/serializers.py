from rest_framework import serializers
from .models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription

class BudgetItemSerializer(serializers.ModelSerializer):
    class Meta: 
        model = BudgetItem
        fields = '__all__'

class CreditCardSerializer(serializers.ModelSerializer):
    class Meta: 
        model = CreditCard
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = '__all__'

class LoanSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Loan
        fields = '__all__'

class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fieds = '__all__'

class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = "__all__"