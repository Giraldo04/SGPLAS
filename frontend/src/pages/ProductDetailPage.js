// src/pages/ProductDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams(); // obtiene el :id de la ruta
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5001/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Error al obtener el producto');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="container mx-auto p-4">Cargando producto...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  if (!product) return <div className="container mx-auto p-4">Producto no encontrado</div>;

  // Opcional: manejar descuentos
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sección de imágenes (Izquierda) */}
        <div className="w-full md:w-1/2">
          {/* Imagen principal */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-96 object-cover rounded"
          />
          {/* Si deseas una galería de imágenes, puedes mapear product.images (si existe) */}
        </div>

        {/* Sección de detalles (Derecha) */}
        <div className="w-full md:w-1/2 flex flex-col">
          {/* Nombre del producto */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Precio y descuento */}
          <div className="flex items-center space-x-3 mb-4">
            {hasDiscount ? (
              <>
                <span className="text-xl font-semibold text-red-600">
                  ${product.price}
                </span>
                <span className="line-through text-gray-400">
                  ${product.originalPrice}
                </span>
                {/* Ejemplo de porcentaje de descuento */}
                <span className="text-sm text-green-600">
                  -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                </span>
              </>
            ) : (
              <span className="text-xl font-semibold">
                ${product.price}
              </span>
            )}
          </div>

          {/* Botón para comprar o agregar al carrito */}
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">
            Agregar al Carrito
          </button>

          {/* Descripción breve */}
          <p className="text-gray-700 leading-relaxed">
            {product.description}
          </p>

          {/* Opcional: Detalles adicionales, reseñas, etc. */}
        </div>
      </div>

      {/* Sección inferior con más información, tabs, etc. si lo deseas */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">Detalle del producto</h2>
        <p className="text-gray-700 leading-relaxed">
          Aquí podrías poner más detalles técnicos, tabla de tallas, etc.
        </p>
      </div>
    </div>
  );
};

export default ProductDetailPage;
