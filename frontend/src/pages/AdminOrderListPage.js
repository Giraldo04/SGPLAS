// src/pages/AdminOrderListPage.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminOrderListPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/orders', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        setOrders(data);
      } catch (error) {
        console.error('Error al cargar las órdenes:', error);
      }
    };

    fetchOrders();
  }, [userInfo]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Panel de Administración - Órdenes</h2>
      {orders.length === 0 ? (
        <p>No hay órdenes registradas.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Orden ID</th>
              <th className="border p-2">Usuario</th>
              <th className="border p-2">Fecha</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Pagado</th>
              <th className="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">{order.user ? order.user.name : 'N/A'}</td>
                <td className="border p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="border p-2">${order.totalPrice.toFixed(2)}</td>
                <td className="border p-2">{order.isPaid ? 'Sí' : 'No'}</td>
                <td className="border p-2">
                  <Link
                    to={`/admin/order/${order._id}`}
                    className="text-blue-600 hover:underline"
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

export default AdminOrderListPage;
