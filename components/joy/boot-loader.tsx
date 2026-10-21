'use client'

import { useEffect, useState } from 'react'
import { PageLoader } from '@/components/joy/page-loader'

/**
 * Shown on every first load. It is part of the server HTML, so it paints as soon as the
 * page starts arriving, and it leaves (with a short fade) once the page has hydrated and
 * finished loading. A fast load never sees it: it stays invisible for its first 350 ms.
 */
const PREVIEW = process.env.NEXT_PUBLIC_JOY_PREVIEW === '1'

export function BootLoader() {
  const [phase, setPhase] = useState<'on' | 'out' | 'gone'>('on')

  useEffect(() => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      // Static review build only: every page is a full load there, so remember the first one.
      if (PREVIEW) { try { sessionStorage.setItem('joy-booted', '1') } catch {} }
      setPhase('out')
      window.setTimeout(() => setPhase('gone'), 500)
    }
    const ready = () => window.setTimeout(finish, 80)
    if (document.readyState === 'complete') ready()
    else window.addEventListener('load', ready, { once: true })
    const cap = window.setTimeout(finish, 12000) // never trap the page behind it
    return () => { window.removeEventListener('load', ready); window.clearTimeout(cap) }
  }, [])

  if (phase === 'gone') return null
  return (
    <div className={phase === 'out' ? 'joy-boot joy-boot-out' : 'joy-boot'}>
      <div className="joy-boot-night"><PageLoader kind="night" /></div>
      {PREVIEW && <div className="joy-boot-classic"><PageLoader /></div>}
    </div>
  )
}
