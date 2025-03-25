// src/pages/ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (userInfo) {
        try {
          const response = await fetch('http://localhost:5001/api/orders/myorders', {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          const data = await response.json();
          setOrders(data);
        } catch (error) {
          console.error('Error al obtener las órdenes:', error);
        }
      }
    };
    fetchOrders();
  }, [userInfo]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <div className="mb-6">
        <p>
          <span className="font-semibold">Nombre:</span> {userInfo?.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {userInfo?.email}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-2">Historial de Órdenes</h3>
      {orders.length === 0 ? (
        <p>No tienes órdenes registradas.</p>
      ) : (
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Orden ID</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Estado</th>
              <th className="border p-2">Acción</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">${order.totalPrice.toFixed(2)}</td>
                <td className="border p-2">
                  {order.isPaid ? 'Pagada' : 'Pendiente'}
                </td>
                <td className="border p-2">
                  <Link
                    className="text-blue-600 hover:underline"
                    to={`/orders/${order._id}`}
                  >
                    Ver Detalles
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProfilePage;
