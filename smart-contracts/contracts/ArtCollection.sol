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
        string descriptionHash;
        uint256 price;
        bool forSale;
    }

    uint256 public tokenId = 0;
    uint256 public constant MAX_ARTWORKS_PER_USER = 10;

    mapping(uint256 => ArtWork) public artworks;
    mapping(address => uint256) public userArtCount;
    mapping(uint256 => address[]) public previousOwners;
    mapping(address => uint256) public lastTransactionTime;

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

    // Créer une oeuvre d'art unique
    function mintArtWork(
        string memory _name,
        ArtType _artType,
        string memory _artist,
        string memory _descriptionHash,
        uint256 _price
    ) external {
        artworks[tokenId] = ArtWork({
            name: _name,
            artType: _artType,
            artist: _artist,
            descriptionHash: _descriptionHash,
            price: _price,
            forSale: true
        });

        _safeMint(msg.sender, tokenId);

        tokenId++;

        userArtCount[msg.sender] = userArtCount[msg.sender] + 1;
    }

    // Mettre une oeuvre en vente
    function putArtWorkForSale(uint256 _tokenId, uint256 _price) external onlyOwnerOf(_tokenId) {
        require(_price > 0, "Le prix doit etre superieur a 0");

        artworks[_tokenId].forSale = true;
        artworks[_tokenId].price = _price;
    }

    function removeFromSale(uint256 _tokenId) external onlyOwnerOf(_tokenId) hasSpaceInCollection {
        require(artworks[_tokenId].forSale, "L'oeuvre n'est pas en vente");
        artworks[_tokenId].forSale = false;
    }

    // Acheter une oeuvre d'art mise en vente
    function buyArtWork(uint256 _tokenId) external payable cooldownCheck hasSpaceInCollection {
        ArtWork memory art = artworks[_tokenId];
        require(art.forSale, "L'oeuvre n'est pas en vente");
        require(msg.value == art.price, "Le montant envoye ne correspond pas au prix de l'oeuvre");

        address seller = ownerOf(_tokenId);

        // Transférer les fonds au vendeur
        payable(seller).transfer(msg.value);

        // Transférer l'oeuvre au nouvel acheteur
        _transfer(seller, msg.sender, _tokenId);

        // Mettre à jour les informations
        previousOwners[_tokenId].push(seller);
        artworks[_tokenId].forSale = false;
        userArtCount[seller] = userArtCount[seller] - 1;
        userArtCount[msg.sender] = userArtCount[msg.sender] + 1;

        lastTransactionTime[msg.sender] = block.timestamp;
        lastTransactionTime[seller] = block.timestamp;
    }

    // Récupérer les métadonnées d'une oeuvre d'art
    function getArtWork(uint256 _tokenId) external view returns (ArtWork memory) {
        require(ownerOf(_tokenId) == msg.sender, "Vous n'etes pas le proprietaire de cette oeuvre");
        return artworks[_tokenId];
    }

    // Récupérer les anciens propriétaires d'une oeuvre
    function getPreviousOwners(uint256 _tokenId) external view returns (address[] memory) {
        return previousOwners[_tokenId];
    }

    // Récupérer le nombre d'oeuvres possédées par un utilisateur
    function getUserArtCount() external view returns (uint256) {
        return userArtCount[msg.sender];
    }

    function getAllArtworks() external view returns (ArtWork[] memory) {
        ArtWork[] memory allArtworks = new ArtWork[](tokenId);
        for (uint256 i = 0; i < tokenId; i++) {
            allArtworks[i] = artworks[i];
        }
        return allArtworks;
    }
}
