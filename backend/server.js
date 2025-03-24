// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// Puedes agregar la conexión a la base de datos desde config/db.js más adelante
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a ImportadoraSGPlas API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
