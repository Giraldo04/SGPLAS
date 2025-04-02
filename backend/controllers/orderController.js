// backend/controllers/orderController.js
const Order = require('../models/Order');


// Función para enviar correo electrónico con el resumen de la orden

// POST /api/orders
// Crear nueva orden
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,   // { street, houseNumber, apartment, commune, region }
      shippingMethod,    // 'pickup' o 'delivery'
      paymentMethod,
      totalPrice,
    } = req.body;

    console.log("req.body.orderItems:", req.body.orderItems);
    console.log("shippingAddress recibido:", shippingAddress);

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No hay items en la orden' });
    }

    // Crear la orden
    const order = new Order({
      user: req.user._id, // viene del middleware protect
      orderItems,
      shippingAddress,
      shippingMethod,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log("Orden creada:", createdOrder);

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error en addOrderItems:", error);
    return res.status(500).json({ message: 'Error al crear la orden',  error: error.message  });
  }
};

// GET /api/orders/:id
// Obtener detalles de una orden
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }
    console.log("Orden obtenida:", order);
    return res.json(order);
  } catch (error) {
    console.error("Error en getOrderById:", error);
    return res.status(500).json({ message: 'Error al obtener la orden' });
  }
};

// PUT /api/orders/:id/pay
// Marcar la orden como pagada
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Orden no encontrada' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    console.log("Orden actualizada a pagada:", updatedOrder);
    return res.json(updatedOrder);
  } catch (error) {
    console.error("Error en updateOrderToPaid:", error);
    return res.status(500).json({ message: 'Error al actualizar la orden' });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    console.log("Órdenes del usuario:", orders);
    return res.json(orders);
  } catch (error) {
    console.error("Error en getMyOrders:", error);
    return res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};

// GET /api/orders/
// Obtener todas las órdenes (administrador)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    console.log("Todas las órdenes:", orders);
    return res.json(orders);
  } catch (error) {
    console.error("Error en getAllOrders:", error);
    return res.status(500).json({ message: 'Error al obtener las órdenes' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
};
