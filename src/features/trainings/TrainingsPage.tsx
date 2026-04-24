/**
 * @file TrainingsPage.tsx
 * @description Vista principal del módulo de Programación de Entrenamientos.
 * Implementa patrón Maestro-Detalle con operaciones CRUD completas:
 * crear (POST), editar (PATCH) y soporte para futuras eliminaciones.
 */
import { useCallback, useEffect, useState } from 'react'
import { apiErrorMessage, apiRequest } from '../../lib/api'
import { ErrorMessage } from '../../components/ui/ErrorMessage'
import { SuccessToast } from '../../components/ui/SuccessToast'
import { TrainingList, type TrainingListItem } from './components/TrainingList'
import { TrainingDetail } from './components/TrainingDetail'
import { TrainingFormOverlay } from './components/TrainingFormOverlay'

type FormMode = null | 'create' | 'edit'

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingListItem[]>([])
  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formMode, setFormMode] = useState<FormMode>(null)
  const [successMessage, setSuccessMessage] = useState('')

  // ── Carga desde API ──
  const loadTrainings = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await apiRequest<TrainingListItem[]>('/scheduling/trainings')
      setTrainings(data)
    } catch (error) {
      setLoadError(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTrainings()
  }, [loadTrainings])

  // ── Handlers ──
  function handleFormSuccess(message: string) {
    setFormMode(null)
    setSelectedTrainingId(null)
    setSuccessMessage(message)
    loadTrainings()
  }

  return (
    <>
      {/* ── Formulario Overlay tipo página ── */}
      {formMode !== null && (
        <TrainingFormOverlay
          mode={formMode}
          trainingId={formMode === 'edit' ? (selectedTrainingId ?? undefined) : undefined}
          trainings={trainings}
          onSuccess={handleFormSuccess}
          onCancel={() => setFormMode(null)}
        />
      )}

      {/* ── Toast de éxito ── */}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Agenda de Entrenamientos</h1>
            <p className="mt-1 text-sm text-slate-600">Gestiona las sesiones programadas del club.</p>
          </div>
          <button
            type="button"
            id="btn-new-training"
            onClick={() => { setSelectedTrainingId(null); setFormMode('create') }}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-primary-hover)] transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Sesión
          </button>
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
              {selectedTrainingId ? 'Detalles del Entrenamiento' : 'Selecciona una sesión'}
            </h2>

            {!selectedTrainingId ? (
              <p className="mt-4 text-sm text-slate-500">
                Selecciona una sesión de la lista para ver la sede, el foco y los atletas convocados. O pulsa "Nueva Sesión" para crear una.
              </p>
            ) : (
              <TrainingDetail
                publicId={selectedTrainingId}
                onClose={() => setSelectedTrainingId(null)}
                onEdit={() => setFormMode('edit')}
              />
            )}
          </article>
        </section>
      </main>
    </>
  )
}
