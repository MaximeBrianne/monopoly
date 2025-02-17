import React, { useState } from 'react';
import './App.css';
import MetaMaskAuth from './components/MetaMaskAuth';
import Dashboard from './components/Dashboard';

function App() {
  const [account, setAccount] = useState(null);

  const handleLogin = (accountAddress) => {
    setAccount(accountAddress);
  };

  return (
    <div className="App">
      <h1>Échange de Cartes Web3</h1>
      {!account ? (
        <MetaMaskAuth onLogin={handleLogin} />
      ) : (
        <Dashboard account={account} />
      )}
    </div>
  );
}

export default App;
