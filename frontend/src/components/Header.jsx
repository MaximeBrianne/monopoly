// Header.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ userAddress, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Déconnexion de MetaMask (reset des informations d'utilisateur)
    onLogout();
    navigate('/metamaskauth'); // Rediriger vers la page MetaMaskAuth
  };

  return (
    <header>
      <div>
        {userAddress ? (
          <span>Connecté en tant que : {userAddress}</span>
        ) : (
          <span>Non connecté</span>
        )}
      </div>
      <div>
        {userAddress && (
          <>
            <button onClick={() => navigate('/admin')}>Admin</button>
            <button onClick={() => navigate('/market')}>Market</button>
            <button onClick={handleLogout}>Déconnexion</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
