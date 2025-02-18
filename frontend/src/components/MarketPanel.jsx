// src/components/MarketPanel.jsx
import React from 'react';

const MarketPanel = () => {
  // Cartes fictives du marché
  const cards = [
    { id: 1, name: 'Carte Marché 1' },
    { id: 2, name: 'Carte Marché 2' },
    { id: 3, name: 'Carte Marché 3' },
  ];

  return (
    <div>
      {cards.map(card => (
        <div key={card.id} style={{ margin: '0.5rem', padding: '0.5rem', border: '1px solid #000' }}>
          {card.name}
        </div>
      ))}
    </div>
  );
};

export default MarketPanel;
