// src/pages/ProductosPage.js
import React, { useEffect, useState, useContext} from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';


const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al cargar productos', error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Productos</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.map((producto) => (
          <div
            key={producto._id}
            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col"
          >
            
            <Link to={`/productos/${producto._id}`}>
            <img
              src={producto.image}
              alt={producto.name}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="mt-4 text-xl font-semibold">{producto.name}</h3>
            </Link>
            <p className="text-gray-600 mb-2">${producto.price}</p>
            <button
              onClick={() => addToCart(producto)}
              className="mt-auto bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Agregar al Carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPage;
