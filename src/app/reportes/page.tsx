// pages/reportes.tsx
'use client';

import React, { useEffect, useState } from 'react';

type ProductoReponer = {
  producto: string;
  stock: number;
};

type CategoriaValor = {
  categoria: string;
  valorCategoria: number;
};

export default function ReportesPage() {
  const [categorias, setCategorias] = useState<CategoriaValor[]>([]);
  const [totalInventario, setTotalInventario] = useState<number | null>(null);
  const [productosReponer, setProductosReponer] = useState<ProductoReponer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Llamada a la API para obtener los reportes
    const fetchReportes = async () => {
      try {
        const response = await fetch('/api/reportes');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los reportes');
        }
        const data = await response.json();
        setCategorias(data.categorias);
        setTotalInventario(data.total);
        setProductosReponer(data.productosReponer);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReportes();
  }, []);

  return (
    <div className="gestion-container">
      <h1 className="gestion-title text-3xl font-bold mb-6">Reportes de Inventario</h1>

      {loading && <p>Cargando reportes...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Valor Total del Inventario</h2>
          <p className="font-bold text-xl mb-4">${totalInventario}</p>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Valor por Categoría</h2>
          <table className="min-w-full table-auto mb-6">
            <thead>
              <tr>
                <th className="px-4 py-2">Categoría</th>
                <th className="px-4 py-2">Valor Total</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{categoria.categoria}</td>
                  <td className="border px-4 py-2">${categoria.valorCategoria}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h2 className="text-2xl font-semibold mt-6 mb-2">Productos a Reponer</h2>
          {productosReponer.length === 0 ? (
            <p>No hay productos para reponer</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2">Producto</th>
                  <th className="px-4 py-2">Stock</th>
                </tr>
              </thead>
              <tbody>
                {productosReponer.map((producto, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{producto.producto}</td>
                    <td className="border px-4 py-2">{producto.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
