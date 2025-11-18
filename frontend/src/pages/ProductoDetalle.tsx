import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Define una interfaz para la estructura de un producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  // Puedes añadir más campos aquí según tu modelo de datos
}

export default function ProductoDetalle() {
  // El hook useParams nos da el 'id' de la URL (ej: /productos/1 -> id = '1')
  const { id } = useParams<{ id: string }>();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducto = async () => {
      if (!id) return; // No hacer nada si no hay ID en la URL

      try {
        // La URL apunta al API Gateway, que redirigirá la petición al microservicio de productos.
        const response = await axios.get<Producto>(`http://localhost:8000/api/v1/productos/${id}`);
        setProducto(response.data);
      } catch (err) {
        setError('No se pudo cargar la información del producto.');
        console.error("Error al cargar el producto:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]); // Este efecto se ejecuta cada vez que el 'id' en la URL cambia

  if (loading) return <div className="text-center p-10">Cargando producto...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!producto) return <div className="text-center p-10">Producto no encontrado.</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{producto.nombre}</h1>
      <p className="text-lg text-gray-700 mb-4">{producto.descripcion}</p>
      <p className="text-2xl font-semibold text-green-600">${producto.precio.toFixed(2)}</p>
      {/* Aquí puedes añadir más detalles, imágenes, y un botón de "Añadir al carrito" */}
    </div>
  );
}