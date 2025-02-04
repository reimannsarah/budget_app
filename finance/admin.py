from django.contrib import admin
from .models import Budget, CreditCard, Income, Loan, PaymentMethod, Subscription 

admin.site.register(Budget)
admin.site.register(CreditCard)
admin.site.register(Income)
admin.site.register(Loan)
admin.site.register(PaymentMethod)
admin.site.register(Subscription)
