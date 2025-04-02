// src/pages/MenProductsPage.js
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';


const MenProductsPage = () => {
  const [productos, setProductos] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products?category=men');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos para hombres', error);
      }
    };
    fetchProductos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold mb-6">Calzado para Hombres</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="product-card border p-4 rounded shadow hover:shadow-lg transition"
          >
            <Link to={`/productos/${producto._id}`}>
              <img
                src={producto.image}
                alt={producto.name}
                className="w-full h-60 object-cover rounded"
              />
              <h3 className="mt-4 font-semibold text-lg">{producto.name}</h3>
            </Link>
            <p className="text-gray-600 mb-2">${producto.price}</p>
            <button
              onClick={() => addToCart(producto)}
              className="mt-auto w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenProductsPage;
