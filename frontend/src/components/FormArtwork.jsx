import { useState } from "react";
import { mintArtWork } from "../contract/contract";
import { create } from "ipfs-http-client";

const client = create({ url: "http://localhost:5001" });

const FormArtwork = ({ fetchArtworks }) => {
    let [error, setError] = useState(null);
    let [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const creator = formData.get("creator");
        const price = formData.get("price");
        const artType = formData.get("artType");
        let descriptionHash = ""

        try {
            if (file) {
                const added = await client.add(file);
                descriptionHash = added.path;
            }

            await mintArtWork(name, artType, creator, descriptionHash, price);
            fetchArtworks();
        } catch (error) {
            setError("Une erreur s'est produite durant l'enregistrement.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nom" required />
            <input type="text" name="creator" placeholder="Créateur" required />
            <input type="text" name="price" placeholder="Prix" required />
            <select name="artType" required>
                <option value="0">Peinture</option>
                <option value="1">Sculpture</option>
                <option value="2">Photographie</option>
                <option value="3">Digitale</option>
                <option value="4">Autres</option>
            </select>
            <input type="file" onChange={handleFileChange} />
            <button type="submit">Ajouter</button>
            {error && (
                <div>
                    <strong>Erreur :</strong> {error}
                </div>
            )}
        </form>
    );
};

export default FormArtwork;
