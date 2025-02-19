import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ account }) => {
  const navigate = useNavigate();

  return (
    <header>
      <div>
        <span>{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Non connecté"}</span>
      </div>
      <div>
        {account && (
          <>
            <button onClick={() => navigate('/admin')}>Admin</button>
            <button onClick={() => navigate('/market')}>Market</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
