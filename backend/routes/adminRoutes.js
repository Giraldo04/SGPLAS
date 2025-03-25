// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { getAdminSummary } = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

// Esta ruta estará protegida: solo administradores pueden acceder
router.get('/summary', protect, admin, getAdminSummary);

module.exports = router;
