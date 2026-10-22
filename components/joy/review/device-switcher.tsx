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
    // the framed page has its own comment toolbar, so hide this page's one while the frame is open
    document.documentElement.setAttribute('data-joy-device', '1')
    return () => {
      document.body.style.overflow = prev
      document.documentElement.removeAttribute('data-joy-device')
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
      className={`h-[26px] cursor-pointer rounded-full px-2.5 text-[11.5px] font-semibold tracking-[.01em] transition-colors ${mode === k ? 'bg-[#7878E9] text-white' : 'bg-transparent text-white/75 hover:bg-white/10 hover:text-white'}`}
    >
      {label}
    </button>
  )

  return (
    <div data-review-ui data-no-reveal>
      {mode === 'desktop' ? (
        <div className="fixed bottom-3 left-3 z-[75] flex max-md:hidden gap-0.5 rounded-full bg-[#16172B] p-[3px] shadow-[0_8px_22px_-12px_rgba(22,23,43,.55)]">
          {TABS.map((t) => btn(t.key, t.label))}
        </div>
      ) : (
        <div className="fixed inset-0 z-[200] bg-[#F2F2F4]">
          <div className="absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-center gap-1.5 bg-[#16172B]">
            {TABS.map((t) => btn(t.key, t.label))}
          </div>
          <div className="flex justify-center px-3 pb-3 pt-14">
            <iframe
              ref={frame}
              src={src}
              title={`${mode} preview`}
              style={{ width: WIDTH[mode], maxWidth: '100%', height: 'calc(100vh - 5rem)' }}
              className="rounded-[28px] border-8 border-[#16172B] bg-white shadow-[0_16px_40px_-20px_rgba(22,23,43,.35)]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
