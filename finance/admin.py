from django.contrib import admin
from .models import Budget, CreditCards, Income, Loans, PaymentMethods, Subscriptions 

admin.site.register(Budget)
admin.site.register(CreditCards)
admin.site.register(Income)
admin.site.register(Loans)
admin.site.register(PaymentMethods)
admin.site.register(Subscriptions)
