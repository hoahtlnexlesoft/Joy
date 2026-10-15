import { useId } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

export type ElementKey = 'Flame' | 'Stream' | 'Spark' | 'Stone' | 'Wind' | 'Garden' | 'Sky' | 'Mountain' | 'Ocean'

/** bg = card fill, bd = card border, blob = corner shapes, chip = energy pill, deep = chip text */
const palette: Record<ElementKey, { bg: string; bd: string; blob: string; chip: string; deep: string }> = {
  Flame: { bg: '#fff1ea', bd: '#ffd0bb', blob: '#ffd6c4', chip: '#ffe0d4', deep: '#e24f38' },
  Stream: { bg: '#edf6ff', bd: '#bddcf7', blob: '#c9e3fa', chip: '#d8ebfc', deep: '#2f7fd0' },
  Spark: { bg: '#fff8e1', bd: '#ffe08f', blob: '#ffeaa8', chip: '#ffefbd', deep: '#b98200' },
  Stone: { bg: '#f4f4f7', bd: '#dcdce5', blob: '#dfdfe8', chip: '#e4e4ec', deep: '#6b6b7d' },
  Wind: { bg: '#eff6ff', bd: '#c2daf4', blob: '#d3e5f9', chip: '#dbeafb', deep: '#3d86d6' },
  Garden: { bg: '#edf9ee', bd: '#bde5c1', blob: '#cdecd0', chip: '#d9f1dc', deep: '#38974f' },
  Sky: { bg: '#f3edff', bd: '#d8c8f6', blob: '#e3d6fa', chip: '#e6dafb', deep: '#7a4fd6' },
  Mountain: { bg: '#fff8e4', bd: '#f3df9d', blob: '#f9e7ad', chip: '#fbe9b5', deep: '#b3731a' },
  Ocean: { bg: '#e9f6fd', bd: '#b3dff2', blob: '#c9e8f8', chip: '#d3ecf9', deep: '#2b86c8' },
}


/** Inflated, glossy "balloon" lighting, matching the Joy logo letters. */
export function Balloon({ id, strength = 1 }: { id: string; strength?: number }) {
  return (
    <filter id={id} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation={3.2} result="b" />
      <feDiffuseLighting in="b" surfaceScale={7 * strength} diffuseConstant={1.1} lightingColor="#fff" result="d">
        <feDistantLight azimuth={235} elevation={62} />
      </feDiffuseLighting>
      <feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1={0.22} k2={0.86} k3={0} k4={0} result="lit" />
      <feSpecularLighting in="b" surfaceScale={7 * strength} specularConstant={0.75} specularExponent={20} lightingColor="#fff" result="s">
        <feDistantLight azimuth={235} elevation={52} />
      </feSpecularLighting>
      <feComposite in="s" in2="SourceAlpha" operator="in" result="si" />
      <feComposite in="lit" in2="si" operator="arithmetic" k1={0} k2={1} k3={1} k4={0} />
    </filter>
  )
}

/* The nine element icons: glossy 3D-style illustrations, redrawn as clean SVG. */
function G({ id, a, b, x1 = 0, y1 = 0, x2 = 0, y2 = 1 }: { id: string; a: string; b: string; x1?: number; y1?: number; x2?: number; y2?: number }) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2}>
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  )
}
const star = (cx: number, cy: number, r: number) => {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 ? r * 0.45 : r
    return `${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`
  })
  return pts.join(' ')
}

function shape(name: ElementKey, u: string): ReactNode {
  const id = (k: string) => `${u}${k}`
  const url = (k: string) => `url(#${id(k)})`
  switch (name) {
    case 'Flame':
      return (
        <>
          <defs>
            <G id={id('o')} a="#ff9a45" b="#e9452b" />
            <G id={id('y')} a="#fff0a0" b="#f4b52e" />
          </defs>
          <path d="M60 8C62 28 90 40 90 74c0 22-14 36-30 36S30 96 30 74c0-16 10-26 15-38 4 8 9 8 12 0 3-8 3-18 3-28Z" fill={url('o')} stroke="#d9452b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M60 60c10 9 15 19 15 28 0 11-7 17-15 17s-15-6-15-17c0-9 5-19 15-28Z" fill={url('y')} />
          <path d="M42 70c-2-8 2-16 6-20" fill="none" stroke="#ffd1a0" strokeWidth="4" strokeLinecap="round" opacity=".8" />
          <ellipse cx="54" cy="86" rx="4" ry="7" fill="#fff" opacity=".55" transform="rotate(12 54 86)" />
        </>
      )
    case 'Stream':
      return (
        <>
          <defs>
            <G id={id('w')} a="#b5f3f6" b="#46bfe6" x1={0.2} y1={0} x2={0.8} y2={1} />
          </defs>
          <path d="M54 16c12 20 34 36 34 62 0 18-14 30-32 30S22 96 22 78c0-24 22-42 32-62Z" fill={url('w')} stroke="#3fb5dc" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M92 18c5 7 12 12 12 20a12 12 0 0 1-24 0c0-8 7-13 12-20Z" fill={url('w')} stroke="#3fb5dc" strokeWidth="1.6" />
          <path d="M20 88c4 6 10 10 10 16a10 10 0 0 1-20 0c0-6 6-10 10-16Z" fill={url('w')} stroke="#3fb5dc" strokeWidth="1.6" />
          <path d="M36 70c0-10 5-18 11-25" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".7" />
          <ellipse cx="92" cy="38" rx="2.6" ry="4.5" fill="#fff" opacity=".7" />
        </>
      )
    case 'Garden':
      return (
        <>
          <defs>
            <G id={id('t')} a="#b8e86a" b="#86c640" />
            <G id={id('s')} a="#8fcb4a" b="#5fa22e" />
            <G id={id('c')} a="#ffffff" b="#cfe3f5" />
          </defs>
          <path d="M66 18c-6 0-8-8-1-9 3-8 15-7 15 0 7 0 8 9 0 9Z" fill={url('c')} />
          <path d="M30 30c-4 0-5-5 0-6 2-5 10-4 10 1 5 0 5 5 0 5Z" fill={url('c')} opacity=".85" />
          <g stroke="#4f9a2a" strokeWidth="3" strokeLinecap="round" fill="none"><path d="M50 78V54" /><path d="M72 78V60" /><path d="M92 78V58" /></g>
          <path d="M18 80c4-14 8-20 12-22 0 8 2 14 6 18ZM40 82c-2-12 0-20 4-26 4 8 4 18 0 26ZM84 82c2-12 8-18 14-22 0 10-2 18-8 24Z" fill="#6db83a" />
          <g transform="translate(50 52)"><g fill="#ffb347">{[0, 72, 144, 216, 288].map((r) => <circle key={r} cx="0" cy="-8" r="6.5" transform={`rotate(${r})`} />)}</g><circle r="5" fill="#ffd95a" /></g>
          <g transform="translate(74 58)"><g fill="#f0653f">{[0, 72, 144, 216, 288].map((r) => <circle key={r} cx="0" cy="-9" r="7.5" transform={`rotate(${r})`} />)}</g><circle r="5.5" fill="#ffd95a" /></g>
          <g transform="translate(94 56)"><g fill="#ffd45a">{[0, 72, 144, 216, 288].map((r) => <circle key={r} cx="0" cy="-6" r="4.6" transform={`rotate(${r})`} />)}</g><circle r="3.4" fill="#f59a2a" /></g>
          <ellipse cx="96" cy="42" rx="5" ry="4" fill="#ffd34d" stroke="#6b4a1a" strokeWidth="1.4" /><path d="M94 40v4M98 40v4" stroke="#6b4a1a" strokeWidth="1.4" />
          <path d="M16 88v10c0 7 20 14 44 14s44-7 44-14V88Z" fill={url('s')} />
          <ellipse cx="60" cy="88" rx="44" ry="15" fill={url('t')} />
          <g fill="#ffc4d6"><circle cx="34" cy="92" r="2.2" /><circle cx="84" cy="96" r="2.2" /><circle cx="62" cy="99" r="1.8" /></g>
        </>
      )
    case 'Sky':
      return (
        <>
          <defs>
            <G id={id('k')} a="#c6ecfb" b="#63b9ea" />
          </defs>
          <path d="M30 94c-14 0-22-9-22-20s9-19 20-19c1-14 13-24 27-24 12 0 22 7 26 18 14-1 25 8 25 21 0 14-11 24-25 24Z" fill={url('k')} stroke="#58aee2" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M20 72c0-6 5-10 10-10" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".75" />
          <path d="M50 44c4-5 10-7 16-6" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity=".75" />
        </>
      )
    case 'Ocean':
      return (
        <>
          <defs>
            <G id={id('n')} a="#3f8fe8" b="#1c55c0" />
            <G id={id('g')} a="#ffe37a" b="#f2b52a" />
          </defs>
          <polygon points={star(60, 34, 20)} fill={url('g')} stroke="#e9a21c" strokeWidth="1.6" strokeLinejoin="round" />
          <polygon points={star(36, 62, 10)} fill={url('g')} stroke="#e9a21c" strokeWidth="1.2" strokeLinejoin="round" />
          <ellipse cx="28" cy="32" rx="9" ry="7" fill="#fbe14a" stroke="#e0b82a" strokeWidth="1.4" transform="rotate(-15 28 32)" />
          <ellipse cx="94" cy="56" rx="8" ry="6" fill="#fbe14a" stroke="#e0b82a" strokeWidth="1.4" transform="rotate(20 94 56)" />
          <circle cx="86" cy="24" r="6" fill="#9ec9f5" /><circle cx="84" cy="22" r="2" fill="#fff" opacity=".8" />
          <g fill="#2f7ae0"><circle cx="20" cy="70" r="3" /><circle cx="28" cy="80" r="2" /><circle cx="102" cy="76" r="3" /><circle cx="94" cy="84" r="2" /></g>
          <path d="M10 104c4-12 12-12 18-6 4-10 14-12 20-2 4-12 22-14 26-2 6-8 16-4 18 4 8-6 14 0 12 8-2 8-10 12-20 12H22c-10 0-14-6-12-14Z" fill={url('n')} stroke="#1a4fb4" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M22 100c4-5 9-5 12-1M52 96c4-5 10-5 13-1" fill="none" stroke="#9cc9ff" strokeWidth="3" strokeLinecap="round" opacity=".8" />
        </>
      )
    case 'Stone':
      return (
        <>
          <defs>
            <G id={id('m')} a="#9fd2e0" b="#5d9fba" x1={0} y1={0} x2={1} y2={1} />
            <G id={id('f')} a="#4aa96a" b="#2f8a4e" />
            <G id={id('b')} a="#a8dc62" b="#7ec043" />
          </defs>
          <path d="M14 92v6c0 8 20 14 46 14s46-6 46-14v-6Z" fill="#5fa532" />
          <ellipse cx="60" cy="92" rx="46" ry="14" fill={url('b')} />
          <path d="M34 90 62 32l30 58Z" fill={url('m')} />
          <path d="m62 32 30 58-22-4-10-24Z" fill="#4f8fa8" opacity=".55" />
          <path d="M62 32 51 54l6 3 5-6 5 6 7-3Z" fill="#fff" stroke="#bcd9e4" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M44 92c6-14 14-22 26-24l22 24Z" fill="#f2b872" />
          <path d="M60 92c0-8 4-12 8-12s8 4 8 12Z" fill="#d88f4c" />
          <g fill={url('f')}>
            <path d="M22 88 30 62 38 88Z" /><path d="M24 72l6-16 6 16Z" /><path d="M88 90l7-26 7 26Z" /><path d="M90 74l5-16 5 16Z" />
          </g>
          <g fill="#7a5230"><rect x="29" y="88" width="2" height="5" /><rect x="94" y="90" width="2" height="5" /></g>
        </>
      )
    case 'Wind':
      return (
        <>
          <defs>
            <G id={id('r')} a="#3a53c8" b="#2c46b0" />
            <G id={id('l')} a="#74b7ff" b="#4a8ae6" x1={0} y1={0} x2={1} y2={1} />
          </defs>
          <path d="M12 62c-4-14 8-18 14-10" fill="none" stroke="#2c46b0" strokeWidth="9" strokeLinecap="round" />
          <circle cx="66" cy="64" r="46" fill={url('r')} />
          <circle cx="66" cy="64" r="42" fill={url('l')} />
          <path d="M66 64c0-5 7-6 9-2 3 6-3 12-10 11-9-1-13-11-9-19 5-10 20-12 28-4 10 10 6 28-8 33-16 6-34-4-36-22" fill="none" stroke="#2c46b0" strokeWidth="8" strokeLinecap="round" />
          <path d="M66 64c0-5 7-6 9-2 3 6-3 12-10 11-9-1-13-11-9-19 5-10 20-12 28-4 10 10 6 28-8 33-16 6-34-4-36-22" fill="none" stroke="#9fcbff" strokeWidth="3" strokeLinecap="round" transform="translate(-1 -2)" />
          <path d="M46 36c8-8 20-10 30-6" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".7" />
        </>
      )
    case 'Mountain':
      return (
        <>
          <defs>
            <G id={id('h')} a="#ffd35a" b="#f2a91f" />
            <G id={id('d')} a="#f6b445" b="#e0861c" />
          </defs>
          <path d="M58 86 80 38c4-8 10-8 14 0l20 48Z" fill={url('d')} />
          <path d="M80 38c4-8 10-8 14 0l20 48H98Z" fill="#e0861c" opacity=".35" />
          <path d="M8 98 38 44c3-6 9-6 12 0l30 54Z" fill={url('h')} />
          <path d="M44 98V84a8 8 0 0 1 16 0v14Z" fill="#7b3f1c" />
          <path d="M30 46V12" stroke="#d9a15a" strokeWidth="3" strokeLinecap="round" />
          <path d="M31 13h18l-5 6 5 6H31Z" fill="#6fd0e2" />
          <g fill="#fff" opacity=".6"><circle cx="28" cy="66" r="1.8" /><circle cx="70" cy="82" r="1.8" /><circle cx="94" cy="70" r="1.8" /></g>
        </>
      )
    default: // Spark
      return (
        <>
          <defs>
            <G id={id('z')} a="#ffe86a" b="#f4b21a" x1={0.2} y1={0} x2={0.8} y2={1} />
            <G id={id('q')} a="#ffe770" b="#f5b82a" />
          </defs>
          <path d="M70 8 28 66h26l-12 46 52-62H66Z" fill={url('z')} stroke="#f0a712" strokeWidth="2" strokeLinejoin="round" />
          <path d="M66 14 38 62" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".6" />
          <polygon points={star(98, 28, 12)} fill={url('q')} stroke="#f0a712" strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points={star(24, 100, 10)} fill={url('q')} stroke="#f0a712" strokeWidth="1.4" strokeLinejoin="round" />
        </>
      )
  }
}

export function ElementMascot({ name, className, delay = 0 }: { name: ElementKey; className?: string; delay?: number }) {
  const u = useId()
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`${name} icon`} className={cn('joy-bob block overflow-visible', className)} style={{ animationDelay: `-${delay}s` }}>
      {shape(name, u)}
    </svg>
  )
}

function EnergyIcon({ energy }: { energy: string }) {
  const common = { viewBox: '0 0 16 16', className: 'size-3.5 shrink-0', 'aria-hidden': true as const }
  switch (energy) {
    case 'Fire':
      return (
        <svg {...common} fill="currentColor">
          <path d="M8 1C8.4 5 12 6 12 10.2C12 13 10.2 15 8 15C5.8 15 4 13 4 10.4C4 8.4 5.2 7.4 5.8 5.6C6.8 6.6 7.6 5 8 1Z" />
        </svg>
      )
    case 'Water':
      return (
        <svg {...common} fill="currentColor">
          <path d="M8 1.2C8 1.2 3.2 6.8 3.2 10.4C3.2 13.2 5.3 15 8 15C10.7 15 12.8 13.2 12.8 10.4C12.8 6.8 8 1.2 8 1.2Z" />
        </svg>
      )
    case 'Air':
      return (
        <svg {...common} fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
          <path d="M1.8 5.2H9.4a2 2 0 1 0-2-2M1.8 8.6H12.2a2 2 0 1 1-2 2M1.8 12H6.4" />
        </svg>
      )
    case 'Earth':
      return (
        <svg {...common} fill="currentColor">
          <path d="M1 14L6 4.8L8.8 9.4L10.8 6.4L15 14Z" />
        </svg>
      )
    default:
      return (
        <svg {...common} fill="currentColor">
          <path d="M4.4 13A3.1 3.1 0 0 1 4.2 6.9A4 4 0 0 1 11.8 6.4A3.3 3.3 0 0 1 11.8 13Z" />
        </svg>
      )
  }
}

export function ElementCard({ name, energies, index = 0 }: { name: ElementKey; energies: string[]; index?: number }) {
  const p = palette[name]
  const vars = { '--bg': p.bg, '--bd': p.bd, '--blob': p.blob, '--chip': p.chip, '--d': p.deep } as CSSProperties
  return (
    <li
      style={vars}
      className={cn(
        'group relative flex items-center gap-4 overflow-hidden rounded-[2rem] bg-[linear-gradient(150deg,#ffffff_0%,var(--bg)_70%)] px-4 py-4 ring-1 ring-[var(--chip)]',
        'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1',
        name === 'Ocean' && '@md:col-span-2 @5xl:col-span-1',
      )}
    >
      {/* soft pastel clouds + sparkles */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-6 -top-7 size-20 rounded-full bg-[var(--blob)] opacity-60 blur-[2px]" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-8 right-6 h-14 w-24 rounded-[50%] bg-[var(--blob)] opacity-40" />
      <span aria-hidden="true" className="pointer-events-none absolute right-5 top-3 text-[0.8rem] text-[var(--d)] opacity-40 transition-transform duration-500 group-hover:rotate-45 group-hover:scale-125">✦</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-14 text-[0.6rem] text-[var(--d)] opacity-30 transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-125">✦</span>
      <span className="relative grid size-[5.5rem] shrink-0 place-items-center rounded-full bg-white/80 ring-4 ring-[var(--chip)]">
        <ElementMascot name={name} delay={(index % 5) * 0.7} className="size-[4.5rem]" />
      </span>
      <div className="relative min-w-0">
        <p className="font-display text-[1.5rem] font-semibold leading-none text-[#2a2240]">{name}</p>
        <ul className="mt-2.5 flex flex-wrap gap-1.5">
          {energies.map((e) => (
            <li key={e} className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.75rem] font-semibold leading-none text-[var(--d)] ring-1 ring-[var(--chip)]">
              <EnergyIcon energy={e} />
              {e}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
