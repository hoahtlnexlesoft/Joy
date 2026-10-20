'use client'

import { useEffect, useRef, useState } from 'react'

type Mode = 'desktop' | 'tablet' | 'mobile'
const TABS: { key: Mode; label: string }[] = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'mobile', label: 'Mobile' },
]
const WIDTH: Record<Exclude<Mode, 'desktop'>, number> = { tablet: 820, mobile: 390 }

/**
 * Review-only: lets a reviewer see the page at tablet / mobile width.
 * Tablet / Mobile open the current page in a device-sized frame; Desktop goes back.
 */
export function DeviceSwitcher() {
  const [mode, setMode] = useState<Mode>('desktop')
  const [inFrame, setInFrame] = useState(true) // assume yes until mounted (no flash inside the frame)
  const [src, setSrc] = useState('')
  const frame = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    setInFrame(window.self !== window.top)
  }, [])

  useEffect(() => {
    if (mode === 'desktop') return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mode])

  if (inFrame) return null

  const pick = (m: Mode) => {
    if (m === mode) return
    if (m === 'desktop') {
      // continue on the page the reviewer navigated to inside the frame
      let path = ''
      try {
        const l = frame.current?.contentWindow?.location
        if (l) path = l.pathname + l.search + l.hash
      } catch {}
      const here = location.pathname + location.search + location.hash
      setMode('desktop')
      if (path && path !== here) location.assign(path)
      return
    }
    if (mode === 'desktop') setSrc(location.pathname + location.search + location.hash)
    setMode(m)
  }

  const btn = (k: Mode, label: string) => (
    <button
      key={k}
      type="button"
      onClick={() => pick(k)}
      aria-pressed={mode === k}
      className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold shadow-[0_1px_4px_rgba(0,0,0,.12)] transition ${mode === k ? 'bg-[#306eed] text-white' : 'bg-white text-[#2a2240] hover:bg-slate-50'}`}
    >
      {label}
    </button>
  )

  return (
    <div data-review-ui data-no-reveal>
      {mode === 'desktop' ? (
        <div className="fixed bottom-3 left-3 z-[75] flex max-md:hidden gap-1.5 rounded-full bg-white/85 p-1.5 shadow-[0_4px_16px_rgba(0,0,0,.18)] backdrop-blur">
          {TABS.map((t) => btn(t.key, t.label))}
        </div>
      ) : (
        <div className="fixed inset-0 z-[200] bg-[#e8e2f0]">
          <div className="absolute inset-x-0 top-0 z-10 flex h-[52px] items-center justify-center gap-2 bg-white/75 backdrop-blur">
            {TABS.map((t) => btn(t.key, t.label))}
          </div>
          <div className="flex justify-center px-3 pb-3 pt-16">
            <iframe
              ref={frame}
              src={src}
              title={`${mode} preview`}
              style={{ width: WIDTH[mode], maxWidth: '100%', height: 'calc(100vh - 5rem)' }}
              className="rounded-[28px] border-8 border-[#2a2240] bg-white shadow-[0_20px_50px_rgba(60,30,90,.25)]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
