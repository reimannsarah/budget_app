from django.contrib import admin
from .models import BudgetItem, CreditCard, Income, Loan, PaymentMethod, Subscription 


class BudgetItemAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'category',  'percentage_of_income', 'created_at', 'updated_at')
class CreditCardAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'annual_fee', 'created_at', 'updated_at')
class IncomeAdmin(admin.ModelAdmin):
    list_display = ('user', 'source', 'amount') 
class LoanAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'minimum_monthly_payment')
class PaymentMethodAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'type')
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ('user', 'name', 'due_date')

admin.site.register(BudgetItem, BudgetItemAdmin)
admin.site.register(CreditCard, CreditCardAdmin)
admin.site.register(Income, IncomeAdmin)
admin.site.register(Loan, LoanAdmin)
admin.site.register(PaymentMethod, PaymentMethodAdmin)
admin.site.register(Subscription, SubscriptionAdmin)
