export type DemoSession = {
  displayName: string
  token: string
}

const sessionStorageKey = 'cinetrack-demo-session'

export function readDemoSession(): DemoSession | null {
  try {
    const stored = window.localStorage.getItem(sessionStorageKey)
    if (!stored) return null
    const session: unknown = JSON.parse(stored)
    if (session && typeof session === 'object' && 'displayName' in session && 'token' in session
      && typeof session.displayName === 'string' && typeof session.token === 'string') {
      return session as DemoSession
    }
  } catch {
    window.localStorage.removeItem(sessionStorageKey)
  }
  return null
}

export function createDemoSession(displayName: string): DemoSession {
  const token = `demo-${window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
  const session = { displayName: displayName.trim(), token }
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session))
  return session
}

export function clearDemoSession() {
  window.localStorage.removeItem(sessionStorageKey)
}
