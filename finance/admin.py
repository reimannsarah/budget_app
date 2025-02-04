from django.contrib import admin
from .models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription 

admin.site.register(BudgetItem)
admin.site.register(CreditCard)
admin.site.register(Income)
admin.site.register(Loan)
admin.site.register(PaymentMethod)
admin.site.register(Subscription)
