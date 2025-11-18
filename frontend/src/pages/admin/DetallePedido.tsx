import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Package, User, Calendar, DollarSign, Info } from 'lucide-react';

// Interfaces basadas en los modelos del backend
interface OrderItem {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  nombre_producto?: string; // Añadimos el nuevo campo opcional
  // Nota: El backend no envía el nombre del producto, solo su ID.
  // Para una futura mejora, el backend podría incluir el nombre del producto aquí.
}

interface PedidoDetallado {
  id: number;
  id_usuario: number;
  monto_total: number;
  fecha_creacion: string;
  estado: string;
  items: OrderItem[];
}

export default function DetallePedido() {
  const { id } = useParams<{ id: string }>();
  const [pedido, setPedido] = useState<PedidoDetallado | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedido = async () => {
      try {
        setLoading(true);
        const response = await axios.get<PedidoDetallado>(`http://localhost:8000/api/v1/pedidos/${id}`);
        setPedido(response.data);
        setError(null);
      } catch (err) {
        setError('No se pudo cargar el detalle del pedido.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedido();
  }, [id]);

  if (loading) return <p>Cargando detalles del pedido...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!pedido) return <p>No se encontró el pedido.</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <Link to="/admin/pedidos" className="flex items-center text-blue-600 hover:underline mb-4">
        <ArrowLeft size={18} className="mr-2" />
        Volver a la lista de pedidos
      </Link>

      <h2 className="text-3xl font-bold text-gray-800 mb-6">Detalle del Pedido #{pedido.id}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Información General</h3>
          <p className="flex items-center"><User size={16} className="mr-2" /> <strong>ID Usuario:</strong> {pedido.id_usuario}</p>
          <p className="flex items-center"><Calendar size={16} className="mr-2" /> <strong>Fecha:</strong> {new Date(pedido.fecha_creacion).toLocaleString()}</p>
          <p className="flex items-center"><DollarSign size={16} className="mr-2" /> <strong>Monto Total:</strong> ${pedido.monto_total.toLocaleString()}</p>
          <p className="flex items-center"><Info size={16} className="mr-2" /> <strong>Estado:</strong> <span className="font-semibold capitalize">{pedido.estado}</span></p>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-lg mb-2 flex items-center"><Package size={18} className="mr-2" />Productos en el Pedido</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Producto</th>
                <th className="py-2 px-4 text-left">Cantidad</th>
                <th className="py-2 px-4 text-right">Precio Unitario</th>
                <th className="py-2 px-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {pedido.items.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4 font-medium">
                    {item.nombre_producto || `ID: #${item.id_producto}`}
                  </td>
                  <td className="py-2 px-4">{item.cantidad}</td>
                  <td className="py-2 px-4 text-right">${item.precio_unitario.toLocaleString()}</td>
                  <td className="py-2 px-4 text-right font-semibold">${(item.cantidad * item.precio_unitario).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}