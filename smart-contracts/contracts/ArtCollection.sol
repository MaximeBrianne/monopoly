// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ArtCollection is Ownable, ERC721 {
    enum ArtType { PAINTING, SCULPTURE, PHOTOGRAPHY, DIGITAL_ART, OTHER }

    struct ArtWork {
        string name;
        ArtType artType;
        string artist;
        string descriptionHash; // Lien vers le Hash du texte stocké sur IPFS
        uint256 price;
        bool forSale;
    }

    uint256 public tokenId = 0;
    uint256 public constant MAX_ARTWORKS_PER_USER = 10; // Limite d'œuvres par utilisateur

    mapping(uint256 => ArtWork) public artworks;
    mapping(address => uint256) public userArtCount; // Nombre d'œuvres possédées par un utilisateur
    mapping(uint256 => address[]) public previousOwners;
    mapping(address => uint256) public lastTransactionTime; // Horodatage des dernières transactions

    constructor() ERC721("ArtCollection", "ART") Ownable(msg.sender) {}

    modifier cooldownCheck() {
        require(block.timestamp >= lastTransactionTime[msg.sender] + 5 minutes, "Veuillez attendre avant de faire une nouvelle transaction");
        _;
    }

    modifier onlyOwnerOf(uint256 _tokenId) {
        require(ownerOf(_tokenId) == msg.sender, "Vous n'etes pas le proprietaire de cette oeuvre");
        _;
    }

    modifier hasSpaceInCollection() {
        require(userArtCount[msg.sender] < MAX_ARTWORKS_PER_USER, "Vous avez atteint la limite d'oeuvres possedees");
        _;
    }

    // Créer une œuvre d'art unique
    function mintArtWork(
        string memory _name,
        ArtType _artType,
        string memory _artist,
        string memory _descriptionHash,
        uint256 _price
    ) external onlyOwner {
        tokenId++;
        _safeMint(msg.sender, tokenId);

        artworks[tokenId] = ArtWork({
            name: _name,
            artType: _artType,
            artist: _artist,
            descriptionHash: _descriptionHash,
            price: _price,
            forSale: false
        });

        userArtCount[msg.sender] = userArtCount[msg.sender] + 1; // Incrémenter le nombre d'œuvres
    }

    // Mettre une œuvre en vente
    function putArtWorkForSale(uint256 _tokenId, uint256 _price) external onlyOwnerOf(_tokenId) {
        require(_price > 0, "Le prix doit etre superieur a 0");

        artworks[_tokenId].forSale = true;
        artworks[_tokenId].price = _price;
    }

    // Acheter une œuvre d'art mise en vente
    function buyArtWork(uint256 _tokenId) external payable cooldownCheck {
        ArtWork memory art = artworks[_tokenId];
        require(art.forSale, "L'oeuvre n'est pas en vente");
        require(msg.value == art.price, "Le montant envoye ne correspond pas au prix de l'oeuvre");

        address seller = ownerOf(_tokenId);

        // Transférer les fonds au vendeur
        payable(seller).transfer(msg.value);

        // Transférer l'œuvre au nouvel acheteur
        _transfer(seller, msg.sender, _tokenId);

        // Mettre à jour les informations
        artworks[_tokenId].forSale = false; // Annuler la vente
        userArtCount[seller] = userArtCount[seller] - 1; // Décrémenter le nombre d'œuvres du vendeur
        userArtCount[msg.sender] = userArtCount[msg.sender] + 1; // Incrémenter le nombre d'œuvres de l'acheteur

        lastTransactionTime[msg.sender] = block.timestamp;
        lastTransactionTime[seller] = block.timestamp;
    }

    // Récupérer les métadonnées d'une œuvre d'art
    function getArtWork(uint256 _tokenId) external view returns (ArtWork memory) {
        require(ownerOf(_tokenId) == msg.sender, "Vous n'etes pas le proprietaire de cette oeuvre");
        return artworks[_tokenId];
    }

    // Récupérer les anciens propriétaires d'une œuvre
    function getPreviousOwners(uint256 _tokenId) external view returns (address[] memory) {
        return previousOwners[_tokenId];
    }

    // Récupérer le nombre d'œuvres possédées par un utilisateur
    function getUserArtCount() external view returns (uint256) {
        return userArtCount[msg.sender];
    }

    function getAllArtworks() external view returns (ArtWork[] memory)
    {
        if (tokenId == 0) {
            return new ArtWork[](0);
        }

        ArtWork[] memory allArtworks = new ArtWork[](tokenId);
        for (uint256 i = 1; i <= tokenId; i++) {
            allArtworks[i - 1] = artworks[i];
        }
        return allArtworks;
    }
}
