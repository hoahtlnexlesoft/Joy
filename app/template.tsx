'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { startReveal } from '@/components/joy/reveal'

export default function Template({ children }: { children: React.ReactNode }) {
  // Re-mounts on every navigation, so the enter animation plays on each page change.
  const pathname = usePathname() || '/'
  const last = pathname.replace(/\/$/, '').split('/').pop() || ''
  const on = last !== 'parent'
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!on || !ref.current) return
    return startReveal(ref.current)
  }, [on])

  return (
    <div ref={ref} className={on ? 'joy-rv' : undefined}>
      {children}
    </div>
  )
}
