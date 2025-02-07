from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    ethereum_address = models.CharField(max_length=42, unique=True, blank=True, null=True)

    def __str__(self):
        return self.username if self.username else self.ethereum_address
