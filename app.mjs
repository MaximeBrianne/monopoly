import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.static('public'));

// Route de test pour vérifier si le serveur fonctionne
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
