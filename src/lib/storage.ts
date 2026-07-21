import type { Message } from './types'

export interface Session {
  id: string
  title: string
  mode: 'chat' | 'conversation'
  createdAt: number
  updatedAt: number
  messages: Message[]
}

const STORAGE_KEY = 'coach-sessions'
const MAX_SESSIONS = 50

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function generateTitle(messages: Message[]): string {
  const firstUserMsg = messages.find((m) => m.role === 'user')
  if (!firstUserMsg) return 'Nouvelle conversation'
  const text = firstUserMsg.content.slice(0, 50)
  return text.length < firstUserMsg.content.length ? text + '...' : text
}

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const sessions: Session[] = JSON.parse(raw)
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    return []
  }
}

export function saveSessions(sessions: Session[]): void {
  try {
    const sorted = sessions.sort((a, b) => b.updatedAt - a.updatedAt)
    const trimmed = sorted.slice(0, MAX_SESSIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // storage full or unavailable
  }
}

export function createSession(mode: 'chat' | 'conversation'): Session {
  const now = Date.now()
  const session: Session = {
    id: generateId(),
    title: 'Nouvelle conversation',
    mode,
    createdAt: now,
    updatedAt: now,
    messages: [],
  }
  const sessions = loadSessions()
  sessions.push(session)
  saveSessions(sessions)
  return session
}

export function addMessage(sessionId: string, message: Message): Session | null {
  const sessions = loadSessions()
  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null

  session.messages.push(message)
  session.updatedAt = Date.now()
  session.title = generateTitle(session.messages)

  saveSessions(sessions)
  return session
}

export function updateSessionMessages(sessionId: string, messages: Message[]): Session | null {
  const sessions = loadSessions()
  const session = sessions.find((s) => s.id === sessionId)
  if (!session) return null

  session.messages = messages
  session.updatedAt = Date.now()
  if (messages.length > 0) {
    session.title = generateTitle(messages)
  }

  saveSessions(sessions)
  return session
}

export function deleteSession(sessionId: string): void {
  const sessions = loadSessions()
  const filtered = sessions.filter((s) => s.id !== sessionId)
  saveSessions(filtered)
}

export function getSession(sessionId: string): Session | null {
  const sessions = loadSessions()
  return sessions.find((s) => s.id === sessionId) || null
}
