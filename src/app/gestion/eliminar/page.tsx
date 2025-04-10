'use client';

import React, { useState } from 'react';

export default function EliminarPage() {
  const [tipo, setTipo] = useState<'producto' | 'categoria' | ''>('');
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [puedeEliminar, setPuedeEliminar] = useState(false);

  const handleBuscar = async () => {
    if (!tipo || !nombre.trim()) {
      setError('Por favor, selecciona un tipo y escribe un nombre');
      return;
    }

    try {
      const response = await fetch('/api/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'buscar', tipo, nombre }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al buscar');
      }

      setMensaje(`${tipo} Encontrado. Puedes eliminarlo.`);
      setPuedeEliminar(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setMensaje(null);
      setPuedeEliminar(false);
    }
  };

  const handleEliminar = async () => {
    try {
      const response = await fetch('/api/eliminar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accion: 'eliminar', tipo, nombre }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al eliminar');
      }

      const data = await response.json();
      setMensaje(data.message);
      setError(null);
      setPuedeEliminar(false);
      setNombre('');
    } catch (err: any) {
      setError(err.message);
      setMensaje(null);
    }
  };

  return (
    <div className="gestion-container">
      <h1 className="gestion-title">Eliminar Producto o Categoría</h1>

      <div className="flex gap-4">
        <button onClick={() => setTipo('producto')} className="btn btn-primary p-5 rounded-lg">
          Eliminar Producto
        </button>
        <button onClick={() => setTipo('categoria')} className="btn btn-secondary p-5 rounded-lg">
          Eliminar Categoría
        </button>
      </div>

      {tipo && (
        <>
          <div className="mt-6">
            <label className="block font-bold">Nombre del {tipo}:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder={`Escribe el nombre del ${tipo}`}
              className="input"
            />
          </div>

          <button onClick={handleBuscar} className="btn bg-blue-500 p-2 rounded-md mt-4">
            Buscar
          </button>

          {mensaje && (
            <div className="mt-4">
              <p className="text-green-500">{mensaje}</p>
              {puedeEliminar && (
                <button onClick={handleEliminar} className="btn bg-red-600 rounded-md p-2 mt-4">
                  Eliminar {tipo}
                </button>
              )}
            </div>
          )}

          {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
      )}
    </div>
  );
}
