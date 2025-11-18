import React from 'react';
import { useEffect, useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import apiClient from '../api/client';
import ProductCard from '../components/ProductCard';
import ProductoModal from '../components/ProductoModal';
import type { Producto } from '../types/models';

// Variantes de animación para el contenedor y los ítems
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Productos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(null);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const data = await apiClient.getProductos();
        setProductos(data);
        setFilteredProductos(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  useEffect(() => {
    let result = productos;

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.categoria === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProductos(result);
  }, [searchTerm, selectedCategory, productos]);

  const categories = Array.from(new Set(productos.map((p) => p.categoria)));

  const handleCardClick = (producto: Producto) => {
    setSelectedProducto(producto);
  };

  const handleCloseModal = () => {
    setSelectedProducto(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
            Catálogo de Productos
          </h1>
          <p className="text-gray-600 text-lg">
            Explora nuestra colección de artesanías únicas
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-amber-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 appearance-none bg-white"
              >
                <option value="all">Todas las Categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">Cargando productos...</p>
          </div>
        ) : filteredProductos.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <p className="text-gray-600 text-lg">
              No se encontraron productos que coincidan con tu búsqueda
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-gray-600">
                Mostrando <span className="font-bold text-amber-900">{filteredProductos.length}</span> productos
              </p>
            </div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredProductos.map((producto) => (
                <motion.div key={producto.id} variants={itemVariants}>
                  <ProductCard
                    producto={producto}
                    onCardClick={handleCardClick}
                  />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
      <ProductoModal producto={selectedProducto} onClose={handleCloseModal} />
    </div>
  );
}
