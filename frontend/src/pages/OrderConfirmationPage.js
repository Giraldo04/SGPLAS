// src/pages/OrderConfirmationPage.js
import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const query = new URLSearchParams(useLocation().search);
  const status = query.get('status'); // 'success' o 'failure'
  const orderId = query.get('orderId');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const fetchOrder = async () => {
        try {
          const res = await fetch(`http://localhost:5001/api/orders/${orderId}`);
          const data = await res.json();
          setOrder(data);
        } catch (error) {
          console.error('Error al obtener detalles de la orden:', error);
        }
      };
      fetchOrder();
    }
  }, [orderId]);

  return (
    <div className="container mx-auto p-4">
      {status === 'success' ? (
        <>
          <h2 className="text-2xl font-bold mb-4">¡Compra Exitosa!</h2>
          <p>La orden <strong>{orderId}</strong> ha sido procesada correctamente.</p>
          {order && (
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Detalles de la Orden:</h3>
              <p><strong>Método de Envío:</strong> {order.shippingMethod}</p>
              {order.shippingMethod === 'delivery' ? (
                <>
                  <p><strong>Dirección de Envío:</strong></p>
                  <p>Calle: {order.shippingAddress.street}</p>
                  <p>Nº Casa: {order.shippingAddress.houseNumber}</p>
                  <p>Depto: {order.shippingAddress.apartment}</p>
                  <p>Comuna: {order.shippingAddress.commune}</p>
                  <p>Región: {order.shippingAddress.region}</p>
                </>
              ) : (
                <p><strong>Dirección de Retiro:</strong> {order.shippingAddress.address}</p>
              )}
              <p><strong>Total:</strong> ${order.totalPrice.toFixed(2)}</p>
            </div>
          )}
          <Link to="/" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Volver al Inicio
          </Link>
        </>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-4">Error en la Compra</h2>
          <p>Ocurrió un problema al procesar tu pago. Por favor, intenta nuevamente.</p>
          <Link to="/cart" className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
            Volver al Carrito
          </Link>
        </>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
