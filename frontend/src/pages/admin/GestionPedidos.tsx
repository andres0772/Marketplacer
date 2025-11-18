import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface Pedido {
  id: number;
  id_usuario: number;
  monto_total: number;
  fecha_creacion: string;
  estado: 'pending' | 'completed' | 'cancelled' | string; // Usamos los valores reales del backend
}

const getStatusBadge = (status: Pedido['estado']) => {
  switch (status) {
    case 'completed':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Completado</span>;
    case 'pending':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pendiente</span>;
    case 'cancelled':
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Cancelado</span>;
    default:
      return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Desconocido</span>;
  }
};

export default function GestionPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        // Asumimos que este es el endpoint para obtener todos los pedidos
        const response = await axios.get<Pedido[]>('http://localhost:8000/api/v1/pedidos/');
        setPedidos(response.data);
        setError(null);
      } catch (err) {
        setError('No se pudieron cargar los pedidos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleCancelPedido = async (pedidoId: number) => {
    if (window.confirm(`¿Estás seguro de que quieres cancelar el pedido #${pedidoId}? Esta acción no se puede deshacer.`)) {
      try {
        await axios.put(`http://localhost:8000/api/v1/pedidos/${pedidoId}`, {
          estado: 'cancelled',
        });
        // Actualizamos la lista para reflejar el cambio de estado
        setPedidos(pedidos.map(p => p.id === pedidoId ? { ...p, estado: 'cancelled' } : p));
      } catch (err) {
        alert('Error al cancelar el pedido.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Cargando pedidos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestionar Pedidos</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID Pedido</th>
              <th className="py-2 px-4 text-left">ID Usuario</th>
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Total</th>
              <th className="py-2 px-4 text-left">Estado</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4 font-medium">#{pedido.id}</td>
                <td className="py-2 px-4">{pedido.id_usuario}</td>
                <td className="py-2 px-4">{pedido.fecha_creacion ? new Date(pedido.fecha_creacion).toLocaleDateString() : 'N/A'}</td>
                <td className="py-2 px-4">${(pedido.monto_total ?? 0).toLocaleString()}</td>
                <td className="py-2 px-4">{getStatusBadge(pedido.estado)}</td>
                <td className="py-2 px-4 text-center">
                  <div className="flex justify-center gap-4">
                    <Link to={`/admin/pedidos/${pedido.id}`} className="text-blue-600 hover:underline font-medium">
                      Ver
                    </Link>
                    {pedido.estado === 'pending' && (
                      <button onClick={() => handleCancelPedido(pedido.id)} className="text-red-600 hover:underline font-medium">
                        Cancelar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}