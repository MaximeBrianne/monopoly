// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CardCollection is ERC721Enumerable, Ownable {
    struct Card {
        string name;
        string cardType;        // Creature, Sort,         Enchantement,   Artefact
        string rarity;          // Commune,  Non Commune,  Rare,           Mythique
        string imageURI;        // Lien vers l'image stockée sur IPFS
        string descriptionHash; // Lien vers le Hash du texte stockée sur IPFS
    }

    uint8 public constant MAX_CARDS_PER_USER = 20;
    uint256 public constant COOLDOWN_TIME = 5 minutes;  // 5 minutes de cooldown entre les transactions
    uint256 public constant ACTION_LOCK_TIME = 10 minutes; // 10 minutes de lock après acquisition
    mapping(uint256 => Card) public cards;
    mapping(uint256 => address[]) public previousOwners;

    mapping(address => uint256) public lastTransactionTime; // Horodatage des dernières transactions
    mapping(address => uint256) public lastActionTime; // Horodatage des dernières acquisitions

    constructor() ERC721("CardCollection", "CARD") {}

    modifier cooldownCheck() {
        require(block.timestamp >= lastTransactionTime[msg.sender] + COOLDOWN_TIME, "veuillez attendre avant de faire une nouvelle transaction");
        _;
    }

    modifier actionLockCheck() {
        require(block.timestamp >= lastActionTime[msg.sender] + ACTION_LOCK_TIME, "Vous devez attendre avant de faire une nouvelle action");
        _;
    }

    // Créer plusieurs exemplaires d'une carte
    function mintCard(
        string memory _name,
        string memory _cardType,
        string memory _rarity,
        string memory _imageURI,
        string memory _descriptionHash,
        uint256 _copies
    ) external onlyOwner {
        for (uint256 i = 0; i < _copies; i++) {
            uint256 tokenId = totalSupply() + 1;
            _safeMint(msg.sender, tokenId);

            cards[tokenId] = Card({
                name: _name,
                cardType: _cardType,
                rarity: _rarity,
                imageURI: _imageURI,
                descriptionHash: _descriptionHash
            });

            lastActionTime[msg.sender] = block.timestamp; // Mise à jour de l'horodatage pour le lock temporaire
        }
    }

    // Echanger une carte entre deux utilisateurs
    function transferCard(address _to, uint256 _tokenId) external cooldownCheck {
        require(ownerOf(_tokenId) == msg.sender, "Vous n'etes pas le proprietaire de cette carte");
        require(balanceOf(_to) < MAX_CARDS_PER_USER, "L'utilisateur cible a atteint la limite de possession");

        // Enregistrer l'ancien propriétaire
        previousOwners[_tokenId].push(msg.sender);

        // Transférer la carte
        _transfer(msg.sender, _to, _tokenId);

        // Mise à jour de horodatage de transaction pour l'utilisateur
        lastTransactionTime[msg.sender] = block.timestamp;
    }

    // Récupérer les métadonnées d'une carte
    function getCard(uint256 _tokenId) external view returns (Card memory) {
        //require(ownerOf(_tokenId) != address(0), "La carte n'existe pas");
        require(ownerOf(_tokenId) != address(0), "La carte n'existe pas");
        return cards[_tokenId];
    }

    // Récupérer les anciens propriétaires d'une carte
    function getPreviousOwners(uint256 _tokenId) external view returns (address[] memory) {
        return previousOwners[_tokenId];
    }
}
