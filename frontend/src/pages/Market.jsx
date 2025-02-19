// Market.jsx
import { useEffect, useState } from 'react';
import { getUserGallery, getUserMarket, getNotUserMarket } from '../contract/contract';

const Market = () => {
  const [galleryArtworks, setGalleryArtworks] = useState([]);
  const [stallArtworks, setStallArtworks] = useState([]);
  const [marketArtworks, setMarketArtworks] = useState([]);

  useEffect(() => {
    getUserGallery().then((artworks) => {setGalleryArtworks(artworks)});
    getUserMarket().then((artworks) => {setStallArtworks(artworks)});
    getNotUserMarket().then((artworks) => {setMarketArtworks(artworks)});
  }, []);

  return (
    <div>
      <h1>MARKET</h1>

      <div>
        {galleryArtworks.map((artwork) => (
          <div key={artwork.tokenId}>
            <p>{artwork.name}</p>
            <p>{artwork.artist}</p>
            <p>{artwork.price} ETH</p>
          </div>
        ))}
      </div>

      <div>
        {stallArtworks.map((artwork) => (
          <div key={artwork.tokenId}>
            <p>{artwork.name}</p>
            <p>{artwork.artist}</p>
            <p>{artwork.price} ETH</p>
          </div>
        ))}
      </div>

      <div>
        {marketArtworks.map((artwork) => (
          <div key={artwork.tokenId}>
            <p>{artwork.name}</p>
            <p>{artwork.artist}</p>
            <p>{artwork.price} ETH</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;
