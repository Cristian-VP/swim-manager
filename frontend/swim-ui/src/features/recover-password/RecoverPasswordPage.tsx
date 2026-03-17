import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'

type RecoverState = {
  email: string
}

export default function RecoverPasswordPage() {
  const [form, setForm] = useState<RecoverState>({ email: '' })
  const [submitted, setSubmitted] = useState(false)

  const emailError = useMemo(() => {
    const trimmedEmail = form.email.trim()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (trimmedEmail.length === 0) {
      return 'El email es obligatorio.'
    }

    if (!emailPattern.test(trimmedEmail)) {
      return 'Introduce un email valido.'
    }

    return ''
  }, [form.email])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="mx-auto w-full max-w-xl px-6 py-10 md:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-6 shadow-sm md:p-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[var(--color-brand-primary-soft)]/75 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[var(--color-brand-mint)]/65 blur-3xl" />

        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-text-muted)]">Recover Password</p>
        <h1 className="relative mt-3 text-3xl font-black text-[var(--color-brand-deep)]">Recuperar contrasena</h1>
        <p className="relative mt-2 text-sm text-[var(--color-text-muted)]">
          Flujo UI-only adaptado de la base visual de contacto. No se realizan solicitudes HTTP en esta iteracion.
        </p>

        <form className="relative mt-6 space-y-4" onSubmit={onSubmit} noValidate>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-[var(--color-brand-deep)]">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ email: event.target.value })}
              className="w-full rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm outline-none ring-[var(--color-brand-primary-soft)] transition focus:ring"
              placeholder="operador@club.com"
            />
            {submitted && emailError ? <p className="mt-1 text-xs text-red-600">{emailError}</p> : null}
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-brand-primary-hover)]"
          >
            Enviar enlace de recuperacion
          </button>

          {submitted && !emailError ? (
            <p className="rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              Mensaje enviado en modo UI-only. La integracion backend de recuperacion queda fuera de alcance.
            </p>
          ) : null}

          <p className="text-center text-sm text-[var(--color-text-muted)]">
            <Link to="/login" className="font-semibold text-[var(--color-brand-primary)] underline-offset-4 hover:underline">
              Volver a login
            </Link>
          </p>
        </form>
      </section>
    </main>
  )
}
