// src/pages/ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext'; // Si deseas usar algo adicional del carrito
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userInfo, login } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  
  // Dirección de envío en el perfil del usuario
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    houseNumber: '',
    apartment: '',
    commune: '',
    region: '',
  });

  const [message, setMessage] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Al montar el componente, si userInfo tiene shippingAddress, se carga al estado
  useEffect(() => {
    if (userInfo && userInfo.shippingAddress) {
      setShippingAddress(userInfo.shippingAddress);
    }
  }, [userInfo]);

  // Obtener historial de órdenes del usuario
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
          
          // Asegúrate de manejar el caso donde data no sea un array
          if (Array.isArray(data)) {
            setOrders(data);
          } else {
            setOrders([]); // o maneja el error según necesites
          }
        } catch (error) {
          console.error('Error al obtener las órdenes:', error);
        }
      }
    };
    fetchOrders();
  }, [userInfo]);

  // Función para actualizar la dirección de envío en el perfil
  const handleAddressUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:5001/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          shippingAddress, // Se envía la dirección actualizada
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Dirección actualizada con éxito');
        // Actualiza el contexto (AuthContext) con los nuevos datos del usuario
        login(data);
      } else {
        setMessage(data.message || 'Error al actualizar la dirección');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage('Error al actualizar la dirección');
    }
    setLoadingUpdate(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Información Básica del Usuario */}
      <h2 className="text-2xl font-bold mb-4">Perfil de Usuario</h2>
      <div className="mb-6">
        <p>
          <span className="font-semibold">Nombre:</span> {userInfo?.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {userInfo?.email}
        </p>
      </div>

      {/* Formulario para Dirección de Envío */}
      <div className="max-w-md mx-auto p-4 bg-white rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Dirección de Envío</h3>
        <form onSubmit={handleAddressUpdate} className="space-y-4">
          <div>
            <label className="block font-semibold">Calle</label>
            <input
              type="text"
              value={shippingAddress.street}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, street: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Número de Casa</label>
            <input
              type="text"
              value={shippingAddress.houseNumber}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, houseNumber: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Departamento (opcional)</label>
            <input
              type="text"
              value={shippingAddress.apartment}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, apartment: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Comuna</label>
            <input
              type="text"
              value={shippingAddress.commune}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, commune: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Región</label>
            <input
              type="text"
              value={shippingAddress.region}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, region: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loadingUpdate}
          >
            {loadingUpdate ? 'Actualizando...' : 'Actualizar Dirección'}
          </button>

          {message && <p className="mt-2 text-green-600">{message}</p>}
        </form>
      </div>

      {/* Historial de Órdenes */}
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
