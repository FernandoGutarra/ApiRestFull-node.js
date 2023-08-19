// app.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware para analizar el cuerpo de las solicitudes JSON
app.use(bodyParser.json());

// Configuración de cors
app.use(cors());

// Importa y usa tus rutas
const router = require('./router');
app.use(router);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
