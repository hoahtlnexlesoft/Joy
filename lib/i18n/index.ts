'use client'

import { useCallback, useSyncExternalStore } from 'react'
import { MM } from './mm'

/**
 * Tiny client-side i18n: English text is the key, and `mm.ts` holds the Myanmar
 * translation for it. A string without a translation simply stays English, so
 * pages can be translated gradually. The chosen language is kept in localStorage.
 */
export type Lang = 'en' | 'mm'

const KEY = 'joy-lang'
let memory: Lang = 'en'
let cache: Lang | undefined
const listeners = new Set<() => void>()

function read(): Lang {
  try {
    const v = window.localStorage.getItem(KEY)
    if (v === 'en' || v === 'mm') return v
  } catch { /* storage can be blocked, fall back to memory */ }
  return memory
}
function snapshot(): Lang {
  if (cache === undefined) cache = read()
  return cache
}

export function setLang(next: Lang) {
  memory = next
  cache = next
  try { window.localStorage.setItem(KEY, next) } catch { /* ignore */ }
  listeners.forEach((l) => l())
}

export function useLang(): Lang {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => { listeners.delete(cb) } },
    snapshot,
    () => 'en', // server render and first hydration pass are always English
  )
}

/** `const t = useT()` then `t('Log in')`. */
export function useT() {
  const lang = useLang()
  return useCallback((text: string) => (lang === 'mm' ? MM[text] ?? text : text), [lang])
}
