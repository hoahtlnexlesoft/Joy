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

/** EN / MM switch with flags. `compact` hides the language codes (header on small screens). */
export function LangSwitch({ className, compact }: { className?: string; compact?: boolean }) {
  const lang = useLang()
  return (
    <div role="group" aria-label="Language" className={cn('inline-flex items-center gap-0.5 rounded-full bg-white/80 p-0.5 ring-1 ring-[#e8dff0]', className)}>
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
              'inline-flex h-8 items-center gap-1.5 rounded-full px-1.5 text-xs font-bold transition',
              compact ? '' : 'sm:pr-2.5',
              on ? 'bg-gradient-joy text-white shadow-sm' : 'text-[#6b6480] hover:bg-[#f6f0fa]',
            )}
          >
            <Flag className={cn('size-6 shrink-0 rounded-full', !on && 'opacity-80')} />
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
