import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, CreditCard } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-100 text-blue-700 font-bold'
        : 'hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="flex" style={{ height: 'calc(100vh - 4rem)' }}> {/* Ajustamos la altura para descontar el Navbar */}
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <LayoutDashboard className="mr-2 text-blue-600" />
            Admin
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink to="pedidos" className={navLinkClasses}>
                <ClipboardList className="mr-3" size={20} />
                Pedidos
              </NavLink>
            </li>
            <li>
              <NavLink to="pagos" className={navLinkClasses}>
                <CreditCard className="mr-3" size={20} />
                Pagos
              </NavLink>
            </li>
            <li>
              <NavLink to="productos" className={navLinkClasses}>
                <Package className="mr-3" size={20} />
                Productos
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* Aquí se renderizarán las rutas hijas */}
      </main>
    </div>
  );
};

export default AdminLayout;