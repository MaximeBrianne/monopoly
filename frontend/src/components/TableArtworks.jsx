const TableArtworks = ({ artworks }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Créateur</th>
          <th>Prix</th>
          <th>En Vente</th>
        </tr>
      </thead>
      <tbody>
        {artworks.length > 0 ? (
          artworks.map((artwork, index) => (
            <tr key={index}>
              <td>{artwork.tokenId}</td>
              <td>{artwork.name}</td>
              <td>{artwork.artist}</td>
              <td>{artwork.price} ETH</td>
              <td>{artwork.forSale ? "Oui" : "Non"}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5">Aucune œuvre disponible</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableArtworks;
