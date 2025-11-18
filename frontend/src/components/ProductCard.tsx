import React from 'react';
import type { Producto } from '../types/models';

interface ProductCardProps {
  producto: Producto;
  onCardClick?: (producto: Producto) => void; // Función opcional para abrir el modal
}

const ProductCard: React.FC<ProductCardProps> = ({ producto, onCardClick }) => {
  const isClickable = !!onCardClick;
  const cursorStyle = isClickable ? 'cursor-pointer' : 'cursor-default';

  return (
    <div
      onClick={() => onCardClick?.(producto)} // Llamada segura: solo se ejecuta si onCardClick existe
      className={`bg-white rounded-xl shadow-md ${isClickable ? 'hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2' : ''} overflow-hidden ${cursorStyle} group`}
    >
      <div className="relative overflow-hidden">
        <img
          src={producto.image || 'https://placehold.co/400x400/FFF0DB/92400E?text=Imagen'}
          alt={producto.nombre}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-amber-900 mb-2 truncate">
          {producto.nombre}
        </h3>
        <p className="text-gray-600 mb-4 h-12 overflow-hidden text-ellipsis">{producto.descripcion}</p>
        <p className="text-2xl font-bold text-orange-600">${producto.precio.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default ProductCard;