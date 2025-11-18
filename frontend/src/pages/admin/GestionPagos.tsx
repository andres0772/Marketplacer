import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard } from 'lucide-react';
import ModalPago from '../../components/ModalPago'; // Importamos el nuevo modal

// Usaremos la misma interfaz de Pedido, ya que un pago está ligado a un pedido
interface Pago {
  id: number;
  id_pedido: number;
  monto: number;
  fecha_creacion: string;
  estado: 'pending' | 'completed' | 'cancelled' | string;
}

export default function GestionPagos() {
  const [pagosPendientes, setPagosPendientes] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Estados para controlar el modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagoSeleccionado, setPagoSeleccionado] = useState<Pago | null>(null);

  const fetchPedidosPendientes = async () => {
    try {
      setLoading(true);
      // Hacemos una petición para obtener solo los pedidos con estado 'PENDIENTE'
      const response = await axios.get<Pago[]>('http://localhost:8000/api/v1/pagos/?estado=pending');
      setPagosPendientes(response.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los pagos pendientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidosPendientes();
  }, []);

  const handleOpenModal = (pago: Pago) => {
    setPagoSeleccionado(pago);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPagoSeleccionado(null);
  };

  const handleConfirmarPago = async (metodo: string) => {
    if (!pagoSeleccionado) return;

    try {
      const pagoData = {
        monto: pagoSeleccionado.monto,
        metodo_pago: metodo,
      };
      await axios.put(`http://localhost:8000/api/v1/pagos/${pagoSeleccionado.id}`, pagoData);
      handleCloseModal();
      fetchPedidosPendientes(); // Refrescar la lista
    } catch (err) {
      alert('Error al procesar el pago.');
      console.error(err);
    }
  };

  if (loading) return <p>Cargando pagos pendientes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Pagos Pendientes</h2>
        {pagosPendientes.length === 0 && !loading ? (
          <p>No hay pagos pendientes en este momento.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">ID Pedido Asociado</th>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-left">Total</th>
                  <th className="py-2 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pagosPendientes.map((pago) => (
                  <tr key={pago.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 font-medium">#{pago.id_pedido}</td>
                    <td className="py-2 px-4">{pago.fecha_creacion ? new Date(pago.fecha_creacion).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-2 px-4">${(pago.monto ?? 0).toLocaleString()}</td>
                    <td className="py-2 px-4 text-center">
                      <button onClick={() => handleOpenModal(pago)} className="flex items-center justify-center gap-2 w-full px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors">
                        <CreditCard size={16} />
                        Procesar Pago
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ModalPago
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmarPago}
        pedidoId={pagoSeleccionado?.id_pedido ?? null}
      />
    </>
  );
}