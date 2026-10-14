import type { ReactNode } from 'react'
import { AppActivationGuide } from './app-guide'

type Row = { name: string; child?: string }

function WalletIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
      <rect x="5" y="10" width="28" height="22" rx="6" fill="#8b7cf6" />
      <rect x="5" y="10" width="28" height="9" rx="4.5" fill="#a99bff" />
      <rect x="24" y="19" width="12" height="9" rx="4.5" fill="#6a5bd8" />
      <circle cx="29.5" cy="23.5" r="1.8" fill="#fff" />
    </svg>
  )
}
function DocIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
      <rect x="9" y="5" width="22" height="30" rx="6" fill="#c9bcff" />
      <rect x="9" y="5" width="22" height="30" rx="6" fill="none" stroke="#8b7cf6" strokeWidth="2" />
      <path d="M14.5 15h11M14.5 21h11M14.5 27h6" stroke="#7a6af0" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
function CoinsIcon() {
  return (
    <svg viewBox="0 0 40 40" className="size-9" aria-hidden="true">
      <ellipse cx="17" cy="29" rx="11" ry="5" fill="#ffc83d" /><rect x="6" y="22" width="22" height="7" fill="#ffd966" /><ellipse cx="17" cy="22" rx="11" ry="5" fill="#ffe28a" />
      <ellipse cx="23" cy="15" rx="11" ry="5" fill="#ffc83d" /><rect x="12" y="9" width="22" height="6" fill="#ffd966" /><ellipse cx="23" cy="9" rx="11" ry="5" fill="#ffe28a" />
      <path d="M23 6.5v5M21 8h3.6" stroke="#e7a100" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
function Smiley() {
  return (
    <svg viewBox="0 0 48 48" className="size-14 drop-shadow-[0_6px_8px_rgba(255,170,0,0.35)]" aria-hidden="true">
      <circle cx="24" cy="24" r="21" fill="#ffd84d" />
      <circle cx="24" cy="24" r="21" fill="none" stroke="#ffc21a" strokeWidth="2" />
      <ellipse cx="14" cy="28" rx="4" ry="2.8" fill="#ff9db8" opacity=".75" /><ellipse cx="34" cy="28" rx="4" ry="2.8" fill="#ff9db8" opacity=".75" />
      <ellipse cx="17" cy="21" rx="2.4" ry="3.2" fill="#4a3b5c" /><ellipse cx="31" cy="21" rx="2.4" ry="3.2" fill="#4a3b5c" />
      <path d="M16 30c2.2 4.4 13.8 4.4 16 0z" fill="#e23d5a" stroke="#4a3b5c" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}
function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path d="M12 1.5c.9 5.7 4.8 9.6 10.5 10.5-5.7.9-9.6 4.8-10.5 10.5C11.1 16.8 7.2 12.9 1.5 12 7.2 11.1 11.1 7.2 12 1.5z" fill="currentColor" />
    </svg>
  )
}

export function PlanReady({ title, child, rows, ref_, total, pay, onClose, onPlans }: { title: string; child?: string; rows: Row[]; ref_: string; total: string; pay: ReactNode; onClose: () => void; onPlans: () => void }) {
  const one = rows.length === 1
  return (
    <div className="relative z-0 -m-6 overflow-hidden rounded-[2rem] bg-gradient-to-b from-[#dcefff] via-[#efe6ff] to-[#ffe9f3] px-4 pb-7 pt-5 sm:-m-8 sm:px-8 sm:pb-8 sm:pt-6">
      {/* sky decoration */}
      <div className="pointer-events-none absolute -left-10 top-24 h-24 w-40 rounded-full bg-white/60 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-8 top-56 h-28 w-44 rounded-full bg-white/50 blur-2xl" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/80 to-transparent" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-6 -left-6 size-24 rounded-full bg-white/80 blur-md" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-8 left-16 size-28 rounded-full bg-white/80 blur-md" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-8 -right-4 size-28 rounded-full bg-[#ffe3f1]/90 blur-md" aria-hidden="true" />
      <Spark className="pointer-events-none absolute left-[46%] top-5 size-5 text-[#ffd34d]" />
      <Spark className="pointer-events-none absolute right-[22%] top-24 size-4 text-[#ffd34d]" />
      <Spark className="pointer-events-none absolute left-6 top-28 size-3.5 text-[#b79cff]" />

      {/* header */}
      <div className="relative flex items-start gap-3 pr-10">
        <div className="min-w-0 flex-1 pt-1">
          <span className="mb-1 grid size-11 place-items-center rounded-full bg-white/80 shadow-[0_6px_14px_-8px_rgba(120,90,200,0.6)] ring-1 ring-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/butterfly-blue.webp" alt="" className="size-8 object-contain" />
          </span>
          <p className="font-hand text-[1.7rem] font-bold leading-none text-[#5b47c9] sm:text-4xl">{title}</p>
          {child ? <p className="bg-gradient-to-r from-[#3fa2ff] via-[#9a6cf5] to-[#ff7ab0] bg-clip-text font-display text-5xl font-bold leading-[1.15] text-transparent sm:text-6xl">{child}</p> : null}
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/butterfly-purple.webp" alt="" className="-mr-2 -mt-1 size-28 shrink-0 object-contain drop-shadow-[0_10px_14px_rgba(150,100,220,0.3)] sm:size-40" />
      </div>

      {/* summary */}
      <div className="relative mt-3 rounded-3xl bg-white/70 p-4 shadow-[0_12px_30px_-18px_rgba(120,90,200,0.55)] ring-1 ring-white backdrop-blur-sm sm:p-5">
        {one && rows[0].child ? (
          <span className="absolute -top-3 right-4 inline-flex items-center gap-1.5 rounded-full bg-[#e3f8ec] px-3 py-1 text-xs font-bold text-[#1f9a5a] ring-1 ring-[#b9ebd0]">
            <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true"><circle cx="8" cy="5" r="3" /><path d="M2.5 14c.5-3 2.7-4.5 5.5-4.5s5 1.5 5.5 4.5z" /></svg>
            For {rows[0].child}
          </span>
        ) : null}
        {!one && (
          <ul className="mb-3 space-y-2 border-b border-dashed border-[#d8cdf5] pb-3">
            {rows.map((r) => (
              <li key={r.name} className="flex items-center justify-between gap-3 text-sm"><b className="font-display text-base">{r.name}</b><span className="rounded-full bg-[#e3f8ec] px-3 py-1 text-xs font-bold text-[#1f9a5a] ring-1 ring-[#b9ebd0]">{r.child ? `For ${r.child}` : 'Not assigned yet'}</span></li>
            ))}
          </ul>
        )}
        <dl className="grid grid-cols-3 divide-x divide-[#e3daf8] text-center sm:text-left">
          <div className="flex flex-col items-center gap-1.5 px-1 sm:flex-row sm:gap-3 sm:px-4 sm:first:pl-0"><span className="hidden shrink-0 rounded-2xl bg-white/90 p-2 ring-1 ring-[#ece5fb] sm:block"><WalletIcon /></span><div className="min-w-0"><dt className="text-[11px] text-muted-foreground">Paid via</dt><dd className="mt-1 flex justify-center sm:justify-start">{pay}</dd></div></div>
          <div className="flex flex-col items-center gap-1.5 px-1 sm:flex-row sm:gap-3 sm:px-4"><span className="hidden shrink-0 rounded-2xl bg-white/90 p-2 ring-1 ring-[#ece5fb] sm:block"><DocIcon /></span><div className="min-w-0"><dt className="text-[11px] text-muted-foreground">Transaction</dt><dd className="mt-1 break-all text-xs font-bold sm:text-sm">{ref_}</dd></div></div>
          <div className="flex flex-col items-center gap-1.5 px-1 sm:flex-row sm:gap-3 sm:px-4"><span className="hidden shrink-0 rounded-2xl bg-white/90 p-2 ring-1 ring-[#ece5fb] sm:block"><CoinsIcon /></span><div className="min-w-0"><dt className="text-[11px] text-muted-foreground">Total paid</dt><dd className="mt-0.5 font-display text-2xl font-bold text-[#1f9a5a]">{total}</dd></div></div>
        </dl>
      </div>

      <p className="relative mx-auto mt-4 w-fit rounded-full bg-white/80 px-4 py-1.5 font-hand text-xl font-bold text-[#6a56d6] shadow-[0_6px_16px_-10px_rgba(120,90,200,0.6)] ring-1 ring-white">
        <Spark className="mr-1.5 inline size-3.5 -translate-y-0.5 text-[#ffbf2f]" />
        {rows.some((r) => r.child) ? 'New activities are unlocked!' : 'Assign it to a child anytime from Plans.'}
      </p>

      <div className="relative mt-4">
        <AppActivationGuide />
      </div>

      <div className="relative flex flex-wrap items-center justify-end gap-3 pl-14 sm:pl-16">
        <div className="pointer-events-none absolute -bottom-2 left-0 sm:-bottom-1"><Smiley /></div>
        <button type="button" onClick={onClose} className="inline-flex h-11 items-center justify-center rounded-full bg-white/90 px-6 text-sm font-semibold ring-1 ring-[#e3daf8] transition hover:bg-white">Close</button>
        <button type="button" onClick={onPlans} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff6b9d] to-[#ff9a4d] px-6 text-sm font-bold text-white shadow-[0_10px_22px_-8px_rgba(255,107,157,0.8)] transition hover:-translate-y-0.5">
          Go to Plans
          <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m6 3 5 5-5 5" /></svg>
        </button>
      </div>
    </div>
  )
}
