import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MetaMaskAuth = ({ onLogin }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
      checkIfMetaMaskConnected();
    } else {
      setError("MetaMask n'est pas installé.");
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkIfMetaMaskConnected = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      onLogin(accounts[0]);
      navigate("/admin"); // Redirige vers la page admin après connexion
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
      onLogin(accounts[0]);
      navigate("/admin"); // Redirige après connexion
    } catch (err) {
      setError("Erreur de connexion à MetaMask");
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      navigate("/login"); // Redirige vers la connexion si l'utilisateur se déconnecte
    } else {
      setAccount(accounts[0]);
      onLogin(accounts[0]);
      navigate("/admin");
    }
  };

  const handleChainChanged = (chainId) => {
    console.log("Changement de réseau :", chainId);
  };

  return (
    <div>
      {account ? (
        <p>Connecté avec : {account}</p>
      ) : (
        <button onClick={handleConnectMetaMask}>Se connecter avec MetaMask</button>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default MetaMaskAuth;
