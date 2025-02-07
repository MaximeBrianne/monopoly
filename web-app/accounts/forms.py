from django import forms

class MetaMaskLoginForm(forms.Form):
    ethereum_address = forms.CharField(max_length=42, required=True)

    def clean_ethereum_address(self):
        address = self.cleaned_data['ethereum_address']
        if not address.startswith("0x") or len(address) != 42:
            raise forms.ValidationError("Adresse Ethereum invalide.")
        return address
