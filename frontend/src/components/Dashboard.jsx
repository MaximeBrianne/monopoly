import React from 'react';
import './Dashboard.css';
import PlayerHand from './PlayerHand';
import PlayerSalePanel from './PlayerSalePanel';
import MarketPanel from './MarketPanel';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="panel left">
        <h2>Ma Main</h2>
        <PlayerHand />
      </div>
      <div className="panel center">
        <h2>Mon Étale</h2>
        <PlayerSalePanel />
      </div>
      <div className="panel right">
        <h2>Marché</h2>
        <MarketPanel />
      </div>
    </div>
  );
};

export default Dashboard;
