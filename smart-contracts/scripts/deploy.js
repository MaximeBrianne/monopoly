const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Déployer des contrats avec :", deployer.address);

  const ArtCollection = await ethers.getContractFactory("ArtCollection");
  const artCollection = await ArtCollection.deploy();
  await artCollection.waitForDeployment();

  const frontend = path.join(__dirname, '..', '..', 'frontend', 'src', 'contract');

  if (!fs.existsSync(frontend)) {
    fs.mkdirSync(frontend, { recursive: true });
  }

  // Enregistre l'adresse du contrat dans le fichier contract.js
  fs.writeFileSync(
    path.join(frontend, "ContractAddresses.json"),
    JSON.stringify({ ArtCollection: await artCollection.getAddress() }, undefined, 2)
  );

  const abiPath = "./artifacts/contracts/ArtCollection.sol/ArtCollection.json";
  const abi = JSON.parse(fs.readFileSync(abiPath, "utf-8")).abi;

  // Enregistre l'ABI du contrat dans le fichier abi.js
  fs.writeFileSync(
    path.join(frontend, "ArtCollection.json"),
    JSON.stringify(abi, null, 2)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
