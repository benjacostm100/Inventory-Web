import './gestion.css';
import Link from 'next/link';

export default function GestionPage() {
  return (
    <div className="gestion-container">
      <h1 className="gestion-title">Gestión de Inventario</h1>
      <div className="gestion-buttons">
        <Link href="/gestion/consultar">
          <button className="gestion-button">Consultar inventario</button>
        </Link>
        <Link href="/gestion/agregar">
          <button className="gestion-button">Agregar producto o categoria</button>
        </Link>
        <Link href="/gestion/eliminar">
          <button className="gestion-button">Eliminar producto o categoría</button>
        </Link>
        <Link href="/gestion/actualizar">
          <button className="gestion-button">Actualizar producto o categoria</button>
        </Link>
        <Link href="/gestion/buscar">
          <button className="gestion-button">Buscar producto o categoría</button>
        </Link>
      </div>
    </div>
  );
}
