// src/pages/OrderConfirmationPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

// Hook para obtener parámetros de la URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const OrderConfirmationPage = () => {
  const query = useQuery();
  const status = query.get('status'); // 'success' o 'failure'
  const orderId = query.get('orderId');
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (orderId) {
      // Obtener detalles de la orden desde el backend
      fetch(`http://localhost:5001/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data))
        .catch((error) => console.error(error));
    }
  }, [orderId]);

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow text-center">
      {status === 'success' ? (
        <>
          <h2 className="text-2xl font-bold mb-4">¡Pago Exitoso!</h2>
          <p>Tu orden <strong>{orderId}</strong> ha sido procesada correctamente.</p>
          {orderDetails && (
            <div className="mt-4">
              <p><strong>Total:</strong> ${orderDetails.totalPrice.toFixed(2)}</p>
              <p>
                <strong>Fecha:</strong> {new Date(orderDetails.createdAt).toLocaleString()}
              </p>
            </div>
          )}
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Volver al Inicio
          </Link>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Pago Fallido</h2>
          <p>Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
          <Link
            to="/cart"
            className="mt-4 inline-block bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
          >
            Volver al Carrito
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
