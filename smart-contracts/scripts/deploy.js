async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Déployer des contrats avec :", deployer.address);

  const ArtCollection = await ethers.getContractFactory("ArtCollection");
  const artCollection = await ArtCollection.deploy();
  await artCollection.waitForDeployment();

  console.log("contrat déployé pour ArtCollection:", artCollection.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
