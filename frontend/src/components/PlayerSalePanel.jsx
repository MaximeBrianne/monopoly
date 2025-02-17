import React from 'react';

const PlayerSalePanel = () => {
  const cardsOnSale = [
    { id: 1, name: 'Carte E', type: 'Rare', price: 80 },
    { id: 2, name: 'Carte F', type: 'Epic', price: 120 },
  ];

  return (
    <div>
      {cardsOnSale.length > 0 ? (
        <ul>
          {cardsOnSale.map(card => (
            <div key={card.id} style={{ margin: '0.5rem', padding: '0.5rem', border: '1px solid #000' }}>
              {card.name} - {card.type} - {card.price} ETH
            </div>
          ))}
        </ul>
      ) : (
        <p>Vous n'avez pas de cartes mises en vente.</p>
      )}
    </div>
  );
};

export default PlayerSalePanel;
