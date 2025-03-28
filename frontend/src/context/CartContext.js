// src/context/CartContext.js
import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const CartContext = createContext();

// Componente proveedor del contexto
export const CartProvider = ({ children }) => {
  // Estado inicial del carrito
  const [cartItems, setCartItems] = useState([]);

  // Al montar el componente, cargamos el carrito desde localStorage (si existe)
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Cada vez que cambie el carrito, lo guardamos en localStorage
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para agregar un producto al carrito
  const addToCart = (product) => {
    console.log("Producto que llega a addToCart:", product);  
    // Verificamos si ya existe en el carrito
    const existItem = cartItems.find((item) => item._id === product._id);

    if (existItem) {
      // Si existe, aumentamos la cantidad
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      // Si no existe, lo agregamos con cantidad = 1
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Función para eliminar un producto del carrito (uno en uno)
  const removeOneFromCart = (productId) => {
    const existItem = cartItems.find((item) => item._id === productId);
    if (existItem && existItem.quantity > 1) {
      // Si la cantidad es mayor a 1, solo restamos 1
      setCartItems(
        cartItems.map((item) =>
          item._id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
      );
    } else {
      // Si la cantidad es 1 o no existe, lo removemos completamente
      setCartItems(cartItems.filter(item => item._id !== productId));
    }
  };

  // Función para remover completamente un producto del carrito
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((item) => item._id !== productId));
  };

  // Vaciar todo el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  // Valor que exponemos a los componentes
  
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeOneFromCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
