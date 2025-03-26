// backend/models/DeliverySettings.js
const mongoose = require('mongoose');

const deliverySettingsSchema = new mongoose.Schema({
  shippingPrice: {
    type: Number,
    required: true,
    default: 0, // Precio del envío
  },
  localPickupAddress: {
    type: String,
    required: true,
    default: 'Conferencia 166, Galeria Antunez Oficina Nro 52', // Dirección para retiro en local
  },
});

module.exports = mongoose.model('DeliverySettings', deliverySettingsSchema);
