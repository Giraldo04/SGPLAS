// src/pages/AdminProductCreatePage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminProductCreatePage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [countInStock, setCountInStock] = useState(0);
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('men');
  
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          countInStock: Number(countInStock),
          image,
          category, // Se envía la categoría seleccionada
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/admin/productlist');
      } else {
        alert(data.message || 'Error al crear el producto');
      }
    } catch (error) {
      console.error('Error al crear el producto:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-6">Crear Producto</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-semibold">Nombre</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded p-2 mt-1" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Descripción</label>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2 mt-1" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Precio</label>
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border rounded p-2 mt-1" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Cantidad en Stock</label>
          <input 
            type="number" 
            value={countInStock} 
            onChange={(e) => setCountInStock(e.target.value)}
            className="w-full border rounded p-2 mt-1" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">URL de la Imagen</label>
          <input 
            type="text" 
            value={image} 
            onChange={(e) => setImage(e.target.value)}
            className="w-full border rounded p-2 mt-1" 
            required 
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded p-2 mt-1"
            required
          >
            <option value="men">Hombres</option>
            <option value="women">Mujeres</option>
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear Producto
        </button>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
