export const DEMO_USER = {
  email: 'operador@club.com',
  password: 'password123',
}

const AUTH_KEY = 'mock_auth_token'

export function loginWithMockCredentials(email: string, password: string): boolean {
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    localStorage.setItem(AUTH_KEY, 'authenticated')
    return true
  }
  return false
}

export function isMockAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === 'authenticated'
}

export function logoutMockSession(): void {
  localStorage.removeItem(AUTH_KEY)
}
