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
      "QmHashDescription",
      1000
    );

    // Vérifier que l'oeuvre d'art a été mintée
    const art = await artCollection.getArtWork(1);
    expect(art.name).to.equal("Mon Premier Art");
    expect(art.artist).to.equal("Artiste Exemplar");
    expect(art.price).to.equal(1000);
    expect(art.artType).to.equal(0); // Vérifie que type = 'Peinture'
  });

  it("should not allow minting more than 10 artworks per user", async function () {
    for (let i = 0; i < 10; i++) {
      await artCollection.mintArtWork(
        `Art #${i}`,
        0,  // 0 = 'Peinture'
        "Artiste Exemplar",
        "QmHashDescription",
        1000
      );
    }

    // Vérifier que l'utilisateur ne peut pas avoir plus de 10 oeuvres
    await expect(
      artCollection.mintArtWork(
        "Art #11",
        0,  // 0 = 'Peinture'
        "Artiste Exemplar",
        "QmHashDescription",
        1000
      )
    ).to.be.revertedWith("Vous avez atteint la limite d'oeuvres possédées");
  });

  it("should allow putting an artwork for sale", async function () {
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );

    // Mettre l'oeuvre en vente
    await artCollection.putArtWorkForSale(1, 1500);

    // Vérifier que l'oeuvre est bien en vente
    const art = await artCollection.getArtWork(1);
    expect(art.forSale).to.be.true;
    expect(art.price).to.equal(1500);
  });

  it("should allow buying an artwork", async function () {
    // Créer une oeuvre d'art et la mettre en vente
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    // Acheter l'oeuvre
    await addr1.sendTransaction({
      to: artCollection.address,
      value: 1500
    });

    // Vérifier que l'oeuvre a bien changé de propriétaire
    const newOwner = await artCollection.ownerOf(1);
    expect(newOwner).to.equal(addr1.address);
  });

  it("should not allow buying an artwork with insufficient funds", async function () {
    // Créer une oeuvre d'art et la mettre en vente
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 correspond à 'Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    // Essayer d'acheter l'oeuvre avec des fonds insuffisants
    await expect(
      addr1.sendTransaction({
        to: artCollection.address,
        value: 1000  // Moins que le prix de vente
      })
    ).to.be.revertedWith("Le montant envoye ne correspond pas au prix de l'oeuvre");
  });

  it("should track previous owners correctly", async function () {
    // Créer une oeuvre d'art et la mettre en vente
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    // Acheter l'oeuvre
    await addr1.sendTransaction({
      to: artCollection.address,
      value: 1500
    });

    // Vérifier que les anciens propriétaires sont bien enregistrés
    const previousOwners = await artCollection.getPreviousOwners(1);
    expect(previousOwners.length).to.equal(1);
    expect(previousOwners[0]).to.equal(owner.address);
  });

  it("should not allow transfer if cooldown has not passed", async function () {
    // Créer une oeuvre d'art et la mettre en vente
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );
    await artCollection.putArtWorkForSale(1, 1500);

    // Acheter l'oeuvre
    await addr1.sendTransaction({
      to: artCollection.address,
      value: 1500
    });

    // Essayer de vendre l'oeuvre avant la fin du cooldown
    await expect(
      artCollection.connect(addr1).buyArtWork(1)
    ).to.be.revertedWith("Veuillez attendre avant de faire une nouvelle transaction");
  });

  it("should allow retrieving art work details", async function () {
    // Créer une oeuvre d'art
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 = 'Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );

    // Vérifier les détails de l'oeuvre
    const art = await artCollection.getArtWork(1);
    expect(art.name).to.equal("Mon Premier Art");
    expect(art.artist).to.equal("Artiste Exemplar");
    expect(art.price).to.equal(1000);
    expect(art.artType).to.equal(0); // Vérifie le type d'art
  });

  it("should prevent retrieving art work details by non-owner", async function () {
    // Créer une oeuvre d'art
    await artCollection.mintArtWork(
      "Mon Premier Art",
      0,  // 0 ='Peinture'
      "Artiste Exemplar",
      "QmHashDescription",
      1000
    );

    // Essayer de récupérer les détails de l'oeuvre par un non-propriétaire
    await expect(
      artCollection.connect(addr1).getArtWork(1)
    ).to.be.revertedWith("Vous n'etes pas le proprietaire de cette oeuvre");
  });
});
