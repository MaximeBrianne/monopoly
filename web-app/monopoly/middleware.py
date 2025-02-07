from django.shortcuts import redirect
from django.utils.deprecation import MiddlewareMixin

class RedirectToLoginMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        if response.status_code in [403]:
            return redirect('/accounts/login/')

        elif response.status_code in [404]:
            return redirect('/')

        return response
