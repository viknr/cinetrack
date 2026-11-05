export type DemoSession = {
  displayName: string
  userId: string
  token: string
}

type StoredAccount = {
  displayName: string
  email: string
  salt: string
  passwordHash: string
}

const sessionStorageKey = 'cinetrack-demo-session'
const accountsStorageKey = 'cinetrack-demo-accounts'
const demoEmail = 'demo@cinetrack.local'
const demoPassword = 'FilmNight2026!'
const pbkdf2Iterations = 120_000

function readAccounts(): StoredAccount[] {
  try {
    const stored = window.localStorage.getItem(accountsStorageKey)
    if (!stored) return []
    const parsed: unknown = JSON.parse(stored)
    if (Array.isArray(parsed) && parsed.every((account) => account && typeof account.email === 'string'
      && typeof account.displayName === 'string' && typeof account.salt === 'string' && typeof account.passwordHash === 'string')) {
      return parsed as StoredAccount[]
    }
  } catch {
    window.localStorage.removeItem(accountsStorageKey)
  }
  return []
}

function saveSession(displayName: string, userId: string): DemoSession {
  const token = `demo-${window.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
  const session = { displayName, userId, token }
  window.localStorage.setItem(sessionStorageKey, JSON.stringify(session))
  return session
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

async function passwordVerifier(password: string, salt: ArrayBuffer): Promise<string> {
  const keyMaterial = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await window.crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new Uint8Array(salt), iterations: pbkdf2Iterations, hash: 'SHA-256' }, keyMaterial, 256)
  return bytesToHex(new Uint8Array(bits))
}

export function readDemoSession(): DemoSession | null {
  try {
    const stored = window.localStorage.getItem(sessionStorageKey)
    if (!stored) return null
    const session: unknown = JSON.parse(stored)
    if (session && typeof session === 'object' && 'displayName' in session && 'token' in session
      && typeof session.displayName === 'string' && typeof session.token === 'string') {
      const storedUserId = 'userId' in session && typeof session.userId === 'string' ? session.userId : ''
      const matchingAccounts = readAccounts().filter((account) => account.displayName === session.displayName)
      const userId = storedUserId || (matchingAccounts.length === 1 ? matchingAccounts[0].email
        : session.displayName === 'Alex Morgan' ? demoEmail : `legacy:${session.token}`)
      const upgradedSession = { displayName: session.displayName, userId, token: session.token }
      if (!storedUserId) window.localStorage.setItem(sessionStorageKey, JSON.stringify(upgradedSession))
      return upgradedSession
    }
  } catch {
    window.localStorage.removeItem(sessionStorageKey)
  }
  return null
}

export async function signInWithCredentials(email: string, password: string): Promise<DemoSession | null> {
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail === demoEmail && password === demoPassword) return saveSession('Alex Morgan', demoEmail)

  const account = readAccounts().find((item) => item.email === normalizedEmail)
  if (!account) return null
  const saltBytes = Uint8Array.from(account.salt.match(/.{1,2}/g) ?? [], (byte) => Number.parseInt(byte, 16))
  const candidate = await passwordVerifier(password, saltBytes.buffer as ArrayBuffer)
  if (candidate !== account.passwordHash) return null
  return saveSession(account.displayName, account.email)
}

export async function registerAccount(displayName: string, email: string, password: string): Promise<{ session?: DemoSession; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase()
  if (normalizedEmail === demoEmail || readAccounts().some((account) => account.email === normalizedEmail)) {
    return { error: 'An account with that email already exists. Try signing in instead.' }
  }

  const saltBuffer = new ArrayBuffer(16)
  const salt = window.crypto.getRandomValues(new Uint8Array(saltBuffer))
  const account: StoredAccount = {
    displayName: displayName.trim(),
    email: normalizedEmail,
    salt: bytesToHex(salt),
    passwordHash: await passwordVerifier(password, saltBuffer),
  }
  window.localStorage.setItem(accountsStorageKey, JSON.stringify([...readAccounts(), account]))
  return { session: saveSession(account.displayName, account.email) }
}

export function clearDemoSession() {
  window.localStorage.removeItem(sessionStorageKey)
}
