// backend/controllers/paymentController.js
const WebpayPlus = require('../config/transbankConfig');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');

// Función para enviar el correo de resumen de la orden al correo de la empresa
const sendOrderEmail = async (order) => {
  // Configurar el transportador con las variables de entorno (ejemplo para Gmail)
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // ej: smtp.gmail.com
    port: Number(process.env.EMAIL_PORT), // ej: 587
    secure: Number(process.env.EMAIL_PORT) === 465, // false para 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Construir el HTML del correo con un resumen de la orden
  let itemsHTML = order.orderItems
    .map(
      (item) =>
        `<li>${item.name} - Cantidad: ${item.quantity} - Precio: $${item.price}</li>`
    )
    .join('');

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
    from: `"E-commerce" <${process.env.EMAIL_USER}>`,
    to: process.env.COMPANY_EMAIL, // Correo de la empresa
    subject: `Nueva Orden Pagada - ID: ${order._id}`,
    html: emailHTML,
  };

  let info = await transporter.sendMail(mailOptions);
  console.log('Correo enviado, ID:', info.messageId);
};

const createTransaction = async (req, res) => {
  try {
    const { buyOrder, sessionId, amount } = req.body;
    if (!buyOrder) {
      return res.status(400).json({ message: "'buyOrder' es requerido" });
    }

    const returnUrl = process.env.TRANSBANK_WEBPAY_RETURN_URL;
    const transaction = new WebpayPlus.Transaction();
    console.log('buyOrder recibido:', buyOrder);
    const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);
    res.json(response);
  } catch (error) {
    console.error('Error al iniciar transacción Transbank:', error);
    res.status(500).json({ message: 'Error al iniciar transacción' });
  }
};

const processReturn = async (req, res) => {
  try {
    const token = req.body.token_ws || req.query.token_ws;
    if (!token) {
      return res.status(400).json({ message: 'Token no proporcionado' });
    }

    const transaction = new WebpayPlus.Transaction();
    const result = await transaction.commit(token);
    console.log('Resultado Transbank:', result);

    // Usamos result.buy_order (según la respuesta de la SDK)
    const orderId = result.buy_order;

    // Si la transacción está autorizada, actualizamos la orden para marcarla como pagada
    if (result.status === 'AUTHORIZED') {
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: result,
        },
        { new: true }
      );
      console.log('Orden actualizada a pagada:', updatedOrder);

      // Enviamos el correo a la empresa con el resumen de la orden
      sendOrderEmail(updatedOrder).catch((err) =>
        console.error("Error al enviar correo:", err)
      );
    }

    return res.redirect(
      `http://localhost:3000/order-confirmation?status=success&orderId=${orderId}`
    );
  } catch (error) {
    console.error('Error al confirmar transacción Transbank:', error);
    res.redirect('http://localhost:3000/order-confirmation?status=failure');
  }
};

module.exports = { createTransaction, processReturn };
