// src/pages/CartPage.js
import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, addToCart, removeOneFromCart, removeFromCart, clearCart } = useContext(CartContext);

  // Calcular el total
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link to="/productos" className="text-blue-600 hover:underline">
          ¡Ir a comprar!
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Carrito de Compras</h2>
      <div className="flex flex-col space-y-4">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex flex-col md:flex-row items-center justify-between border-b pb-4"
          >
            <div className="flex items-center space-x-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover"
              />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">${item.price}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 mt-2 md:mt-0">
              <button
                onClick={() => removeOneFromCart(item._id)}
                className="px-2 py-1 bg-red-100 text-red-700 rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => addToCart(item)}
                className="px-2 py-1 bg-green-100 text-green-700 rounded"
              >
                +
              </button>
              <button
                onClick={() => removeFromCart(item._id)}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-right mt-6">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <button
          onClick={clearCart}
          className="mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Vaciar Carrito
        </button>
        {/* BOTÓN PARA IR AL CHECKOUT */}
        <Link
          to="/checkout"
          className="inline-block mt-2 ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Finalizar Compra
        </Link>
      </div>
    </div>
  );
};

export default CartPage;
