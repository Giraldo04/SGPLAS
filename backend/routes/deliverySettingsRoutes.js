// backend/routes/deliverySettingsRoutes.js
const express = require('express');
const router = express.Router();
const { getDeliverySettings, updateDeliverySettings } = require('../controllers/deliverySettingsController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Ruta para obtener la configuración (accesible para cualquier usuario, si lo deseas)
router.get('/', getDeliverySettings);

// Ruta para actualizar la configuración (solo administradores)
router.put('/', protect, admin, updateDeliverySettings);

module.exports = router;
