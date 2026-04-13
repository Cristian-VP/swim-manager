export type Season = {
  public_id: string
  name: string
}

export type TrainingListItem = {
  public_id: string
  name: string
  date: string
  season: Season
  focus: string
}

type Props = {
  trainings: TrainingListItem[]
  loading: boolean
  onSelectTraining: (id: string) => void
  selectedId: string | null
}

export function TrainingList({ trainings, loading, onSelectTraining, selectedId }: Props) {
  if (loading && trainings.length === 0) {
    return <p className="mt-3 text-sm text-slate-500">Cargando entrenamientos...</p>
  }

  if (!loading && trainings.length === 0) {
    return <p className="mt-3 text-sm text-slate-600">No hay entrenamientos registrados todavia.</p>
  }

  return (
    <ul className="mt-4 space-y-2">
      {trainings.map((training) => (
        <li 
          key={training.public_id} 
          className={`rounded-xl border px-3 py-2 transition-colors ${
            selectedId === training.public_id 
              ? 'border-brand-primary/50 bg-slate-50 shadow-sm' 
              : 'border-slate-200 hover:border-slate-400'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-semibold text-slate-900">{training.name}</p>
              <p className="text-xs text-slate-500">
                {new Date(training.date).toLocaleString()} · {training.season?.name}
              </p>
              <p className="text-xs text-slate-600 mt-1 line-clamp-1">{training.focus || 'Sin foco definido'}</p>
            </div>
            
            <button
              type="button"
              onClick={() => onSelectTraining(training.public_id)}
              className="mt-1 rounded-lg border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-700 hover:bg-white bg-transparent shrink-0 ml-2"
            >
              Ver detalle
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}
