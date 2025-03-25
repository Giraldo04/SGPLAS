const express = require('express');
const router = express.Router();
const {
    addOrderItems, 
    getOrderById, 
    updateOrderToPaid, 
    getMyOrders, 
    getAllOrders
} = require('../controllers/orderController');
const { protect, admin} = require('../middlewares/authMiddleware');

// Crear una nueva orden
router.post('/', protect, addOrderItems);

// Obtener una orden por ID
router.get('/:id', protect, getOrderById);

// Actualizar orden a pagada
router.put('/:id/pay', protect, updateOrderToPaid);

router.get('/myorders', protect, getMyOrders);

// Nueva ruta para obtener todas las órdenes (administrador)
router.get('/', protect, admin, getAllOrders);

module.exports = router;
