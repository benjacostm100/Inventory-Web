'use client'; // Importante para usar hooks en componentes de React

import { useState, useEffect } from 'react';

export default function ConfiguracionPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Comprueba la preferencia de modo oscuro al cargar la página
    if (localStorage.getItem('darkMode') === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', newMode.toString());

      // Añadir o quitar la clase 'dark' en el body
      if (newMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
      return newMode;
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Configuración</h1>
      <p className="mb-6">Aquí se mostrarán las opciones de configuración del sistema.</p>

      <div className="flex items-center justify-between">
        <span className="text-lg">Modo Oscuro</span>
        <button
          onClick={toggleDarkMode}
          className="bg-gray-800 text-white p-2 rounded-lg"
        >
          {isDarkMode ? 'Activar Modo Claro' : 'Activar Modo Oscuro'}
        </button>
      </div>
    </div>
  );
}
