import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { apiErrorMessage, apiRequest } from '../../../lib/api'
import { ErrorModal } from '../../../components/ui/ErrorModal'

// ─── Tipos ───────────────────────────────────────────────────────────────────

type SeasonRef = { public_id: string; name: string }
type VenueRef = { public_id: string; name: string }
type PersonRef = { public_id: string; first_name: string; last_name: string }

type FormFields = {
  name: string
  date: string
  season_id: string
  venue_id: string
  coach_ids: string[]
  athlete_ids: string[]
}

type Props = {
  onSuccess: (message: string) => void
  onCancel: () => void
}

// ─── Validación ──────────────────────────────────────────────────────────────

function emptyForm(): FormFields {
  return { name: '', date: '', season_id: '', venue_id: '', coach_ids: [], athlete_ids: [] }
}

function validateForm(f: FormFields) {
  return {
    name: f.name.trim() === '' ? 'El nombre es obligatorio.' : '',
    date: f.date.trim() === '' ? 'La fecha es obligatoria.' : '',
    season_id: f.season_id.trim() === '' ? 'La temporada es obligatoria.' : '',
    venue_id: '',
    coach_ids: '',
    athlete_ids: '',
  }
}

// ─── Componentes Extra ───────────────────────────────────────────────────────

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

// ─── Componente Principal ────────────────────────────────────────────────────

export function CompetitionFormOverlay({ onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormFields>(emptyForm())
  const [touched, setTouched] = useState(false)
  
  const [seasons, setSeasons] = useState<SeasonRef[]>([])
  const [venues, setVenues] = useState<VenueRef[]>([])
  const [coaches, setCoaches] = useState<PersonRef[]>([])
  const [athletes, setAthletes] = useState<PersonRef[]>([])

  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')

  // Cargar datos relacionales
  useEffect(() => {
    Promise.all([
      apiRequest<SeasonRef[]>('/scheduling/seasons').catch(() => []),
      apiRequest<VenueRef[]>('/inventory/venues').catch(() => []),
      apiRequest<PersonRef[]>('/people/coaches').catch(() => []),
      apiRequest<PersonRef[]>('/people/athletes').catch(() => [])
    ]).then(([s, v, c, a]) => {
      setSeasons(s)
      setVenues(v)
      setCoaches(c)
      setAthletes(a)
    })
  }, [])

  const errors = useMemo(() => validateForm(form), [form])
  const hasErrors = Object.values(errors).some(Boolean)

  function setField(field: keyof FormFields, value: any) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (hasErrors) return

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      date: form.date ? `${form.date}T00:00:00Z` : '',
      season_public_id: form.season_id,
      coach_public_ids: form.coach_ids,
      athlete_public_ids: form.athlete_ids,
    }
    
    if (form.venue_id) {
      payload.venue_public_id = form.venue_id
    }

    setSubmitting(true)
    try {
      await apiRequest('/scheduling/competitions', { method: 'POST', body: JSON.stringify(payload) })
      onSuccess('Competición creada correctamente.')
    } catch (err) {
      setApiError(apiErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-white">
      {/* ── Header ── */}
      <header className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
        <button
          type="button" onClick={onCancel} aria-label="Volver al dashboard"
          className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Volver
        </button>
        <div className="h-5 w-px bg-slate-200" />
        <h1 className="text-lg font-black text-slate-900">Nueva Competición</h1>
        <span className="ml-auto rounded-full bg-[var(--color-brand-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-brand-primary)]">
          Nueva
        </span>
      </header>

      {/* ── Formulario ── */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        <form
          id="competition-form"
          onSubmit={handleSubmit}
          noValidate
          className="mx-auto max-w-3xl"
        >
          <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <legend className="px-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
              Datos de la competición
            </legend>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2" htmlFor="competition-name">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Nombre <span className="text-red-500">*</span></span>
                <input
                  id="competition-name" type="text" value={form.name} placeholder="ej. Campeonato Regional Sub-16"
                  onChange={(e) => setField('name', e.target.value)} aria-invalid={Boolean(touched && errors.name)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] ${touched && errors.name ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {touched && errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </label>

              <label className="block" htmlFor="competition-date">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Fecha de celebración <span className="text-red-500">*</span></span>
                <input
                  id="competition-date" type="date" value={form.date}
                  onChange={(e) => setField('date', e.target.value)} aria-invalid={Boolean(touched && errors.date)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] ${touched && errors.date ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                />
                {touched && errors.date && <p className="mt-1 text-xs text-red-600">{errors.date}</p>}
              </label>

              <label className="block" htmlFor="competition-season">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Temporada <span className="text-red-500">*</span></span>
                <select
                  id="competition-season" value={form.season_id} onChange={(e) => setField('season_id', e.target.value)} aria-invalid={Boolean(touched && errors.season_id)}
                  className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] bg-white ${touched && errors.season_id ? 'border-red-400 bg-red-50' : 'border-slate-200'}`}
                >
                  <option value="">Selecciona una temporada...</option>
                  {seasons.map((s) => <option key={s.public_id} value={s.public_id}>{s.name}</option>)}
                </select>
                {touched && errors.season_id && <p className="mt-1 text-xs text-red-600">{errors.season_id}</p>}
              </label>

              <label className="block sm:col-span-2" htmlFor="competition-venue">
                <span className="mb-1 block text-sm font-semibold text-slate-700">Sede (Localización)</span>
                <select
                  id="competition-venue" value={form.venue_id} onChange={(e) => setField('venue_id', e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] bg-white border-slate-200"
                >
                  <option value="">(Sin definir)</option>
                  {venues.map((v) => <option key={v.public_id} value={v.public_id}>{v.name}</option>)}
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
             <legend className="px-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
               Equipaje e Inscritos
             </legend>
             <div className="mt-4 grid gap-6 sm:grid-cols-2">
               <CheckboxList 
                 title="Entrenadores Coordinadores"
                 options={coaches}
                 selectedIds={form.coach_ids}
                 onChange={(ids) => setField('coach_ids', ids)}
               />
               <CheckboxList 
                 title="Atletas Competidores"
                 options={athletes}
                 selectedIds={form.athlete_ids}
                 onChange={(ids) => setField('athlete_ids', ids)}
               />
             </div>
          </fieldset>
        </form>
      </main>

      {/* ── Footer ── */}
      <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
        <button
          type="button" onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit" form="competition-form" disabled={submitting || (touched && hasErrors)}
          className="rounded-xl bg-[var(--color-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Guardando...' : 'Aceptar'}
        </button>
      </footer>

      {apiError && (
        <ErrorModal
          message={apiError}
          onRetry={() => { setApiError(''); handleSubmit({ preventDefault: () => {} } as FormEvent) }}
          onClose={() => setApiError('')}
        />
      )}
    </div>
  )
}
