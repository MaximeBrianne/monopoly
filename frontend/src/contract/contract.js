import { ethers } from "ethers";
import artCollectionABI from "./smart-contracts.json";
import contractAddressData from "./ArtCollection.json";

const CONTRACT_ADDRESS = contractAddressData.ArtCollection;

let provider;
let signer;
let contract;

// Initialiser la connexion
export const initContract = async () => {
    if (!window.ethereum) {
        alert("MetaMask est requis pour interagir avec ce site.");
        return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, artCollectionABI.abi, signer);
};

// Ajouter une œuvre (réservé au propriétaire)
export const mintArtWork = async (_name, _artType, _artist, _descriptionHash, _price) => {
    try {
        const tx = await contract.mintArtWork(_name, _artType, _artist, _descriptionHash, _price);
        await tx.wait();
        console.log("Œuvre ajoutée avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'ajout de l'œuvre :", error);
    }
};

// Récupérer toutes les œuvres
export const getAllArtworks = async () => {
    try {
        const artworks = await contract.getAllArtworks();
        return artworks;
    } catch (error) {
        console.error("Erreur lors de la récupération des œuvres :", error);
    }
};

// Acheter une œuvre
export const buyArtWork = async (_tokenId, price) => {
    try {
        const tx = await contract.buyArtWork(_tokenId, { value: price });
        await tx.wait();
        console.log("Achat réussi !");
    } catch (error) {
        console.error("Erreur lors de l'achat :", error);
    }
};

// Mettre en vente une œuvre
export const putArtWorkForSale = async (_tokenId, _price) => {
    try {
        const tx = await contract.putArtWorkForSale(_tokenId, _price);
        await tx.wait();
        console.log("Œuvre mise en vente !");
    } catch (error) {
        console.error("Erreur lors de la mise en vente :", error);
    }
};

// Retirer une œuvre de la vente
export const removeFromSale = async (_tokenId) => {
    try {
        const tx = await contract.removeFromSale(_tokenId);
        await tx.wait();
        console.log("Œuvre retirée de la vente !");
    } catch (error) {
        console.error("Erreur lors du retrait de la vente :", error);
    }
};

// Récupérer les œuvres d'un utilisateur (hors vente)
export const getUserGallery = async () => {
    try {
        const userAddress = await signer.getAddress();
        const allArtworks = await getAllArtworks();
        return allArtworks.filter((art) => art.owner === userAddress && !art.forSale);
    } catch (error) {
        console.error("Erreur lors de la récupération de la galerie :", error);
    }
};

// Récupérer les œuvres en vente d'un utilisateur
export const getUserMarket = async () => {
    try {
        const userAddress = await signer.getAddress();
        const allArtworks = await getAllArtworks();
        return allArtworks.filter((art) => art.owner === userAddress && art.forSale);
    } catch (error) {
        console.error("Erreur lors de la récupération des œuvres en vente :", error);
    }
};

