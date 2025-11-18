import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Trash2, PlusCircle } from 'lucide-react';
import ProductoForm from './ProductoForm';
import type { Producto } from '../../types/models';


export default function GestionProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Producto[]>('http://localhost:8000/api/v1/productos/');
      setProductos(response.data);
      setError(null);
    } catch (err) {
      setError('No se pudieron cargar los productos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleOpenForm = (producto: Producto | null = null) => {
    setEditingProducto(producto);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProducto(null);
  };

  const handleSaveProducto = async (productoData: Partial<Producto>) => {
    try {
      if (editingProducto) {
        // Editar producto existente
        await axios.put(`http://localhost:8000/api/v1/productos/${editingProducto.id}`, productoData);
      } else {
        // Crear nuevo producto
        await axios.post('http://localhost:8000/api/v1/productos/', productoData);
      }
      handleCloseForm();
      fetchProductos(); // Recargar la lista de productos
    } catch (err) {
      console.error('Error al guardar el producto:', err);
      alert('No se pudo guardar el producto.');
    }
  };

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:8000/api/v1/productos/${id}/`);
        // Refrescar la lista de productos después de eliminar
        fetchProductos();
      } catch (err) {
        alert('Error al eliminar el producto.');
        console.error(err);
      }
    }
  };

  if (loading) return <p>Cargando productos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Gestionar Productos</h2>
        <button
          onClick={() => handleOpenForm()}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <PlusCircle size={20} />
          Crear Producto
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 text-left">ID</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Precio</th>
              <th className="py-2 px-4 text-left">Activo</th>
              <th className="py-2 px-4 text-left">Imagen</th>
              <th className="py-2 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{producto.id}</td>
                <td className="py-2 px-4">{producto.nombre}</td>
                <td className="py-2 px-4">${producto.precio.toLocaleString()}</td>
                <td className="py-2 px-4">{producto.is_active ? 'Sí' : 'No'}</td>
                <td className="py-2 px-4">
                  {producto.image ? (
                    <a href={producto.image} target="_blank" rel="noopener noreferrer">
                      <img src={producto.image} alt={producto.nombre} className="h-10 w-10 object-cover rounded-md hover:scale-110 transition-transform" />
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="py-2 px-4 flex justify-center gap-2">
                  <button
                    onClick={() => handleOpenForm(producto)}
                    className="p-2 text-blue-600 hover:text-blue-800"
                    title="Editar"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="p-2 text-red-600 hover:text-red-800"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isFormOpen && (
        <ProductoForm
          producto={editingProducto}
          onSave={handleSaveProducto}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
}