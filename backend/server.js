// Nova - Serveur Node.js
const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('Nova Backend est en ligne !');
});

app.listen(PORT, () => {
  console.log(`Serveur Nova démarré sur le port ${PORT}`);
});
