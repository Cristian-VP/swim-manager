/**
 * @file BackOfficeLayout.tsx
 * @description Estructura de diseño base para el entorno de administración ("Back Office").
 * Organiza la vista usando un diseño de cuadrícula (grid) que incluye la barra lateral de navegación
 * fija a la izquierda y el área de contenido principal a la derecha usando un Outlet de React Router.
 */
import { Outlet } from 'react-router-dom'

import BackOfficeSideNav from './BackOfficeSideNav'

export default function BackOfficeLayout() {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[18rem_1fr]">
      <BackOfficeSideNav />
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
