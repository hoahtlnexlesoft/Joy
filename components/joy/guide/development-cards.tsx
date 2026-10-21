import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type DevKey = 'balance' | 'movement' | 'cycle' | 'progress'

/** soft = icon tint, line = icon stroke, deep = eyebrow text */
const palette: Record<DevKey, { soft: string; line: string; deep: string }> = {
  balance: { soft: '#ffeadf', line: '#f49678', deep: '#ea580c' },
  movement: { soft: '#e2f6ec', line: '#2fb37f', deep: '#23915a' },
  cycle: { soft: '#efeaff', line: '#8f72e6', deep: '#785ac8' },
  progress: { soft: '#e3f1ff', line: '#3f9cf2', deep: '#0877c9' },
}

function pt(cx: number, cy: number, r: number, deg: number) {
  const a = (deg * Math.PI) / 180
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const
}

/** Clockwise arc (screen degrees) with a small open arrowhead at its end. */
function Arrow({ cx, cy, r, a0, a1 }: { cx: number; cy: number; r: number; a0: number; a1: number }) {
  const [x0, y0] = pt(cx, cy, r, a0)
  const [x1, y1] = pt(cx, cy, r, a1)
  const large = (a1 - a0 + 360) % 360 > 180 ? 1 : 0
  return (
    <g>
      <path d={`M${x0.toFixed(2)} ${y0.toFixed(2)}A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`} />
      <path d="M-4 -5.5L2.5 0L-4 5.5" transform={`translate(${x1.toFixed(2)} ${y1.toFixed(2)}) rotate(${a1 + 90})`} />
    </g>
  )
}

function icon(kind: DevKey, soft: string): ReactNode {
  switch (kind) {
    case 'balance':
      return (
        <>
          <circle cx={32} cy={32} r={13} fill={soft} stroke="none" />
          <Arrow cx={32} cy={32} r={18} a0={200} a1={320} />
          <Arrow cx={32} cy={32} r={18} a0={20} a1={140} />
        </>
      )
    case 'movement':
      return (
        <>
          <path d="M32 14V50M22 50H42" />
          <path d="M12 22H52" />
          <path d="M12 22L6 36H18Z" fill={soft} />
          <path d="M52 22L46 36H58Z" fill={soft} />
          <circle cx={32} cy={14} r={2.5} fill={soft} />
        </>
      )
    case 'cycle':
      return (
        <>
          <Arrow cx={32} cy={32} r={22} a0={130} a1={400} />
          <path d="M32 44V32" />
          <path d="M32 35C25 35 22 29 24 25C29 26 32 30 32 35Z" fill={soft} />
          <path d="M32 32C39 32 42 26 40 22C35 23 32 27 32 32Z" fill={soft} />
        </>
      )
    case 'progress':
      return (
        <>
          <rect x={10} y={36} width={11} height={16} rx={5.5} fill={soft} />
          <rect x={26.5} y={26} width={11} height={26} rx={5.5} fill={soft} />
          <rect x={43} y={14} width={11} height={38} rx={5.5} fill={soft} />
        </>
      )
  }
}

function DevIcon({ kind, className }: { kind: DevKey; className?: string }) {
  const p = palette[kind]
  return (
    <svg
      viewBox="0 0 64 64"
      role="img"
      aria-label={kind}
      className={cn('block overflow-visible', className)}
      fill="none"
      stroke={p.line}
      strokeWidth={3.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon(kind, p.soft)}
    </svg>
  )
}

export function DevCard({ kind, eyebrow, title, children }: { kind: DevKey; eyebrow: string; title: string; children: ReactNode }) {
  const p = palette[kind]
  const vars = { '--c': p.soft, '--d': p.deep } as CSSProperties
  return (
    <article
      style={vars}
      className="flex gap-5 rounded-[1.75rem] bg-white/70 p-6 shadow-[0_0_0_1px_var(--border)] transition-colors duration-300 hover:bg-white sm:p-7"
    >
      <div className="grid size-14 shrink-0 place-items-center self-start rounded-full bg-[var(--c)] sm:size-16">
        <DevIcon kind={kind} className="size-8 sm:size-9" />
      </div>
      <div className="min-w-0">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[var(--d)]">{eyebrow}</p>
        <h3 className="mt-1 text-lg font-medium leading-snug">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/65">{children}</p>
      </div>
    </article>
  )
}
