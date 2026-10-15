'use client'

import { useEffect, useId } from 'react'
import { cn } from '@/lib/utils'
import { setLang, useLang, type Lang } from '@/lib/i18n'

/** Round UK flag. Drawn as SVG because flag emoji do not render on Windows. */
export function FlagUK({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <clipPath id={id}><circle cx="12" cy="12" r="12" /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#fff" strokeWidth="4.5" />
        <path d="M0 0 24 24M24 0 0 24" stroke="#C8102E" strokeWidth="1.6" />
        <path d="M12 0v24M0 12h24" stroke="#fff" strokeWidth="7" />
        <path d="M12 0v24M0 12h24" stroke="#C8102E" strokeWidth="4" />
      </g>
    </svg>
  )
}

/** Round Myanmar flag (yellow, green, red with a white star). */
export function FlagMM({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <clipPath id={id}><circle cx="12" cy="12" r="12" /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect y="0" width="24" height="8.1" fill="#FECB00" />
        <rect y="8" width="24" height="8.1" fill="#34B233" />
        <rect y="16" width="24" height="8" fill="#EA2839" />
        <polygon fill="#fff" points="12.00,5.00 13.71,10.25 19.23,10.25 14.76,13.50 16.47,18.75 12.00,15.50 7.53,18.75 9.24,13.50 4.77,10.25 10.29,10.25" />
      </g>
    </svg>
  )
}

const OPTIONS: { lang: Lang; code: string; name: string; Flag: typeof FlagUK }[] = [
  { lang: 'en', code: 'EN', name: 'English', Flag: FlagUK },
  { lang: 'mm', code: 'MM', name: 'မြန်မာ', Flag: FlagMM },
]

/** EN / MM switch: a soft track with a white thumb that slides under the active flag. */
export function LangSwitch({ className, compact }: { className?: string; compact?: boolean }) {
  const lang = useLang()
  const mm = lang === 'mm'
  return (
    <div
      role="group"
      aria-label="Language"
      className={cn('relative inline-grid h-9 grid-cols-2 items-center rounded-full bg-[#f1ecf8]/90 p-1 ring-1 ring-black/[0.04] backdrop-blur', className)}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-white shadow-[0_3px_10px_-3px_rgba(76,52,140,0.35)] ring-1 ring-black/[0.03] transition-transform duration-300 ease-[cubic-bezier(0.34,1.35,0.64,1)]',
          mm && 'translate-x-full',
        )}
      />
      {OPTIONS.map(({ lang: l, code, name, Flag }) => {
        const on = lang === l
        return (
          <button
            key={l}
            type="button"
            lang={l === 'mm' ? 'my' : 'en'}
            aria-pressed={on}
            aria-label={name}
            title={name}
            onClick={() => setLang(l)}
            className={cn(
              'relative z-10 inline-flex h-7 items-center justify-center gap-1.5 rounded-full px-2 text-xs font-bold tracking-wide transition-colors',
              on ? 'text-[#2a2240]' : 'text-[#8a82a0] hover:text-[#2a2240]',
            )}
          >
            <Flag className={cn('size-[18px] shrink-0 rounded-full shadow-[0_0_0_1.5px_#fff,0_1px_3px_rgba(0,0,0,0.2)] transition', !on && 'opacity-60 saturate-[0.7]')} />
            {compact ? null : <span className="hidden sm:inline">{code}</span>}
          </button>
        )
      })}
    </div>
  )
}

/** Keeps <html lang> in step with the chosen language (screen readers, hyphenation, fonts). */
export function LangHtmlSync() {
  const lang = useLang()
  useEffect(() => { document.documentElement.lang = lang === 'mm' ? 'my' : 'en' }, [lang])
  return null
}
