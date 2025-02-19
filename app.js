const express = require('express');
const Web3 = require('web3');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

// Connecter à ton nœud local Ethereum via Infura ou ton nœud local
const web3 = new Web3(process.env.INFURA_URL);  // Ou l'URL de ton nœud local si tu préfères

// Ton adresse et clé privée pour signer les transactions
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

// Charger le contrat à partir de l'ABI générée par Hardhat ou Truffle (assure-toi que tu as un fichier .json)
const contractABI = require('./contracts/ArtCollection.json').abi;  // Assure-toi que ce fichier ABI est dans le bon dossier
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const contract = new web3.eth.Contract(contractABI, contractAddress);

// Route pour obtenir toutes les œuvres
app.get('/artworks', async (req, res) => {
  try {
    const artworks = await contract.methods.getAllArtworks().call();
    res.json(artworks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route pour acheter une œuvre
app.post('/buy', async (req, res) => {
  const { tokenId, amount } = req.body;
  try {
    // Récupérer le prix de l'œuvre
    const price = await contract.methods.artworks(tokenId).call().price;

    // Vérifier si l'utilisateur envoie le bon montant
    if (web3.utils.toWei(amount.toString(), 'ether') !== price) {
      return res.status(400).json({ error: 'Montant incorrect' });
    }

    // Envoyer la transaction d'achat
    const tx = await contract.methods.buyArtWork(tokenId).send({
      from: account.address,
      value: price,
    });

    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/mint', async (req, res) => {
  const { metadataURI, price } = req.body;

  try {
      const tx = await contract.methods.mintArtWork(metadataURI, price).send({
          from: account.address
      });

      res.json(tx);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

// Démarrer le serveur Express
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
