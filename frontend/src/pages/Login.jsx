import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    connectMetaMask();
  }, []);

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      setError("MetaMask n'est pas installé. Veuillez l'installer pour continuer.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setError("");
      navigate("/admin");
    } catch (err) {
      setError("Échec de la connexion à MetaMask. Veuillez réessayer.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "1rem" }}>
      <div style={{ backgroundColor: "white", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", borderRadius: "1rem", padding: "1.5rem", width: "20rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem" }}>Connexion avec MetaMask</h2>
        <button onClick={connectMetaMask} style={{ width: "100%", padding: "0.75rem", fontSize: "1rem", fontWeight: "600", color: "white", backgroundColor: "#007bff", border: "none", borderRadius: "0.5rem", cursor: "pointer" }}>
          Se connecter
        </button>
        {error && (
          <div style={{ marginTop: "1rem", padding: "0.75rem", backgroundColor: "#f8d7da", color: "#721c24", borderRadius: "0.5rem" }}>
            <strong>Erreur :</strong> {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
