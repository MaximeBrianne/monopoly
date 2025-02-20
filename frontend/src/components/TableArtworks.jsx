const TableArtworks = ({ artworks }) => {
  const handleDownload = (hash) => {
    const url = `http://localhost:8080/ipfs/${hash}?download=true&filename=description.txt`;
    window.open(url, "_blank");
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nom</th>
          <th>Créateur</th>
          <th>Prix</th>
          <th>En Vente</th>
          <th>Télécharger</th>
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
              <td>
                {(artwork.descriptionHash && artwork.descriptionHash != "") ? (
                  <button onClick={() => handleDownload(artwork.descriptionHash)}>
                    Télécharger
                  </button>
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6">Aucune œuvre disponible</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableArtworks;
