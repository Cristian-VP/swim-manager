import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'

type LoginState = {
  email: string
  password: string
}

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginState>({ email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)

  const errors = useMemo(() => {
    const trimmedEmail = form.email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    return {
      email:
        trimmedEmail.length === 0
          ? 'El email es obligatorio.'
          : !emailPattern.test(trimmedEmail)
            ? 'Introduce un email valido.'
            : '',
      password: form.password.trim().length === 0 ? 'La contrasena es obligatoria.' : '',
    }
  }, [form.email, form.password])

  const hasErrors = Boolean(errors.email || errors.password)

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)

    if (hasErrors) {
      return
    }

    navigate('/home-manager')
  }

  return (
    <main className="mx-auto w-full max-w-md px-6 py-10 md:py-14">
      <section className="rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8">
        <h1 className="text-3xl font-black text-[var(--color-brand-deep)]">Login</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">Pantalla UI-only. No integra autenticacion backend en iteracion 1.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--color-brand-deep)]">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none ring-[var(--color-brand-primary-soft)] transition focus:ring"
              placeholder="operador@club.com"
            />
            {submitted && errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email}</p> : null}
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--color-brand-deep)]">Contrasena</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none ring-[var(--color-brand-primary-soft)] transition focus:ring"
              placeholder="********"
            />
            {submitted && errors.password ? <p className="mt-1 text-xs text-red-600">{errors.password}</p> : null}
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-primary-hover)]"
          >
            Iniciar sesion
          </button>

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            <Link to="/recover-password" className="font-semibold text-[var(--color-brand-primary)] underline-offset-4 hover:underline">
              Olvide mi contrasena
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
