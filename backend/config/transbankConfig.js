// backend/config/transbankConfig.js
const transbankSdk = require('transbank-sdk');
const { WebpayPlus, Environment, Options } = transbankSdk;

const env = Environment.Test; // Usamos ambiente de integración

WebpayPlus.configureForIntegration(
  process.env.TRANSBANK_COMMERCE_CODE, // Ejemplo: 597055555532
  process.env.TRANSBANK_API_KEY,       // Tu API Key de integración
  Options.DEFAULT                      // Usamos las opciones por defecto para integración
);

module.exports = WebpayPlus;
