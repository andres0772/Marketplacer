import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Productos from './pages/Productos';
import ProductoDetalle from './pages/ProductoDetalle.tsx'; // Asumiendo que tienes este componente
import Auth from './pages/Auth';
import Pedidos from './pages/Pedidos';
import Pagos from './pages/Pagos';
import Carrito from './pages/Carrito';
import AdminLayout from './pages/admin/AdminLayout.tsx';
import GestionProductos from './pages/admin/GestionProductos.tsx';
import GestionPedidos from './pages/admin/GestionPedidos.tsx';
import DetallePedido from './pages/admin/DetallePedido.tsx';
import GestionPagos from './pages/admin/GestionPagos.tsx';

// Componente para aplicar la animación a las páginas
const PageLayout = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.25 }}
  >
    <Outlet />
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/productos/:id" element={<ProductoDetalle />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/carrito" element={<Carrito />} />
        </Route>

        {/* Las rutas de Admin no necesitan la misma animación de página completa */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="pedidos" replace />} />
          <Route path="pedidos" element={<GestionPedidos />} />
          <Route path="pedidos/:id" element={<DetallePedido />} />
          <Route path="productos" element={<GestionProductos />} />
          <Route path="pagos" element={<GestionPagos />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}
