import { useEffect, useRef, useState } from 'react'

type Props = {
  label: string
  durationSeconds?: number
  onConfirm: () => void
  onCancel: () => void
}

/**
 * Toast con cuenta atrás para confirmar un DELETE.
 * Si el usuario no pulsa Cancelar antes de que el tiempo llegue a 0,
 * se ejecuta onConfirm automáticamente.
 */
export function DeleteCountdownToast({ label, durationSeconds = 5, onConfirm, onCancel }: Props) {
  const [remaining, setRemaining] = useState(durationSeconds)
  const confirmedRef = useRef(false)

  useEffect(() => {
    if (remaining <= 0) {
      if (!confirmedRef.current) {
        confirmedRef.current = true
        onConfirm()
      }
      return
    }

    const timer = setTimeout(() => setRemaining((r) => r - 1), 1000)
    return () => clearTimeout(timer)
  }, [remaining, onConfirm])

  const progress = ((durationSeconds - remaining) / durationSeconds) * 100

  function handleCancel() {
    confirmedRef.current = true
    onCancel()
  }

  function handleConfirm() {
    confirmedRef.current = true
    onConfirm()
  }

  return (
    <div
      role="alertdialog"
      aria-live="assertive"
      aria-label="Confirmación de eliminación"
      className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-red-200 bg-white shadow-2xl overflow-hidden"
    >
      {/* Barra de progreso */}
      <div className="h-1 bg-red-100">
        <div
          className="h-full bg-red-500 transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100">
            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </span>
          <div>
            <p className="text-sm font-bold text-slate-900">¿Eliminar?</p>
            <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">{label}</p>
            <p className="mt-1 text-xs text-red-500 font-medium">
              Se eliminará automáticamente en {remaining}s
            </p>
          </div>
        </div>

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Eliminar ahora
          </button>
        </div>
      </div>
    </div>
  )
}
