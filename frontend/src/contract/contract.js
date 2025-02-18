import { ethers } from "ethers";
import contractABI from "./smart-contracts.json"; // ABI du contrat
import contractAddressData from "./ArtCollection.json"; // Adresse déployée

const contractAddress = contractAddressData.ArtCollection; // Adresse du contrat

export const getBlockchain = async () => {
  if (!window.ethereum) {
    alert("Veuillez installer MetaMask !");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  return { contract, signer };
};

export const getArtworks = async () => {
  try {
    const { contract } = await getBlockchain();
    const artworks = await contract.getAllArtworks();

    return artworks.map((artwork, index) => ({
      id: index,
      name: artwork.name,
      artType: artwork.artType,
      artist: artwork.artist,
      descriptionHash: artwork.descriptionHash,
      price: ethers.formatEther(artwork.price), // Convertir Wei en ETH
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres d'art :", error);
    return [];
  }
};
