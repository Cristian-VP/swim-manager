import { useEffect, useState } from 'react'
import { apiRequest, apiErrorMessage } from '../../../lib/api'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

export type CompetitionApiDetail = {
  public_id: string
  name: string
  date: string
  season: { public_id: string; name: string }
  venue: { public_id: string; name: string; venue_type: string; indoor?: boolean } | null
  coaches: { public_id: string; first_name: string; last_name: string; certification?: string }[]
  athletes: { public_id: string; first_name: string; last_name: string }[]
}

type Props = {
  competitionId: string | null
}

export function CompetitionDetail({ competitionId }: Props) {
  const [detail, setDetail] = useState<CompetitionApiDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!competitionId) return

    let alive = true
    async function loadDetail() {
      setLoading(true)
      setError('')
      try {
        const data = await apiRequest<CompetitionApiDetail>(`/scheduling/competitions/${competitionId}`)
        if (alive) setDetail(data)
      } catch (err) {
        if (alive) setError(apiErrorMessage(err))
      } finally {
        if (alive) setLoading(false)
      }
    }

    loadDetail()
    return () => { alive = false }
  }, [competitionId])

  if (!competitionId) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-slate-50 p-6 text-center shadow-sm">
        <div className="mb-3 rounded-full bg-slate-200 p-4">
          <svg className="h-8 w-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500">Selecciona una petición en el calendario para ver sus detalles</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-full min-h-[300px] items-center justify-center rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <LoadingSpinner text="Cargando información de competición..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <ErrorMessage message={error} />
      </div>
    )
  }

  if (!detail) return null

  const compDate = new Date(detail.date)

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
      <header className="mb-6 border-b border-slate-100 pb-4">
        <span className="mb-2 inline-block rounded-full bg-[var(--color-brand-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-brand-primary)]">
          {detail.season?.name || 'Competición Oficial'}
        </span>
        <h2 className="text-2xl font-black text-slate-900">{detail.name}</h2>
        <div className="mt-2 flex items-center space-x-4 text-sm font-medium text-slate-600">
          <div className="flex items-center">
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {compDate.toLocaleDateString()}
          </div>
          <div className="flex items-center text-[var(--color-brand-primary)]">
            <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {compDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-500">UBICACIÓN / SEDE</h3>
            {detail.venue ? (
              <div>
                <p className="font-semibold text-slate-800">{detail.venue.name}</p>
                <p className="text-xs text-slate-500">{detail.venue.venue_type} {detail.venue.indoor ? '(Indoor)' : '(Outdoor)'}</p>
              </div>
            ) : (
              <p className="text-sm font-medium italic text-slate-500">Sin sede asignada</p>
            )}
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="mb-2 text-xs font-bold tracking-wider text-slate-500">RESUMEN PARTICIPACIÓN</h3>
            <p className="text-sm font-medium text-slate-700">
              <span className="text-xl font-black text-[var(--color-brand-primary)]">{detail.athletes?.length || 0}</span> Atletas inscritos
            </p>
          </div>
        </section>

        <section>
          <div className="h-full rounded-xl border border-slate-100 bg-slate-50 p-4">
            <h3 className="mb-3 text-xs font-bold tracking-wider text-slate-500">PLANTILLA TÉCNICA (COACHES)</h3>
            {detail.coaches && detail.coaches.length > 0 ? (
              <ul className="space-y-2">
                {detail.coaches.map(coach => (
                  <li key={coach.public_id} className="flex items-center justify-between rounded bg-white p-2 text-sm shadow-sm border border-slate-100">
                    <span className="font-semibold text-slate-800">{coach.first_name} {coach.last_name}</span>
                    {coach.certification && (
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{coach.certification}</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm font-medium italic text-slate-500">Sin coaches asignados temporalmente.</p>
            )}
          </div>
        </section>
      </div>
    </article>
  )
}
