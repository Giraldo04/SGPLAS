// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { createTransaction, processReturn } = require('../controllers/paymentController');


// Endpoint para iniciar la transacción
router.post('/transbank/init', protect, createTransaction);

// Endpoint para el callback de Transbank
router.post('/transbank/return', processReturn);
// También podrías usar GET si Transbank redirige mediante GET: router.get('/transbank/return', processReturn);
router.get('/transbank/return', processReturn);


module.exports = router;
