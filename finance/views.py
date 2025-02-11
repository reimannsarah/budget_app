from rest_framework import viewsets
from .models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription
from .serializers import (
    BudgetItemSerializer,
    CreditCardSerializer,
    IncomeSerializer,
    LoanSerializer,
    PaymentMethodSerializer,
    SubscriptionSerializer,
)

class BudgetItemViewSet(viewsets.ModelViewSet):
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer

class CreditCardViewSet(viewsets.ModelViewSet):
    queryset = CreditCard.objects.all()
    serializer_class = CreditCardSerializer

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
