from django.urls import path
from .views import metamask_login

urlpatterns = [
    path('login/', metamask_login, name='metamask-login'),
]
