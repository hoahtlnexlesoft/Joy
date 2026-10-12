import { cn } from '@/lib/utils'

export type CuteName = 'children' | 'plans' | 'account' | 'payments' | 'prefs' | 'security' | 'profile' | 'gift'

const TILE: Record<CuteName, string> = {
  children: 'from-[#ffe6d2] to-[#ffd3e2]',
  plans: 'from-[#fff0bf] to-[#ffdca6]',
  account: 'from-[#eadfff] to-[#ffd9ea]',
  profile: 'from-[#eadfff] to-[#ffd9ea]',
  payments: 'from-[#d6f0ff] to-[#dfe6ff]',
  prefs: 'from-[#fff0bf] to-[#ffe0cf]',
  security: 'from-[#d9f6dd] to-[#d6f0ff]',
  gift: 'from-[#ffe0ec] to-[#fff0c9]',
}

const Face = ({ x, y, c = '#5b4a6e' }: { x: number; y: number; c?: string }) => (
  <g>
    <circle cx={x - 2.6} cy={y} r={1} fill={c} />
    <circle cx={x + 2.6} cy={y} r={1} fill={c} />
    <path d={`M ${x - 1.6} ${y + 2.2} Q ${x} ${y + 3.6} ${x + 1.6} ${y + 2.2}`} fill="none" stroke={c} strokeWidth={1} strokeLinecap="round" />
    <circle cx={x - 4.6} cy={y + 2} r={1.2} fill="#ff9db8" opacity={0.6} />
    <circle cx={x + 4.6} cy={y + 2} r={1.2} fill="#ff9db8" opacity={0.6} />
  </g>
)

function Glyph({ name }: { name: CuteName }) {
  switch (name) {
    case 'children':
      return (
        <>
          <circle cx={11.5} cy={17} r={8} fill="#ffb98a" stroke="#f29a63" strokeWidth={1.2} />
          <circle cx={7} cy={9.8} r={2.6} fill="#ffb98a" stroke="#f29a63" strokeWidth={1.2} />
          <circle cx={16} cy={9.8} r={2.6} fill="#ffb98a" stroke="#f29a63" strokeWidth={1.2} />
          <Face x={11.5} y={17} />
          <circle cx={22.5} cy={19.5} r={6} fill="#ffd0e2" stroke="#f59bbd" strokeWidth={1.2} />
          <path d="M18.6 14.6 L20 11.2 L22 14 M24 13.6 L26.2 11.6 L26.6 15.6" fill="#ffd0e2" stroke="#f59bbd" strokeWidth={1.2} strokeLinejoin="round" strokeLinecap="round" />
          <Face x={22.5} y={19.5} />
        </>
      )
    case 'plans':
      return (
        <>
          <path d="M6 9 H26 a2 2 0 0 1 2 2 V13.2 a3 3 0 0 0 0 5.6 V21 a2 2 0 0 1 -2 2 H6 a2 2 0 0 1 -2 -2 V18.8 a3 3 0 0 0 0 -5.6 V11 a2 2 0 0 1 2 -2 Z" fill="#ffd45e" stroke="#f0aa1e" strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M20 10.5 V21.5" stroke="#f0aa1e" strokeWidth={1.3} strokeDasharray="1.6 2.2" strokeLinecap="round" />
          <path d="M12.5 12 l1.2 2.5 2.7 .4 -2 1.9 .5 2.7 -2.4 -1.3 -2.4 1.3 .5 -2.7 -2 -1.9 2.7 -.4 Z" fill="#fff" stroke="#f0aa1e" strokeWidth={1} strokeLinejoin="round" />
        </>
      )
    case 'account':
    case 'profile':
      return (
        <>
          <path d="M5.5 27 c0 -6 4.6 -8.6 10.5 -8.6 s10.5 2.6 10.5 8.6 Z" fill="#b9a0ff" stroke="#8f72e6" strokeWidth={1.3} strokeLinejoin="round" />
          <circle cx={16} cy={11.5} r={7} fill="#ffdcc2" stroke="#f2b48c" strokeWidth={1.3} />
          <path d="M9.4 10.5 c.6 -4.6 4 -6 7 -5.6 c3.4 .4 5.8 2.6 6.2 6 c-2.6 -.4 -5 -1.8 -6.2 -3.6 c-1 2 -3.6 3.4 -7 3.2 Z" fill="#8f72e6" />
          <Face x={16} y={12} />
        </>
      )
    case 'payments':
      return (
        <>
          <rect x={4} y={8} width={24} height={17} rx={4.5} fill="#7fd0ff" stroke="#3fa9e8" strokeWidth={1.4} />
          <rect x={4} y={12.4} width={24} height={4} fill="#d7f0ff" />
          <path d="M9.5 21.4 c-1.4 -1 -2 -1.8 -2 -2.7 a1.3 1.3 0 0 1 2 -1 a1.3 1.3 0 0 1 2 1 c0 .9 -.6 1.7 -2 2.7 Z" fill="#ff7fa5" />
          <rect x={18} y={19.4} width={7} height={2} rx={1} fill="#fff" opacity={0.85} />
        </>
      )
    case 'prefs':
      return (
        <>
          <path d="M16 5 c-5 0 -8 3.6 -8 8.4 v4.2 l-2.4 3.6 a1.2 1.2 0 0 0 1 1.8 h18.8 a1.2 1.2 0 0 0 1 -1.8 L24 17.6 v-4.2 C24 8.6 21 5 16 5 Z" fill="#ffd45e" stroke="#f0aa1e" strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M12.6 25.4 a3.6 3.6 0 0 0 6.8 0" fill="#ff9db8" stroke="#f0689a" strokeWidth={1.3} strokeLinecap="round" />
          <Face x={16} y={14} />
        </>
      )
    case 'security':
      return (
        <>
          <path d="M10.5 14 V10.8 a5.5 5.5 0 0 1 11 0 V14" fill="none" stroke="#4fbf7a" strokeWidth={2.4} strokeLinecap="round" />
          <rect x={6.5} y={13.5} width={19} height={13.5} rx={4.5} fill="#8be0a4" stroke="#4fbf7a" strokeWidth={1.4} />
          <circle cx={16} cy={19.2} r={2.1} fill="#fff" />
          <path d="M16 20.4 V23" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
        </>
      )
    case 'gift':
      return (
        <>
          <rect x={5.5} y={13} width={21} height={14} rx={3.5} fill="#ff9db8" stroke="#f0689a" strokeWidth={1.4} />
          <rect x={4} y={9.5} width={24} height={5.5} rx={2.4} fill="#ffc4d6" stroke="#f0689a" strokeWidth={1.4} />
          <rect x={14.2} y={9.5} width={3.6} height={17.5} fill="#ffe27a" />
          <path d="M16 9.5 c-1.5 -4.6 -6.6 -4.6 -6 -1.4 c.4 2 3.6 1.6 6 1.4 Z M16 9.5 c1.5 -4.6 6.6 -4.6 6 -1.4 c-.4 2 -3.6 1.6 -6 1.4 Z" fill="#ffe27a" stroke="#f0aa1e" strokeWidth={1.1} strokeLinejoin="round" />
        </>
      )
  }
}

/** Kawaii pastel icon tile used across the Parent portal. */
export function CuteIcon({ name, className, glyphClassName, active }: { name: CuteName; className?: string; glyphClassName?: string; active?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-[0.9rem] bg-gradient-to-br shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.9),0_4px_10px_-6px_rgba(39,37,63,0.35)] transition-transform duration-200',
        TILE[name],
        active && 'scale-110 shadow-[inset_0_0_0_1.5px_rgba(255,255,255,1),0_8px_16px_-8px_rgba(240,104,154,0.6)]',
        className ?? 'size-9',
      )}
    >
      <svg viewBox="0 0 32 32" className={cn('size-[78%]', glyphClassName)} fill="none">
        <Glyph name={name} />
      </svg>
    </span>
  )
}
