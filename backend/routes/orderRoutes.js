const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, admin } = require('../middlewares/authMiddleware');
const {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
} = require('../controllers/orderController');

// 1. Ruta para obtener las órdenes del usuario autenticado (mis órdenes)
router.get('/myorders', protect, getMyOrders);

// 2. Ruta para obtener todas las órdenes (administrador)
// Debe definirse antes de la ruta dinámica para evitar conflictos
router.get('/', protect, admin, getAllOrders);

// 3. Ruta para crear una nueva orden, con validación de campos
router.post(
  '/',
  protect,
  [
    body('orderItems')
      .isArray({ min: 1 })
      .withMessage('Debe haber al menos un producto en la orden'),
    body('shippingMethod')
      .isIn(['pickup', 'delivery'])
      .withMessage('El método de envío debe ser "pickup" o "delivery"'),
    // Validación condicional: si shippingMethod es "delivery", se requieren ciertos campos
    body('shippingAddress').custom((value, { req }) => {
      if (req.body.shippingMethod === 'delivery') {
        if (!value || !value.street || !value.houseNumber || !value.commune || !value.region) {
          throw new Error('Para envío a domicilio, se requieren calle, número, comuna y región');
        }
      }
      return true;
    }),
  ],
  (req, res, next) => {
    // Validación de errores
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
  addOrderItems
);

// 4. Ruta para actualizar una orden a pagada
router.put('/:id/pay', protect, updateOrderToPaid);

// 5. Ruta para obtener una orden por ID (esta debe ir al final para no capturar otras rutas)
router.get('/:id', protect, getOrderById);

module.exports = router;
