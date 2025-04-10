import Link from 'next/link';
import './globals.css';  // Primero importa global.css
import './app.css';

export default function Home() {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido al Sistema de Gestión de Inventarios</h1>
      <div>
        <Link href="/gestion" className="home-link button">
          Ir al Menú de Gestión
        </Link>
        <Link href="/reportes" className="home-link button button-secondary">
          Ver Reportes
        </Link>
        <Link href="/configuracion" className="home-link button button-outline">
          Configuración
        </Link>
      </div>
    </div>
  );
}
