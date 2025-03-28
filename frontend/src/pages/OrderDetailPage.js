// src/pages/OrderDetailPage.js
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo) return; // Esperamos a que userInfo esté disponible
    const fetchOrder = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/orders/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        if (!res.ok) {
          throw new Error('Error al obtener la orden');
        }
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchOrder();
  }, [id, userInfo]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>Cargando orden...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Detalle de la Orden</h2>
      <p><strong>Orden ID:</strong> {order._id}</p>
      <p><strong>Método de Envío:</strong> {order.shippingMethod}</p>
      {order.shippingMethod === 'delivery' ? (
        <>
          <p><strong>Dirección de Envío:</strong></p>
          <p>Calle: {order.shippingAddress?.street}</p>
          <p>Nº Casa: {order.shippingAddress?.houseNumber}</p>
          <p>Depto: {order.shippingAddress?.apartment}</p>
          <p>Comuna: {order.shippingAddress?.commune}</p>
          <p>Región: {order.shippingAddress?.region}</p>
        </>
      ) : (
        <p><strong>Dirección de Retiro:</strong> {order.shippingAddress?.street}</p>
      )}
      <p><strong>Estado de Pago:</strong> {order.isPaid ? 'Pagada' : 'Pendiente'}</p>
      <p><strong>Total:</strong> ${order.totalPrice?.toFixed(2)}</p>

      <h3 className="text-xl font-semibold mt-4 mb-2">Items de la Orden</h3>
      <ul className="list-disc pl-5">
        {order.orderItems.map((item, index) => (
          <li key={index}>
            {item.name} - Cantidad: {item.quantity} - Precio: ${item.price}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetailPage;
