'use client'

import type { ReactNode } from 'react'
import { StoreBadges } from '../download-cta'
import { useT } from '@/lib/i18n'

function DashArrow() {
  return (
    <span className="flex shrink-0 items-center justify-center rotate-90 sm:rotate-0" aria-hidden="true">
      <svg viewBox="0 0 44 22" className="h-5 w-9 text-[#b9a0ff]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17C12 17 18 6 33 9" strokeDasharray="1 5.5" />
        <path d="m30 3 8 6-9 5" />
      </svg>
    </span>
  )
}

function PhoneArt() {
  return (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden="true">
      <ellipse cx="48" cy="52" rx="42" ry="38" fill="#e3f1ff" />
      <rect x="29" y="12" width="38" height="72" rx="9" fill="#4b4f9f" />
      <rect x="33" y="17" width="30" height="62" rx="5" fill="#fff" />
      <circle cx="44" cy="40" r="5.5" fill="#ff9db8" /><circle cx="55" cy="40" r="5.5" fill="#ffb15c" />
      <circle cx="44" cy="51" r="5.5" fill="#7fb5e6" /><circle cx="55" cy="51" r="5.5" fill="#b9a0ff" />
      <path d="M72 28l4-5M76 35l6-2M70 20l1-5" stroke="#ff9e50" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function ChildArt() {
  return (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden="true">
      <ellipse cx="48" cy="52" rx="42" ry="38" fill="#f6dfae" />
      <rect x="20" y="16" width="56" height="56" rx="16" fill="#f9c95c" stroke="#f5b73b" strokeWidth="3" />
      <path d="M30 40c0-11 8-17 18-17s18 6 18 17c-6-3-10-7-12-11-4 6-14 11-24 11Z" fill="#7a4a2b" />
      <circle cx="48" cy="46" r="15" fill="#ffd0a8" />
      <path d="M33 38c4-1 10-4 15-9 4 5 9 8 15 9-1-9-8-15-15-15s-14 6-15 15Z" fill="#7a4a2b" />
      <circle cx="42" cy="47" r="2" fill="#4a2f22" /><circle cx="54" cy="47" r="2" fill="#4a2f22" />
      <path d="M43 53c3 3 7 3 10 0" stroke="#ff765f" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="38" cy="52" r="3" fill="#ffb3a0" opacity=".7" /><circle cx="58" cy="52" r="3" fill="#ffb3a0" opacity=".7" />
      <path d="M30 70c3-8 10-10 18-10s15 2 18 10v2H30Z" fill="#ffe27a" />
      <circle cx="68" cy="68" r="11" fill="#ff765f" stroke="#fff" strokeWidth="3" />
      <path d="M68 62v12M62 68h12" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function LinkArt() {
  return (
    <svg viewBox="0 0 96 96" className="size-full" aria-hidden="true">
      <ellipse cx="48" cy="52" rx="42" ry="38" fill="#e6d6ff" />
      <rect x="18" y="14" width="56" height="58" rx="16" fill="#efeaff" stroke="#fff" strokeWidth="3" />
      <circle cx="46" cy="38" r="11" fill="#8e5cf0" />
      <path d="M26 66c0-11 9-17 20-17s20 6 20 17v4H26Z" fill="#8e5cf0" />
      <circle cx="68" cy="68" r="14" fill="#fff" stroke="#e6d6ff" strokeWidth="3" />
      <path d="M62 72l-2 2a4 4 0 0 0 6 6l4-4m-2-6l2-2a4 4 0 0 0-6-6l-4 4" transform="translate(-1 -3)" stroke="#8a45d6" strokeWidth="3.4" strokeLinecap="round" fill="none" />
      <path d="M80 30l5-4M82 40l6 0" stroke="#b9a0ff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

/** Thin dashed outline with wide gaps (CSS `border-dashed` can't tune dash length). */
function DashedBorder({ radius, color }: { radius: number; color: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
      <rect x="0.5" y="0.5" rx={radius} ry={radius} fill="none" stroke={color} strokeWidth="1" strokeDasharray="4 6" strokeLinecap="round" style={{ width: 'calc(100% - 1px)', height: 'calc(100% - 1px)' }} />
    </svg>
  )
}

/** Shown after a successful payment: how to activate the Joy app on the child's device. */
export function AppActivationGuide() {
  const t = useT()
  const steps: { n: number; badge: string; panel: string; art: ReactNode; title: string; body: string; stores?: boolean }[] = [
    { n: 1, badge: 'bg-[#3d7bf0]', panel: 'from-[#e3f1ff] to-[#ffffff]', art: <PhoneArt />, title: t('Download the app'), body: t("Install it on your child's device."), stores: true },
    { n: 2, badge: 'bg-[#ff9e50]', panel: 'from-[#fff3d6] to-[#fffaf4]', art: <ChildArt />, title: t('Switch to Child view'), body: t('Tap Play on the Home screen.') },
    { n: 3, badge: 'bg-[#8e5cf0]', panel: 'from-[#f3efff] to-[#fbf9ff]', art: <LinkArt />, title: t('Link parent account'), body: t('My profile › Link Parent Account.') },
  ]
  return (
    <section aria-label={t('Activate the Joy app in 3 easy steps')} className="relative mb-5 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#faf7ff] via-[#fcfaff] to-[#fcfaff] px-3 pb-4 pt-3.5 sm:px-4">
      <DashedBorder radius={28} color="#d9ccff" />
      <p className="mb-0.5 flex items-center justify-center gap-1.5 text-xs font-bold text-[#8e5cf0]">
        <svg viewBox="0 0 24 24" className="size-4 fill-[#fbc23c]" aria-hidden="true"><path d="M12 1.5c.7 5.6 4.9 9.8 10.5 10.5-5.6.7-9.8 4.9-10.5 10.5C11.3 16.9 7.1 12.7 1.5 12 7.1 11.3 11.3 7.1 12 1.5Z" /></svg>
        {t('Next step')}
      </p>
      <p className="mb-3 flex items-center justify-center gap-2 text-center font-display text-[15px] font-extrabold text-[#30235f] sm:text-base">
        <span className="hidden text-[#b9a0ff] sm:inline" aria-hidden="true">⁓</span>
        {t('Activate the Joy app in 3 easy steps')}
        <span className="hidden text-[#b9a0ff] sm:inline" aria-hidden="true">⁓</span>
      </p>
      <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:gap-1">
        {steps.map((s, i) => (
          <li key={s.n} className="contents">
            <div className={`relative flex flex-1 flex-col items-center gap-1.5 rounded-3xl bg-gradient-to-b p-3 pt-4 text-center ${s.panel} ${s.stores ? 'sm:flex-[1.25]' : ''}`}>
              <span className={`absolute left-2.5 top-2.5 grid size-7 place-items-center rounded-full text-sm font-extrabold text-white shadow-[0_4px_10px_-3px_rgba(82, 66, 138, 0.5)] ${s.badge}`}>{s.n}</span>
              <span className="block size-20 sm:size-[5.5rem]">{s.art}</span>
              <b className="block font-display text-sm font-extrabold leading-tight text-[#30235f]">{s.title}</b>
              <p className="text-xs leading-snug text-[#7a7399]">{s.body}</p>
              {s.stores ? (
                <StoreBadges className="mt-0.5 flex-col items-center gap-1 [&>a]:h-8 [&>a]:w-32 [&>a]:pl-2.5 [&>a]:pr-3 [&>a]:whitespace-nowrap [&>a]:justify-center [&>a]:gap-2 [&_svg]:size-3.5 [&_.font-display]:text-[12px] [&_.uppercase]:text-[7px]" appleHref="https://apps.apple.com" googleHref="https://play.google.com/store" />
              ) : null}
            </div>
            {i < steps.length - 1 && <DashArrow />}
          </li>
        ))}
      </ol>
    </section>
  )
}
