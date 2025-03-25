// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Inicializar Express
const app = express();
app.use(express.json());
app.use(cors());

const userRoutes = require('./routes/userRoutes'); // Asegúrate de que exista
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const adminUserRoutes = require('./routes/adminUserRoutes');
const productRoutes = require('./routes/productRoutes');

// Configurar rutas
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/products', productRoutes);

// Integrar Swagger para la documentación de la API
const { swaggerUi, swaggerDocs } = require('./swagger');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Bienvenido a ImportadoraSGPlas API');
});

// Después de definir todas las rutas en server.js, agrega:
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const { errorHandler } = require('./middlewares/errorMiddleware');
app.use(errorHandler);


// server.js
// ... configuración y rutas

const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

module.exports = server;

