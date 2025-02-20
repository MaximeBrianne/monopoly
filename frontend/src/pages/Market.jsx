import { useEffect, useState } from 'react';
import {
  getUserGallery,
  getUserMarket,
  getNotUserMarket,
  getUserBalance,
  putArtWorkForSale,
  removeFromSale,
  buyArtWork
} from '../contract/contract';
import styles from './Market.module.css';

const Market = () => {
  const [selected, setSelected] = useState({
    0: [], // Galerie
    1: [], // Étale
    2: [], // Marché
  });
  const [balance, setBalance] = useState("0");

  const [galleryArtworks, setGalleryArtworks] = useState([]);
  const [stallArtworks, setStallArtworks] = useState([]);
  const [marketArtworks, setMarketArtworks] = useState([]);

  useEffect(() => {
    getUserBalance().then(setBalance);
    getUserGallery().then(setGalleryArtworks);
    getUserMarket().then(setStallArtworks);
    getNotUserMarket().then(setMarketArtworks);
  }, []);

  const handleSelect = (id, category) => {
    setSelected((prevSelected) => {
      const updatedCategory = prevSelected[category].includes(id)
        ? prevSelected[category].filter((i) => i !== id)
        : [...prevSelected[category], id];

      return { ...prevSelected, [category]: updatedCategory };
    });
  };

  const handleTransaction = async () => {
    try {
      for (const tokenId of selected[0]) {
        const artwork = galleryArtworks.find(a => a.tokenId === tokenId);
        if (artwork) {
          console.log(`Mise en vente : ${artwork.name} (${tokenId}) pour ${artwork.price} ETH`);
          await putArtWorkForSale(tokenId, artwork.price);
        }
      }

      for (const tokenId of selected[1]) {
        console.log(`Retrait de la vente : Token ${tokenId}`);
        await removeFromSale(tokenId);
      }

      for (const tokenId of selected[2]) {
        const artwork = marketArtworks.find(a => a.tokenId === tokenId);
        if (artwork) {
          console.log(`Achat : ${artwork.name} (${tokenId}) pour ${artwork.price} ETH`);
          await buyArtWork(tokenId, artwork.price);
        }
      }

      getUserBalance().then(setBalance);
      getUserGallery().then(setGalleryArtworks);
      getUserMarket().then(setStallArtworks);
      getNotUserMarket().then(setMarketArtworks);

      setSelected({ 0: [], 1: [], 2: [] });

    } catch (error) {
      console.error("Erreur lors de la transaction :", error);
    }
  };

  const isDisabled = Object.values(selected).every((arr) => arr.length === 0);

  return (
    <div className={styles.market}>
      <h1>MARKET</h1>

      <div className={styles.balance}>
        <span>Solde : {balance} ETH</span>
      </div>

      <div className={styles.panels}>
        <div className={styles.panel}>
          <h3>GALLERIE</h3>
          {galleryArtworks.map((artwork) => (
            <div
              key={artwork.tokenId}
              className={selected[0].includes(artwork.tokenId) ? styles.artifact_selected : styles.artifact_not_selected}
              onClick={() => handleSelect(artwork.tokenId, 0)}
            >
              <p>{artwork.name}</p>
              <p>{artwork.artist}</p>
              <p>{artwork.price} ETH</p>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <h3>ÉTALE</h3>
          {stallArtworks.map((artwork) => (
            <div
              key={artwork.tokenId}
              className={selected[1].includes(artwork.tokenId) ? styles.artifact_selected : styles.artifact_not_selected}
              onClick={() => handleSelect(artwork.tokenId, 1)}
            >
              <p>{artwork.name}</p>
              <p>{artwork.artist}</p>
              <p>{artwork.price} ETH</p>
            </div>
          ))}
        </div>

        <div className={styles.panel}>
          <h3>MARCHÉ</h3>
          {marketArtworks.map((artwork) => (
            <div
              key={artwork.tokenId}
              className={selected[2].includes(artwork.tokenId) ? styles.artifact_selected : styles.artifact_not_selected}
              onClick={() => handleSelect(artwork.tokenId, 2)}
            >
              <p>{artwork.name}</p>
              <p>{artwork.artist}</p>
              <p>{artwork.price} ETH</p>
            </div>
          ))}
        </div>
      </div>

      <button disabled={isDisabled} onClick={handleTransaction}>
        Valider
      </button>
    </div>
  );
};

export default Market;
