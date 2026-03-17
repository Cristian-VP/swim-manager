import { BrowserRouter, NavLink, Navigate, Route, Routes } from 'react-router-dom'

import AthletesPage from './features/athletes/AthletesPage'
import LandingPage from './features/landing/LandingPage'
import LoginPage from './features/login/LoginPage'
import TrainingsPage from './features/trainings/TrainingsPage'

function navClassName(isActive: boolean): string {
  const base = 'rounded-lg px-3 py-2 text-sm font-semibold transition'
  return isActive
    ? `${base} bg-slate-900 text-white`
    : `${base} text-slate-700 hover:bg-slate-200`
}

function AppLayout() {
  return (
    <div className="min-h-screen bg-transparent">
      <header className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 md:px-10">
          <p className="font-black tracking-tight text-slate-900">Swim UI</p>
          <nav className="flex flex-wrap gap-2" aria-label="Main Navigation">
            <NavLink to="/" end className={({ isActive }) => navClassName(isActive)}>
              Home
            </NavLink>
            <NavLink to="/login" className={({ isActive }) => navClassName(isActive)}>
              Login
            </NavLink>
            <NavLink to="/athletes" className={({ isActive }) => navClassName(isActive)}>
              Athletes
            </NavLink>
            <NavLink to="/trainings" className={({ isActive }) => navClassName(isActive)}>
              Trainings
            </NavLink>
          </nav>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/athletes" element={<AthletesPage />} />
        <Route path="/trainings" element={<TrainingsPage />} />
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
