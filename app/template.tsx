'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { startReveal } from '@/components/joy/reveal'

export default function Template({ children }: { children: React.ReactNode }) {
  // Re-mounts on every navigation, so the enter animation plays on each page change.
  const pathname = usePathname() || '/'
  // The static review build serves pages as /home.html, /pricing.html ...
  const norm = pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/'
  // Hosted previews may add a path prefix, so only look at the last segment.
  const last = norm.split('/').pop() || ''
  const on = !['parent', 'device'].includes(last)
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
