import { useState, useEffect } from "react";
import { getBlockchain, getArtworks } from "../contract/contract";

const CreateArtwork = () => {
    const [name, setName] = useState("");
    const [artType, setArtType] = useState("");
    const [artist, setArtist] = useState("");
    const [descriptionHash, setDescriptionHash] = useState("");
    const [price, setPrice] = useState("");
    const [artworks, setArtworks] = useState([]); // Liste des œuvres

    const fetchArtworks = async () => {
        const arts = await getArtworks();
        setArtworks(arts);
    };

    const createArtwork = async () => {
        if (!name || !artType || !artist || !descriptionHash || !price) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            const { contract } = await getBlockchain();
            const tx = await contract.createArtwork(name, artType, artist, descriptionHash, ethers.parseEther(price));
            await tx.wait();
            alert("Œuvre d'art créée avec succès !");
            fetchArtworks(); // Rafraîchir la liste après création
        } catch (error) {
            console.error("Erreur lors de la création :", error);
        }
    };

    useEffect(() => {
        fetchArtworks();
    }, []);

    return (
        <div>
            <h2>Créer une Œuvre d'Art</h2>
            <input type="text" placeholder="Nom" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Type d'Art" value={artType} onChange={(e) => setArtType(e.target.value)} />
            <input type="text" placeholder="Artiste" value={artist} onChange={(e) => setArtist(e.target.value)} />
            <input type="text" placeholder="Hash IPFS de la description" value={descriptionHash} onChange={(e) => setDescriptionHash(e.target.value)} />
            <input type="number" placeholder="Prix (ETH)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <button onClick={createArtwork}>Créer</button>

            <h2>Liste des Œuvres</h2>
            <ul>
            {artworks.length > 0 ? (
                artworks.map((art) => (
                <li key={art.id}>
                    <strong>{art.name}</strong> - {art.artType} par {art.artist} (Prix: {art.price} ETH)
                    <br />
                    <small>IPFS: {art.descriptionHash}</small>
                </li>
                ))
            ) : (
                <p>Aucune œuvre enregistrée.</p>
            )}
            </ul>
        </div>
    );
};

export default CreateArtwork;
