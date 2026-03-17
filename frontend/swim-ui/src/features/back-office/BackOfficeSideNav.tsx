import { Link, NavLink } from 'react-router-dom'

import { ACTIVE_BACKOFFICE_NAV, PASSIVE_BACKOFFICE_NAV } from './backOfficeNav'

function activeNavClassName(isActive: boolean): string {
  const base = 'flex items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold transition'
  return isActive
    ? `${base} bg-[var(--color-brand-primary)] text-white shadow-sm`
    : `${base} text-[var(--color-brand-deep)] hover:bg-[var(--color-brand-primary-soft)]`
}

export default function BackOfficeSideNav() {
  return (
    <aside className="w-full border-b border-[var(--color-border)] bg-white/90 px-4 py-4 backdrop-blur lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:shrink-0 lg:border-r lg:border-b-0 lg:px-5 lg:py-6">
      <div className="flex h-full flex-col">
        <div>
          <Link to="/home-manager" className="block rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 py-2 transition hover:border-[var(--color-brand-primary)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)]">BackOffice - User</p>
            <p className="mt-1 text-sm font-bold text-[var(--color-brand-deep)]">swim manager</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Home resumen</p>
          </Link>

          <nav className="mt-4 space-y-1" aria-label="Back office navigation">
            {ACTIVE_BACKOFFICE_NAV.map((item) => {
              if (!item.to) {
                return null
              }

              return (
                <NavLink key={item.label} to={item.to} className={({ isActive }) => activeNavClassName(isActive)}>
                  <span>{item.label}</span>
                  {item.badge ? <span className="rounded-full bg-white/25 px-2 py-0.5 text-[11px]">{item.badge}</span> : null}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="mt-6 border-t border-[var(--color-border)] pt-4 lg:mt-auto">
          <div className="space-y-1">
            {PASSIVE_BACKOFFICE_NAV.map((item) => (
              <span
                key={item.label}
                aria-disabled="true"
                className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-[color:color-mix(in_srgb,var(--color-text-muted)_78%,white)]"
              >
                <span>{item.label}</span>
                {item.badge ? <span className="rounded-full bg-[var(--color-surface)] px-2 py-0.5 text-[11px] text-[var(--color-text-muted)]">{item.badge}</span> : null}
              </span>
            ))}
          </div>

          <footer className="mt-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3">
            <p className="text-sm font-semibold text-[var(--color-brand-deep)]">Olivia Rios</p>
            <p className="text-xs text-[var(--color-text-muted)]">olivia@swimmanager.com</p>
          </footer>
        </div>
      </div>
    </aside>
  )
}
