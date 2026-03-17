import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'

type LoginState = {
  email: string
  password: string
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginState>({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    return {
      email: form.email.trim().length === 0 ? 'El email es obligatorio.' : '',
      password: form.password.trim().length === 0 ? 'La contrasena es obligatoria.' : '',
    }
  }, [form.email, form.password])

  const hasErrors = Boolean(errors.email || errors.password)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10 md:py-14">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-black text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Pantalla UI-only. No integra autenticacion backend en iteracion 1.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring"
              placeholder="operador@club.com"
            />
            {submitted && errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Contrasena</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-300 transition focus:ring"
              placeholder="********"
            />
            {submitted && errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            Entrar
          </button>

          {submitted && !hasErrors ? (
            <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Validacion local correcta. Integracion auth queda fuera de alcance en esta iteracion.
            </p>
          ) : null}
        </form>
      </section>
    </main>
  )
}
