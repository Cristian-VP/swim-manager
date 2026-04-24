import { useEffect, useState } from 'react'
import { apiErrorMessage, apiRequest } from '../../../lib/api'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

type RelPerson = {
  public_id: string
  first_name?: string
  last_name?: string
  display_name?: string
}

type TrainingApiDetail = {
  public_id: string
  name: string
  date: string
  focus: string
  season: {
    public_id: string
    name: string
  }
  venue: {
    public_id: string
    name: string
    venue_type: string
  } | null
  coaches: RelPerson[]
  athletes: RelPerson[]
}

type Props = {
  publicId: string
  onClose: () => void
  onEdit: () => void
}

export function TrainingDetail({ publicId, onClose, onEdit }: Props) {
  const [training, setTraining] = useState<TrainingApiDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function loadDetail() {
      setLoading(true)
      setError('')
      try {
        const detail = await apiRequest<TrainingApiDetail>(`/scheduling/trainings/${publicId}`)
        if (alive) {
          setTraining(detail)
        }
      } catch (err) {
        if (alive) {
          setError(apiErrorMessage(err))
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    loadDetail()

    return () => {
      alive = false
    }
  }, [publicId])

  if (loading) {
    return <LoadingSpinner text="Cargando detalles de la sesion..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!training) {
    return null
  }

  return (
    <div className="mt-4 space-y-5">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{training.name}</h3>
        <p className="text-sm font-medium text-[var(--color-brand-primary)]">
          {new Date(training.date).toLocaleString()}
        </p>
      </div>

      <div className="rounded-xl bg-slate-50 p-4 border border-slate-100 space-y-3">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Temporada</p>
          <p className="text-sm font-medium text-slate-900">{training.season?.name}</p>
        </div>
        
        {training.venue && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Sede (Venue)</p>
            <p className="text-sm font-medium text-slate-900">
              {training.venue.name} <span className="text-slate-500 font-normal">({training.venue.venue_type})</span>
            </p>
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Foco de sesion</p>
          <p className="text-sm font-medium text-slate-800 bg-white p-2 border border-slate-200 rounded mt-1">
            {training.focus || 'Sin foco de entrenamiento definido.'}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">COACHES ASIGNADOS</p>
          {training.coaches && training.coaches.length > 0 ? (
            <ul className="text-sm space-y-1">
              {training.coaches.map(c => (
                <li key={c.public_id} className="flex items-center before:content-['•'] before:mr-2 before:text-slate-400">
                  {c.display_name || `${c.first_name} ${c.last_name}`.trim()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No hay coaches asignados.</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-xs font-bold text-slate-700 mb-2 border-b border-slate-100 pb-1">ATLETAS ({training.athletes?.length || 0})</p>
          {training.athletes && training.athletes.length > 0 ? (
            <ul className="text-sm space-y-1 max-h-32 overflow-y-auto pr-1">
              {training.athletes.map(a => (
                <li key={a.public_id} className="flex items-center before:content-['•'] before:mr-2 before:text-slate-400">
                  {a.display_name || `${a.first_name} ${a.last_name}`.trim()}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-500 italic">No hay atletas asignados.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-xl bg-[var(--color-brand-primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--color-brand-primary-hover)] transition-colors"
        >
          Editar
        </button>
      </div>
    </div>
  )
}
