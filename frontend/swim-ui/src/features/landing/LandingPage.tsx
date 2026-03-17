import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 md:px-10 md:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-amber-100 via-orange-50 to-cyan-50 p-8 shadow-sm md:p-12">
        <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-200/60 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-44 w-44 rounded-full bg-orange-200/70 blur-2xl" />

        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">Swim Manager</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-black leading-tight text-slate-900 md:text-6xl">
          Gestiona atletas y entrenamientos con una UI lista para API
        </h1>
        <p className="mt-5 max-w-2xl text-base text-slate-700 md:text-lg">
          Ejercicio de maquetacion para un club deportivo generico, conectado a Django Ninja por contratos reales.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/login"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Ir a Login
          </Link>
          <Link
            to="/athletes"
            className="rounded-xl border border-slate-400 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-600"
          >
            Ver Atletas
          </Link>
          <Link
            to="/trainings"
            className="rounded-xl border border-cyan-500 bg-cyan-50 px-5 py-3 text-sm font-semibold text-cyan-800 transition hover:bg-cyan-100"
          >
            Ver Entrenamientos
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Athletes CRUD</h2>
          <p className="mt-2 text-sm text-slate-600">Listado, creacion y edicion con selector de direccion.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Training Scheduling</h2>
          <p className="mt-2 text-sm text-slate-600">Creacion de sesiones con season, coaches, athletes y venue.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-bold text-slate-900">Contrato API</h2>
          <p className="mt-2 text-sm text-slate-600">Manejo explicito de estados 404, 409 y 422 en formularios.</p>
        </article>
      </section>
    </main>
  )
}
