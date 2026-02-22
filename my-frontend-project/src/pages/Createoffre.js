import React, { useState } from "react";
import axios from "axios";

const CreateOffre = () => {
  const [titre, setTitre] = useState("");
  const [localisation, setLocalisation] = useState("");
  const [description, setDescription] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation simple
    if (!titre || !localisation || !description || !entreprise) {
      setMessage("Tous les champs sont obligatoires !");
      return;
    }

    try {
      const token = localStorage.getItem("token"); // récupère le token

      const res = await axios.post(
        "http://localhost:3001/api/offres", // <- URL CORRECTE
        { titre, localisation, description, entreprise },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );

      setMessage(res.data.msg); // affiche "Offre créée avec succès"
      console.log("Offre créée :", res.data.data);

      // Réinitialiser le formulaire
      setTitre("");
      setLocalisation("");
      setDescription("");
      setEntreprise("");

    } catch (err) {
      console.error("Erreur création offre:", err.response?.data || err.message);
      setMessage(err.response?.data?.msg || "Erreur serveur");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h2>Créer une Offre</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "10px" }}>
          <label>Titre :</label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Localisation :</label>
          <input
            type="text"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Description :</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-control"
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Entreprise :</label>
          <input
            type="text"
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Ajouter l'Offre
        </button>
      </form>
    </div>
  );
};

export default CreateOffre;