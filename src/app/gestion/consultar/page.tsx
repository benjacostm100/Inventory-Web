// /app/gestion/consultar/page.tsx
'use client';
import React, { useState, useEffect } from 'react';

type Producto = {
  producto: string;
  cantidad: number;
  precio: number;
};

type Categoria = {
  categoria: string;
  productos: Producto[];
};

export default function ConsultarPage() {
  const [productos, setProductos] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductos() {
      try {
        const response = await fetch('/api/inventario');
        if (!response.ok) {
          throw new Error('No se pudo cargar el inventario');
        }
        const data = await response.json();
        setProductos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProductos();
  }, []);

  return (
    <div className="gestion-container">
      <h1 className="gestion-title">Consultar Inventario</h1>

      {loading && <p>Cargando inventario...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <div>
          <h2 className="text-xl font-bold mb-2">Inventario Actual</h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-4 py-2">Producto</th>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Cantidad</th>
                <th className="px-4 py-2">Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((categoria, index) => (
                <React.Fragment key={index}>
                  <tr>
                    <td colSpan={4} className="font-bold text-lg">{categoria.categoria}</td>
                  </tr>
                  {categoria.productos.map((producto, subIndex) => (
                    <tr key={subIndex}>
                      <td className="border px-4 py-2">{producto.producto}</td>
                      <td className="border px-4 py-2">{categoria.categoria}</td>
                      <td className="border px-4 py-2">{producto.cantidad}</td>
                      <td className="border px-4 py-2">${producto.precio}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
