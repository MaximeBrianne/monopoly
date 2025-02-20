const { expect } = require("chai");

describe("ArtCollection Contract", function () {
  let ArtCollection, artCollection, owner, user1, user2;
  let tokenId = 0;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    ArtCollection = await ethers.getContractFactory("ArtCollection");
    artCollection = await ArtCollection.deploy();
    await artCollection.waitForDeployment();
  });

  it("should mint a new art work", async function () {
    await artCollection.connect(owner).mintArtWork("Mona Lisa", 0, "Leonardo da Vinci", "QmHash", 1);
    const artwork = await artCollection.artworks(tokenId);
    expect(artwork.name).to.equal("Mona Lisa");
    expect(artwork.artist).to.equal("Leonardo da Vinci");
    tokenId++;
  });

  it("should put artwork for sale", async function () {
    await artCollection.connect(owner).mintArtWork("Starry Night", 0, "Vincent van Gogh", "QmHash", 1);
    await artCollection.connect(owner).putArtWorkForSale(tokenId - 1, 2);
    
    const artwork = await artCollection.artworks(tokenId - 1);
    console.log(`Artwork for sale: ${artwork.forSale}, Price: ${artwork.price}`);
    
    expect(artwork.forSale).to.equal(true);
    expect(artwork.price).to.equal(2);
  });

  it("should allow a user to buy an artwork", async function () {
    await artCollection.connect(owner).mintArtWork("The Persistence of Memory", 0, "Salvador Dalí", "QmHash", 1);
    await artCollection.connect(owner).putArtWorkForSale(tokenId - 1, 2);

    const artwork = await artCollection.artworks(tokenId - 1);
    console.log("Artwork for sale:", artwork.forSale, "Price:", artwork.price);

    const balanceBefore = BigInt(await ethers.provider.getBalance(user1.address));
    await artCollection.connect(user1).buyArtWork(tokenId - 1, { value: 2 });
    const balanceAfter = BigInt(await ethers.provider.getBalance(user1.address));

    expect(balanceAfter).to.be.lessThan(balanceBefore - BigInt(2)); // Correction ici
  });

  it("should revert if buying artwork with insufficient funds", async function () {
    await artCollection.connect(owner).mintArtWork("The Scream", 0, "Edvard Munch", "QmHash", 1);
    await artCollection.connect(owner).putArtWorkForSale(tokenId - 1, 3);
    await expect(
      artCollection.connect(user2).buyArtWork(tokenId - 1, { value: 2 })
    ).to.be.revertedWith("Le montant envoye ne correspond pas au prix de l'oeuvre");
  });
});
