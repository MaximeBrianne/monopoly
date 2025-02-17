import React from 'react';

const PlayerHand = () => {
  // Pour l'instant, des cartes fictives
  const cards = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    name: `Carte ${i + 1}`,
  }));

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

export default PlayerHand;
