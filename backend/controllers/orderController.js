// backend/controllers/orderController.js
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Función para enviar correo electrónico con el resumen de la orden
const sendOrderEmail = async (order) => {
  // Configurar el transportador
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // ej: smtp.gmail.com
    port: Number(process.env.EMAIL_PORT), // ej: 587 o 465
    secure: Number(process.env.EMAIL_PORT) === 465, // true para 465, false para 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Construir el HTML con el resumen de la orden
  let itemsHTML = order.orderItems
    .map(
      (item) =>
        `<li>${item.name} - Cantidad: ${item.quantity} - Precio: $${item.price}</li>`
    )
    .join('');

  // Construir el cuerpo del correo
  let emailHTML = `
    <h2>Resumen de la Orden</h2>
    <p><strong>ID de Orden:</strong> ${order._id}</p>
    <p><strong>Método de Envío:</strong> ${order.shippingMethod}</p>
    <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
    <h3>Productos:</h3>
    <ul>${itemsHTML}</ul>
    <h3>Dirección:</h3>
    ${
      order.shippingMethod === 'delivery'
        ? `<p>Calle: ${order.shippingAddress.street}</p>
           <p>Nº Casa: ${order.shippingAddress.houseNumber}</p>
           <p>Depto: ${order.shippingAddress.apartment || 'N/A'}</p>
           <p>Comuna: ${order.shippingAddress.commune}</p>
           <p>Región: ${order.shippingAddress.region}</p>`
        : `<p>${order.shippingAddress.street}</p>`
    }
  `;

  let mailOptions = {
    from: `"E-commerce" <${process.env.EMAIL_USER}>`, // Remitente
    to: process.env.COMPANY_EMAIL, // Destinatario: correo de la empresa
    subject: `Nueva Orden Recibida - ID: ${order._id}`,
    html: emailHTML,
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('Correo enviado, ID:', info.messageId);
};

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

    // Enviar correo a la empresa con el resumen de la orden
    sendOrderEmail(createdOrder).catch((err) =>
      console.error("Error al enviar correo:", err)
    );

    return res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Error en addOrderItems:", error);
    return res.status(500).json({ message: 'Error al crear la orden' });
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
