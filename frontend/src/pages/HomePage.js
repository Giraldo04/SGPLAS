// src/pages/HomePage.js
import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const HomePage = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div>
      <Slider {...settings}>
        <div>
          <img src="/logo.jpeg" alt="Banner 1" className="w-full h-64 object-cover" />
        </div>
        <div>
          <img src="/logo.jpg" alt="Banner 2" className="w-full h-64 object-cover" />
        </div>
        {/* Agrega más banners si lo deseas */}
      </Slider>
      <div className="text-center mt-6">
        <h1 className="text-4xl font-bold">Bienvenido a ImportadoraSGPlas</h1>
        <p className="text-gray-600 mt-2">Descubre los mejores productos.</p>
        <div className="flex justify-center mt-4 space-x-4">
          <Link to="/productos" className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700">
            Ver Productos
          </Link>
          <Link to="/register" className="bg-secondary text-white px-6 py-2 rounded hover:bg-green-700">
            Crear Cuenta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
