// backend/swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  // Definición básica de la API con OpenAPI 3.0.0
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'ImportadoraSGPlas API',
      version: '1.0.0',
      description: 'Documentación de la API para el e-commerce ImportadoraSGPlas',
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Servidor de desarrollo',
      },
    ],
  },
  // Indica dónde buscar las definiciones de las rutas
  apis: ['./routes/*.js'], // Se buscarán comentarios de Swagger en los archivos de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
