import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaMaskAuth = ({ onLogin }) => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si MetaMask est installé, on tente de se connecter dès que le composant se monte.
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      checkIfMetaMaskConnected();
    } else {
      setError('MetaMask n\'est pas installé.');
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfMetaMaskConnected = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      onLogin(accounts[0]); // On passe l'adresse au parent (Dashboard)
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      onLogin(accounts[0]); // On passe l'adresse au parent (Dashboard)
    } catch (err) {
      setError('Erreur de connexion à MetaMask');
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
    } else {
      setAccount(accounts[0]);
      onLogin(accounts[0]); // On met à jour l'adresse dans le parent
    }
  };

  const handleChainChanged = (chainId) => {
    // Gérer un changement de réseau ici si nécessaire
  };

  return (
    <div>
      {account ? (
        <div>
          <p>Connecté avec : {account}</p>
        </div>
      ) : (
        <button onClick={handleConnectMetaMask}>Se connecter avec MetaMask</button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default MetaMaskAuth;
