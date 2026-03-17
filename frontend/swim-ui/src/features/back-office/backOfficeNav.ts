export type BackOfficeNavItem = {
  label: string
  to?: string
  disabled?: boolean
  badge?: string
}

export const ACTIVE_BACKOFFICE_NAV: BackOfficeNavItem[] = [
  { label: 'Athletes', to: '/athletes' },
  { label: 'Trainings', to: '/trainings' },
]

export const PASSIVE_BACKOFFICE_NAV: BackOfficeNavItem[] = [
  { label: 'Configuracion', disabled: true },
]
