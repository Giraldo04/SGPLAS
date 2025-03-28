// src/pages/ProfilePage.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { userInfo, login } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  
  // Usamos un arreglo para las direcciones de envío
  const [shippingAddresses, setShippingAddresses] = useState([]);
  
  // Estado para agregar una nueva dirección
  const [newAddress, setNewAddress] = useState({
    street: '',
    houseNumber: '',
    apartment: '',
    commune: '',
    region: '',
    default: false,
  });

  const [message, setMessage] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);

  // Al montar el componente, si userInfo tiene shippingAddresses, se cargan en el estado
  useEffect(() => {
    if (userInfo && userInfo.shippingAddresses) {
      setShippingAddresses(userInfo.shippingAddresses);
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
          // Aseguramos que data sea un array
          setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
          console.error('Error al obtener las órdenes:', error);
        }
      }
    };
    fetchOrders();
  }, [userInfo]);

  // Función para actualizar el perfil del usuario (con shippingAddresses)
  const handleProfileUpdate = async (e) => {
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
          shippingAddresses, // Enviamos el arreglo completo de direcciones
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage('Perfil actualizado correctamente');
        // Actualizamos el contexto con los nuevos datos del usuario
        login(data);
      } else {
        setMessage(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setMessage('Error al actualizar el perfil');
    }
    setLoadingUpdate(false);
  };

  // Función para agregar una nueva dirección al arreglo
  const handleAddAddress = (e) => {
    e.preventDefault();
    const updatedAddresses = [...shippingAddresses, newAddress];
    setShippingAddresses(updatedAddresses);
    // Reiniciamos el formulario de nueva dirección
    setNewAddress({
      street: '',
      houseNumber: '',
      apartment: '',
      commune: '',
      region: '',
      default: false,
    });
  };

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

      {/* Sección de Direcciones de Envío */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Direcciones de Envío</h3>
        {shippingAddresses.length === 0 ? (
          <p>No tienes direcciones guardadas.</p>
        ) : (
          <ul className="list-disc pl-5">
            {shippingAddresses.map((addr, index) => (
              <li key={index}>
                {addr.street}, Nº {addr.houseNumber}
                {addr.apartment && `, Depto: ${addr.apartment}`}, {addr.commune}, {addr.region}
                {addr.default && <span className="text-green-600 ml-2">(Predeterminada)</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Formulario para Agregar Nueva Dirección */}
      <div className="max-w-md mx-auto p-4 bg-white rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Agregar Nueva Dirección</h3>
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div>
            <label className="block font-semibold">Calle</label>
            <input
              type="text"
              value={newAddress.street}
              onChange={(e) =>
                setNewAddress({ ...newAddress, street: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Número de Casa</label>
            <input
              type="text"
              value={newAddress.houseNumber}
              onChange={(e) =>
                setNewAddress({ ...newAddress, houseNumber: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Departamento (opcional)</label>
            <input
              type="text"
              value={newAddress.apartment}
              onChange={(e) =>
                setNewAddress({ ...newAddress, apartment: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
            />
          </div>
          <div>
            <label className="block font-semibold">Comuna</label>
            <input
              type="text"
              value={newAddress.commune}
              onChange={(e) =>
                setNewAddress({ ...newAddress, commune: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <div>
            <label className="block font-semibold">Región</label>
            <input
              type="text"
              value={newAddress.region}
              onChange={(e) =>
                setNewAddress({ ...newAddress, region: e.target.value })
              }
              className="w-full border rounded p-2 mt-1"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Agregar Dirección
          </button>
        </form>
      </div>

      {/* Botón para actualizar perfil con las direcciones nuevas */}
      <button
        onClick={handleProfileUpdate}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-6"
        disabled={loadingUpdate}
      >
        {loadingUpdate ? 'Actualizando...' : 'Guardar Cambios en Perfil'}
      </button>

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
