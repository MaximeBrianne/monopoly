import { ethers } from "ethers";
import artCollectionABI from "./ArtCollection.json";
import contractAddressData from "./ContractAddresses.json";

const CONTRACT_ADDRESS = contractAddressData.ArtCollection;

let provider, signer, contract;


export const initContract = async () => {
    if (!contract) {
        if (!window.ethereum) {
            alert("MetaMask est requis pour interagir avec ce site.");
            return;
        }

        // Crée le provider et le signer pour interagir avec le contrat
        provider = new ethers.BrowserProvider(window.ethereum);
        signer = await provider.getSigner();

        // Initialisation du contrat avec l'adresse et ABI
        contract = new ethers.Contract(CONTRACT_ADDRESS, artCollectionABI, signer);
    }
};


// Ajouter une oeuvre (réservé au propriétaire)
export const mintArtWork = async (_name, _artType, _artist, _descriptionHash, _price) => {
    await initContract();

    try {
        const tx = await contract.mintArtWork(_name, _artType, _artist, _descriptionHash, _price);
        await tx.wait();
        console.log("Oeuvre ajoutée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'oeuvre :", error);
    }
};

export const getAllArtworks = async () => {
    await initContract();

    try {
      const totalArtworks = await contract.tokenId(); // Le nombre d'artworks
      const artworksList = [];

      for (let i = 0; i < totalArtworks; i++) {
        const artwork = await contract.artworks(i);
        const owner = await contract.ownerOf(i);
        artworksList.push({
          tokenId: i,
          name: artwork.name,
          artType: artwork.artType,
          artist: artwork.artist,
          price: artwork.price,
          forSale: artwork.forSale,
          owner: owner
        });
      }

      return artworksList;
    } catch (error) {
      console.error("Erreur lors de la récupération des œuvres:", error);
      throw error;
    }
};


// Acheter une oeuvre
export const buyArtWork = async (_tokenId, price) => {
    await initContract();

    try {
        const tx = await contract.buyArtWork(_tokenId, { value: price });
        await tx.wait();
        console.log("Achat réussi !");
    } catch (error) {
        console.error("Erreur lors de l'achat :", error);
    }
};

// Mettre en vente une oeuvre
export const putArtWorkForSale = async (_tokenId, _price) => {
    try {
        const tx = await contract.putArtWorkForSale(_tokenId, _price);
        await tx.wait();
        console.log("oeuvre mise en vente !");
    } catch (error) {
        console.error("Erreur lors de la mise en vente :", error);
    }
};

// Retirer une oeuvre de la vente
export const removeFromSale = async (_tokenId) => {
    await initContract();

    try {
        const tx = await contract.removeFromSale(_tokenId);
        await tx.wait();
        console.log("Oeuvre retirée de la vente !");
    } catch (error) {
        console.error("Erreur lors du retrait de la vente :", error);
    }
};

// Récupérer les oeuvres d'un utilisateur (hors vente)
export const getUserGallery = async () => {
    try {
        const userAddress = await signer.getAddress();
        const allArtworks = await getAllArtworks();
        const artworks = allArtworks.filter((art) => art.owner === userAddress && !art.forSale);
        console.log(artworks);

        return artworks;
    } catch (error) {
        console.error("Erreur lors de la récupération de la galerie :", error);
    }
};

// Récupérer les oeuvres en vente d'un utilisateur
export const getUserMarket = async () => {
    await initContract();

    try {
        const userAddress = await signer.getAddress();
        const allArtworks = await getAllArtworks();

        console.log(allArtworks);
        console.log(userAddress);
        const artworks = allArtworks.filter((art) => art.owner === userAddress && art.forSale);
        console.log(artworks);

        return artworks;
    } catch (error) {
        console.error("Erreur lors de la récupération des oeuvres en vente :", error);
    }
};

export const getNotUserMarket = async () => {
    await initContract();

    try {
        const userAddress = await signer.getAddress();
        const allArtworks = await getAllArtworks();
        const artworks = allArtworks.filter((art) => art.owner !== userAddress && art.forSale);
        console.log(artworks);
        return artworks;
    } catch (error) {
        console.error("Erreur lors de la récupération des oeuvres en vente :", error);
    }
}

