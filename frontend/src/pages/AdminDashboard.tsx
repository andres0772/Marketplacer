import React, { useState } from 'react';
// Importa los componentes de administración
import GestionProductos from './admin/GestionProductos.tsx';
import GestionPedidos from './admin/GestionPedidos.tsx';
// Componentes placeholder para las otras secciones
import GestionPagos from './admin/GestionPagos.tsx';

type Tab = 'productos' | 'pedidos' | 'pagos';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('productos');

  const renderContent = () => {
    switch (activeTab) {
      case 'productos':
        return <GestionProductos />;
      case 'pedidos':
        return <GestionPedidos />;
      case 'pagos':
        return <GestionPagos />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Panel de Administración</h1>
      
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('productos')}
            className={`${activeTab === 'productos' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Productos
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`${activeTab === 'pedidos' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pedidos
          </button>
          <button
            onClick={() => setActiveTab('pagos')}
            className={`${activeTab === 'pagos' ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pagos
          </button>
        </nav>
      </div>

      <div>{renderContent()}</div>
    </div>
  );
}