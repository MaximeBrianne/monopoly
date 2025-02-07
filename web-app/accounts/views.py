from django.shortcuts import render, redirect
from django.contrib.auth import login
# from .models import CustomUser
from .forms import MetaMaskLoginForm

def metamask_login(request):
    if request.method == "POST":
        form = MetaMaskLoginForm(request.POST)
        if form.is_valid():
            ethereum_address = form.cleaned_data['ethereum_address']
            user, created = CustomUser.objects.get_or_create(ethereum_address=ethereum_address)
            login(request, user)
            return redirect('home')

    else:
        form = MetaMaskLoginForm()

    return render(request, 'accounts/login.html', {'form': form})
