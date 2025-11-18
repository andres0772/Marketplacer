import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  return (
    <nav className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-amber-900 hidden sm:block">
              Marketplacer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/productos"
              className="text-amber-900 hover:text-orange-600 transition-colors font-medium"
            >
              Productos
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/pedidos"
                  className="text-amber-900 hover:text-orange-600 transition-colors font-medium"
                >
                  Mis Pedidos
                </Link>
                <Link
                  to="/pagos"
                  className="text-amber-900 hover:text-orange-600 transition-colors font-medium"
                >
                  Pagos
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link
              to="/carrito"
              className="relative p-2 text-amber-900 hover:text-orange-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/admin"
                  className="flex items-center space-x-2 text-amber-900 hover:text-orange-600 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">{user?.username}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 text-amber-900 hover:text-orange-600 transition-colors"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="hidden md:block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Iniciar Sesión
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-amber-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-amber-200">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/productos"
              className="block text-amber-900 hover:text-orange-600 transition-colors font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Productos
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/pedidos"
                  className="block text-amber-900 hover:text-orange-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Pedidos
                </Link>
                <Link
                  to="/pagos"
                  className="block text-amber-900 hover:text-orange-600 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pagos
                </Link>
                <div className="pt-3 border-t border-amber-200 flex items-center justify-between">
                  <Link
                    to="/admin"
                    className="text-amber-900 font-medium hover:text-orange-600"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user?.username}
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-orange-600 hover:text-orange-700"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
            {!isAuthenticated && (
              <Link
                to="/auth"
                className="block px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg text-center font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
