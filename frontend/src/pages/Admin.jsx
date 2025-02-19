import { useState, useEffect } from "react";
import TableArtworks from "../components/TableArtworks";
import FormArtwork from "../components/FormArtwork";
import { getAllArtworks } from "../contract/contract";

const Admin = () => {
  const [artworks, setArtworks] = useState([]);

  useEffect(() => {
    fetchArtworks();
  }, []);

  const fetchArtworks = async () => {
    const artworks = await getAllArtworks();
    setArtworks(artworks);
  };

  return (
    <div>
      <h1>ADMIN</h1>
      <FormArtwork fetchArtworks={fetchArtworks} />
      <TableArtworks artworks={artworks} />
    </div>
  );
};

export default Admin;
