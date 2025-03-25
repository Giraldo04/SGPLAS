// backend/controllers/paymentController.js
const { WebpayPlus } = require('transbank-sdk');

/**
 * Inicia una transacción con Webpay Plus.
 * Se espera recibir en el body: amount, buyOrder, sessionId.
 */
const createTransaction = async (req, res) => {
  try {
    const { amount, buyOrder, sessionId } = req.body;

    // Define la URL de retorno: donde Transbank redirigirá tras finalizar el pago.
    // Asegúrate de que esta URL sea accesible desde Transbank (en desarrollo puedes usar herramientas como ngrok).
    const returnUrl = 'http://localhost:5001/api/payments/transbank/return';

    // Instancia el objeto de transacción.
    const transaction = new WebpayPlus.Transaction();

    // Crea la transacción con los parámetros requeridos.
    const response = await transaction.create(buyOrder, sessionId, amount, returnUrl);
    // response tendrá { token, url }

    res.json(response);
  } catch (error) {
    console.error('Error al iniciar transacción Transbank:', error);
    res.status(500).json({ message: 'Error al iniciar transacción' });
  }
};

/**
 * Endpoint de retorno (callback) de Transbank.
 * Se espera recibir el token en el query o body (según configuración).
 */
const processReturn = async (req, res) => {
  try {
    // En general, Transbank envía el token en el parámetro "token_ws"
    const token = req.body.token_ws || req.query.token_ws;
    if (!token) {
      return res.status(400).json({ message: 'Token no proporcionado' });
    }

    const transaction = new WebpayPlus.Transaction();
    // Confirmar la transacción usando el token recibido.
    const result = await transaction.commit(token);

    const orderId = result.buyOrder || 'unknown';


    if (result.status === 'AUTHORIZED') {
        return res.redirect(`http://localhost:3000/order-confirmation?status=success&orderId=${orderId}`);
      } else {
        return res.redirect(`http://localhost:3000/order-confirmation?status=failure&orderId=${orderId}`);
      }


  } catch (error) {
    console.error('Error al confirmar transacción Transbank:', error);
    res.status(500).json({ message: 'Error al confirmar transacción' });
  }
};

module.exports = {
  createTransaction,
  processReturn,
};
