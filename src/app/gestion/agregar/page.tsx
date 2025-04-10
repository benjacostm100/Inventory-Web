'use client';

import React, { useState, useEffect } from 'react';

export default function AgregarPage() {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    cantidad: '',
    categoria: '',
    nuevaCategoria: '', // Para manejar la nueva categoría
  });
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]); // Lista de categorías
  const [loadingCategorias, setLoadingCategorias] = useState<boolean>(true);

  // Función para cargar las categorías desde la API de inventario
  const fetchCategorias = async () => {
    try {
      const response = await fetch('/api/inventario');
      if (!response.ok) throw new Error('No se pudieron cargar las categorías');
      const data = await response.json();

      // Extraemos las categorías desde el arreglo de productos
      const categorias = data.map((categoria: { categoria: string }) => categoria.categoria);
      setCategorias(categorias);
    } catch (err) {
      console.error(err);
      setError('Error al cargar las categorías');
    } finally {
      setLoadingCategorias(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Usamos la nueva categoría si está definida, sino usamos la categoría seleccionada
    const categoriaFinal = formData.nuevaCategoria || formData.categoria;

    try {
      const response = await fetch('/api/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: 'producto', // Solo estamos agregando productos
          ...formData,
          categoria: categoriaFinal,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al agregar');
      }

      const data = await response.json();
      setMensaje(data.message);
      setFormData({ nombre: '', precio: '', cantidad: '', categoria: '', nuevaCategoria: '' });
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMensaje(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, categoria: e.target.value, nuevaCategoria: '' })); // Reset nueva categoría
  };

  const handleNuevaCategoriaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, nuevaCategoria: e.target.value, categoria: '' })); // Reset categoría seleccionada
  };

  return (
    <div className="gestion-container">
      <h1 className="gestion-title">Agregar Producto</h1>

      <form onSubmit={handleSubmit} className="mt-6">
        <h2 className="text-xl font-bold">Agregar Producto</h2>

        {/* Campos comunes */}
        <div className="mb-4">
          <label className="block font-bold">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            className="input"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold">Precio:</label>
          <input
            type="number"
            name="precio"
            value={formData.precio}
            onChange={handleInputChange}
            required
            className="input"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold">Cantidad:</label>
          <input
            type="number"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleInputChange}
            required
            className="input"
          />
        </div>

        <div className="mb-4">
          <label className="block font-bold">Categoría:</label>
          {loadingCategorias ? (
            <p>Cargando categorías...</p>
          ) : (
            <>
              {/* Lista desplegable con categorías existentes */}
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleCategoriaChange}
                className="input"
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((categoria, index) => (
                  <option key={index} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>

              {/* Input para agregar una nueva categoría */}
              <div className="mt-4">
                <label className="block font-bold">O ingrese una nueva categoría:</label>
                <input
                  type="text"
                  name="nuevaCategoria"
                  value={formData.nuevaCategoria}
                  onChange={handleNuevaCategoriaChange}
                  className="input"
                />
              </div>
            </>
          )}
        </div>

        <button type="submit" className="btn btn-success p-2 rounded-lg">
          Agregar
        </button>
      </form>

      {/* Mensaje de éxito o error */}
      {mensaje && <p className="text-green-500 mt-4">{mensaje}</p>}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
