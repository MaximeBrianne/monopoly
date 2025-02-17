import React from 'react';

const PlayerHand = () => {
  const cards = [
    { id: 1, name: 'Carte A', type: 'Rare', value: 100 },
    { id: 2, name: 'Carte B', type: 'Commune', value: 20 },
    { id: 3, name: 'Carte C', type: 'Rare', value: 150 },
    { id: 4, name: 'Carte D', type: 'Epic', value: 200 },
    // Plus de cartes...
  ];

  return (
    <div>
      {cards.length > 0 ? (
        <ul>
          {cards.map(card => (
            <div key={card.id}  style={{ margin: '0.5rem', padding: '0.5rem', border: '1px solid #000' }}>
              {card.name} - {card.type} - {card.value} ETH
            </div>
          ))}
        </ul>
      ) : (
        <p>Vous n'avez pas de cartes en main.</p>
      )}
    </div>
  );
};

export default PlayerHand;
