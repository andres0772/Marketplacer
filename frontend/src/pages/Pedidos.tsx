import React from 'react';
import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';
import apiClient from '../api/client';
import type { Order } from '../types/models';
import { useAuthStore } from '../store/authStore';

export default function Pedidos() {
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPedidos = async () => {
      try {
        const data = await apiClient.getPedidos();
        setPedidos(data);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [isAuthenticated]);

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-amber-500" />;
    }
  };

  const getStatusText = (estado: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente',
      processing: 'En Proceso',
      completed: 'Completado',
      cancelled: 'Cancelado',
    };
    return statusMap[estado.toLowerCase()] || estado;
  };

  const getStatusColor = (estado: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colorMap[estado.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus pedidos</p>
          <a
            href="/auth"
            className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold"
          >
            Iniciar Sesión
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Mis Pedidos
          </h1>
          <p className="text-gray-600 text-lg">
            Revisa el estado de tus pedidos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Cargando pedidos...</p>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No tienes pedidos aún</p>
            <a
              href="/productos"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold"
            >
              Explorar Productos
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div
                key={pedido.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-amber-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(pedido.estado)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-900">
                        Pedido #{pedido.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(pedido.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {pedido.items.length} producto{pedido.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        pedido.estado
                      )}`}
                    >
                      {getStatusText(pedido.estado)}
                    </span>
                    <p className="text-2xl font-bold text-orange-600">
                      ${pedido.monto_total.toLocaleString()}
                    </p>
                  </div>
                </div>

                {pedido.items.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-amber-100">
                    <p className="text-sm font-medium text-gray-700 mb-2">Artículos:</p>
                    <div className="space-y-1">
                      {pedido.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm text-gray-600"
                        >
                          <span>Producto ID: {item.id_producto}</span>
                          <span>
                            {item.cantidad}x ${item.precio_unitario.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
