/**
 * @file TrainingFormOverlay.tsx
 * @description Formulario de pantalla completa para crear y editar sesiones de entrenamiento.
 * Carga temporadas, entrenadores y atletas relacionales desde la API, gestiona la validación
 * en cliente, la navegación entre sesiones en modo edición (PATCH) y el feedback de errores.
 */
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { apiErrorMessage, apiRequest } from '../../../lib/api'
import { ErrorModal } from '../../../components/ui/ErrorModal'
import type { TrainingListItem } from './TrainingList'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type SeasonRef = { public_id: string; name: string }
type PersonRef = { public_id: string; first_name: string; last_name: string }

type TrainingApiDetail = {
  public_id: string
  name: string
  date: string
  focus: string
  season: SeasonRef
  coaches: { public_id: string }[]
  athletes: { public_id: string }[]
}

type FormFields = {
  name: string
  date: string
  time: string
  focus: string
  season_id: string
  coach_ids: string[]
  athlete_ids: string[]
}

type Props = {
  mode: 'create' | 'edit'
  trainingId?: string
  trainings: TrainingListItem[]
  onSuccess: (message: string) => void
  onCancel: () => void
}

function emptyForm(): FormFields {
  return { name: '', date: '', time: '00:00', focus: '', season_id: '', coach_ids: [], athlete_ids: [] }
}

function detailToForm(d: TrainingApiDetail): FormFields {
  const datePart = d.date ? d.date.slice(0, 10) : ''
  const timePart = d.date ? d.date.slice(11, 16) : '00:00'
  return {
    name: d.name,
    date: datePart,
    time: timePart,
    focus: d.focus ?? '',
    season_id: d.season?.public_id ?? '',
    coach_ids: d.coaches?.map((c) => c.public_id) ?? [],
    athlete_ids: d.athletes?.map((a) => a.public_id) ?? [],
  }
}

function validateForm(f: FormFields) {
  return {
    name: f.name.trim() === '' ? 'El nombre es obligatorio.' : '',
    date: f.date.trim() === '' ? 'La fecha es obligatoria.' : '',
    time: f.time.trim() === '' ? 'La hora es obligatoria.' : '',
    focus: '',
    season_id: f.season_id.trim() === '' ? 'La temporada es obligatoria.' : '',
    coach_ids: '',
    athlete_ids: '',
  }
}

function CheckboxList({ title, options, selectedIds, onChange }: { title: string, options: PersonRef[], selectedIds: string[], onChange: (ids: string[]) => void }) {
  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(x => x !== id))
    } else {
      onChange([...selectedIds, id])
    }
  }

  return (
    <div>
      <span className="mb-1 block text-sm font-semibold text-slate-700">{title}</span>
      <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
        {options.map(opt => (
          <label key={opt.public_id} className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-100 transition-colors">
            <input type="checkbox" checked={selectedIds.includes(opt.public_id)} onChange={() => toggle(opt.public_id)} className="h-4 w-4 rounded border-slate-300 text-[var(--color-brand-primary)] focus:ring-[var(--color-brand-primary)]" />
            <span className="text-sm font-medium text-slate-700">{opt.first_name} {opt.last_name}</span>
          </label>
        ))}
        {options.length === 0 && <p className="p-2 text-xs text-slate-500">Cargando...</p>}
      </div>
    </div>
  )
}

export function TrainingFormOverlay({ mode, trainingId, trainings, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormFields>(emptyForm())
  const [touched, setTouched] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const [seasons, setSeasons] = useState<SeasonRef[]>([])
  const [coaches, setCoaches] = useState<PersonRef[]>([])
  const [athletes, setAthletes] = useState<PersonRef[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [activeTrainingId, setActiveTrainingId] = useState<string | undefined>(trainingId)

  useEffect(() => {
    Promise.all([
      apiRequest<SeasonRef[]>('/scheduling/seasons').catch(() => []),
      apiRequest<PersonRef[]>('/people/coaches').catch(() => []),
      apiRequest<PersonRef[]>('/people/athletes').catch(() => [])
    ]).then(([s, c, a]) => {
      setSeasons(s)
      setCoaches(c)
      setAthletes(a)
    })
  }, [])

  useEffect(() => {
    if (mode === 'edit' && trainingId) {
      const idx = trainings.findIndex((t) => t.public_id === trainingId)
      setCurrentIndex(idx >= 0 ? idx : 0)
    }
  }, [mode, trainingId, trainings])

  useEffect(() => {
    if (mode !== 'edit' || !activeTrainingId) return

    let alive = true
    setLoadingDetail(true)
    apiRequest<TrainingApiDetail>(`/scheduling/trainings/${activeTrainingId}`)
      .then((data) => { if (alive) setForm(detailToForm(data)) })
      .catch(() => { })
      .finally(() => { if (alive) setLoadingDetail(false) })

    return () => { alive = false }
  }, [mode, activeTrainingId])

  const errors = useMemo(() => validateForm(form), [form])
  const hasErrors = Object.values(errors).some(Boolean)

  const trainingLabel = mode === 'edit' && trainings[currentIndex]
    ? trainings[currentIndex].name
    : 'Nueva Sesión'

  function navigate(dir: -1 | 1) {
    const next = currentIndex + dir
    if (next < 0 || next >= trainings.length) return
    setCurrentIndex(next)
    setActiveTrainingId(trainings[next].public_id)
    setTouched(false)
  }

  function setField(field: keyof FormFields, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (hasErrors) return

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      date: form.date && form.time ? `${form.date}T${form.time}:00Z` : '',
      focus: form.focus.trim(),
      season_public_id: form.season_id,
      coach_public_ids: form.coach_ids,
      athlete_public_ids: form.athlete_ids,
    }

    setSubmitting(true)
    try {
      if (mode === 'create') {
        await apiRequest('/scheduling/trainings', { method: 'POST', body: JSON.stringify(payload) })
        onSuccess('Sesión de entrenamiento creada correctamente.')
      } else {
        await apiRequest(`/scheduling/trainings/${activeTrainingId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        onSuccess('Sesión de entrenamiento actualizada correctamente.')
      }
    } catch (err) {
      setApiError(apiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Volver al listado"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <h1 className="text-lg font-black text-slate-900 truncate">{trainingLabel}</h1>
        <span className="ml-auto rounded-full bg-[var(--color-brand-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-brand-primary)]">
          {mode === 'create' ? 'Nueva sesión' : 'Editar sesión'}
        </span>
      </header>

      {/* ── Navegación entre entrenamientos (solo en edición) ── */}
      {mode === 'edit' && trainings.length > 1 && (
        <div className="flex items-center justify-center gap-4 border-b border-slate-100 bg-slate-50 px-6 py-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={currentIndex === 0}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-400 disabled:opacity-30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <p className="text-xs font-medium text-slate-500">
            <span className="font-bold text-slate-700">{currentIndex + 1}</span> / {trainings.length}
          </p>
          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={currentIndex === trainings.length - 1}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-400 disabled:opacity-30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8">
        {loadingDetail ? (
          <p className="text-sm text-slate-500">Cargando datos de la sesión...</p>
        ) : (
          <form
            id="training-form"
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto max-w-3xl"
          >
            <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <legend className="px-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                Datos de la sesión
              </legend>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2" htmlFor="training-name">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">Nombre de la sesión <span className="text-red-500">*</span></span>
                  <input
                    id="training-name" type="text" value={form.name} placeholder="ej. Entrenamiento técnico"
                    onChange={(e) => setField('name', e.target.value)} aria-invalid={Boolean(touched && errors.name)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] ${touched && errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {touched && errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </label>

                <label className="block" htmlFor="training-date">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">Fecha <span className="text-red-500">*</span></span>
                  <input
                    id="training-date" type="date" value={form.date} onChange={(e) => setField('date', e.target.value)}
                    aria-invalid={Boolean(touched && errors.date)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] ${touched && errors.date ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {touched && errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
                </label>

                <label className="block" htmlFor="training-time">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">Hora <span className="text-red-500">*</span></span>
                  <input
                    id="training-time" type="time" value={form.time} onChange={(e) => setField('time', e.target.value)}
                    aria-invalid={Boolean(touched && errors.time)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] ${touched && errors.time ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  />
                  {touched && errors.time && <p className="mt-1 text-xs text-red-600">{errors.time}</p>}
                </label>

                <label className="block sm:col-span-2" htmlFor="training-season">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">Temporada <span className="text-red-500">*</span></span>
                  <select
                    id="training-season" value={form.season_id} onChange={(e) => setField('season_id', e.target.value)}
                    aria-invalid={Boolean(touched && errors.season_id)}
                    className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] bg-white ${touched && errors.season_id ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                  >
                    <option value="">Selecciona una temporada...</option>
                    {seasons.map((s) => <option key={s.public_id} value={s.public_id}>{s.name}</option>)}
                  </select>
                  {touched && errors.season_id && <p className="mt-1 text-xs text-red-600">{errors.season_id}</p>}
                </label>

                <label className="block sm:col-span-2" htmlFor="training-focus">
                  <span className="mb-1 block text-sm font-semibold text-slate-700">Foco de la sesión</span>
                  <textarea
                    id="training-focus" value={form.focus} placeholder="Opcional..." onChange={(e) => setField('focus', e.target.value)} rows={2}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] resize-none"
                  />
                </label>
              </div>
            </fieldset>

            <fieldset className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <legend className="px-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                Asignación
              </legend>
              <div className="mt-4 grid gap-6 sm:grid-cols-2">
                <CheckboxList
                  title="Entrenadores Asignados"
                  options={coaches}
                  selectedIds={form.coach_ids}
                  onChange={(ids) => setField('coach_ids', ids)}
                />
                <CheckboxList
                  title="Atletas Convocados"
                  options={athletes}
                  selectedIds={form.athlete_ids}
                  onChange={(ids) => setField('athlete_ids', ids)}
                />
              </div>
            </fieldset>
          </form>
        )}
      </main>

      <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
        <button
          type="button" onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit" form="training-form" disabled={submitting || (touched && hasErrors)}
          className="rounded-xl bg-[var(--color-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Guardando...' : 'Aceptar'}
        </button>
      </footer>

      {apiError && (
        <ErrorModal
          message={apiError}
          onRetry={() => { setApiError(''); handleSubmit({ preventDefault: () => { } } as FormEvent) }}
          onClose={() => setApiError('')}
        />
      )}
    </div>
  )
}
