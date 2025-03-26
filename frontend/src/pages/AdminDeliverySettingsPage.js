// src/pages/AdminDeliverySettingsPage.js
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDeliverySettingsPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [settings, setSettings] = useState(null);
  const [shippingPrice, setShippingPrice] = useState('');
  const [localPickupAddress, setLocalPickupAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/delivery-settings', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        setSettings(data);
        setShippingPrice(data.shippingPrice);
        setLocalPickupAddress(data.localPickupAddress);
      } catch (err) {
        console.error(err);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchSettings();
    }
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5001/api/delivery-settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({ shippingPrice, localPickupAddress }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/admin/dashboard'); // o donde prefieras redirigir
      } else {
        setError(data.message || 'Error al actualizar la configuración');
      }
    } catch (err) {
      console.error(err);
      setError('Error al actualizar la configuración');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Configuración de Envío y Retiro</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Costo de Envío</label>
          <input
            type="number"
            value={shippingPrice}
            onChange={(e) => setShippingPrice(Number(e.target.value))}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Dirección de Retiro en Local</label>
          <input
            type="text"
            value={localPickupAddress}
            onChange={(e) => setLocalPickupAddress(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar Configuración
        </button>
      </form>
    </div>
  );
};

export default AdminDeliverySettingsPage;
