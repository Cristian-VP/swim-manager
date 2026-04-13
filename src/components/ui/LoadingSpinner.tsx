export function LoadingSpinner({ text = 'Cargando...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center space-x-2 py-6 text-slate-500">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600"></div>
      <span className="text-sm font-medium">{text}</span>
    </div>
  )
}
