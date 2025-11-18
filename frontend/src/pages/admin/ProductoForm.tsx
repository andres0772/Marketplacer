import React, { useState, useEffect } from 'react';
import type { Producto } from '../../types/models';

interface ProductoFormProps {
  producto?: Producto | null; // Producto a editar, o null para crear
  onSave: (productoData: Partial<Producto>) => void;
  onClose: () => void;
}

type FormData = Omit<Producto, 'id'>;

export default function ProductoForm({ producto, onSave, onClose }: ProductoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    image: '',
    is_active: true,
  });

  const isEditing = !!producto;

  useEffect(() => {
    if (isEditing && producto) {
      setFormData({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio,
        categoria: producto.categoria || '',
        image: producto.image || '',
        is_active: producto.is_active,
      });
    }
  }, [producto, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Usar 'instanceof' es un poco más seguro en TypeScript
    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
        setFormData(prev => ({ ...prev, [name]: e.target.checked }));
    } else {
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dataToSave: Partial<Producto> = {
      ...formData,
      precio: Number(formData.precio) // Asegurarse que el precio es un número
    };

    if (isEditing) {
        // En modo edición, solo enviamos los campos solicitados
        onSave({
            id: producto?.id,
            precio: dataToSave.precio,
            categoria: formData.categoria,
            image: formData.image,
        });
    } else {
        // En modo creación, enviamos todos los datos
        onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6">{isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEditing && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
              </div>
            </>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Precio</label>
            <input type="number" name="precio" value={formData.precio} onChange={handleChange} required min="0" step="any" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoría</label>
            <input type="text" name="categoria" value={formData.categoria} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL de la Imagen</label>
            <input type="url" name="image" value={formData.image || ''} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
          </div>
          <div className="flex items-center">
            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 text-orange-600 border-gray-300 rounded" />
            <label className="ml-2 block text-sm text-gray-900">Producto Activo</label>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}