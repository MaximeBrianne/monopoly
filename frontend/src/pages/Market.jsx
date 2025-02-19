// Market.jsx
import React, { useEffect, useState } from 'react';
import { getAllArtworks, buyArtWork } from '../contract/contract';
import Header from '../components/Header';

const Market = () => {
  const [userAddress, setUserAddress] = useState(null);
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const provider = window.ethereum;
      const userSigner = await provider.getSigner();
      const address = await userSigner.getAddress();
      setUserAddress(address);
      const artworksList = await getAllArtworks();
      setArtworks(artworksList);
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    setUserAddress(null);
    setArtworks([]);
  };

  const handleBuy = async (tokenId, price) => {
    await buyArtWork(tokenId, price);
    alert('Achat effectué avec succès');
  };

  return (
    <h1>MARKET</h1>
  );
};

export default Market;
