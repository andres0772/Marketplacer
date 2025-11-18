import React from 'react';
import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react';
import apiClient from '../api/client';
import type { Payment } from '../types/models';
import { useAuthStore } from '../store/authStore';

export default function Pagos() {
  const [pagos, setPagos] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchPagos = async () => {
      try {
        setPagos([]); // <-- ¡AQUÍ ESTÁ LA SOLUCIÓN! Limpiamos la lista antes de la petición.
        const data = await apiClient.getPagos();
        setPagos(data);
      } catch (error) {
        console.error('Error al cargar pagos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPagos();
  }, [isAuthenticated]);

  const getStatusIcon = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-amber-500" />;
    }
  };

  const getStatusText = (estado: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendiente',
      completed: 'Completado',
      failed: 'Fallido',
      processing: 'En Proceso',
    };
    return statusMap[estado.toLowerCase()] || estado;
  };

  const getStatusColor = (estado: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      processing: 'bg-blue-100 text-blue-800',
    };
    return colorMap[estado.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <p className="text-gray-600 mb-4">Debes iniciar sesión para ver tus pagos</p>
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
            Mis Pagos
          </h1>
          <p className="text-gray-600 text-lg">
            Historial de transacciones y pagos
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Cargando pagos...</p>
          </div>
        ) : pagos.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">No tienes pagos registrados</p>
            <a
              href="/productos"
              className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold"
            >
              Explorar Productos
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {pagos.map((pago) => (
              <div
                key={pago.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-amber-100"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {getStatusIcon(pago.estado)}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-amber-900">
                        Pago #{pago.id}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Pedido #{pago.id_pedido}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(pago.fecha_creacion).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {pago.metodo_pago && (
                        <p className="text-sm text-gray-600 mt-1">
                          Método: {pago.metodo_pago}
                        </p>
                      )}
                      {pago.fecha_pago && (
                        <p className="text-sm text-gray-600">
                          Completado:{' '}
                          {new Date(pago.fecha_pago).toLocaleDateString('es-ES')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        pago.estado
                      )}`}
                    >
                      {getStatusText(pago.estado)}
                    </span>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">
                        ${pago.monto.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600 text-right">
                        {pago.moneda}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
