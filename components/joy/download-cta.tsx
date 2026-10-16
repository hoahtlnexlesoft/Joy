'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Download } from '@/components/joy/cute-icons'
import { joyButtonClass } from './ui'
import { useT } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const APPLE_PATH =
  'M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66ZM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28Z'

function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn('fill-current', className)} aria-hidden="true">
      <path d={APPLE_PATH} />
    </svg>
  )
}

function PlayMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M3.6 2.2 13.3 12l-9.7 9.8c-.2-.2-.3-.6-.3-1V3.2c0-.4.1-.8.3-1Z" fill="#34a853" />
      <path d="m16.9 8.4-3.6 3.6-9.7-9.8c.3-.3.8-.3 1.3 0l12 6.2Z" fill="#4285f4" />
      <path d="M16.9 15.6 4.9 21.8c-.5.3-1 .3-1.3 0l9.7-9.8 3.6 3.6Z" fill="#ea4335" />
      <path d="m20.6 13-3.7 2.6-3.6-3.6 3.6-3.6 3.7 2.6c.9.6.9 1.4 0 2Z" fill="#fbbc04" />
    </svg>
  )
}

/** Gradient "Download app" button. Same look as the other Joy buttons, with a download icon. */
export function DownloadButton({ href = '#download', className, label }: { href?: string; className?: string; label?: string }) {
  const t = useT()
  return (
    <Link href={href} className={joyButtonClass('primary', className)}>
      <Download className="size-4 shrink-0" aria-hidden="true" />
      {t(label ?? 'Download app')}
    </Link>
  )
}

/** Cute App Store / Google Play pair. One size and style used everywhere on the site. */
export function StoreBadges({ className, tone = 'dark', children }: { className?: string; tone?: 'dark' | 'light'; children?: React.ReactNode }) {
  const t = useT()
  const base =
    'group inline-flex h-11 items-center gap-2 rounded-full py-0 pl-1.5 pr-4 text-[#2a2240] shadow-[0_8px_18px_-8px_rgba(238,90,138,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:rotate-[-1.5deg] hover:shadow-[0_12px_22px_-8px_rgba(238,90,138,0.7)]'
  const apple = 'bg-gradient-to-r from-[#ffe1ec] to-[#ffd0e0] ring-2 ring-white'
  const play = 'bg-gradient-to-r from-[#fff1c4] to-[#ffe3a3] ring-2 ring-white'
  const chip = 'grid size-8 shrink-0 place-items-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110'
  return (
    <div className={cn('flex flex-wrap items-center gap-2.5', className)} data-tone={tone}>
      <Link href="#download" className={cn(base, apple)} aria-label="App Store">
        <span className={chip}>
          <AppleMark className="size-[18px] text-[#2a2240]" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2a2240]/60">{t('Download on the')}</span>
          <span className="font-display text-[15px] font-semibold">App Store</span>
        </span>
      </Link>
      <Link href="#download" className={cn(base, play)} aria-label="Google Play">
        <span className={chip}>
          <PlayMark className="size-[18px]" />
        </span>
        <span className="flex flex-col leading-none">
          <span className="text-[9px] font-semibold uppercase tracking-wider text-[#2a2240]/60">{t('Get it on')}</span>
          <span className="font-display text-[15px] font-semibold">Google Play</span>
        </span>
      </Link>
      {children}
    </div>
  )
}

/** A slim "get the app" band that can be dropped between page sections. */
export function DownloadStrip({ className, tone = 'light' }: { className?: string; tone?: 'light' | 'dark' }) {
  const t = useT()
  const dark = tone === 'dark'
  return (
    <section aria-label={t('Download the app')} className={cn('px-4 py-5 md:py-6', className)}>
      <div
        className={cn(
          'mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 rounded-[2rem] px-6 py-5 md:flex-row md:px-8',
          dark ? 'bg-white/5 ring-1 ring-white/10' : 'bg-gradient-to-r from-[#fff1e6] via-[#fff7f1] to-[#fdeef5] ring-1 ring-black/[0.04]',
        )}
      >
        <div className="text-center md:text-left">
          <p className={cn('font-display text-xl font-medium', dark ? 'text-white' : 'text-[#2a2240]')}>{t('Get the Joy app')}</p>
          <p className={cn('text-sm', dark ? 'text-white/65' : 'text-foreground/70')}>{t('Free on iOS and Android')}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <DownloadButton className="h-11" />
          <StoreBadges tone={dark ? 'light' : 'dark'} className="hidden lg:flex" />
        </div>
      </div>
    </section>
  )
}

/** Mobile-only bar pinned to the bottom. Shown after the first screen, hidden while the download section is on screen. */
export function MobileDownloadBar() {
  const t = useT()
  const [show, setShow] = useState(false)
  useEffect(() => {
    let atTarget = false
    let past = false
    const update = () => setShow(past && !atTarget)
    const onScroll = () => {
      past = window.scrollY > 520
      update()
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    let io: IntersectionObserver | undefined
    const target = document.getElementById('download')
    if (target && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        atTarget = e.isIntersecting
        update()
      })
      io.observe(target)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])
  return (
    <div
      data-review-ui
      data-no-reveal
      aria-hidden={!show}
      className={cn(
        'fixed inset-x-0 z-[60] px-3 pr-[4.75rem] transition-all duration-300 md:hidden',
        // the client-review build has a Browse/Comment pill along the bottom edge: sit above it
        process.env.NEXT_PUBLIC_JOY_REVIEW === '1' ? 'bottom-[3.75rem]' : 'bottom-3',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0',
      )}
    >
      <Link
        href="#download"
        tabIndex={show ? 0 : -1}
        className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-joy text-[15px] font-semibold text-white shadow-[0_14px_30px_-10px_rgba(238,90,138,0.8)]"
      >
        <Download className="size-5" aria-hidden="true" />
        {t('Download the app')}
      </Link>
    </div>
  )
}
