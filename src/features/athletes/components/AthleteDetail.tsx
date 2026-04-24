import { useEffect, useState } from 'react'
import { apiErrorMessage, apiRequest } from '../../../lib/api'
import { ErrorMessage } from '../../../components/ui/ErrorMessage'
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner'

type AthleteApiDetail = {
  public_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string | null
  height: number | null
  weight: number | null
  jersey_number: number | null
  address: {
    public_id: string
    formatted_address?: string
  } | null
}

type Props = {
  publicId: string
  onClose: () => void
  onEdit: () => void
  onRequestDelete: () => void
}

export function AthleteDetail({ publicId, onClose, onEdit, onRequestDelete }: Props) {
  const [athlete, setAthlete] = useState<AthleteApiDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    async function loadDetail() {
      setLoading(true)
      setError('')
      try {
        const detail = await apiRequest<AthleteApiDetail>(`/people/athletes/${publicId}`)
        if (alive) {
          setAthlete(detail)
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
    return <LoadingSpinner text="Cargando detalles del atleta..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  if (!athlete) {
    return null
  }

  return (
    <div className="mt-4 space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          {athlete.first_name} {athlete.last_name}
        </h3>
        <p className="text-sm text-slate-500">{athlete.email} • {athlete.phone}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 rounded-xl bg-slate-50 p-4 border border-slate-100">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Jersey</p>
          <p className="text-sm font-medium text-slate-900">{athlete.jersey_number ?? 'No asignado'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Nacimiento</p>
          <p className="text-sm font-medium text-slate-900">{athlete.date_of_birth ?? 'No especificado'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Altura</p>
          <p className="text-sm font-medium text-slate-900">{athlete.height ? `${athlete.height} cm` : 'No especificada'}</p>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Peso</p>
          <p className="text-sm font-medium text-slate-900">{athlete.weight ? `${athlete.weight} kg` : 'No especificado'}</p>
        </div>
      </div>

      {athlete.address && (
        <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Direccion principal</p>
          <p className="text-sm font-medium text-slate-900 mt-1">
            {athlete.address.formatted_address || athlete.address.public_id}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cerrar
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onRequestDelete}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Eliminar
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
    </div>
  )
}
