import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ connectMetaMask, account }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleConnection = async () => {
    setError(connectMetaMask('eth_requestAccounts'));

    if (account){
      navigate('/admin');
    }
  }

  return (
    <div>
      <div>
        <h2>Connexion avec MetaMask</h2>
        <button onClick={handleConnection}>
          Se connecter
        </button>
        {error && (
          <div>
            <strong>Erreur :</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
