export type AthleteListItem = {
  public_id: string
  first_name: string
  last_name: string
  jersey_number: number | null
}

type Props = {
  athletes: AthleteListItem[]
  loading: boolean
  onSelectAthlete: (id: string) => void
  selectedId: string | null
}

export function AthleteList({ athletes, loading, onSelectAthlete, selectedId }: Props) {
  if (loading && athletes.length === 0) {
    return <p className="mt-3 text-sm text-slate-500">Cargando atletas...</p>
  }

  if (!loading && athletes.length === 0) {
    return <p className="mt-3 text-sm text-slate-600">No hay atletas registrados actualmente.</p>
  }

  return (
    <ul className="mt-4 space-y-2">
      {athletes.map((athlete) => (
        <li 
          key={athlete.public_id} 
          className={`flex items-center justify-between rounded-xl border px-3 py-2 transition-colors ${
            selectedId === athlete.public_id 
              ? 'border-slate-800 bg-slate-50' 
              : 'border-slate-200 hover:border-slate-400'
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {athlete.first_name} {athlete.last_name}
            </p>
            <p className="text-xs text-slate-500">Jersey: {athlete.jersey_number ?? 'sin asignar'}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelectAthlete(athlete.public_id)}
            className="rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-700 hover:bg-white bg-transparent"
          >
            Ver detalle
          </button>
        </li>
      ))}
    </ul>
  )
}
