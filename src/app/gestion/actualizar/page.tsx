'use client'

import { useState, useEffect } from 'react';

interface Elemento {
  categoria: string;
  nombre: string;
  stock: string;
  precio: string;
}

export default function Actualizar() {
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState<Elemento[]>([]);
  const [categorias, setCategorias] = useState<Elemento[]>([]);
  const [seleccionado, setSeleccionado] = useState<Elemento | null>(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevoPrecio, setNuevoPrecio] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (query.length > 1) {
      fetch(`/api/actualizar?nombre=${query}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.productos) {
            setProductos(data.productos);
          }
          if (data.categorias) {
            setCategorias(data.categorias);
          }
        })
        .catch((err) => console.error('Error fetching data:', err));
    } else {
      setProductos([]);
      setCategorias([]);
    }
  }, [query]);

  const handleActualizar = () => {
    if (!seleccionado) return;

    fetch('/api/actualizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: seleccionado?.nombre || seleccionado?.categoria,
        nuevoNombre: nuevoNombre || null,
        nuevaCantidad: nuevaCantidad || null,
        nuevoPrecio: nuevoPrecio || null,
      }),
    })
      .then((res) => res.json())
      .then((data) => setMensaje(data.message || 'Actualización exitosa'))
      .catch(() => setMensaje('Error en la actualización.'));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Actualizar Producto o Categoría</h1>
      <div className="relative">
        <input
          type="text"
          placeholder="Escriba el producto o categoría que desea buscar"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {(productos.length > 0 || categorias.length > 0) && (
          <ul className="absolute z-10 bg-white border w-full rounded-md shadow mt-1">
            {productos.map((item, index) => (
              <li
                key={index}
                onClick={() => setSeleccionado(item)}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                Producto: {item.nombre}
              </li>
            ))}
            {categorias.map((item, index) => (
              <li
                key={index}
                onClick={() => setSeleccionado(item)}
                className="p-2 cursor-pointer hover:bg-blue-100"
              >
                Categoría: {item.nombre}
              </li>
            ))}
          </ul>
        )}
      </div>
      {seleccionado && (
        <div className="mt-6 p-4 border rounded-md shadow bg-gray-50">
          <h2 className="text-xl font-semibold">Actualizar {seleccionado.nombre}</h2>
          {seleccionado.nombre && (
            <>
              <input
                type="text"
                placeholder="Nuevo nombre"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
              />
              <input
                type="number"
                placeholder="Nueva cantidad"
                value={nuevaCantidad}
                onChange={(e) => setNuevaCantidad(e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
              />
              <input
                type="number"
                placeholder="Nuevo precio"
                value={nuevoPrecio}
                onChange={(e) => setNuevoPrecio(e.target.value)}
                className="w-full p-2 border rounded-md mt-2"
              />
            </>
          )}
          {seleccionado.categoria && (
            <input
              type="text"
              placeholder="Nuevo nombre de la categoría"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              className="w-full p-2 border rounded-md mt-2"
            />
          )}
          <button
            onClick={handleActualizar}
            className="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Actualizar
          </button>
          {mensaje && <p className="mt-4 text-green-500">{mensaje}</p>}
        </div>
      )}
    </div>
  );
}
