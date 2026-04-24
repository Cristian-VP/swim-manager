import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { apiErrorMessage, apiRequest } from '../../../lib/api'
import { ErrorModal } from '../../../components/ui/ErrorModal'
import type { AthleteListItem } from './AthleteList'

// ─── Tipos ───────────────────────────────────────────────────────────────────

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
}

type FormFields = {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  height: string
  weight: string
  jersey_number: string
}

type Props = {
  mode: 'create' | 'edit'
  athleteId?: string
  athletes: AthleteListItem[]
  onSuccess: (message: string) => void
  onCancel: () => void
}

// ─── Utilidades ──────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function emptyForm(): FormFields {
  return { first_name: '', last_name: '', email: '', phone: '', date_of_birth: '', height: '', weight: '', jersey_number: '' }
}

function detailToForm(d: AthleteApiDetail): FormFields {
  return {
    first_name: d.first_name,
    last_name: d.last_name,
    email: d.email,
    phone: d.phone,
    date_of_birth: d.date_of_birth ?? '',
    height: d.height != null ? String(d.height) : '',
    weight: d.weight != null ? String(d.weight) : '',
    jersey_number: d.jersey_number != null ? String(d.jersey_number) : '',
  }
}

function validateForm(f: FormFields) {
  return {
    first_name: f.first_name.trim() === '' ? 'El nombre es obligatorio.' : '',
    last_name: f.last_name.trim() === '' ? 'El apellido es obligatorio.' : '',
    email: f.email.trim() === '' ? 'El email es obligatorio.' : !EMAIL_RE.test(f.email.trim()) ? 'Email no válido.' : '',
    phone: f.phone.trim() === '' ? 'El teléfono es obligatorio.' : '',
    date_of_birth: '',
    height: f.height !== '' && isNaN(Number(f.height)) ? 'Debe ser un número.' : '',
    weight: f.weight !== '' && isNaN(Number(f.weight)) ? 'Debe ser un número.' : '',
    jersey_number: f.jersey_number !== '' && isNaN(Number(f.jersey_number)) ? 'Debe ser un número entero.' : '',
  }
}

// ─── Componente de Campo ──────────────────────────────────────────────────────
function FormField({
  id, label, type = 'text', value, field, setField, error, required = false, placeholder = ''
}: {
  id: string; label: string; type?: string; value: string; field: keyof FormFields; setField: (f: keyof FormFields, v: string) => void; error?: string; required?: boolean; placeholder?: string
}) {
  return (
    <label className="block" htmlFor={id}>
      <span className="mb-1 block text-sm font-semibold text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => setField(field, e.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-[var(--color-brand-primary-soft)] ${
          error ? 'border-red-400 bg-red-50' : 'border-slate-200 bg-white'
        }`}
      />
      {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600">{error}</p>}
    </label>
  )
}

// ─── Componente Principal ────────────────────────────────────────────────────

export function AthleteFormOverlay({ mode, athleteId, athletes, onSuccess, onCancel }: Props) {
  const [form, setForm] = useState<FormFields>(emptyForm())
  const [touched, setTouched] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [activeAthleteId, setActiveAthleteId] = useState<string | undefined>(athleteId)

  // Calcula el índice inicial al montar en modo edición
  useEffect(() => {
    if (mode === 'edit' && athleteId) {
      const idx = athletes.findIndex((a) => a.public_id === athleteId)
      setCurrentIndex(idx >= 0 ? idx : 0)
    }
  }, [mode, athleteId, athletes])

  // Carga el detalle cuando cambia el atleta activo (modo edición)
  useEffect(() => {
    if (mode !== 'edit' || !activeAthleteId) return

    let alive = true
    setLoadingDetail(true)
    apiRequest<AthleteApiDetail>(`/people/athletes/${activeAthleteId}`)
      .then((data) => { if (alive) setForm(detailToForm(data)) })
      .catch(() => {})
      .finally(() => { if (alive) setLoadingDetail(false) })

    return () => { alive = false }
  }, [mode, activeAthleteId])

  const errors = useMemo(() => validateForm(form), [form])
  const hasErrors = Object.values(errors).some(Boolean)

  const athleteLabel = mode === 'edit' && athletes[currentIndex]
    ? `${athletes[currentIndex].first_name} ${athletes[currentIndex].last_name}`
    : 'Nuevo Atleta'

  // ── Navegación entre atletas (modo edición) ──
  function navigate(dir: -1 | 1) {
    const next = currentIndex + dir
    if (next < 0 || next >= athletes.length) return
    setCurrentIndex(next)
    setActiveAthleteId(athletes[next].public_id)
    setTouched(false)
  }

  // ── Actualiza un campo del formulario ──
  function setField(field: keyof FormFields, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  // ── Envío ──
  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setTouched(true)
    if (hasErrors) return

    const payload: Record<string, unknown> = {
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    }
    if (form.date_of_birth) payload.date_of_birth = form.date_of_birth
    if (form.height !== '') payload.height = Number(form.height)
    if (form.weight !== '') payload.weight = Number(form.weight)
    if (form.jersey_number !== '') payload.jersey_number = Number(form.jersey_number)

    setSubmitting(true)
    try {
      if (mode === 'create') {
        await apiRequest('/people/athletes', { method: 'POST', body: JSON.stringify(payload) })
        onSuccess('Atleta creado correctamente.')
      } else {
        await apiRequest(`/people/athletes/${activeAthleteId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        onSuccess('Atleta actualizado correctamente.')
      }
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
        <h1 className="text-lg font-black text-slate-900 truncate">{athleteLabel}</h1>
        <span className="ml-auto rounded-full bg-[var(--color-brand-primary-soft)] px-3 py-1 text-xs font-bold text-[var(--color-brand-primary)]">
          {mode === 'create' ? 'Nuevo' : 'Editar'}
        </span>
      </header>

      {/* ── Navegación entre atletas (solo en edición) ── */}
      {mode === 'edit' && athletes.length > 1 && (
        <div className="flex items-center justify-center gap-4 border-b border-slate-100 bg-slate-50 px-6 py-2.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={currentIndex === 0}
            aria-label="Atleta anterior"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-400 disabled:opacity-30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-xs font-medium text-slate-500">
            <span className="font-bold text-slate-700">{currentIndex + 1}</span> / {athletes.length}
          </p>
          <button
            type="button"
            onClick={() => navigate(1)}
            disabled={currentIndex === athletes.length - 1}
            aria-label="Atleta siguiente"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:border-slate-400 disabled:opacity-30 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* ── Formulario ── */}
      <main className="flex-1 overflow-y-auto px-6 py-8">
        {loadingDetail ? (
          <p className="text-sm text-slate-500">Cargando datos del atleta...</p>
        ) : (
          <form
            id="athlete-form"
            onSubmit={handleSubmit}
            noValidate
            className="mx-auto max-w-2xl"
          >
            <fieldset className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <legend className="px-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                Datos personales
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField id="athlete-first-name" label="Nombre" field="first_name" value={form.first_name} setField={setField} error={touched ? errors.first_name : ''} required placeholder="ej. Carlos" />
                <FormField id="athlete-last-name" label="Apellido" field="last_name" value={form.last_name} setField={setField} error={touched ? errors.last_name : ''} required placeholder="ej. García" />
                <FormField id="athlete-email" label="Email" field="email" type="email" value={form.email} setField={setField} error={touched ? errors.email : ''} required placeholder="atleta@club.es" />
                <FormField id="athlete-phone" label="Teléfono" field="phone" value={form.phone} setField={setField} error={touched ? errors.phone : ''} required placeholder="+34 600 000 000" />
                <FormField id="athlete-dob" label="Fecha de nacimiento" field="date_of_birth" type="date" value={form.date_of_birth} setField={setField} error={touched ? errors.date_of_birth : ''} />
              </div>
            </fieldset>

            <fieldset className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <legend className="px-2 text-sm font-bold text-slate-500 uppercase tracking-wider">
                Datos físicos
              </legend>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <FormField id="athlete-height" label="Altura (cm)" field="height" value={form.height} setField={setField} error={touched ? errors.height : ''} placeholder="175" />
                <FormField id="athlete-weight" label="Peso (kg)" field="weight" value={form.weight} setField={setField} error={touched ? errors.weight : ''} placeholder="70" />
                <FormField id="athlete-jersey" label="Número jersey" field="jersey_number" value={form.jersey_number} setField={setField} error={touched ? errors.jersey_number : ''} placeholder="7" />
              </div>
            </fieldset>
          </form>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-1px_4px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          form="athlete-form"
          disabled={submitting || (touched && hasErrors)}
          className="rounded-xl bg-[var(--color-brand-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-brand-primary-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? 'Guardando...' : 'Aceptar'}
        </button>
      </footer>

      {/* ── Modal de error de API ── */}
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
