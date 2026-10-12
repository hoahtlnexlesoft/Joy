'use client'

import { useSyncExternalStore } from 'react'

export type JoySession = { name: string; method: 'Apple' | 'Google' | 'Phone' | 'Email' } | null

const KEY = 'joy-session'
let memory: JoySession = null
const listeners = new Set<() => void>()

function read(): JoySession {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as JoySession
  } catch { /* storage can be blocked, fall back to memory */ }
  return memory
}
let cache: JoySession | undefined
function snapshot(): JoySession {
  if (cache === undefined) cache = read()
  return cache
}
function emit(next: JoySession) {
  memory = next
  cache = next
  try {
    if (next) window.localStorage.setItem(KEY, JSON.stringify(next))
    else window.localStorage.removeItem(KEY)
  } catch { /* ignore */ }
  listeners.forEach((l) => l())
}

export const joyLogin = (s: NonNullable<JoySession>) => emit(s)
export const joyLogout = () => emit(null)
export const DEMO_PARENT: NonNullable<JoySession> = { name: 'Bruce Smith', method: 'Apple' }

export function useJoySession(): JoySession | undefined {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb) } },
    snapshot,
    () => undefined, // undefined = not known yet (server render)
  )
}
