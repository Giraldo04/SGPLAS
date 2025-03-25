// src/pages/CheckoutPage.js
import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Calcular el total del carrito
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Función para crear la orden y, posteriormente, iniciar el pago
  const handleOrder = async () => {
    if (!userInfo) {
      alert('Debes iniciar sesión para continuar');
      return;
    }

    // Construir la lista de items de la orden
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id, // referencia al Product en la BD
    }));

    try {
      // Crear la orden en el backend (a través de la API de órdenes)
      const resOrder = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          paymentMethod: 'Transbank',
          totalPrice,
        }),
      });

      const orderData = await resOrder.json();
      if (resOrder.ok) {
        // Orden creada con éxito: limpiar el carrito
        clearCart();
        // Iniciar el flujo de pago con Transbank utilizando la orden creada
        await handlePayment(orderData);
      } else {
        alert(orderData.message || 'Error al crear la orden');
      }
    } catch (error) {
      console.error('Error al crear la orden', error);
    }
  };

  // Función para iniciar el proceso de pago con Transbank
  const handlePayment = async (order) => {
    try {
      // Asegúrate de que la URL del endpoint de pagos sea la correcta
      const resPayment = await fetch('http://localhost:5001/api/payments/transbank/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ 
          orderId: order._id, 
          amount: order.totalPrice 
        }),
      });
      const paymentData = await resPayment.json();
      if (resPayment.ok) {
        // Redirige al usuario a la URL proporcionada por Transbank
        window.location.href = paymentData.url;
      } else {
        alert(paymentData.message || 'Error al iniciar el pago');
      }
    } catch (error) {
      console.error('Error al iniciar el pago:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Checkout</h2>
      {/* Formulario de dirección de envío */}
      <div className="mb-4">
        <label className="block font-semibold">Dirección</label>
        <input
          type="text"
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
          className="w-full border rounded p-2 mt-1"
        />
      </div>
      {/* Aquí podrías agregar campos para city, postalCode y country */}
      <div className="mb-4">
        <label className="block font-semibold">Ciudad</label>
        <input
          type="text"
          value={shippingAddress.city}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, city: e.target.value })
          }
          className="w-full border rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Código Postal</label>
        <input
          type="text"
          value={shippingAddress.postalCode}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
          }
          className="w-full border rounded p-2 mt-1"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">País</label>
        <input
          type="text"
          value={shippingAddress.country}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, country: e.target.value })
          }
          className="w-full border rounded p-2 mt-1"
        />
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold">Total: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={handleOrder}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
        >
          Confirmar Orden y Pagar
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
