from django.urls import path
from .views import SendLoginCodeView, VerifyLoginCodeView

urlpatterns = [
    path('send-code/', SendLoginCodeView.as_view(), name='send_login_code'),
    path('verify-code/', VerifyLoginCodeView.as_view(), name='verify_login_code'),
]
