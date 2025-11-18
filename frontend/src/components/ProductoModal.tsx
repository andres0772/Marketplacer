import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';

// Asumimos que la interfaz del producto es similar a esta
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  image?: string;
}

interface ProductoModalProps {
  producto: Producto | null;
  onClose: () => void;
}

const ProductoModal: React.FC<ProductoModalProps> = ({ producto, onClose }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (producto) {
      addItem({ ...producto, cantidad: 1 });
      onClose(); // Opcional: cerrar el modal al añadir al carrito
    }
  };

  return (
    <AnimatePresence>
      {producto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()} // Evita que el clic en el modal lo cierre
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Columna de la Imagen */}
            <div className="w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
              <img 
                src={producto.image || 'https://placehold.co/600x600/FFF0DB/92400E?text=Imagen'} 
                alt={producto.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Columna de Contenido */}
            <div className="w-full md:w-1/2 p-8 flex flex-col">
              <h2 className="text-3xl font-bold text-amber-900 mb-2">{producto.nombre}</h2>
              <p className="text-gray-600 mb-6 flex-grow">{producto.descripcion}</p>
              
              <div className="flex items-baseline justify-between mb-6">
                <span className="text-4xl font-bold text-orange-600">${producto.precio.toLocaleString()}</span>
                <span className="text-gray-500">COP</span>
              </div>

              <button 
                onClick={handleAddToCart}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-bold text-lg flex items-center justify-center gap-2 hover:shadow-xl transition-all"
              >
                <ShoppingCart size={20} />
                Añadir al Carrito
              </button>
            </div>

            {/* Botón de Cerrar */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 bg-white bg-opacity-70 rounded-full p-2 hover:bg-opacity-100 hover:text-gray-900 transition-all"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductoModal;