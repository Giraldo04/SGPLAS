// src/components/Header.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const { cartItems } = useContext(CartContext);
  const { userInfo, logout } = useContext(AuthContext);

  // Calcular la cantidad total de items en el carrito
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="bg-white shadow py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        
      <Link to="/" className="flex items-center">
        <img src="/logoimportadora.png" alt="Logo ImportadoraSGPlas" className="w-10 h-10 mr-2" />
        <span className="text-2xl font-bold text-gray-800">ImportadoraSGPlas</span>
      </Link>

        {/* Menú de Navegación */}
        <nav className="flex items-center space-x-4">
          
          {/* Enlace a Productos */}
          <Link to="/productos" className="text-gray-600 hover:text-gray-800">
            Productos
          </Link>

          {/* Si NO está logueado, mostrar Crear Cuenta e Iniciar Sesión */}
          {!userInfo && (
            <Link to="/register" className="text-gray-600 hover:text-gray-800">
              Crear Cuenta
            </Link>
          )}

          {userInfo ? (
            <>
              {/* Si es admin, mostrar un menú de administración */}
              {userInfo.isAdmin && userInfo.isAdmin && (
                <div className="relative group">
                {/* Botón Admin */}
                <button className="text-gray-600 hover:text-gray-800 px-4 py-2">
                  Admin
                </button>
              
                {/* Menú desplegable */}
                <div className="hidden group-hover:block absolute top-full left-0 py-2 w-48 bg-white border rounded shadow-xl transition-all duration-150">
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Productos
                  </Link>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Órdenes
                  </Link>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  >
                    Usuarios
                  </Link>
                </div>
              </div>
              
              )}

              {/* Botón para cerrar sesión */}
              <button
                onClick={logout}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Si NO está logueado, mostramos el link a Iniciar Sesión
            <Link to="/login" className="text-gray-600 hover:text-gray-800">
              Iniciar Sesión
            </Link>
          )}

          {/* Carrito de Compras */}
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-800">
            Carrito
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs font-semibold rounded-full px-2 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
