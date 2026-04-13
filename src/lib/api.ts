const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1').replace(/\/$/, '')

export class ApiError extends Error {
  status: number
  detail: unknown

  constructor(status: number, detail: unknown) {
    super(typeof detail === 'string' ? detail : `API error (${status})`)
    this.status = status
    this.detail = detail
  }
}

async function parseResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  return response.text()
}

export async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    const detail =
      typeof body === 'object' && body !== null && 'detail' in body
        ? (body as { detail: unknown }).detail
        : body
    throw new ApiError(response.status, detail)
  }

  return body as T
}

export function apiErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 404) {
      return 'No se encontro el recurso relacionado (404). Revisa los IDs seleccionados.'
    }
    if (error.status === 409) {
      return 'Conflicto de datos (409). Puede existir un registro duplicado.'
    }
    if (error.status === 422) {
      if (Array.isArray(error.detail)) {
        return `Validacion fallida (422): ${error.detail
          .map((item) => {
            if (typeof item === 'object' && item !== null && 'msg' in item) {
              return String((item as { msg: unknown }).msg)
            }
            return String(item)
          })
          .join(' | ')}`
      }
      return 'Validacion fallida (422). Revisa los campos del formulario.'
    }
    if (error.status >= 500) {
      const detailText = typeof error.detail === 'string' ? error.detail : ''
      if (/relation\s+"[^"]+"\s+does not exist/i.test(detailText)) {
        return 'La base de datos no esta preparada (faltan tablas). Ejecuta migrate y carga fixtures del backend.'
      }
      return 'Error interno del servidor (500). Revisa backend y logs.'
    }
    return `Error HTTP ${error.status}.`
  }

  if (error instanceof Error) {
    if (isConnectionError(error)) {
      return `No se pudo conectar con la API (${API_BASE}). Revisa backend, puerto y VITE_API_BASE_URL.`
    }
    return error.message
  }

  return 'Ocurrio un error inesperado.'
}

export function isConnectionError(error: unknown): boolean {
  if (error instanceof ApiError) {
    return false
  }

  if (error instanceof Error) {
    return /NetworkError when attempting to fetch resource|Failed to fetch|Load failed/i.test(error.message)
  }

  return false
}
