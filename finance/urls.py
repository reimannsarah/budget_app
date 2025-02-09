from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Set up a router for your views to automatically generate URL patterns
router = DefaultRouter()
router.register(r'budget-items', views.BudgetItemViewSet)
router.register(r'credit-cards', views.CreditCardViewSet)
router.register(r'incomes', views.IncomeViewSet)
router.register(r'loans', views.LoanViewSet)
router.register(r'payment-methods', views.PaymentMethodViewSet)
router.register(r'subscriptions', views.SubscriptionViewSet)

urlpatterns = [
    # Include the router URLs
    path('api/', include(router.urls)),
]
