import { useEffect, useState } from 'react'
import { apiErrorMessage, apiRequest } from '../../lib/api'
import { AthleteList, type AthleteListItem } from './components/AthleteList'
import { AthleteDetail } from './components/AthleteDetail'
import { ErrorMessage } from '../../components/ui/ErrorMessage'

export default function AthletesPage() {
  const [athletes, setAthletes] = useState<AthleteListItem[]>([])
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadError, setLoadError] = useState<string>('')

  useEffect(() => {
    let alive = true

    async function load() {
      setLoading(true)
      setLoadError('')
      try {
        const data = await apiRequest<AthleteListItem[]>('/people/athletes')
        if (alive) {
          setAthletes(data)
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
        <h1 className="text-3xl font-black text-slate-900">Catalogo de Atletas</h1>
        <p className="mt-1 text-sm text-slate-600">Explora el listado de atletas registrados y sus detalles completos.</p>
      </header>

      <ErrorMessage message={loadError} />

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
              Usa el listado de la izquierda para ver la informacion completa de una persona, como sus medidas y datos de contacto.
            </p>
          ) : (
            <AthleteDetail 
              publicId={selectedAthleteId} 
              onClose={() => setSelectedAthleteId(null)} 
            />
          )}
        </article>
      </section>
    </main>
  )
}
