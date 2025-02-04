from django.db import models
from django.contrib.auth.models import User

class Budget(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=255)
    created_at = models.DateField(auto_now_add=True)
    percentagae_of_income = models.DecimalField(max_digits=3, decimal_places=2)
    updated_at = models.DateField(auto_now=True)

class CreditCards(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    annual_fee = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)
    credit_limit = models.IntegerField()
    due_date = models.DateField()
    name = models.CharField(max_length=255)
    minimum_monthly_payment = models.DecimalField(max_digits=10, decimal_places=2)
    statement_date = models.DateField()
    updated_at = models.DateField(auto_now=True)

class Income(models.Model): 
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)
    source = models.CharField(max_length=255)
    updated_at = models.DateField(auto_now=True)

class Loans(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    minimum_monthly_payment = models.DecimalField(max_digits=10, decimal_places=2)
    name = models.CharField(max_length=255)
    updated_at = models.DateField(auto_now=True)

class PaymentMethods(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateField(auto_now_add=True)
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=255)
    updated_at = models.DateField(auto_now=True)

class Subscriptions(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateField(auto_now_add=True)
    credit_card = models.ForeignKey(CreditCards, on_delete=models.SET_NULL, null=True)
    due_date = models.DateField()
    name = models.CharField(max_length=255)
    payment_method = models.ForeignKey(PaymentMethods, on_delete=models.SET_NULL, null=True)
    updated_at = models.DateField(auto_now=True)