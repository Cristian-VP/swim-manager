import { BrowserRouter, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'

import AthletesPage from './features/athletes/AthletesPage'
import BackOfficeLayout from './features/back-office/BackOfficeLayout'
import HomeManagerPage from './features/home-manager/HomeManagerPage.tsx'
import LoginPage from './features/login/LoginPage'
import PublicLandingPage from './features/public-landing/PublicLandingPage'
import RecoverPasswordPage from './features/recover-password/RecoverPasswordPage'
import TrainingsPage from './features/trainings/TrainingsPage'

function publicNavClassName(isActive: boolean): string {
  const base = 'text-xs font-semibold transition md:text-sm'
  return isActive ? `${base} text-[var(--color-brand-primary)]` : `${base} text-[var(--color-brand-deep)] hover:text-[var(--color-brand-primary)]`
}

function AppLayout() {
  const location = useLocation()
  const isPublicLanding = location.pathname === '/'
  const isManagerArea = ['/home-manager', '/athletes', '/trainings'].some((path) => location.pathname.startsWith(path))
  const showPublicHeader = !isPublicLanding && !isManagerArea

  return (
    <div className="min-h-screen bg-transparent">
      {showPublicHeader ? (
        <header className="sticky top-0 z-10 border-b border-[var(--color-border)]/80 bg-white/85 backdrop-blur">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-3 md:px-8">
            <NavLink to="/" className="text-lg font-black tracking-tight text-[var(--color-brand-deep)] md:text-xl">
              swim manager
            </NavLink>
            <nav className="flex flex-wrap gap-2" aria-label="Main Navigation">
              <NavLink to="/" end className={({ isActive }) => publicNavClassName(isActive)}>
                Conocenos
              </NavLink>
              <NavLink to="/login" className={({ isActive }) => publicNavClassName(isActive)}>
                Iniciar sesion
              </NavLink>
            </nav>
          </div>
        </header>
      ) : null}

      <Routes>
        <Route path="/" element={<PublicLandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recover-password" element={<RecoverPasswordPage />} />

        <Route element={<BackOfficeLayout />}>
          <Route path="/home-manager" element={<HomeManagerPage />} />
          <Route path="/athletes" element={<AthletesPage />} />
          <Route path="/trainings" element={<TrainingsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
