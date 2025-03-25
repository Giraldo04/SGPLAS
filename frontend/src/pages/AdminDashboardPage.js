// src/pages/AdminDashboardPage.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const { userInfo } = useContext(AuthContext);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/admin/summary', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setSummary(data);
        } else {
          setError(data.message || 'Error al cargar el resumen');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (userInfo && userInfo.isAdmin) {
      fetchSummary();
    }
  }, [userInfo]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard Administrativo</h2>
      {loading ? (
        <p>Cargando resumen...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-xl font-semibold">Usuarios</h3>
            <p className="text-3xl">{summary.usersCount}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-xl font-semibold">Productos</h3>
            <p className="text-3xl">{summary.productsCount}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-xl font-semibold">Órdenes</h3>
            <p className="text-3xl">{summary.ordersCount}</p>
          </div>
          <div className="p-4 bg-white shadow rounded">
            <h3 className="text-xl font-semibold">Ingresos Totales</h3>
            <p className="text-3xl">${summary.totalRevenue.toFixed(2)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
