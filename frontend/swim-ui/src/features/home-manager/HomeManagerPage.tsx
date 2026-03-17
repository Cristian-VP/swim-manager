export default function HomeManagerPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
      <header className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-white via-white to-[var(--color-brand-primary-soft)]/45 p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">BackOffice</p>
        <h1 className="mt-2 text-3xl font-black text-[var(--color-brand-deep)] md:text-4xl">Bienvend@</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Resumen operativo de los use cases de iteracion 1: gestion de atletas y programacion de entrenamientos.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Atletas registrados</p>
          <p className="mt-2 text-4xl font-black text-[var(--color-brand-deep)]">--</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">Falta por implementar</p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Entrenamientos programados</p>
          <p className="mt-2 text-4xl font-black text-[var(--color-brand-deep)]">--</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">Falta por implementar</p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Proximo entrenamiento</p>
          <p className="mt-2 text-4xl font-black text-[var(--color-brand-deep)]">--</p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">Falta por implementar</p>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[var(--color-brand-deep)]">-</h2>
          <p className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-6 text-sm text-[var(--color-text-muted)]">
            Falta por implementar
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <h2 className="text-2xl font-black text-[var(--color-brand-deep)]">-</h2>
          <p className="mt-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-6 text-sm text-[var(--color-text-muted)]">
            Falta por implementar
          </p>
        </article>
      </section>
    </main>
  )
}
