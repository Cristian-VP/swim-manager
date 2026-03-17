import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import { apiErrorMessage, apiRequest } from '../../lib/api'

type AthleteListItem = {
  public_id: string
  first_name: string
  last_name: string
  jersey_number: number | null
}

type AddressListItem = {
  public_id: string
  formatted_address: string
}

type AthleteDetail = {
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
  } | null
}

type AthleteFormState = {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  height: string
  weight: string
  jersey_number: string
  address_public_id: string
}

const INITIAL_FORM: AthleteFormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  date_of_birth: '',
  height: '',
  weight: '',
  jersey_number: '',
  address_public_id: '',
}

function toNullableNumber(value: string): number | null {
  if (!value.trim()) {
    return null
  }
  return Number(value)
}

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<AthleteListItem[]>([])
  const [addresses, setAddresses] = useState<AddressListItem[]>([])
  const [form, setForm] = useState<AthleteFormState>(INITIAL_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string>('')

  const pageTitle = useMemo(() => {
    return editingId ? 'Editar atleta' : 'Nuevo atleta'
  }, [editingId])

  async function loadAthletes() {
    const data = await apiRequest<AthleteListItem[]>('/people/athletes')
    setAthletes(data)
  }

  async function loadAddresses() {
    const data = await apiRequest<AddressListItem[]>('/core/addresses')
    setAddresses(data)
  }

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setFeedback('')
      try {
        await Promise.all([loadAthletes(), loadAddresses()])
      } catch (error) {
        if (alive) {
          setFeedback(apiErrorMessage(error))
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

  function resetForm() {
    setForm(INITIAL_FORM)
    setEditingId(null)
  }

  async function startEdit(publicId: string) {
    setLoading(true)
    setFeedback('')
    try {
      const detail = await apiRequest<AthleteDetail>(`/people/athletes/${publicId}`)
      setForm({
        first_name: detail.first_name,
        last_name: detail.last_name,
        email: detail.email,
        phone: detail.phone,
        date_of_birth: detail.date_of_birth ?? '',
        height: detail.height?.toString() ?? '',
        weight: detail.weight?.toString() ?? '',
        jersey_number: detail.jersey_number?.toString() ?? '',
        address_public_id: detail.address?.public_id ?? '',
      })
      setEditingId(publicId)
    } catch (error) {
      setFeedback(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback('')

    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
      email: form.email,
      phone: form.phone,
      date_of_birth: form.date_of_birth || null,
      height: toNullableNumber(form.height),
      weight: toNullableNumber(form.weight),
      jersey_number: toNullableNumber(form.jersey_number),
      address_public_id: form.address_public_id || null,
    }

    try {
      if (editingId) {
        await apiRequest(`/people/athletes/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setFeedback('Atleta actualizado correctamente.')
      } else {
        await apiRequest('/people/athletes', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setFeedback('Atleta creado correctamente.')
      }

      await loadAthletes()
      resetForm()
    } catch (error) {
      setFeedback(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:px-10">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Athlete Management</h1>
        <p className="mt-1 text-sm text-slate-600">Listado, creacion y edicion con selector de direccion.</p>
      </header>

      {feedback ? (
        <p className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">{feedback}</p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="text-lg font-bold text-slate-900">Atletas ({athletes.length})</h2>

          {loading && athletes.length === 0 ? <p className="mt-3 text-sm text-slate-500">Cargando...</p> : null}

          <ul className="mt-4 space-y-2">
            {athletes.map((athlete) => (
              <li key={athlete.public_id} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {athlete.first_name} {athlete.last_name}
                  </p>
                  <p className="text-xs text-slate-500">Jersey: {athlete.jersey_number ?? 'sin asignar'}</p>
                </div>
                <button
                  type="button"
                  onClick={() => startEdit(athlete.public_id)}
                  className="rounded-lg border border-slate-400 px-3 py-1 text-xs font-medium text-slate-700 hover:border-slate-700"
                >
                  Editar
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="text-lg font-bold text-slate-900">{pageTitle}</h2>

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <input
                required
                value={form.first_name}
                onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Nombre"
              />
              <input
                required
                value={form.last_name}
                onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Apellidos"
              />
            </div>

            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Email"
            />

            <div className="grid gap-3 md:grid-cols-2">
              <input
                value={form.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Telefono"
              />
              <input
                type="date"
                value={form.date_of_birth}
                onChange={(event) => setForm((prev) => ({ ...prev, date_of_birth: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <input
                type="number"
                value={form.height}
                onChange={(event) => setForm((prev) => ({ ...prev, height: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Altura (cm)"
              />
              <input
                type="number"
                value={form.weight}
                onChange={(event) => setForm((prev) => ({ ...prev, weight: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Peso (kg)"
              />
              <input
                type="number"
                value={form.jersey_number}
                onChange={(event) => setForm((prev) => ({ ...prev, jersey_number: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                placeholder="Dorsal"
              />
            </div>

            <select
              value={form.address_public_id}
              onChange={(event) => setForm((prev) => ({ ...prev, address_public_id: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Sin direccion</option>
              {addresses.map((address) => (
                <option key={address.public_id} value={address.public_id}>
                  {address.formatted_address}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {editingId ? 'Guardar cambios' : 'Crear atleta'}
              </button>
              {editingId ? (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  Cancelar
                </button>
              ) : null}
            </div>
          </form>
        </article>
      </section>
    </main>
  )
}
