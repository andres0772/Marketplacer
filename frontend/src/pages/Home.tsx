import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Sparkles, Heart, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductoModal from '../components/ProductoModal'; // <-- 1. Importar el modal
import type { Producto } from '../types/models';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null); // <-- 2. Añadir estado para el modal

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const productos = await apiClient.getProductos();
        setFeaturedProducts(productos.slice(0, 6));
      } catch (error) {
        console.error('Error al cargar productos destacados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 backdrop-blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow-md">
              <Sparkles className="w-5 h-5 text-orange-600" />
              <span className="text-amber-900 font-medium">Productos Artesanales Locales</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-amber-900 leading-tight">
              Descubre el Arte
              <br />
              <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Hecho a Mano
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Conectamos artesanos locales con quienes valoran la calidad y autenticidad de productos únicos
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/productos"
                className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
              >
                Explorar Productos
              </Link>
              <Link
                to="/auth"
                className="px-8 py-4 bg-white text-amber-900 rounded-xl font-bold text-lg hover:shadow-lg hover:scale-105 transition-all border-2 border-amber-200"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Productos Únicos</h3>
              <p className="text-gray-600">
                Cada producto es una obra de arte creada con dedicación y técnicas tradicionales
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Hecho con Amor</h3>
              <p className="text-gray-600">
                Apoya a artesanos locales que ponen su corazón en cada creación
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-amber-100">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">Comunidad Local</h3>
              <p className="text-gray-600">
                Fortalecemos la economía local conectando compradores con artesanos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-amber-900 mb-4">
              Productos Destacados
            </h2>
            <p className="text-gray-600 text-lg">
              Descubre nuestras creaciones más populares
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((producto) => (
                <ProductCard 
                  key={producto.id} 
                  producto={producto} 
                  onCardClick={setSelectedProducto} // <-- 3. Pasar la función para abrir el modal
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/productos"
              className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
            >
              Ver Todos los Productos
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-12 text-center text-white space-y-6">
            <h2 className="text-4xl font-bold">
              ¿Eres Artesano?
            </h2>
            <p className="text-xl opacity-90">
              Únete a nuestra comunidad y comparte tus creaciones con el mundo
            </p>
            <Link
              to="/auth"
              className="inline-block px-8 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Registrarme como Vendedor
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Renderizar el modal */}
      <ProductoModal producto={selectedProducto} onClose={() => setSelectedProducto(null)} />
    </div>
  );
}
