'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Play, X } from '@/components/joy/cute-icons'
import { joyButtonClass } from '../ui'

const VIDEO_MP4 = '/videos/joy-daily-activities.mp4'
const VIDEO_WEBM = '/videos/joy-daily-activities.webm'
const POSTER = '/videos/joy-daily-activities-poster.webp'

export function VideoButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', k)
      btnRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <button ref={btnRef} type="button" onClick={(e) => { if (!e.defaultPrevented) setOpen(true) }} className={joyButtonClass('ghost', className)} aria-haspopup="dialog">
        {children}
      </button>
      {open &&
        createPortal(
        <div
          data-no-reveal
          role="dialog"
          aria-modal="true"
          aria-label="How Joy works – video"
          className="fixed inset-0 z-[100] grid place-items-center bg-[#2a2240]/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[1.75rem] bg-black shadow-2xl ring-1 ring-white/20" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-foreground shadow hover:bg-white"
              aria-label="Close video"
            >
              <X className="size-5" />
            </button>
            <video controls autoPlay playsInline poster={POSTER} className="aspect-video w-full bg-black">
              <source src={VIDEO_WEBM} type="video/webm" />
              <source src={VIDEO_MP4} type="video/mp4" />
              Your browser does not support inline video playback.
            </video>
          </div>
        </div>
      , document.body)}
    </>
  )
}
