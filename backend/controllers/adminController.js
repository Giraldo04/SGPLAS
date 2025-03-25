// backend/controllers/adminController.js
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

const getAdminSummary = async (req, res) => {
  try {
    // Contar usuarios, productos y órdenes
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();

    // Calcular ingresos totales a partir de todas las órdenes
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);

    res.json({
      usersCount,
      productsCount,
      ordersCount,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el resumen', error: error.message });
  }
};

module.exports = { getAdminSummary };
