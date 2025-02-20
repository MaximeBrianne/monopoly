# Documentation du Projet 5 BLOC

## Prérequis

Avant de commencer, assurez-vous d'avoir installé les outils suivants :

- Node.js
- Hardhat
- Metamask
- Un nœud Ethereum local
- Un nœud IPFS local (via Kubo)


## Installation du Projet

### 1. Cloner le dépôt
```
git clone https://github.com/MaximeBrianne/monopoly.git
```

### 2. Installer les dépendances

Dans un CMD dans les dossier :
- `./frontend/`
- `./smart-contracts`
```
npm install
```

### 3. Déploiement de l'IPFS en Local

#### 3.1 Installer Kubo

Télécharger [Kubo](https://dist.ipfs.tech/kubo/v0.33.2/kubo_v0.33.2_windows-amd64.zip)

```
ipfs init
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"http://localhost:3000\", \"http://localhost:5173\"]"
ipfs daemon
```

### 4. Déploiement du Contrat en Local

```
cd ./smart-contracts/

npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

### 5. Déploiment du  site
```
cd ./frontend/

npm install
npm run dev
```

### 6. Accéder au site

#### 6.1. Installer MetaMask

Si vous n'avez pas l'extension [MetaMask](https://chromewebstore.google.com/search/metamask), installez le.

#### 6.2. Importer un Compte

Pour obtenir des ETH, importer un des comptes possèdant 10,000 ETH qui apparait lorsque vous faites la commande : `npx hardhat node` via la clé privé.

#### 6.3. Accéder au site

Aller sur le site : http://localhost:5173/
