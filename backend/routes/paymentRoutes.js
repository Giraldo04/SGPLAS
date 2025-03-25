// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createTransaction, processReturn } = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware'); // Si deseas proteger la creación de transacción

// Endpoint para iniciar la transacción
router.post('/transbank/init', protect, createTransaction);

// Endpoint para el callback de Transbank
router.post('/transbank/return', processReturn);
// También podrías usar GET si Transbank redirige mediante GET: router.get('/transbank/return', processReturn);

module.exports = router;
