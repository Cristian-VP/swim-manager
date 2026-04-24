import { useEffect, useState, useMemo } from 'react'

export type CompetitionListItem = {
  public_id: string
  name: string
  date: string
}

type Props = {
  competitions: CompetitionListItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreateNew: () => void
}

export function CompetitionCalendar({ competitions, selectedId, onSelect, onCreateNew }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date())

  useEffect(() => {
    if (competitions.length === 0) return

    const now = new Date()
    const currentMonthComps = competitions.filter(c => {
      const d = new Date(c.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })

    if (currentMonthComps.length === 0) {
      const upcoming = competitions.filter(c => new Date(c.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      
      const targetComps = upcoming.length > 0 ? upcoming : competitions
      if (targetComps.length > 0) {
        const targetDate = new Date(targetComps[0].date)
        setCurrentDate(new Date(targetDate.getFullYear(), targetDate.getMonth(), 1))
        
        if (!selectedId) {
          onSelect(targetComps[0].public_id)
        }
      }
    }
  }, [competitions, selectedId, onSelect])

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))

  const { days, year, monthName } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const monthFormatter = new Intl.DateTimeFormat('es-ES', { month: 'long' })
    const formattedMonth = monthFormatter.format(currentDate)
    const monthName = formattedMonth.charAt(0).toUpperCase() + formattedMonth.slice(1)

    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const startDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    
    const calendarDays = []
    
    for (let i = 0; i < startDayIndex; i++) {
        calendarDays.push(null)
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i)
    }

    return { days: calendarDays, year, monthName }
  }, [currentDate])

  const getCompsForDay = (day: number | null) => {
    if (!day) return []
    return competitions.filter(c => {
      const d = new Date(c.date)
      return d.getDate() === day && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear()
    })
  }

  const closestUpcomingId = useMemo(() => {
    const now = new Date()
    const upcoming = competitions.filter(c => new Date(c.date) >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    return upcoming.length > 0 ? upcoming[0].public_id : null
  }, [competitions])

  return (
    <article className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm w-full font-sans">
      <header className="mb-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800">{monthName} {year}</h2>
          <div className="flex space-x-1">
            <button onClick={prevMonth} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Mes anterior">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button onClick={nextMonth} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 transition-colors" aria-label="Mes siguiente">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <button
          type="button"
          id="btn-new-competition"
          onClick={onCreateNew}
          className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-brand-primary)] px-3 py-2 text-xs font-semibold text-[var(--color-brand-primary)] hover:bg-[var(--color-brand-primary-soft)] transition-colors"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Competición
        </button>
      </header>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-slate-400">
        <div>L</div><div>M</div><div>X</div><div>J</div><div>V</div><div>S</div><div>D</div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const comps = getCompsForDay(day)
          const hasComp = comps.length > 0
          
          let circleClasses = "h-8 w-8 rounded-full flex items-center justify-center text-sm transition-all"
          let isSelectable = false
          
          if (!day) {
            circleClasses += " bg-transparent text-transparent"
          } else if (hasComp) {
            isSelectable = true
            const isSelected = comps.some(c => c.public_id === selectedId)
            const isClosest = comps.some(c => c.public_id === closestUpcomingId)
            
            if (isSelected) {
              circleClasses += " bg-[var(--color-brand-primary)] text-white font-bold"
            } else if (isClosest && !selectedId) {
               circleClasses += " bg-[var(--color-brand-primary)] text-white font-bold"
            } else {
              circleClasses += " bg-slate-200 text-slate-800 font-bold hover:bg-slate-300"
            }
          } else {
            circleClasses += " text-slate-600 font-medium hover:bg-slate-100"
          }

          return (
             <div key={idx} className="flex justify-center p-1">
               {isSelectable ? (
                 <button
                   onClick={() => onSelect(comps[0].public_id)}
                   className={circleClasses}
                   title={comps.map(c => c.name).join(', ')}
                 >
                   {day}
                 </button>
               ) : (
                 <div className={circleClasses}>{day}</div>
               )}
             </div>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
          <div className="h-3 w-3 rounded-full bg-[var(--color-brand-primary)]"></div>
          <span>Seleccionada / Próxima</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <div className="h-3 w-3 rounded-full bg-slate-200 border border-slate-300"></div>
          <span>Otras competiciones</span>
        </div>
      </div>
    </article>
  )
}
