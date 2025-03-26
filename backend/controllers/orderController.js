const Order = require('../models/Order');

// POST /api/orders
// Crear nueva orden
const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,   // ahora con subcampos { street, houseNumber, apartment, commune, region }
      shippingMethod,    // 'pickup' o 'delivery'
      paymentMethod,
      totalPrice,
    } = req.body;


    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No hay items en la orden' });
    }

    // Crear la orden
   const order = new Order({
      user: req.user._id, // viene del middleware protect
      orderItems,
      shippingAddress,   // objeto con { street, houseNumber, ... }
      shippingMethod,    // 'pickup' o 'delivery'
      paymentMethod,
      totalPrice,
    }); 

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la orden' });
  }
};


const getMyOrders = async (req, res) => {
    try {
      // Encuentra las órdenes donde el campo "user" coincida con el usuario autenticado
      const orders = await Order.find({ user: req.user._id });
      res.json(orders);
    } catch (error) {
      console.error('Error al obtener las órdenes:', error);
      res.status(500).json({ message: 'Error al obtener las órdenes' });
    }
  };


  // Obtener todas las órdenes (administrador)
const getAllOrders = async (req, res) => {
    try {
      const orders = await Order.find({}).populate('user', 'name email');
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las órdenes' });
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
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la orden' });
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
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la orden' });
  }
};

module.exports = {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getAllOrders,
};
