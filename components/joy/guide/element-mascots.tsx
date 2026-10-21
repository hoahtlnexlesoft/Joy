import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

export type ElementKey = 'Flame' | 'Stream' | 'Spark' | 'Stone' | 'Wind' | 'Garden' | 'Sky' | 'Mountain' | 'Ocean'

/** bg = card fill, bd = card border, blob = corner shapes, chip = energy pill, deep = chip text */
const palette: Record<ElementKey, { bg: string; bd: string; blob: string; chip: string; deep: string }> = {
  Flame: { bg: '#ffeadf', bd: '#ffd9c4', blob: '#ffd9c4', chip: '#ffd9c4', deep: '#e8332a' },
  Stream: { bg: '#e3f1ff', bd: '#c4e0ff', blob: '#c4e0ff', chip: '#e3f1ff', deep: '#0a86e8' },
  Spark: { bg: '#fff3d6', bd: '#ffe27a', blob: '#fff1b8', chip: '#fff1b8', deep: '#b98200' },
  Stone: { bg: '#ffffff', bd: '#dcdce5', blob: '#dcdce5', chip: '#dcdce5', deep: '#6b6b7d' },
  Wind: { bg: '#e3f1ff', bd: '#c4e0ff', blob: '#e3f1ff', chip: '#e3f1ff', deep: '#0a86e8' },
  Garden: { bg: '#e2f6ec', bd: '#bfe5bd', blob: '#c9ecdb', chip: '#c9ecdb', deep: '#2f8f3a' },
  Sky: { bg: '#f4eeff', bd: '#e6d6ff', blob: '#e6d6ff', chip: '#e6d6ff', deep: '#8a45d6' },
  Mountain: { bg: '#fff3d6', bd: '#f6dfae', blob: '#fff1b8', chip: '#fff1b8', deep: '#b3731a' },
  Ocean: { bg: '#e7f7fa', bd: '#b3dff2', blob: '#d6f0ff', chip: '#d6f0ff', deep: '#0284c7' },
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

/** The nine element icons: the supplied 3D artwork, one image per element. */
export function ElementMascot({ name, className, delay = 0 }: { name: ElementKey; className?: string; delay?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/elements/${name.toLowerCase()}.webp?v=2`}
      alt={name}
      width={192}
      height={192}
      className={cn('joy-bob block object-contain', className)}
      style={{ animationDelay: `-${delay}s` }}
    />
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
        'group relative flex items-center gap-3 overflow-hidden rounded-[1.5rem] bg-[linear-gradient(150deg,#ffffff_0%,color-mix(in_srgb,var(--bg)_55%,white)_80%)] px-3.5 py-3.5 ring-1 ring-[var(--chip)]/60',
        'transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-1',
      )}
    >
      {/* soft pastel clouds + sparkles */}
      <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-9 size-24 rounded-full bg-[var(--blob)] opacity-25 blur-xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-4 h-14 w-28 rounded-[50%] bg-[var(--blob)] opacity-15 blur-xl" />
      <span aria-hidden="true" className="pointer-events-none absolute right-5 top-3 text-[0.8rem] text-[var(--d)] opacity-20 transition-transform duration-500 group-hover:rotate-45 group-hover:scale-125">✦</span>
      <span aria-hidden="true" className="pointer-events-none absolute bottom-3 right-14 text-[0.6rem] text-[var(--d)] opacity-15 transition-transform duration-500 group-hover:-rotate-45 group-hover:scale-125">✦</span>
      <ElementMascot name={name} delay={(index % 5) * 0.7} className="relative size-[3.75rem] shrink-0" />
      <div className="relative min-w-0">
        <p className="font-display text-xl font-semibold leading-none text-[#2a2240]">{name}</p>
        <ul className="mt-2 flex flex-wrap gap-1">
          {energies.map((e) => (
            <li key={e} className="inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[0.7rem] font-semibold leading-none text-[var(--d)] ring-1 ring-[var(--chip)]">
              <EnergyIcon energy={e} />
              {e}
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}
