/**
 * @file AthletesPage.tsx
 * @description Vista principal del directorio de Atletas.
 * Coordina la carga, selección, creación, edición y eliminación de atletas,
 * delegando la lógica de UI en AthleteList, AthleteDetail y AthleteFormOverlay.
 */
import { useCallback, useEffect, useState } from 'react'
import { apiErrorMessage, apiRequest } from '../../lib/api'
import { AthleteList, type AthleteListItem } from './components/AthleteList'
import { AthleteDetail } from './components/AthleteDetail'
import { AthleteFormOverlay } from './components/AthleteFormOverlay'
import { DeleteCountdownToast } from '../../components/ui/DeleteCountdownToast'
import { SuccessToast } from '../../components/ui/SuccessToast'
import { ErrorMessage } from '../../components/ui/ErrorMessage'

type FormMode = null | 'create' | 'edit'

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<AthleteListItem[]>([])
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState('')

  const [formMode, setFormMode] = useState<FormMode>(null)
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // ── Carga inicial ──
  const loadAthletes = useCallback(async () => {
    setLoading(true)
    setLoadError('')
    try {
      const data = await apiRequest<AthleteListItem[]>('/people/athletes')
      setAthletes(data)
    } catch (error) {
      setLoadError(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadAthletes()
  }, [loadAthletes])

  // ── Handlers de formulario ──
  function handleOpenCreate() {
    setSelectedAthleteId(null)
    setFormMode('create')
  }

  function handleOpenEdit() {
    setFormMode('edit')
  }

  function handleFormSuccess(message: string) {
    setFormMode(null)
    setSelectedAthleteId(null)
    setSuccessMessage(message)
    loadAthletes()
  }

  function handleFormCancel() {
    setFormMode(null)
  }

  // ── Handlers de borrado ──
  function handleRequestDelete() {
    setDeleteTargetId(selectedAthleteId)
  }

  async function handleConfirmDelete() {
    if (!deleteTargetId) return
    const idToDelete = deleteTargetId
    setDeleteTargetId(null)
    setSelectedAthleteId(null)

    try {
      await apiRequest(`/people/athletes/${idToDelete}`, { method: 'DELETE' })
      setAthletes((prev) => prev.filter((a) => a.public_id !== idToDelete))
      setSuccessMessage('Atleta eliminado correctamente.')
    } catch (err) {
      setDeleteError(apiErrorMessage(err))
    }
  }

  function handleCancelDelete() {
    setDeleteTargetId(null)
  }

  const deleteTarget = athletes.find((a) => a.public_id === deleteTargetId)

  return (
    <>
      {/* ── Formulario Overlay tipo página ── */}
      {formMode !== null && (
        <AthleteFormOverlay
          mode={formMode}
          athleteId={formMode === 'edit' ? (selectedAthleteId ?? undefined) : undefined}
          athletes={athletes}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      {/* ── Toast de borrado con cuenta atrás ── */}
      {deleteTargetId && deleteTarget && (
        <DeleteCountdownToast
          label={`${deleteTarget.first_name} ${deleteTarget.last_name} será eliminado permanentemente.`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      {/* ── Toast de éxito ── */}
      {successMessage && (
        <SuccessToast
          message={successMessage}
          onClose={() => setSuccessMessage('')}
        />
      )}

      {/* ── Contenido principal ── */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Catálogo de Atletas</h1>
            <p className="mt-1 text-sm text-slate-600">Gestiona el directorio de atletas registrados.</p>
          </div>
          <button
            type="button"
            id="btn-new-athlete"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 rounded-xl bg-[var(--color-brand-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-primary-hover)] transition-colors shadow-sm"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Atleta
          </button>
        </header>

        {loadError && <ErrorMessage message={loadError} />}
        {deleteError && <ErrorMessage message={deleteError} />}

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Atletas {athletes.length > 0 && <span className="font-normal text-slate-500">({athletes.length})</span>}
            </h2>
            <AthleteList
              athletes={athletes}
              loading={loading}
              selectedId={selectedAthleteId}
              onSelectAthlete={setSelectedAthleteId}
            />
          </article>

          <article className={`rounded-2xl border ${selectedAthleteId ? 'border-slate-300 shadow-md' : 'border-slate-200'} bg-white p-4 md:p-5 shadow-sm transition-all`}>
            <h2 className="text-lg font-bold text-slate-900">
              {selectedAthleteId ? 'Detalles del atleta' : 'Selecciona un atleta'}
            </h2>

            {!selectedAthleteId ? (
              <p className="mt-4 text-sm text-slate-500">
                Usa el listado de la izquierda para ver la información completa de un atleta, o pulsa "Nuevo Atleta" para añadir uno.
              </p>
            ) : (
              <AthleteDetail
                publicId={selectedAthleteId}
                onClose={() => setSelectedAthleteId(null)}
                onEdit={handleOpenEdit}
                onRequestDelete={handleRequestDelete}
              />
            )}
          </article>
        </section>
      </main>
    </>
  )
}
