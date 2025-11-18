import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart as CartIcon } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';
import apiClient from '../api/client';

export default function Carrito() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (items.length === 0) return;

    setLoading(true);
    try {
      // Verificación de seguridad: Asegurarnos de que tenemos un ID de usuario.
      if (!user?.id) {
        throw new Error("No se pudo obtener el ID del usuario. Por favor, inicie sesión de nuevo.");
      }

      // Create order
      const orderData = {
        id_usuario: user?.id, // <-- ¡CORRECCIÓN! Usamos el ID del usuario autenticado
        items: items.map((item) => ({ 
          id_producto: item.id,
          cantidad: item.cantidad,
        })),
      };

      await apiClient.createPedido(orderData);

      clearCart();
      navigate('/pedidos');
    } catch (error) {
      console.error('Error al procesar pedido:', error);
      alert('Error al procesar el pedido. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md">
          <CartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Tu carrito está vacío
          </h2>
          <p className="text-gray-600 mb-6">
            ¡Explora nuestros productos artesanales y encuentra algo único!
          </p>
          <Link
            to="/productos"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
          >
            Explorar Productos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Carrito de Compras
          </h1>
          <p className="text-gray-600 text-lg">
            Revisa tus productos antes de finalizar
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md p-6 border border-amber-100"
              >
                <div className="flex gap-4">
                  <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.nombre}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full opacity-30" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h3 className="text-lg font-bold text-amber-900">
                        {item.nombre}
                      </h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Eliminar"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-sm text-gray-600 mb-3">
                      {item.descripcion}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 bg-amber-50 rounded-lg px-2 py-1">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, Math.max(1, item.cantidad - 1))
                          }
                          className="p-1 hover:bg-amber-100 rounded"
                        >
                          <Minus className="w-4 h-4 text-amber-900" />
                        </button>
                        <span className="font-bold text-amber-900 w-8 text-center">
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          className="p-1 hover:bg-amber-100 rounded"
                        >
                          <Plus className="w-4 h-4 text-amber-900" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          ${item.precio.toLocaleString()} c/u
                        </p>
                        <p className="text-xl font-bold text-orange-600">
                          ${(item.precio * item.cantidad).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100 sticky top-24">
              <h2 className="text-2xl font-bold text-amber-900 mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">${totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span className="font-medium">Gratis</span>
                </div>
                <div className="border-t border-amber-200 pt-3 flex justify-between text-lg font-bold">
                  <span className="text-amber-900">Total:</span>
                  <span className="text-orange-600">
                    ${totalPrice.toLocaleString()} COP
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Procesando...' : 'Finalizar Compra'}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-gray-600 text-center mt-4">
                  Debes <Link to="/auth" className="text-orange-600 font-medium">iniciar sesión</Link> para completar la compra
                </p>
              )}

              <button
                onClick={clearCart}
                className="w-full mt-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
