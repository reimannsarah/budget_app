from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied

from .models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription
from .serializers import (
    BudgetItemSerializer,
    CreditCardSerializer,
    IncomeSerializer,
    LoanSerializer,
    PaymentMethodSerializer,
    SubscriptionSerializer,
)

class UserRestrictedViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    model = None

    def get_queryset(self):
        if self.model is None:
            raise NotImplementedError("Child classes must define a 'model' attribute")
        return self.model.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_object(self):
        obj = super().get_object()
        if obj.user != self.request.user:
            raise PermissionDenied("You do not have permission to access this resource.")
        return obj

class BudgetItemViewSet(UserRestrictedViewSet):
    model = BudgetItem
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer

class CreditCardViewSet(UserRestrictedViewSet):
    model = CreditCard
    queryset = CreditCard.objects.all()
    serializer_class = CreditCardSerializer

class IncomeViewSet(UserRestrictedViewSet):
    model = Income
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

class LoanViewSet(UserRestrictedViewSet):
    model = Loan
    queryset = Loan.objects.all()
    serializer_class = LoanSerializer

class SubscriptionViewSet(UserRestrictedViewSet):
    model = Subscription
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer

class PaymentMethodViewSet(UserRestrictedViewSet):
    model = PaymentMethod
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer
