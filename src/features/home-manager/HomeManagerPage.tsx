/**
 * @file HomeManagerPage.tsx
 * @description Panel principal o "Dashboard" que los gerentes ven al ingresar al Back Office.
 * Agrega y muestra métricas clave combinando múltiples endpoints (atletas y entrenamientos),
 * y calendarios de competiciones mensuales.
 */
import { useEffect, useState } from 'react'
import { apiRequest } from '../../lib/api'
import type { AthleteListItem } from '../athletes/components/AthleteList'
import type { TrainingListItem } from '../trainings/components/TrainingList'

import { CompetitionCalendar, type CompetitionListItem } from './components/CompetitionCalendar'
import { CompetitionDetail } from './components/CompetitionDetail'

export default function HomeManagerPage() {
  const [athletes, setAthletes] = useState<AthleteListItem[]>([])
  const [trainings, setTrainings] = useState<TrainingListItem[]>([])
  const [competitions, setCompetitions] = useState<CompetitionListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadData() {
      try {
        const [fetchedAthletes, fetchedTrainings, fetchedCompetitions] = await Promise.all([
          apiRequest<AthleteListItem[]>('/people/athletes').catch(() => []),
          apiRequest<TrainingListItem[]>('/scheduling/trainings').catch(() => []),
          apiRequest<CompetitionListItem[]>('/scheduling/competitions').catch(() => []),
        ])
        if (alive) {
          setAthletes(fetchedAthletes)
          setTrainings(fetchedTrainings)
          setCompetitions(fetchedCompetitions)
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      alive = false
    }
  }, [])

  const now = new Date()
  const upcomingTrainings = trainings
    .filter((t) => new Date(t.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const nextTraining = upcomingTrainings.length > 0 ? upcomingTrainings[0] : null
  const nextTrainingDisplay = nextTraining
    ? new Date(nextTraining.date).toLocaleDateString()
    : (trainings.length > 0 ? "Sin futuros" : "--")

  return (
    <main className="mx-auto flex w-full max-w-[85rem] flex-col gap-8 px-4 py-6 md:px-8 md:py-8">
      <header className="rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-white via-white to-[var(--color-brand-primary-soft)]/45 p-6 shadow-sm">
        <h1 className="mt-2 text-3xl font-black text-[var(--color-brand-deep)] md:text-4xl">Bienvenid@</h1>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          Resumen operativo de gestión de atletas, programación de entrenamientos y calendario mensual de competiciones.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Atletas registrados</p>
          <p className="mt-2 text-4xl font-black text-[var(--color-brand-deep)]">
            {loading ? '--' : athletes.length}
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {loading ? 'Cargando...' : 'Total de atletas en DB'}
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Entrenamientos programados</p>
          <p className="mt-2 text-4xl font-black text-[var(--color-brand-deep)]">
            {loading ? '--' : trainings.length}
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            {loading ? 'Cargando...' : 'Total de entrenamientos'}
          </p>
        </article>

        <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
          <p className="text-xs font-semibold text-[var(--color-text-muted)]">Próximo entrenamiento</p>
          <p className="mt-2 text-2xl md:text-3xl font-black text-[var(--color-brand-deep)]">
            {loading ? '--' : nextTrainingDisplay}
          </p>
          <p className="mt-2 truncate text-xs text-[var(--color-text-muted)]">
            {loading ? 'Cargando...' : (nextTraining ? nextTraining.name : 'Sin próximos entrenamientos')}
          </p>
        </article>
      </section>

      {/* New Calendar and Detail Section */}
      <section className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <CompetitionCalendar 
            competitions={competitions} 
            selectedId={selectedCompetitionId} 
            onSelect={setSelectedCompetitionId} 
          />
        </div>

        <div className="lg:col-span-2">
          <CompetitionDetail competitionId={selectedCompetitionId} />
        </div>
      </section>
    </main>
  )
}
