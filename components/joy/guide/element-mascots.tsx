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

function Grad({ id, a, b, y1 = 0, y2 = 120 }: { id: string; a: string; b: string; y1?: number; y2?: number }) {
  return (
    <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="0" y1={y1} x2="0" y2={y2}>
      <stop offset="0" stopColor={a} />
      <stop offset="1" stopColor={b} />
    </linearGradient>
  )
}

function Face({ cx, cy, s = 1 }: { cx: number; cy: number; s?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx={-14} cy={0} rx={4.6} ry={5.6} fill="#3a2a4d" />
      <ellipse cx={14} cy={0} rx={4.6} ry={5.6} fill="#3a2a4d" />
      <circle cx={-15.6} cy={-2} r={1.9} fill="#fff" />
      <circle cx={12.4} cy={-2} r={1.9} fill="#fff" />
      <ellipse cx={-24} cy={8} rx={6.5} ry={4.2} fill="#ff7f9d" opacity={0.55} />
      <ellipse cx={24} cy={8} rx={6.5} ry={4.2} fill="#ff7f9d" opacity={0.55} />
      <path d="M-5.5 6.5q5.5 6 11 0" fill="none" stroke="#3a2a4d" strokeWidth={2.4} strokeLinecap="round" />
    </g>
  )
}

function Sparkle({ x, y, s, fill = '#ffd34d' }: { x: number; y: number; s: number; fill?: string }) {
  return <path d="M0 -10C1 -4 4 -1 10 0C4 1 1 4 0 10C-1 4 -4 1 -10 0C-4 -1 -1 -4 0 -10Z" transform={`translate(${x} ${y}) scale(${s})`} fill={fill} />
}

function Leaf({ x, y, r, s, fill }: { x: number; y: number; r: number; s: number; fill: string }) {
  return <path d="M0 0C5 -9 14 -9 18 -5C13 3 6 6 0 0Z" transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`} fill={fill} />
}

function Flower({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={4.6 * Math.cos((a * Math.PI) / 180)} cy={4.6 * Math.sin((a * Math.PI) / 180)} r={3.4} fill="#fff" />
      ))}
      <circle r={2.6} fill="#ffd54a" />
    </g>
  )
}

function Tree({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-2} y={-2} width={4} height={6} rx={1.5} fill="#8a5a3a" />
      <path d="M0-26L11-6H-11Z" fill="#3f9f5c" />
      <path d="M0-16L13 2H-13Z" fill="#2f8a4c" />
    </g>
  )
}

function shape(name: ElementKey, u: string): ReactNode {
  switch (name) {
    case 'Flame':
      return (
        <>
          <defs>
            <Grad id={`${u}o`} a="#ffb04a" b="#ff5233" y1={6} y2={112} />
            <Grad id={`${u}i`} a="#ffe99a" b="#ffb347" y1={62} y2={110} />
          </defs>
          <g>
          <path d="M30 56C18 46 24 30 30 20C32 32 40 38 38 52Z" fill="#ff8a3d" />
          <path d="M62 6C64 24 92 38 94 70C96 96 78 112 58 112C36 112 22 96 24 74C22 58 34 48 40 36C44 44 48 46 50 40C54 30 58 18 62 6Z" fill={`url(#${u}o)`} />
          <ellipse cx={58} cy={86} rx={27} ry={24} fill={`url(#${u}i)`} />
          </g>
          <Face cx={58} cy={88} s={0.95} />
          <Sparkle x={14} y={82} s={0.6} />
          <Sparkle x={106} y={66} s={0.5} />
          <Sparkle x={20} y={26} s={0.5} />
        </>
      )
    case 'Stream':
      return (
        <>
          <defs>
            <Grad id={`${u}d`} a="#8ad8ff" b="#3d8fe8" y1={6} y2={110} />
          </defs>
          <g>
          <path d="M60 6C60 6 24 46 24 74C24 94 40 110 60 110C80 110 96 94 96 74C96 46 60 6 60 6Z" fill={`url(#${u}d)`} />
          </g>
          <ellipse cx={40} cy={62} rx={4.6} ry={10} transform="rotate(16 40 62)" fill="#fff" opacity={0.6} />
          <Face cx={60} cy={82} s={0.95} />
          <path d="M2 106q10-9 20 0t20 0" fill="none" stroke="#8fd2fb" strokeWidth={4.5} strokeLinecap="round" />
          <path d="M78 110q10-9 20 0t20 0" fill="none" stroke="#8fd2fb" strokeWidth={4.5} strokeLinecap="round" />
          <path d="M12 116q8-6 16 0t16 0" fill="none" stroke="#bfe5fc" strokeWidth={3.5} strokeLinecap="round" />
          <circle cx={14} cy={46} r={4} fill="#6fbcf4" />
          <circle cx={108} cy={40} r={3.4} fill="#6fbcf4" />
          <circle cx={100} cy={20} r={2.6} fill="#6fbcf4" />
        </>
      )
    case 'Spark':
      return (
        <>
          <defs>
            <Grad id={`${u}b`} a="#fff28d" b="#ffbf2e" y1={6} y2={114} />
          </defs>
          <g>
          <path d="M72 6L26 66H52L40 114L94 44H66L86 6Z" fill={`url(#${u}b)`} stroke={`url(#${u}b)`} strokeWidth={9} strokeLinejoin="round" />
          </g>
          <path d="M72 14L40 58" stroke="#fffbd0" strokeWidth={3.5} strokeLinecap="round" opacity={0.7} />
          <Face cx={60} cy={62} s={0.8} />
          <Sparkle x={102} y={22} s={0.7} />
          <Sparkle x={16} y={28} s={0.5} />
          <Sparkle x={106} y={96} s={0.6} />
          <Sparkle x={20} y={102} s={0.4} />
        </>
      )
    case 'Stone':
      return (
        <>
          <defs>
            <Grad id={`${u}r`} a="#bcbcc7" b="#6c6c7b" y1={38} y2={108} />
          </defs>
          <g>
          <path d="M16 88C14 66 28 44 52 40C68 36 88 44 98 62C108 80 104 96 90 102C70 108 36 108 22 100C18 98 16 94 16 88Z" fill={`url(#${u}r)`} />
          <path d="M52 40C68 36 88 44 98 62C84 56 66 52 52 40Z" fill="#d2d2dc" opacity={0.8} />
          <path d="M6 110q3-16 8-18q-1 9 5 18Z" fill="#6cc36a" />
          <path d="M16 110q1-10 7-14q0 7 3 14Z" fill="#58b45a" />
          <path d="M94 110q2-12 9-16q-1 9 3 16Z" fill="#6cc36a" />
          <path d="M104 110q3-8 9-10q-2 6-1 10Z" fill="#58b45a" />
          </g>
          <Leaf x={12} y={52} r={-40} s={0.8} fill="#7ed08b" />
          <Leaf x={96} y={36} r={20} s={0.6} fill="#62c27a" />
          <Face cx={58} cy={76} s={1} />
        </>
      )
    case 'Wind':
      return (
        <>
          <defs>
            <Grad id={`${u}c`} a="#ffffff" b="#d4e5fb" y1={30} y2={96} />
            <filter id={`${u}f`} x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx={0} dy={2} stdDeviation={2.2} floodColor="#8fb4e0" floodOpacity={0.45} />
            </filter>
          </defs>
          <g filter={`url(#${u}f)`}><g fill={`url(#${u}c)`}>
            <circle cx={36} cy={70} r={20} />
            <circle cx={60} cy={54} r={27} />
            <circle cx={84} cy={70} r={20} />
            <rect x={36} y={62} width={48} height={28} rx={14} />
          </g></g>
          <path d="M64 100H96C108 100 112 91 106 85C101 80 94 85 98 89" fill="none" stroke="#82c8f2" strokeWidth={4.5} strokeLinecap="round" />
          <path d="M80 110H102" fill="none" stroke="#a9dafa" strokeWidth={3.6} strokeLinecap="round" />
          <Leaf x={8} y={34} r={-30} s={0.9} fill="#7ed08b" />
          <Leaf x={100} y={26} r={25} s={0.8} fill="#62c27a" />
          <Leaf x={26} y={108} r={200} s={0.7} fill="#7ed08b" />
          <Face cx={60} cy={68} s={0.95} />
        </>
      )
    case 'Garden':
      return (
        <>
          <defs>
            <Grad id={`${u}a`} a="#9be46f" b="#3fae4e" y1={16} y2={62} />
            <Grad id={`${u}b`} a="#7fd868" b="#35a24a" y1={16} y2={62} />
            <Grad id={`${u}s`} a="#b8845a" b="#7b5030" y1={82} y2={112} />
          </defs>
          <g>
          <path d="M22 102C22 90 44 84 60 84C76 84 98 90 98 102C98 110 80 114 60 114C40 114 22 110 22 102Z" fill={`url(#${u}s)`} />
          <path d="M60 88C60 74 58 60 56 46" fill="none" stroke="#3a9d4a" strokeWidth={4} strokeLinecap="round" />
          <path d="M57 62C40 64 24 52 22 34C40 32 56 42 57 62Z" fill={`url(#${u}a)`} />
          <path d="M58 56C62 32 84 18 106 20C104 42 84 60 58 56Z" fill={`url(#${u}b)`} />
          <path d="M57 48C52 38 56 28 64 24C68 34 64 44 57 48Z" fill={`url(#${u}a)`} />
          </g>
          <path d="M26 36C38 40 48 48 55 58M62 52C76 42 90 32 102 24" fill="none" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
          <Flower x={32} y={98} s={0.9} />
          <Flower x={90} y={96} s={0.9} />
          <Flower x={50} y={106} s={0.6} />
          <Sparkle x={106} y={60} s={0.4} fill="#fff" />
        </>
      )
    case 'Sky':
      return (
        <>
          <defs>
            <Grad id={`${u}s`} a="#ffe681" b="#ffb62e" y1={16} y2={50} />
            <Grad id={`${u}c`} a="#ffffff" b="#e3dbff" y1={44} y2={104} />
            <filter id={`${u}f`} x="-20%" y="-20%" width="140%" height="150%">
              <feDropShadow dx={0} dy={2} stdDeviation={2.2} floodColor="#a893e6" floodOpacity={0.4} />
            </filter>
          </defs>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={92 + 19 * Math.cos((a * Math.PI) / 180)}
              y1={32 + 19 * Math.sin((a * Math.PI) / 180)}
              x2={92 + 25 * Math.cos((a * Math.PI) / 180)}
              y2={32 + 25 * Math.sin((a * Math.PI) / 180)}
              stroke="#ffc53d"
              strokeWidth={3.4}
              strokeLinecap="round"
            />
          ))}
          <circle cx={92} cy={32} r={15} fill={`url(#${u}s)`} />
          <g filter={`url(#${u}f)`}><g fill={`url(#${u}c)`}>
            <circle cx={34} cy={82} r={20} />
            <circle cx={60} cy={68} r={27} />
            <circle cx={86} cy={84} r={18} />
            <rect x={34} y={78} width={52} height={26} rx={13} />
          </g></g>
          <ellipse cx={14} cy={38} rx={10} ry={5} fill="#fff" opacity={0.9} />
          <ellipse cx={20} cy={34} rx={6} ry={4.5} fill="#fff" opacity={0.9} />
          <Face cx={60} cy={84} s={0.95} />
        </>
      )
    case 'Mountain':
      return (
        <>
          <defs>
            <Grad id={`${u}m`} a="#a3c2f2" b="#5b88d2" y1={18} y2={108} />
            <Grad id={`${u}s`} a="#ffe27a" b="#ffb62e" y1={14} y2={42} />
          </defs>
          <circle cx={94} cy={28} r={19} fill="#ffe9a8" opacity={0.5} />
          <circle cx={94} cy={28} r={13} fill={`url(#${u}s)`} />
          <ellipse cx={16} cy={32} rx={10} ry={5} fill="#fff" />
          <ellipse cx={22} cy={28} rx={6} ry={4.5} fill="#fff" />
          <g>
          <path d="M6 108C16 84 34 52 50 28C57 17 67 17 73 27C88 50 106 82 114 108Z" fill={`url(#${u}m)`} />
          <path d="M66 20C70 22 72 25 73 27C88 50 106 82 114 108H72C76 80 72 48 66 20Z" fill="#3f6fc0" opacity={0.3} />
          <path d="M50 28C57 17 67 17 73 27L81 40C75 36 70 42 64 38C58 42 52 36 45 40Z" fill="#fff" />
          <path d="M0 110C20 102 40 106 60 106C80 106 100 102 120 110V116H0Z" fill="#7fd08a" />
          </g>
          <Tree x={20} y={106} s={0.9} />
          <Tree x={35} y={108} s={0.65} />
          <Tree x={98} y={106} s={0.85} />
          <Tree x={85} y={108} s={0.6} />
        </>
      )
    case 'Ocean':
      return (
        <>
          <defs>
            <Grad id={`${u}w`} a="#72ceff" b="#2d7fe2" y1={14} y2={112} />
          </defs>
          <g>
          <path d="M10 108C6 64 30 26 66 18C96 12 114 34 106 54C100 44 88 42 80 50C92 62 90 84 72 96C62 102 56 106 54 112Z" fill={`url(#${u}w)`} />
          <path d="M66 18C98 12 114 34 106 54" fill="none" stroke="#e3f6ff" strokeWidth={6.5} strokeLinecap="round" />
          </g>
          <path d="M84 44C92 40 100 44 102 52" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.8} />
          <circle cx={14} cy={40} r={4} fill="#9fdcff" />
          <circle cx={26} cy={20} r={3} fill="#9fdcff" />
          <circle cx={112} cy={80} r={3} fill="#9fdcff" />
          <circle cx={100} cy={100} r={2.4} fill="#9fdcff" />
          <Face cx={46} cy={80} s={0.9} />
        </>
      )
  }
}

export function ElementMascot({ name, className, delay = 0 }: { name: ElementKey; className?: string; delay?: number }) {
  const u = useId()
  return (
    <svg viewBox="0 0 120 120" role="img" aria-label={`${name} character`} className={cn('joy-bob block overflow-visible', className)} style={{ animationDelay: `-${delay}s` }}>
      <defs>
      </defs>
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
