// backend/controllers/paymentController.js
const WebpayPlus = require('../config/transbankConfig');
const Order = require('../models/Order');

const createTransaction = async (req, res) => {
  try {
    const { buyOrder, sessionId, amount } = req.body;

    if (!buyOrder) {
      return res.status(400).json({ message: "'buyOrder' es requerido" });
    }

    const returnUrl = process.env.TRANSBANK_WEBPAY_RETURN_URL; // Ej.: http://localhost:5001/api/payments/transbank/return

    const transaction = new WebpayPlus.Transaction();
    console.log('buyOrder recibido:', buyOrder)
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
    const orderId = result.buy_order

    if(result.status === 'AUTHORIZED') {
      // Aquí puedes llamar a un método de actualización o directamente usar el modelo Order
      await Order.findByIdAndUpdate(result.buy_order, {
        isPaid: true,
        paidAt: Date.now(),
        paymentResult: result
      });
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
