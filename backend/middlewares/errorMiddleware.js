// backend/middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
  
  console.log('Error:', err.stack || err.message);

  res.status(500).json({ message: 'Error del servidor', error: err.message });
    // Si el código de estado es 200 (OK) y hay un error, lo establecemos a 500 (Internal Server Error)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    
    res.json({
      message: err.message,
      // En producción, puedes ocultar el stack para no revelar detalles internos
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { errorHandler };
  