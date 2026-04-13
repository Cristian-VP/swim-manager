import { Link } from 'react-router-dom'
import landingHeroImage from '../../assets/talahria-jensen-F20aPGvyhrQ-unsplash.jpg'

export default function PublicLandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[var(--color-surface)] text-[var(--color-text)]">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 pb-8 pt-4 md:px-8 md:pb-12 md:pt-5">
        <header className="flex items-center justify-between">
          <Link to="/" className="text-lg font-black tracking-tight text-[var(--color-brand-deep)] md:text-xl">
            swim manager
          </Link>

          <nav className="flex items-center gap-5 text-xs font-semibold text-[var(--color-brand-deep)] md:gap-6 md:text-sm" aria-label="Landing">
            <Link className="transition hover:text-[var(--color-brand-primary)]" to="/">
              Conocenos
            </Link>
            <Link className="transition hover:text-[var(--color-brand-primary)]" to="/login">
              Inicia sesion
            </Link>
          </nav>
        </header>

        <section className="grid flex-1 items-center gap-10 py-8 md:grid-cols-[1.1fr_0.9fr] md:py-14">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-black leading-tight text-[var(--color-brand-deep)] md:text-6xl">
              Tu pasión, tu progreso, tu comunidad
            </h1>
            <p className="mt-5 max-w-xl text-base text-[var(--color-text-muted)] md:text-lg">
              Todo lo que necesitas para vivir el deporte esta en tu Club.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-xl border-2 border-[var(--color-brand-primary)] bg-white px-6 py-2.5 text-sm font-bold text-[var(--color-brand-primary)] shadow-sm"
              >
                Contacta
              </button>
              <button
                type="button"
                className="rounded-xl bg-[var(--color-brand-primary)] px-6 py-2.5 text-sm font-bold text-white shadow-md"
              >
                Inscribete
              </button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[420px]">
            <img
              src={landingHeroImage}
              alt="Nadadora en piscina"
              className="h-[300px] w-full rounded-2xl border border-[var(--color-border)] object-cover shadow-sm md:h-[560px]"
            />
          </div>
        </section>
      </section>

      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-5 text-sm font-semibold text-[var(--color-text-muted)] md:grid-cols-[1fr_repeat(4,auto)] md:items-center md:px-8 md:py-4">
          <div className="flex flex-col gap-3">
            <span className="text-xl leading-none text-[var(--color-brand-deep)]">fig</span>
            <div className="flex items-center gap-2 text-[11px] font-bold text-[var(--color-brand-deep)]">
              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5">X</span>
              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5">IG</span>
              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5">YT</span>
              <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5">IN</span>
            </div>
          </div>

          <span>Ayuda</span>
          <span>Terminos y condiciones</span>
          <span>Privacidad</span>
          <span>Contacto</span>
        </div>
      </footer>
    </main>
  )
}
