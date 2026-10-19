'use client'

import { useEffect, useId, useRef } from 'react'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Crown, Gem, Sparkles, X } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'
import { CuteIcon, type CuteName } from './icons'

type BtnVariant = 'gold' | 'ghost' | 'danger' | 'aya' | 'blue' | 'green' | 'blueSoft' | 'greenSoft' | 'orangeSoft' | 'dark'
// Palette sampled from the JOY logo: orange #fd7e19→#fd9427, blue #008eed→#32b3fc, green #6cc800→#8fdc2a
const btnV: Record<BtnVariant, string> = {
  gold: 'bg-gradient-to-r from-[#fd7e19] to-[#fd9427] text-white shadow-[0_8px_22px_-10px_rgba(253,126,25,0.75)] hover:-translate-y-0.5',
  blue: 'bg-gradient-to-r from-[#008eed] to-[#32b3fc] text-white shadow-[0_8px_22px_-10px_rgba(0,142,237,0.75)] hover:-translate-y-0.5',
  green: 'bg-gradient-to-r from-[#5fbf00] to-[#8fdc2a] text-white shadow-[0_8px_22px_-10px_rgba(95,191,0,0.7)] hover:-translate-y-0.5',
  blueSoft: 'bg-[#e3f3ff] text-[#0877c9] hover:bg-[#d0eaff]',
  greenSoft: 'bg-[#eaf8d6] text-[#3f8a00] hover:bg-[#ddf1bd]',
  orangeSoft: 'bg-[#fff0dd] text-[#d96a0a] hover:bg-[#ffe4c4]',
  ghost: 'bg-white text-foreground ring-1 ring-border hover:ring-foreground/25',
  danger: 'bg-[#e5484d] text-white hover:bg-[#d23a3f]',
  dark: 'bg-[#2a2240] text-white hover:bg-[#3a3158]',
  aya: 'bg-[#e8332a] text-white hover:bg-[#d02a22]',
}
export function Btn({ variant = 'gold', small, full, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; small?: boolean; full?: boolean }) {
  return (
    <button
      type="button"
      {...p}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
        small ? 'h-9 px-4 text-sm' : 'h-11 px-6 text-sm',
        full && 'w-full',
        btnV[variant],
        className,
      )}
    />
  )
}

export function Card({ title, action, children, className }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn('rounded-[1.5rem] bg-white p-5 shadow-[0_0_0_1px_var(--border)] sm:p-6', className)}>
      {title ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-medium">{title}</h2>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  )
}

export function Empty({ icon, cute, title, children, action }: { icon?: string; cute?: CuteName; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[1.5rem] bg-white px-6 py-12 text-center shadow-[0_0_0_1px_var(--border)]">
      {cute ? <CuteIcon name={cute} className="size-16 rounded-[1.4rem]" /> : <span className="text-4xl" aria-hidden="true">{icon}</span>}
      <h2 className="font-display text-xl font-medium">{title}</h2>
      {children ? <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{children}</p> : null}
      {action}
    </div>
  )
}

export function Seg<T extends string | number>({ value, options, onChange, label }: { value: T; options: [T, string][]; onChange: (v: T) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full bg-[#f4f1f8] p-1">
      {options.map(([v, l]) => (
        <button key={String(v)} type="button" role="radio" aria-checked={value === v} onClick={() => onChange(v)} className={cn('h-8 rounded-full px-3.5 text-sm font-semibold transition', value === v ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
          {l}
        </button>
      ))}
    </div>
  )
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-gradient-joy' : 'bg-[#d9d5e3]')}>
      <span className={cn('absolute top-1 size-5 rounded-full bg-white shadow transition-all', on ? 'left-6' : 'left-1')} />
    </button>
  )
}

export function Field({ label, error, prefix, children, hint }: { label: ReactNode; error?: string | null; prefix?: string; children: (id: string) => ReactNode; hint?: string }) {
  const id = useId()
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">{label}</label>
      <div className={cn('flex h-12 items-center rounded-2xl bg-white px-4 ring-1 transition focus-within:ring-2', error ? 'ring-[#e5484d]' : 'ring-border focus-within:ring-ring')}>
        {prefix ? <span className="mr-2 text-sm text-muted-foreground">{prefix}</span> : null}
        {children(id)}
      </div>
      {error ? <p className="mt-1.5 text-xs font-medium text-[#e5484d]">{error}</p> : hint ? <p className="mt-1.5 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
export const inputCls = 'h-full w-full bg-transparent text-base outline-none placeholder:text-muted-foreground/70'

export function Modal({ onClose, children, size = 'md', title }: { onClose: () => void; children: ReactNode; size?: 'md' | 'wide' | 'lg' | 'xl'; title?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', key)
    ref.current?.querySelector<HTMLElement>('input,select,button:not([data-close])')?.focus()
    return () => { document.removeEventListener('keydown', key); document.body.style.overflow = ''; prev?.focus?.() }
  }, [onClose])
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-[#27253f]/45 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={title} className={cn('relative my-auto w-full rounded-[2rem] bg-white p-6 shadow-[0_30px_80px_-30px_rgba(39,37,63,0.6)] sm:p-8', size === 'md' ? 'max-w-md' : size === 'wide' ? 'max-w-xl' : size === 'lg' ? 'max-w-[46rem]' : 'max-w-4xl')}>
        <button type="button" data-close onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid size-9 place-items-center rounded-full text-muted-foreground transition hover:bg-[#f4f1f8] hover:text-foreground"><X className="size-5" /></button>
        {children}
      </div>
    </div>
  )
}
export function DlgHead({ title, sub, icon, cute }: { title: string; sub?: ReactNode; icon?: ReactNode; cute?: CuteName }) {
  return (
    <div className="mb-5 pr-8">
      {cute ? <CuteIcon name={cute} className="mb-3 size-12 rounded-2xl" /> : icon ? <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-[#fff3e8] text-2xl" aria-hidden="true">{icon}</div> : null}
      <h2 className="font-display text-2xl font-medium leading-tight">{title}</h2>
      {sub ? <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{sub}</p> : null}
    </div>
  )
}
export function Note({ children }: { children: ReactNode }) {
  return <p className="mb-4 rounded-2xl bg-[#fff8e6] px-4 py-3 text-xs leading-relaxed text-[#8a6d2f]">{children}</p>
}


/** Plan-type badge shared with the public Pricing page: gold + crown for Premium, purple gem for Special. */
export function UnlockChip({ type, label, className }: { type: 'Premium' | 'Special' | 'Premium Plus' | 'Free'; label?: ReactNode; className?: string }) {
  const base = 'inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-bold'
  const text = label ?? (type === 'Free' ? 'Free plan' : `${type} unlock`)
  if (type === 'Free') return <span className={cn(base, 'bg-[#eeebf3] text-[#6d6585]', className)}>{text}</span>
  if (type === 'Special')
    return (
      <span className={cn(base, 'bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#f0449a] text-white shadow-[0_8px_18px_-8px_rgba(217,70,239,0.9)] ring-1 ring-white/60', className)}>
        <Gem className="size-3.5" aria-hidden="true" />{text}<Sparkles className="size-3" aria-hidden="true" />
      </span>
    )
  return (
    <span className={cn(base, 'bg-gradient-to-r from-[#ffe08a] to-[#ffc542] text-[#7a4a00] shadow-[0_6px_14px_-8px_rgba(255,170,0,0.8)] ring-1 ring-[#ffd166]', className)}>
      <Crown className="size-3.5" aria-hidden="true" />{text}{type === 'Premium Plus' ? <Sparkles className="size-3" aria-hidden="true" /> : null}
    </span>
  )
}

export function Pagination({ page, pages, onChange, label = 'Pagination' }: { page: number; pages: number; onChange: (p: number) => void; label?: string }) {
  if (pages <= 1) return null
  const nums = Array.from({ length: pages }, (_, i) => i + 1)
  const base = 'grid size-9 place-items-center rounded-full text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a8a]/60'
  return (
    <nav aria-label={label} className="mt-5 flex items-center justify-center gap-1.5">
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} className={cn(base, 'bg-white ring-1 ring-border hover:ring-foreground/30 disabled:opacity-40 disabled:hover:ring-border')}><ArrowLeft className="size-4" /></button>
      {nums.map((n) => (
        <button key={n} type="button" aria-label={`Page ${n}`} aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)} className={cn(base, n === page ? 'bg-gradient-to-br from-[#f9709a] to-[#ee5a8a] text-white shadow-[0_8px_16px_-8px_rgba(238,90,138,0.8)]' : 'bg-white text-foreground ring-1 ring-border hover:ring-foreground/30')}>{n}</button>
      ))}
      <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)} className={cn(base, 'bg-white ring-1 ring-border hover:ring-foreground/30 disabled:opacity-40 disabled:hover:ring-border')}><ArrowRight className="size-4" /></button>
    </nav>
  )
}
