import React from 'react';

const PlayerSalePanel = () => {
  // Cartes fictives mises en vente
  const cards = [
    { id: 1, name: 'Carte en Vente A' },
    { id: 2, name: 'Carte en Vente B' },
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

export default PlayerSalePanel;
