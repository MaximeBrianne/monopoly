const { expect } = require("chai");

describe("ArtCollection", function () {
  let ArtCollection;
  let artCollection;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    ArtCollection = await ethers.getContractFactory("ArtCollection");
    artCollection = await ArtCollection.deploy();
  });

  it("should mint an art work correctly", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description 1",
      1000
    );

    const art = await artCollection.getArtWork(1);
    expect(art.name).to.equal("Mon Premier Art");
    expect(art.artist).to.equal("Artiste Exemplar");
    expect(art.price).to.equal(1000);
    expect(art.artType).to.equal(0);
  });

  it("should allow minting and retrieving multiple artworks", async function () {
    // Mint 5 artworks
    for (let i = 0; i < 5; i++) {
      await artCollection.mintArtWork(
        `Art #${i + 1}`,
        0,  // 0 = 'Peinture'
        `Artiste Exemplar ${i + 1}`,
        `Description ${i + 1}`,
        1000 + i * 100
      );
    }

    // Récupérer toutes les œuvres
    const allArtworks = await artCollection.getAllArtworks();

    // Vérifier qu'il y a bien 5 œuvres
    expect(allArtworks.length).to.equal(5);
    for (let i = 0; i < 5; i++) {
      expect(allArtworks[i].name).to.equal(`Art #${i + 1}`);
      expect(allArtworks[i].artist).to.equal(`Artiste Exemplar ${i + 1}`);
      expect(allArtworks[i].price).to.equal(1000 + i * 100);
      expect(allArtworks[i].artType).to.equal(0);  // Peinture
    }
  });

  it("should not allow minting more than 10 artworks per user", async function () {
    for (let i = 0; i < 10; i++) {
      await artCollection.mintArtWork(
        `Art #${i}`,
        0,  // 0 = 'Peinture'
        "Artiste Exemplar",
        "Description",
        1000
      );
    }

    await expect(
      artCollection.mintArtWork(
        "Art #11",
        0,  // 0 = 'Peinture'
        "Artiste Exemplar",
        "Description",
        1000
      )
    ).to.be.revertedWith("Vous avez atteint la limite d'oeuvres possédées");
  });

  it("should allow putting an artwork for sale", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );

    await artCollection.putArtWorkForSale(1, 1500);

    const art = await artCollection.getArtWork(1);
    expect(art.forSale).to.be.true;
    expect(art.price).to.equal(1500);
  });

  it("should allow buying an artwork", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    await addr1.sendTransaction({
      to: artCollection.address,
      value: 1500
    });

    const newOwner = await artCollection.ownerOf(1);
    expect(newOwner).to.equal(addr1.address);
  });

  it("should not allow buying an artwork with insufficient funds", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    await expect(
      addr1.sendTransaction({
        to: artCollection.address,
        value: 1000
      })
    ).to.be.revertedWith("Le montant envoye ne correspond pas au prix de l'oeuvre");
  });

  it("should track previous owners correctly", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    await addr1.sendTransaction({
      to: artCollection.address,
      value: 1500
    });

    const previousOwners = await artCollection.getPreviousOwners(1);
    expect(previousOwners.length).to.equal(1);
    expect(previousOwners[0]).to.equal(owner.address);
  });

  it("should not allow transfer if cooldown has not passed", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    await addr1.sendTransaction({
      to: artCollection.address,
      value: 1500
    });

    await expect(
      artCollection.connect(addr1).buyArtWork(1)
    ).to.be.revertedWith("Veuillez attendre avant de faire une nouvelle transaction");
  });

  it("should allow retrieving art work details", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );

    const art = await artCollection.getArtWork(1);
    expect(art.name).to.equal("Mon Premier Art");
    expect(art.artist).to.equal("Artiste Exemplar");
    expect(art.price).to.equal(1000);
    expect(art.artType).to.equal(0);
  });

  it("should prevent retrieving art work details by non-owner", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 ='Peinture'
      "Artiste Exemplar",
      "Description",
      1000
    );

    await expect(
      artCollection.connect(addr1).getArtWork(1)
    ).to.be.revertedWith("Vous n'etes pas le proprietaire de cette oeuvre");
  });
});
