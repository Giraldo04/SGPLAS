// backend/controllers/deliverySettingsController.js
const DeliverySettings = require('../models/DeliverySettings');

// Obtener la configuración de entrega (suponemos que hay un solo documento)
const getDeliverySettings = async (req, res) => {
  try {
    const settings = await DeliverySettings.findOne({});
    if (settings) {
      res.json(settings);
    } else {
      // Si no existe, crea uno por defecto y retórnalo
      const defaultSettings = await DeliverySettings.create({});
      res.json(defaultSettings);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la configuración de entrega' });
  }
};

// Actualizar la configuración de entrega
const updateDeliverySettings = async (req, res) => {
  try {
    const settings = await DeliverySettings.findOne({});
    if (settings) {
      settings.shippingPrice = req.body.shippingPrice || settings.shippingPrice;
      settings.localPickupAddress = req.body.localPickupAddress || settings.localPickupAddress;
      const updatedSettings = await settings.save();
      res.json(updatedSettings);
    } else {
      res.status(404).json({ message: 'Configuración no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la configuración de entrega' });
  }
};

module.exports = { getDeliverySettings, updateDeliverySettings };
