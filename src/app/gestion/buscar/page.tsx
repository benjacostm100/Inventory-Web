'use client';

import { useState } from 'react';

interface Producto {
  categoria: string;
  nombre: string;
  stock: number;
  precio: number;
}

export default function Buscar() {
  const [query, setQuery] = useState('');
  const [sugerencias, setSugerencias] = useState<Producto[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  // Buscar productos por nombre
  const buscarProducto = async (nombre: string) => {
    try {
      const res = await fetch(`/api/buscar?nombre=${encodeURIComponent(nombre)}`);
      if (res.ok) {
        const data = await res.json();
        setSugerencias(data.resultados);
      } else {
        setSugerencias([]);
      }
    } catch (error) {
      console.error('Error al buscar producto:', error);
      setSugerencias([]);
    }
  };

  // Manejar cambios en el input
  const manejarInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setQuery(valor);
    setProductoSeleccionado(null);
    setMostrarDetalles(false);
    if (valor.length > 2) buscarProducto(valor);
    else setSugerencias([]);
  };

  // Seleccionar un producto de la lista de sugerencias
  const seleccionarProducto = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setQuery(producto.nombre); // Actualizar el input con el nombre seleccionado
    setSugerencias([]);
  };

  // Mostrar detalles del producto seleccionado
  const mostrarDetallesProducto = () => {
    setMostrarDetalles(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Buscar Producto</h1>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={manejarInput}
          placeholder="Escribe el nombre del producto"
          className="border border-gray-300 p-2 rounded w-full"
        />
        {sugerencias.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 rounded shadow w-full mt-1 max-h-40 overflow-y-auto">
            {sugerencias.map((producto, index) => (
              <li
                key={index}
                onClick={() => seleccionarProducto(producto)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {producto.nombre} - {producto.categoria}
              </li>
            ))}
          </ul>
        )}
      </div>
      {productoSeleccionado && (
        <button
          onClick={mostrarDetallesProducto}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ver Detalles
        </button>
      )}
      {mostrarDetalles && productoSeleccionado && (
        <div className="mt-6 p-4 border rounded shadow">
          <h2 className="text-xl font-bold mb-2">{productoSeleccionado.nombre}</h2>
          <p><strong>Categoría:</strong> {productoSeleccionado.categoria}</p>
          <p><strong>Stock:</strong> {productoSeleccionado.stock}</p>
          <p><strong>Precio:</strong> ${productoSeleccionado.precio}</p>
        </div>
      )}
    </div>
  );
}
