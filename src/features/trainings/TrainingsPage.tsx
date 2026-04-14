/**
 * @file TrainingsPage.tsx
 * @description Vista principal del módulo de Programación de Entrenamientos.
 * Obtiene las sesiones planificadas del API e implementa un patrón Maestro-Detalle,
 * permitiendo seleccionar un entrenamiento concreto para visualizar sus datos ampliados.
 */
import { useEffect, useState } from 'react'
import { apiErrorMessage, apiRequest } from '../../lib/api'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { TrainingList, type TrainingListItem } from './components/TrainingList'
import { TrainingDetail } from './components/TrainingDetail'

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingListItem[]>([])
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setLoadError('')
      
      try {
        const data = await apiRequest<TrainingListItem[]>('/scheduling/trainings')
        if (alive) {
          setTrainings(data)
        }
      } catch (error) {
        if (alive) {
          setLoadError(apiErrorMessage(error))
        }
      } finally {
        if (alive) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [])

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:px-10">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Agenda de Entrenamientos</h1>
        <p className="mt-1 text-sm text-slate-600">Revisa las sesiones programadas y sus participantes.</p>
      </header>

      <ErrorMessage message={loadError} />

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">
            Sesiones {trainings.length > 0 && <span className="font-normal text-slate-500">({trainings.length})</span>}
          </h2>

          <TrainingList 
            trainings={trainings} 
            loading={loading} 
            selectedId={selectedTrainingId}
            onSelectTraining={setSelectedTrainingId} 
          />
        </article>

        <article className={`rounded-2xl border ${selectedTrainingId ? 'border-brand-primary/40 shadow-md' : 'border-slate-200'} bg-white p-4 md:p-5 shadow-sm transition-all`}>
          <h2 className="text-lg font-bold text-slate-900">
            {selectedTrainingId ? 'Detalles del Entrenamiento' : 'Selecciona una sesion'}
          </h2>

          {!selectedTrainingId ? (
            <p className="mt-4 text-sm text-slate-500">
              Selecciona una sesion de la lista para ver la sede, el foco y los atletas/coaches convocados.
            </p>
          ) : (
            <TrainingDetail 
              publicId={selectedTrainingId} 
              onClose={() => setSelectedTrainingId(null)} 
            />
          )}
        </article>
      </section>
    </main>
  )
}
