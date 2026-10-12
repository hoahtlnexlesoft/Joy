'use client'

import { useEffect, useId, useState } from 'react'
import { cn } from '@/lib/utils'

type CycleNode = {
  name: string
  color: string
  angle: number
  current?: boolean
}

type Cycle = {
  id: string
  title: string
  curved: boolean
  homeIcon: 'check' | 'star'
  nodes: CycleNode[]
}

const cycles: Cycle[] = [
  {
    id: 'four',
    title: '4-stage cycle',
    curved: true,
    homeIcon: 'check',
    nodes: [
      { name: 'Alpha', color: '#7ccf4a', angle: 180, current: true },
      { name: 'Omega', color: '#f2c14e', angle: 270 },
      { name: 'Crystal', color: '#ec6a47', angle: 0 },
      { name: 'Rainbow', color: '#56b8e6', angle: 90 },
    ],
  },
  {
    id: 'five',
    title: '5-stage cycle',
    curved: false,
    homeIcon: 'star',
    nodes: [
      { name: 'Alpha', color: '#7ccf4a', angle: 198, current: true },
      { name: 'Omega', color: '#f2c14e', angle: 270 },
      { name: 'Crystal', color: '#ec6a47', angle: 342 },
      { name: 'Rainbow', color: '#56b8e6', angle: 54 },
      { name: 'Crystal', color: '#a66ee0', angle: 126 },
    ],
  },
]

const CX = 220
const CY = 200
const R = 112
const NODE_R = 27
const INTERVAL_MS = 4500

const rad = (deg: number) => (deg * Math.PI) / 180
const r2 = (n: number) => Math.round(n * 100) / 100
const point = (deg: number, r = R) => ({ x: r2(CX + r * Math.cos(rad(deg))), y: r2(CY + r * Math.sin(rad(deg))) })

function arrowPath(from: number, to: number, curved: boolean) {
  const end = to <= from ? to + 360 : to
  if (curved) {
    const gap = 24
    const a = point(from + gap)
    const b = point(end - gap)
    return `M ${a.x} ${a.y} A ${R} ${R} 0 0 1 ${b.x} ${b.y}`
  }
  const a = point(from)
  const b = point(end)
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const ux = (b.x - a.x) / len
  const uy = (b.y - a.y) / len
  const pad = NODE_R + 12
  return `M ${r2(a.x + ux * pad)} ${r2(a.y + uy * pad)} L ${r2(b.x - ux * pad)} ${r2(b.y - uy * pad)}`
}

function spiralPoints(cx: number, cy: number, startDeg: number) {
  const pts: string[] = []
  const turns = 2.6 * Math.PI * 2
  for (let t = 0; t <= turns; t += 0.18) {
    const r = 1.2 + t * 1.15
    pts.push(`${r2(cx + r * Math.cos(t + rad(startDeg)))},${r2(cy + r * Math.sin(t + rad(startDeg)))}`)
  }
  return pts.join(' ')
}

function Triskelion({ gradientId }: { gradientId: string }) {
  const arms = [270, 30, 150]
  return (
    <g
      className="motion-safe:animate-[spin_28s_linear_infinite]"
      style={{ transformOrigin: `${CX}px ${CY}px`, transformBox: 'view-box' }}
    >
      <circle cx={CX} cy={CY} r={58} fill="#fff7e3" />
      {arms.map((deg) => {
        const c = point(deg, 21)
        return (
          <polyline
            key={deg}
            points={spiralPoints(c.x, c.y, deg + 180)}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )
      })}
    </g>
  )
}

function CuteFace({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g aria-hidden="true">
      <path d={`M ${x - 18} ${y - 13} Q ${x - 25} ${y - 22} ${x - 15} ${y - 20} Q ${x - 10} ${y - 19} ${x - 10} ${y - 13}`} fill={color} opacity={0.8} />
      <path d={`M ${x + 18} ${y - 13} Q ${x + 25} ${y - 22} ${x + 15} ${y - 20} Q ${x + 10} ${y - 19} ${x + 10} ${y - 13}`} fill={color} opacity={0.8} />
      <circle cx={x - 7} cy={y - 2} r={2.6} fill="#3a2f4a" />
      <circle cx={x + 7} cy={y - 2} r={2.6} fill="#3a2f4a" />
      <circle cx={x - 6.2} cy={y - 3} r={0.9} fill="#fff" />
      <circle cx={x + 7.8} cy={y - 3} r={0.9} fill="#fff" />
      <path d={`M ${x - 4} ${y + 5} Q ${x} ${y + 9} ${x + 4} ${y + 5}`} fill="none" stroke="#3a2f4a" strokeWidth={1.8} strokeLinecap="round" />
      <ellipse cx={x - 13} cy={y + 5} rx={3.5} ry={2.2} fill={color} opacity={0.45} />
      <ellipse cx={x + 13} cy={y + 5} rx={3.5} ry={2.2} fill={color} opacity={0.45} />
    </g>
  )
}

function HomeNode({ x, y, color, icon }: { x: number; y: number; color: string; icon: 'check' | 'star' }) {
  return (
    <g className="motion-safe:animate-[joy-bob_3s_ease-in-out_infinite]" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
      <circle cx={x} cy={y} r={NODE_R + 9} fill={color} opacity={0.16} />
      <circle cx={x} cy={y} r={NODE_R} fill="#f2fbe9" stroke={color} strokeWidth={4} />
      <path
        d={`M ${x - 12} ${y - 1} L ${x} ${y - 13} L ${x + 12} ${y - 1} M ${x - 9} ${y - 3} V ${y + 12} H ${x + 9} V ${y - 3}`}
        fill="none"
        stroke={color}
        strokeWidth={3.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {icon === 'check' ? (
        <path d={`M ${x - 4.5} ${y + 3} L ${x - 1} ${y + 6.5} L ${x + 5} ${y}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path
          d={`M ${x} ${y - 3} L ${x + 2} ${y + 1.5} L ${x + 5} ${y + 1.8} L ${x + 2.7} ${y + 4.6} L ${x + 3.4} ${y + 9} L ${x} ${y + 6.6} L ${x - 3.4} ${y + 9} L ${x - 2.7} ${y + 4.6} L ${x - 5} ${y + 1.8} L ${x - 2} ${y + 1.5} Z`}
          fill={color}
        />
      )}
    </g>
  )
}

function CycleDiagram({ cycle, diamondArrows = false }: { cycle: Cycle; diamondArrows?: boolean }) {
  const uid = useId().replace(/:/g, '')
  const gold = `gold-${uid}`
  const arrow = `arrow-${uid}`

  return (
    <svg viewBox="0 0 440 400" className="h-full w-full" role="img" aria-label={`${cycle.title}: ${cycle.nodes.map((n) => n.name).join(', ')}. Alpha is the current stage.`}>
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffd56b" />
          <stop offset="100%" stopColor="#e3a12f" />
        </linearGradient>
        <marker id={arrow} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 1 1 L 8 5 L 1 9" fill="none" stroke="#c9bfd6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {cycle.nodes.map((node, i) => {
        const next = cycle.nodes[(i + 1) % cycle.nodes.length]
        return (
          <path
            key={`arrow-${i}`}
            d={arrowPath(node.angle, next.angle, cycle.curved && !diamondArrows)}
            fill="none"
            stroke="#c9bfd6"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray="2 9"
            markerEnd={`url(#${arrow})`}
            className="motion-safe:animate-[joy-dash_1.4s_linear_infinite]"
          />
        )
      })}

      <Triskelion gradientId={gold} />

      {cycle.nodes.map((node, i) => {
        const p = point(node.angle)
        const label = point(node.angle, R + 56)
        const isSide = Math.abs(Math.cos(rad(node.angle))) > 0.9
        const lx = isSide ? label.x + Math.cos(rad(node.angle)) * 14 : label.x
        const ly = label.y

        return (
          <g key={`${node.name}-${i}`}>
            {node.current ? (
              <HomeNode x={p.x} y={p.y} color={node.color} icon={cycle.homeIcon} />
            ) : (
              <g>
                <circle cx={p.x} cy={p.y} r={NODE_R + 7} fill={node.color} opacity={0.12} />
                <circle cx={p.x} cy={p.y} r={NODE_R} fill="#fff" stroke={node.color} strokeWidth={4} />
                <CuteFace x={p.x} y={p.y} color={node.color} />
              </g>
            )}

            <text x={lx} y={ly - 6} textAnchor="middle" className="fill-foreground font-display" style={{ fontSize: 17, fontWeight: 600 }}>
              {node.name}
            </text>
            {node.current ? (
              <g>
                <rect x={lx - 34} y={ly + 2} width={68} height={22} rx={11} fill="#5bbfe8" />
                <text x={lx} y={ly + 17.5} textAnchor="middle" fill="#fff" style={{ fontSize: 12, fontWeight: 700 }}>
                  Current
                </text>
              </g>
            ) : (
              <text x={lx} y={ly + 13} textAnchor="middle" fill="#b3a9c2" style={{ fontSize: 12.5, fontWeight: 700 }}>
                Upcoming
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function GrowthCycleIllustration() {
  return (
    <div className="relative aspect-[11/10] w-full" aria-label="Four-stage growth path">
      <CycleDiagram cycle={cycles[0]} />
    </div>
  )
}

export function GrowthCycleSlider() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const timer = window.setInterval(() => setActive((i) => (i + 1) % cycles.length), INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [paused])

  return (
    <div
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-[#fffaf4] to-[#fff1f4] shadow-md"
      role="region"
      aria-roledescription="carousel"
      aria-label="Growth Path cycles"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[11/10] w-full">
        {cycles.map((cycle, i) => (
          <div
            key={cycle.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${cycles.length}: ${cycle.title}`}
            aria-hidden={active !== i}
            className={cn(
              'absolute inset-0 px-3 pb-12 pt-3 transition-all duration-700 ease-out',
              active === i ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0',
            )}
          >
            <CycleDiagram cycle={cycle} />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-12 flex justify-center gap-2">
        {cycles.map((cycle, i) => (
          <button
            key={cycle.id}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Show ${cycle.title}`}
            aria-current={active === i}
            className={cn(
              'h-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              active === i ? 'w-7 bg-gradient-joy' : 'w-2.5 bg-foreground/15 hover:bg-foreground/30',
            )}
          />
        ))}
      </div>
    </div>
  )
}
