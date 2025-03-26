// src/pages/CheckoutPage.js
import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);

  // Estado para la configuración de entrega
  const [deliverySettings, setDeliverySettings] = useState(null);
  // Método de envío: 'pickup' o 'delivery'
  const [shippingMethod, setShippingMethod] = useState('pickup');

  // Estado para los campos de la dirección completa
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    houseNumber: '',
    apartment: '',
    commune: '',
    region: '',
  });

  const [error, setError] = useState('');

  // Calcular subtotal sin envío
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  // Cargar configuración de entrega desde el backend
  useEffect(() => {
    const fetchDeliverySettings = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/delivery-settings');
        const data = await res.json();
        setDeliverySettings(data);
      } catch (err) {
        console.error('Error al cargar configuración de entrega:', err);
      }
    };
    fetchDeliverySettings();
  }, []);

  // Costo de envío (si se elige 'delivery')
  const shippingCost =
    shippingMethod === 'delivery' && deliverySettings
      ? Number(deliverySettings.shippingPrice ?? 0)
      : 0;

  // Total con envío incluido
  const totalPrice = subtotal + shippingCost;

  // Función para crear la orden y luego iniciar el pago
  const handleOrder = async () => {
    if (!userInfo) {
      alert('Debes iniciar sesión para continuar');
      return;
    }

    // Construir items de la orden
    const orderItems = cartItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id,
    }));

    // Si se elige 'delivery', usamos los campos del objeto shippingAddress
    // Si se elige 'pickup', usamos la dirección de retiro de deliverySettings
    const finalShippingAddress =
      shippingMethod === 'delivery'
        ? {
            street: shippingAddress.street,
            houseNumber: shippingAddress.houseNumber,
            apartment: shippingAddress.apartment,
            commune: shippingAddress.commune,
            region: shippingAddress.region,
          }
        : {
            street: deliverySettings?.localPickupAddress,
          };

    try {
      const resOrder = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderItems,
          shippingMethod,
          shippingAddress: {
            street: shippingAddress.street,
            houseNumber: shippingAddress.houseNumber,
            apartment: shippingAddress.apartment,
            commune: shippingAddress.commune,
            region: shippingAddress.region,
          },
          paymentMethod: 'Transbank',
          totalPrice,
          
        }),
      });
      const orderData = await resOrder.json();

      if (resOrder.ok) {
        clearCart();
        await handlePayment(orderData);
      } else {
        alert(orderData.message || 'Error al crear la orden');
      }
    } catch (err) {
      console.error('Error al crear la orden:', err);
      setError('Error al crear la orden');
    }
  };

  // Función para iniciar el pago con Transbank
  const handlePayment = async (order) => {
    try {
      const resPayment = await fetch('http://localhost:5001/api/payments/transbank/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify({
          orderId: order._id,
          amount: order.totalPrice,
        }),
      });
      const paymentData = await resPayment.json();

      if (resPayment.ok) {
        window.location.href = paymentData.url;
      } else {
        alert(paymentData.message || 'Error al iniciar el pago');
      }
    } catch (err) {
      console.error('Error al iniciar el pago:', err);
      setError('Error al iniciar el pago');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Columna Izquierda: Datos de envío o retiro */}
        <div className="md:w-2/3 bg-white p-4 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">Opciones de Entrega</h3>

          {/* Selección de método de entrega */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Método de entrega:</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="pickup"
                  checked={shippingMethod === 'pickup'}
                  onChange={() => setShippingMethod('pickup')}
                />
                <span>Retiro en Local</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="shippingMethod"
                  value="delivery"
                  checked={shippingMethod === 'delivery'}
                  onChange={() => setShippingMethod('delivery')}
                />
                <span>Envío a Domicilio</span>
              </label>
            </div>
          </div>

          {/* Si se elige envío, mostrar campos de dirección */}
          {shippingMethod === 'delivery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Calle</label>
                <input
                  type="text"
                  value={shippingAddress.street}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, street: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: Av. Siempre Viva"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Nº Casa</label>
                <input
                  type="text"
                  value={shippingAddress.houseNumber}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, houseNumber: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: 123"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Depto (opcional)</label>
                <input
                  type="text"
                  value={shippingAddress.apartment}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, apartment: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: 2B"
                />
              </div>
              <div>
                <label className="block font-semibold">Comuna</label>
                <input
                  type="text"
                  value={shippingAddress.commune}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, commune: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: Santiago"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold">Región</label>
                <input
                  type="text"
                  value={shippingAddress.region}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, region: e.target.value })
                  }
                  className="w-full border rounded p-2 mt-1"
                  placeholder="Ej: Región Metropolitana"
                  required
                />
              </div>
            </div>
          )}

          {/* Si se elige retiro, mostrar dirección de retiro */}
          {shippingMethod === 'pickup' && deliverySettings && (
            <div className="mt-4">
              <p className="font-semibold">Dirección de Retiro:</p>
              <p>{deliverySettings.localPickupAddress}</p>
            </div>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {/* Columna Derecha: Resumen de la orden */}
        <div className="md:w-1/3 bg-white p-4 rounded shadow flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-4">Resumen de la Orden</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {shippingMethod === 'delivery' && deliverySettings && (
                <div className="flex justify-between">
                  <span>Costo de Envío</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleOrder}
            className="mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Confirmar Orden y Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
