import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'

import { apiErrorMessage, apiRequest } from '../../lib/api'

type Season = {
  public_id: string
  name: string
}

type Coach = {
  public_id: string
  first_name: string
  last_name: string
}

type Athlete = {
  public_id: string
  first_name: string
  last_name: string
}

type Venue = {
  public_id: string
  name: string
  venue_type: string
  indoor: boolean
}

type Training = {
  public_id: string
  name: string
  date: string
  season: Season
  focus: string
}

type TrainingFormState = {
  name: string
  date: string
  focus: string
  season_public_id: string
  venue_public_id: string
  coach_public_ids: string[]
  athlete_public_ids: string[]
}

const INITIAL_FORM: TrainingFormState = {
  name: '',
  date: '',
  focus: '',
  season_public_id: '',
  venue_public_id: '',
  coach_public_ids: [],
  athlete_public_ids: [],
}

export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<Training[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])
  const [coaches, setCoaches] = useState<Coach[]>([])
  const [athletes, setAthletes] = useState<Athlete[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [form, setForm] = useState<TrainingFormState>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  async function loadTrainings() {
    const data = await apiRequest<Training[]>('/scheduling/trainings')
    setTrainings(data)
  }

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setFeedback('')
      try {
        const [trainingData, seasonData, coachData, athleteData, venueData] = await Promise.all([
          apiRequest<Training[]>('/scheduling/trainings'),
          apiRequest<Season[]>('/scheduling/seasons'),
          apiRequest<Coach[]>('/people/coaches'),
          apiRequest<Athlete[]>('/people/athletes'),
          apiRequest<Venue[]>('/inventory/venues'),
        ])

        if (!alive) {
          return
        }

        setTrainings(trainingData)
        setSeasons(seasonData)
        setCoaches(coachData)
        setAthletes(athleteData)
        setVenues(venueData)
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

  function toggleSelection(value: string, field: 'coach_public_ids' | 'athlete_public_ids') {
    setForm((prev) => {
      const exists = prev[field].includes(value)
      return {
        ...prev,
        [field]: exists ? prev[field].filter((item) => item !== value) : [...prev[field], value],
      }
    })
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setFeedback('')

    try {
      const payload = {
        name: form.name,
        date: new Date(form.date).toISOString(),
        focus: form.focus,
        season_public_id: form.season_public_id,
        venue_public_id: form.venue_public_id || null,
        coach_public_ids: form.coach_public_ids,
        athlete_public_ids: form.athlete_public_ids,
      }

      await apiRequest('/scheduling/trainings', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setFeedback('Entrenamiento creado correctamente.')
      setForm(INITIAL_FORM)
      await loadTrainings()
    } catch (error) {
      setFeedback(apiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8 md:px-10">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Training Scheduling</h1>
        <p className="mt-1 text-sm text-slate-600">Crea sesiones con season, coaches, athletes y venue.</p>
      </header>

      {feedback ? (
        <p className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-700">{feedback}</p>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="text-lg font-bold text-slate-900">Entrenamientos ({trainings.length})</h2>

          {loading && trainings.length === 0 ? <p className="mt-3 text-sm text-slate-500">Cargando...</p> : null}

          <ul className="mt-4 space-y-2">
            {trainings.map((training) => (
              <li key={training.public_id} className="rounded-xl border border-slate-200 px-3 py-2">
                <p className="text-sm font-semibold text-slate-900">{training.name}</p>
                <p className="text-xs text-slate-500">{new Date(training.date).toLocaleString()} · {training.season.name}</p>
                <p className="text-xs text-slate-600">{training.focus || 'Sin foco definido'}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
          <h2 className="text-lg font-bold text-slate-900">Nuevo entrenamiento</h2>

          <form className="mt-4 space-y-3" onSubmit={onSubmit}>
            <input
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Nombre de sesion"
            />

            <input
              required
              type="datetime-local"
              value={form.date}
              onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            />

            <textarea
              value={form.focus}
              onChange={(event) => setForm((prev) => ({ ...prev, focus: event.target.value }))}
              className="min-h-20 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              placeholder="Focus de entrenamiento"
            />

            <select
              required
              value={form.season_public_id}
              onChange={(event) => setForm((prev) => ({ ...prev, season_public_id: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Selecciona temporada</option>
              {seasons.map((season) => (
                <option key={season.public_id} value={season.public_id}>
                  {season.name}
                </option>
              ))}
            </select>

            <select
              value={form.venue_public_id}
              onChange={(event) => setForm((prev) => ({ ...prev, venue_public_id: event.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Sin venue</option>
              {venues.map((venue) => (
                <option key={venue.public_id} value={venue.public_id}>
                  {venue.name} ({venue.venue_type})
                </option>
              ))}
            </select>

            <fieldset className="rounded-xl border border-slate-200 p-3">
              <legend className="px-1 text-xs font-semibold text-slate-700">Coaches (opcional)</legend>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {coaches.map((coach) => (
                  <label key={coach.public_id} className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.coach_public_ids.includes(coach.public_id)}
                      onChange={() => toggleSelection(coach.public_id, 'coach_public_ids')}
                    />
                    {coach.first_name} {coach.last_name}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="rounded-xl border border-slate-200 p-3">
              <legend className="px-1 text-xs font-semibold text-slate-700">Athletes</legend>
              <div className="mt-2 grid gap-2 md:grid-cols-2">
                {athletes.map((athlete) => (
                  <label key={athlete.public_id} className="flex items-center gap-2 text-xs text-slate-700">
                    <input
                      type="checkbox"
                      checked={form.athlete_public_ids.includes(athlete.public_id)}
                      onChange={() => toggleSelection(athlete.public_id, 'athlete_public_ids')}
                    />
                    {athlete.first_name} {athlete.last_name}
                  </label>
                ))}
              </div>
            </fieldset>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              Crear entrenamiento
            </button>
          </form>
        </article>
      </section>
    </main>
  )
}
