import Link from 'next/link'
import { Clipboard, BarChart2, Settings } from 'lucide-react'
import './Components.css'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-inner">
          <div className="navbar-logo">
            <Link href="/" className="navbar-logo">
              <svg className="navbar-logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 7h-7m-7 0H3m18 5h-4m-7 0H3m18 5h-7M6 17H3" />
                <circle cx="9" cy="7" r="1" />
                <circle cx="9" cy="17" r="1" />
              </svg>
              <span className="navbar-logo-text">Inventario-Web</span>
            </Link>
          </div>
          <div className="navbar-links">
            <Link href="/gestion" className="navbar-link">
              <Clipboard className="navbar-link-icon" />
              <span>Gestión</span>
            </Link>
            <Link href="/reportes" className="navbar-link">
              <BarChart2 className="navbar-link-icon" />
              <span>Reportes</span>
            </Link>
            <Link href="/configuracion" className="navbar-link">
              <Settings className="navbar-link-icon" />
              <span>Configuración</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
