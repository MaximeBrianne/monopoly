import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Market from './pages/Market';
import Header from './components/Header';
import { initContract } from './contract/contract';

function App() {
  const [account, setAccount] = useState(undefined);

  const defaultPage = '/admin';

  useEffect(() => {
    connectMetaMask('eth_accounts');

    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount(undefined);
      }
    });
  }, []);

  const connectMetaMask = async (method) => {
    if (!window.ethereum) {
      return "MetaMask n'est pas installé. Veuillez l'installer pour continuer.";
    }

    try {
      let accounts = await window.ethereum.request({ method: method });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
      return "";
    } catch (err) {
      setAccount(undefined);
      return "Une erreur s'est produite durant la connexion.";
    }
  };

  return (
    <Router>
      <AuthWrapper
        defaultPage={defaultPage}
        account={account}
        setAccount={setAccount}
        connectMetaMask={connectMetaMask}
      />
    </Router>
  );
}

// Composant qui gère la redirection et affiche le Header
const AuthWrapper = ({ defaultPage, account, setAccount, connectMetaMask }) => {
  const location = useLocation();

  return (
    <>
      {account && <Header account={account} setAccount={setAccount} />}

      <Routes>
        {account && location.pathname === "/login" && <Route path="/login" element={<Navigate to={defaultPage} replace />} />}

        <Route path="/login" element={<Login connectMetaMask={connectMetaMask} account={account} />} />

        {account ? (
          <>
            <Route path="/admin" element={<Admin />} />
            <Route path="/market" element={<Market />} />
            <Route path="*" element={<Navigate to={defaultPage} replace />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </>
  );
};

export default App;
