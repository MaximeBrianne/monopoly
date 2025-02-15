async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Déployer des contrats avec :", deployer.address);
  
    const CardCollection = await ethers.getContractFactory("CardCollection");
    const cardCollection = await CardCollection.deploy();
    
    console.log("contrat déployé pour CardCollection:", cardCollection.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  