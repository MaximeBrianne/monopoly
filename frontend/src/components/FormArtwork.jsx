import { useState } from "react";
import { mintArtWork } from "../contract/contract";

const FormArtwork = ({ fetchArtworks }) => {
    let [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const name = formData.get("name");
        const creator = formData.get("creator");
        const price = formData.get("price");
        const artType = formData.get("artType");
        const descriptionHash = formData.get("description");

        try {
            await mintArtWork(name, artType, creator, descriptionHash, price);

            fetchArtworks();
        } catch (error) {
            setError("Une erreur s'est produite durant l'enregistrement.");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" placeholder="Nom" />
            <input type="text" name="creator" placeholder="Créateur" />
            <input type="text" name="price" placeholder="Prix" />
            <select name="artType" placeholder="Type d'oeuvre">
                <option value="0">Peinture</option>
                <option value="1">Sculture</option>
                <option value="2">Photographie</option>
                <option value="3">Digitale</option>
                <option value="4">Autres</option>
            </select>
            <input type="textarea" name="description" placeholder="Description" />
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
