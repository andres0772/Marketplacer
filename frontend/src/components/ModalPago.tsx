import React from 'react';
import { X } from 'lucide-react';

interface ModalPagoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (metodo: string) => void;
  pedidoId: number | null;
}

const metodosDePago = [
  { id: 'paypal', nombre: 'PayPal' },
  { id: 'nequi', nombre: 'Nequi' },
  { id: 'credit_card', nombre: 'Tarjeta de Crédito' },
  { id: 'simulado', nombre: 'Simulación Manual' },
];

const ModalPago: React.FC<ModalPagoProps> = ({ isOpen, onClose, onConfirm, pedidoId }) => {
  if (!isOpen) return null;

  const [metodoSeleccionado, setMetodoSeleccionado] = React.useState(metodosDePago[0].id);

  const handleConfirm = () => {
    onConfirm(metodoSeleccionado);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Procesar Pago del Pedido #{pedidoId}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6">
          <label htmlFor="metodo-pago" className="block text-sm font-medium text-gray-700 mb-2">
            Seleccione el método de pago:
          </label>
          <select
            id="metodo-pago"
            value={metodoSeleccionado}
            onChange={(e) => setMetodoSeleccionado(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {metodosDePago.map((metodo) => (
              <option key={metodo.id} value={metodo.id}>
                {metodo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Confirmar Pago
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPago;