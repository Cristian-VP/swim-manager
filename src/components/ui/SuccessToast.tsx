import { useEffect } from 'react'

type Props = {
  message: string
  onClose: () => void
  duration?: number
}

export function SuccessToast({ message, onClose, duration = 3500 }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 shadow-lg animate-in"
      style={{ animation: 'slideUp 0.25s ease' }}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500">
        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </span>
      <p className="text-sm font-semibold text-emerald-800">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar notificación"
        className="ml-2 text-emerald-400 hover:text-emerald-700 transition-colors"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
