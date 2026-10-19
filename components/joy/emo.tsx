import { useId } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Glossy "inflated" glyphs in the JOY logo palette (blue #008eed, orange #fd7e19, green #6cc800):
 * saturated top-to-bottom gradients, no outlines, white specular highlights. They replace native
 * emoji and also drive the Parent-portal CuteIcon tiles. Unknown emoji fall back to plain text.
 */
export type EmoName =
  | 'water' | 'fire' | 'cloud' | 'stone' | 'mountain' | 'garden' | 'sprout' | 'leaf' | 'wave' | 'bolt' | 'bulb' | 'palette'
  | 'lion' | 'compass' | 'star' | 'balloon' | 'gift' | 'ticket' | 'crystal' | 'crown' | 'clock' | 'card' | 'office' | 'house'
  | 'bell' | 'rainbow' | 'sun' | 'moon' | 'backpack' | 'sparkle' | 'heart' | 'teddy' | 'repeat' | 'girl' | 'check'
  | 'chart' | 'folder' | 'telescope' | 'rocket' | 'wind' | 'heartg' | 'kids' | 'lock' | 'trash' | 'warning' | 'bubble'
  | 'happy' | 'excited' | 'calm' | 'okay' | 'tired' | 'worried' | 'sad' | 'grumpy' | 'angry' | 'sleepy' | 'user'

const MAP: Record<string, EmoName> = {
  '💧': 'water', '🔥': 'fire', '☁': 'cloud', '🪨': 'stone', '⛰': 'mountain', '🌿': 'garden', '🌱': 'sprout', '🍃': 'leaf',
  '🌊': 'wave', '⚡': 'bolt', '💡': 'bulb', '🎨': 'palette', '🦁': 'lion', '🧭': 'compass', '⭐': 'star', '🌟': 'star',
  '🎈': 'balloon', '🎁': 'gift', '🎟': 'ticket', '🔮': 'crystal', '👑': 'crown', '🕰': 'clock', '💳': 'card', '🏢': 'office',
  '🏠': 'house', '🔔': 'bell', '🌈': 'rainbow', '☀': 'sun', '🌙': 'moon', '🎒': 'backpack', '✨': 'sparkle', '💗': 'heart',
  '💖': 'heart', '🧸': 'teddy', '🔁': 'repeat', '👧': 'girl', '✓': 'check', '👤': 'user', '📈': 'chart', '🗂': 'folder', '🔭': 'telescope', '🚀': 'rocket', '🌬': 'wind', '💚': 'heartg', '💬': 'bubble', '🤝': 'heart',
  '😊': 'happy', '😁': 'excited', '😆': 'excited', '😌': 'calm', '🙂': 'okay', '😑': 'tired', '😥': 'worried', '😟': 'sad',
  '😒': 'grumpy', '😠': 'angry', '😴': 'sleepy',
}

const norm = (s: string) => s.replace(/️/g, '')
const KEYS = Object.keys(MAP).sort((a, b) => b.length - a.length)
const RE = new RegExp(`(${KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\uFE0F?`, 'u')
const RE_G = new RegExp(RE.source, 'gu')


const INK = '#4a3a63'
type U = (c: string) => string
const Gloss = ({ cx, cy, rx = 3, ry = 1.7, r = -30, o = 0.7 }: { cx: number; cy: number; rx?: number; ry?: number; r?: number; o?: number }) => (
  <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#fff" opacity={o} transform={`rotate(${r} ${cx} ${cy})`} />
)
const Eyes = ({ x, y, d = 2.6, r = 1.1 }: { x: number; y: number; d?: number; r?: number }) => (
  <>
    <circle cx={x - d} cy={y} r={r} fill={INK} />
    <circle cx={x + d} cy={y} r={r} fill={INK} />
  </>
)
const MoodBase = ({ u }: { u: U }) => (
  <>
    <circle cx={16} cy={16} r={12.4} fill={u('yellow')} />
    <Gloss cx={11.4} cy={7.8} rx={4} ry={1.8} />
  </>
)
const Blush = () => (
  <>
    <circle cx={9.2} cy={19} r={1.8} fill="#ff7fa5" opacity={0.5} />
    <circle cx={22.8} cy={19} r={1.8} fill="#ff7fa5" opacity={0.5} />
  </>
)
const Dots = () => <Eyes x={16} y={14.2} d={4.4} r={1.5} />

function Glyph({ name, u }: { name: EmoName; u: U }): ReactNode {
  switch (name) {
    case 'water':
      return (
        <>
          <path d="M16 3.4 C16 3.4 6.6 13.4 6.6 20 a9.4 9.4 0 0 0 18.8 0 C25.4 13.4 16 3.4 16 3.4 Z" fill={u('blue')} />
          <path d="M10.8 20 a5.2 5.2 0 0 1 2.2 -4.8" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
          <circle cx={14.4} cy={11.6} r={1.2} fill="#fff" opacity={0.8} />
        </>
      )
    case 'fire':
      return (
        <>
          <path d="M16 2.6 C17 9 25 12 25 20.6 a9 9 0 0 1 -18 0 C7 15.4 10.8 13.2 11.8 8.2 C13.6 10.4 14 11.8 15 12 C15.6 9 15 5.8 16 2.6 Z" fill={u('orange')} />
          <path d="M16 15.6 C18.4 19 21 20.2 21 23.8 a5 5 0 0 1 -10 0 C11 20.2 15 19 16 15.6 Z" fill={u('yellow')} />
          <Gloss cx={11} cy={19} rx={1} ry={3} r={15} o={0.6} />
        </>
      )
    case 'cloud':
      return (
        <>
          <path d="M9 26 a6 6 0 0 1 -.8 -11.9 A8 8 0 0 1 23.4 12 A6.8 6.8 0 0 1 23.4 26 Z" fill={u('purple')} />
          <Gloss cx={12.4} cy={11.4} rx={3.4} ry={1.6} r={-35} />
        </>
      )
    case 'stone':
      return (
        <>
          <path d="M5 26 C2.8 19 7 10 15 8.4 C23.4 6.8 29 15 27 26 Z" fill={u('tan')} />
          <Gloss cx={12} cy={12.6} rx={4} ry={1.7} r={-35} />
        </>
      )
    case 'mountain':
      return (
        <>
          <path d="M2.6 27 L12.4 8 L17.6 17 L21 12 L29.4 27 Z" fill={u('yellow')} />
          <path d="M9.4 13.8 L12.4 8 L15.4 13.4 L12.4 12.2 Z" fill={u('grey')} />
          <Gloss cx={10.4} cy={21} rx={3} ry={1.2} r={-50} />
        </>
      )
    case 'garden':
      return (
        <>
          <path d="M16 28 V13" stroke="#3f9a00" strokeWidth={1.8} strokeLinecap="round" />
          <path d="M16 16.4 C9 16.4 5.8 12.2 5.8 6.4 C11.6 6.4 16 9.6 16 16.4 Z" fill={u('green')} />
          <path d="M16 22 C23 22 26.2 17.8 26.2 12 C20.4 12 16 15.2 16 22 Z" fill={u('green')} />
          <Gloss cx={10.4} cy={9.6} rx={2.6} ry={1} r={35} />
          <Gloss cx={21} cy={15} rx={2.6} ry={1} r={35} />
        </>
      )
    case 'sprout':
      return (
        <>
          <path d="M16 27 V15" stroke="#3f9a00" strokeWidth={2} strokeLinecap="round" />
          <path d="M16 15.6 C16 9.2 11.4 6.6 5.8 7.2 C5.8 13 9.8 15.8 16 15.6 Z" fill={u('green')} />
          <path d="M16 13.4 C16 8 19.8 5.4 26.2 5.8 C26.2 11.2 22.4 13.8 16 13.4 Z" fill={u('green')} />
          <path d="M7 28 C9.4 24.4 22.6 24.4 25 28 Z" fill={u('tan')} />
        </>
      )
    case 'leaf':
      return (
        <>
          <path d="M6 25 C2.6 14 9.6 5 23 4 C24 15 18.6 25 6 25 Z" fill={u('green')} />
          <path d="M6 25 C10.6 18.4 15 13 20.4 8" stroke="#fff" strokeWidth={1.3} strokeLinecap="round" opacity={0.7} />
          <path d="M19.6 28 C18.6 22.6 22 19 27.6 19 C28 23.6 24.8 27.4 19.6 28 Z" fill={u('green')} />
        </>
      )
    case 'wave':
      return (
        <>
          <path d="M2.6 16.4 q3.7 -6.4 7.4 0 t7.4 0 t7.4 0 t4.6 0 V26 a2.4 2.4 0 0 1 -2.4 2.4 H5 a2.4 2.4 0 0 1 -2.4 -2.4 Z" fill={u('blue')} />
          <path d="M3.4 22 q3.6 -4.2 7.2 0 t7.2 0 t7.2 0 t3.6 0" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
        </>
      )
    case 'bolt':
      return (
        <>
          <path d="M18.6 2.6 L7.4 18.4 H15 L12.8 29.4 L24.8 13 H17.2 Z" fill={u('yellow')} strokeLinejoin="round" />
          <Gloss cx={14.4} cy={11.4} rx={0.9} ry={3.6} r={35} />
        </>
      )
    case 'bulb':
      return (
        <>
          <path d="M16 3 a9 9 0 0 0 -5 16.4 V22 h10 v-2.6 A9 9 0 0 0 16 3 Z" fill={u('yellow')} />
          <rect x={11.4} y={22.8} width={9.2} height={4.4} rx={2.2} fill={u('grey')} />
          <Gloss cx={12.2} cy={9} rx={3} ry={1.5} r={-45} />
        </>
      )
    case 'palette':
      return (
        <>
          <path d="M16 3.6 C8 3.6 2.6 9.4 2.6 16.2 c0 7.2 5.2 12.2 11.4 12.2 c3.2 0 3.8 -2.2 2.2 -4.2 c-1.6 -2.2 -.6 -4.2 2 -4.2 h4.4 c3.6 0 6.4 -2.4 6.4 -6 C29 8 23.6 3.6 16 3.6 Z" fill={u('grey')} />
          <circle cx={9.2} cy={15.4} r={2.3} fill={u('pink')} />
          <circle cx={13.4} cy={9.6} r={2.3} fill={u('yellow')} />
          <circle cx={20.6} cy={9.4} r={2.3} fill={u('blue')} />
          <circle cx={24.8} cy={14.8} r={2.3} fill={u('green')} />
        </>
      )
    case 'lion':
      return (
        <>
          <circle cx={16} cy={16} r={13.4} fill={u('orange')} />
          <circle cx={7.6} cy={7.8} r={3.2} fill={u('tan')} />
          <circle cx={24.4} cy={7.8} r={3.2} fill={u('tan')} />
          <circle cx={16} cy={17} r={9} fill={u('tan')} />
          <Eyes x={16} y={15.4} d={3.6} r={1.3} />
          <path d="M14.4 19 h3.2 l-1.6 1.9 Z" fill="#e8423a" />
          <path d="M16 20.9 v1.2 M13.4 22.6 q2.6 1.8 5.2 0" stroke={INK} strokeWidth={1.1} strokeLinecap="round" />
          <Gloss cx={9} cy={11} rx={3.4} ry={1.4} r={-45} />
        </>
      )
    case 'compass':
      return (
        <>
          <circle cx={16} cy={16} r={13} fill={u('blue')} />
          <circle cx={16} cy={16} r={9.6} fill="#fff" />
          <path d="M16 7.8 L19.6 16 H12.4 Z" fill={u('red')} />
          <path d="M16 24.2 L19.6 16 H12.4 Z" fill={u('grey')} />
          <circle cx={16} cy={16} r={1.3} fill={INK} />
          <Gloss cx={9.4} cy={8.4} rx={3} ry={1.2} r={-45} />
        </>
      )
    case 'star':
      return (
        <>
          <path d="M16 2.8 l3.9 8 8.8 1.2 -6.4 6.2 1.6 8.8 -7.9 -4.3 -7.9 4.3 1.6 -8.8 -6.4 -6.2 8.8 -1.2 Z" fill={u('yellow')} strokeLinejoin="round" />
          <Gloss cx={12.8} cy={11.4} rx={2.8} ry={1.1} r={-30} />
        </>
      )
    case 'balloon':
      return (
        <>
          <path d="M16 24.6 q-2.8 1.8 0 3.4 t0 2.6" fill="none" stroke="#c7cfe2" strokeWidth={1.3} strokeLinecap="round" />
          <ellipse cx={16} cy={13} rx={9.6} ry={10.2} fill={u('pink')} />
          <path d="M16 22.2 l-2 3 h4 Z" fill="#f0488a" />
          <Gloss cx={11.6} cy={8.4} rx={3} ry={1.7} r={-45} />
        </>
      )
    case 'gift':
      return (
        <>
          <rect x={5} y={13} width={22} height={14.4} rx={3.6} fill={u('pink')} />
          <rect x={3.4} y={9.4} width={25.2} height={6} rx={2.6} fill={u('pink')} />
          <rect x={14} y={9.4} width={4} height={18} fill={u('yellow')} />
          <path d="M16 9.4 c-1.6 -5 -7 -5 -6.4 -1.5 c.4 2.1 3.8 1.7 6.4 1.5 Z M16 9.4 c1.6 -5 7 -5 6.4 -1.5 c-.4 2.1 -3.8 1.7 -6.4 1.5 Z" fill={u('yellow')} />
          <Gloss cx={9} cy={19} rx={0.9} ry={3} r={0} o={0.5} />
        </>
      )
    case 'ticket':
      return (
        <>
          <path d="M6 8.6 H26 a2.4 2.4 0 0 1 2.4 2.4 V13.2 a3.2 3.2 0 0 0 0 5.6 V21 a2.4 2.4 0 0 1 -2.4 2.4 H6 a2.4 2.4 0 0 1 -2.4 -2.4 V18.8 a3.2 3.2 0 0 0 0 -5.6 V11 a2.4 2.4 0 0 1 2.4 -2.4 Z" fill={u('orange')} />
          <path d="M20.4 10.4 V21.6" stroke="#fff" strokeWidth={1.4} strokeDasharray="1.6 2.4" strokeLinecap="round" opacity={0.8} />
          <path d="M12.4 11.6 l1.4 2.8 3 .4 -2.2 2.1 .6 3 -2.8 -1.5 -2.8 1.5 .6 -3 -2.2 -2.1 3 -.4 Z" fill="#fff" />
        </>
      )
    case 'crystal':
      return (
        <>
          <path d="M8 28 q8 -5 16 0 Z" fill={u('purple')} />
          <circle cx={16} cy={14.4} r={10.6} fill={u('purple')} />
          <Gloss cx={11.6} cy={9.6} rx={3.6} ry={1.7} r={-45} />
          <circle cx={21.4} cy={19} r={1.1} fill="#fff" opacity={0.7} />
        </>
      )
    case 'crown':
      return (
        <>
          <path d="M4.2 23.4 L3 9 L10.8 14.8 L16 5.8 L21.2 14.8 L29 9 L27.8 23.4 Z" fill={u('yellow')} strokeLinejoin="round" />
          <rect x={4} y={22.2} width={24} height={5} rx={2.4} fill={u('orange')} />
          <circle cx={16} cy={17.6} r={1.8} fill={u('pink')} />
          <circle cx={10} cy={19.4} r={1.3} fill={u('blue')} />
          <circle cx={22} cy={19.4} r={1.3} fill={u('blue')} />
        </>
      )
    case 'clock':
      return (
        <>
          <circle cx={16} cy={16.5} r={12} fill={u('orange')} />
          <circle cx={16} cy={16.5} r={8.8} fill="#fff" />
          <path d="M16 10.4 V16.5 L20.2 19" stroke={INK} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
          <Gloss cx={9.6} cy={8.4} rx={3} ry={1.2} r={-45} />
        </>
      )
    case 'card':
      return (
        <>
          <rect x={3.4} y={7.4} width={25.2} height={18} rx={4.6} fill={u('blue')} />
          <rect x={3.4} y={12} width={25.2} height={4.2} fill="#fff" opacity={0.85} />
          <rect x={7.4} y={19.6} width={8.4} height={2.4} rx={1.2} fill="#fff" opacity={0.9} />
          <circle cx={23} cy={20.8} r={2} fill={u('yellow')} />
        </>
      )
    case 'office':
      return (
        <>
          <rect x={6.4} y={4.6} width={19.2} height={23} rx={3.4} fill={u('blue')} />
          {[9, 15].flatMap((y) => [10.4, 17.8].map((x) => <rect key={`${x}${y}`} x={x} y={y} width={3.8} height={3.8} rx={1} fill="#fff" opacity={0.9} />))}
          <path d="M13.2 27.6 V23 a2.8 2.8 0 0 1 5.6 0 V27.6" fill={u('orange')} />
        </>
      )
    case 'house':
      return (
        <>
          <path d="M6 14.6 V25.4 a2.4 2.4 0 0 0 2.4 2.4 H23.6 a2.4 2.4 0 0 0 2.4 -2.4 V14.6 L16 6.4 Z" fill={u('tan')} />
          <path d="M2.8 16 L16 4.4 L29.2 16 L27 18 L16 8.4 L5 18 Z" fill={u('red')} strokeLinejoin="round" />
          <rect x={13} y={19.4} width={6} height={8.4} rx={2.6} fill={u('orange')} />
        </>
      )
    case 'bell':
      return (
        <>
          <path d="M16 3.6 c-5.2 0 -8.6 3.8 -8.6 8.8 v4.6 l-2.6 3.8 a1.4 1.4 0 0 0 1.2 2.2 h20 a1.4 1.4 0 0 0 1.2 -2.2 L24.6 17 v-4.6 C24.6 7.4 21.2 3.6 16 3.6 Z" fill={u('yellow')} />
          <path d="M12.2 25.4 a3.9 3.9 0 0 0 7.6 0 Z" fill={u('orange')} />
          <Gloss cx={11.6} cy={10.4} rx={3} ry={1.4} r={-60} />
        </>
      )
    case 'rainbow':
      return (
        <>
          <path d="M3.2 25 a12.8 12.8 0 0 1 25.6 0" stroke="#f46f10" strokeWidth={3.4} strokeLinecap="round" />
          <path d="M8.2 25 a7.8 7.8 0 0 1 15.6 0" stroke="#6cc800" strokeWidth={3.4} strokeLinecap="round" />
          <path d="M12.8 25 a3.2 3.2 0 0 1 6.4 0" stroke="#0a86e8" strokeWidth={3.4} strokeLinecap="round" />
        </>
      )
    case 'sun':
      return (
        <>
          <g stroke="#ffab00" strokeWidth={2.2} strokeLinecap="round">
            <path d="M16 2.6 V6 M16 26 V29.4 M2.6 16 H6 M26 16 H29.4 M6.5 6.5 L8.9 8.9 M23.1 23.1 L25.5 25.5 M25.5 6.5 L23.1 8.9 M8.9 23.1 L6.5 25.5" />
          </g>
          <circle cx={16} cy={16} r={8.2} fill={u('yellow')} />
          <Gloss cx={12.8} cy={12.2} rx={2.8} ry={1.2} r={-45} />
        </>
      )
    case 'moon':
      return (
        <>
          <path d="M19.8 3 a13 13 0 1 0 9 19.6 a10.8 10.8 0 0 1 -9 -19.6 Z" fill={u('yellow')} />
          <Gloss cx={9.8} cy={11.4} rx={3.2} ry={1.3} r={-55} />
        </>
      )
    case 'backpack':
      return (
        <>
          <path d="M11.8 8 V6.4 a4.2 4.2 0 0 1 8.4 0 V8" stroke="#f46f10" strokeWidth={1.8} strokeLinecap="round" />
          <rect x={5.8} y={7.6} width={20.4} height={20.4} rx={7.4} fill={u('orange')} />
          <rect x={10} y={18.6} width={12} height={6.8} rx={3} fill={u('yellow')} />
          <Gloss cx={11.4} cy={11.8} rx={3.4} ry={1.5} r={-35} />
        </>
      )
    case 'sparkle':
      return (
        <>
          <path d="M13 3.6 q1.4 8 9 9.4 q-7.6 1.4 -9 9.4 q-1.4 -8 -9 -9.4 q7.6 -1.4 9 -9.4 Z" fill={u('yellow')} />
          <path d="M23.6 17 q.8 4.4 5 5.2 q-4.2 .8 -5 5.2 q-.8 -4.4 -5 -5.2 q4.2 -.8 5 -5.2 Z" fill={u('orange')} />
        </>
      )
    case 'heart':
      return (
        <>
          <path d="M16 27.4 C5.6 20.4 3 14 6 9.2 C8.8 5.4 14 6 16 10.2 C18 6 23.2 5.4 26 9.2 C29 14 26.4 20.4 16 27.4 Z" fill={u('pink')} />
          <Gloss cx={9.6} cy={11} rx={2.6} ry={1.2} r={-45} />
        </>
      )
    case 'teddy':
      return (
        <>
          <circle cx={7.6} cy={7.8} r={4.2} fill={u('tan')} />
          <circle cx={24.4} cy={7.8} r={4.2} fill={u('tan')} />
          <circle cx={16} cy={17} r={11.6} fill={u('orange')} />
          <ellipse cx={16} cy={20.4} rx={5} ry={3.6} fill={u('tan')} />
          <Eyes x={16} y={14.6} d={4} r={1.3} />
          <circle cx={16} cy={19.4} r={1.3} fill={INK} />
          <Gloss cx={10.4} cy={10.4} rx={3.4} ry={1.4} r={-45} />
        </>
      )
    case 'repeat':
      return (
        <g stroke="#0a86e8" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.8 14 V12.4 a4 4 0 0 1 4 -4 H24" />
          <path d="M20.4 4.8 L24.2 8.4 L20.4 12" />
          <path d="M26.2 18 V19.6 a4 4 0 0 1 -4 4 H8" />
          <path d="M11.6 27.2 L7.8 23.6 L11.6 20" />
        </g>
      )
    case 'girl':
      return (
        <>
          <circle cx={16} cy={16.6} r={11} fill={u('skin')} />
          <path d="M5.2 15.4 c.2 -7 5.2 -10.6 10.8 -10.2 c6 .4 10 4.2 10.4 10.2 c-4.6 .2 -8.8 -1.8 -10.8 -5.2 c-2.2 3.8 -6.4 5.4 -10.4 5.2 Z" fill={u('purple')} />
          <circle cx={6.2} cy={8.6} r={3.2} fill={u('pink')} />
          <Eyes x={16} y={17.4} d={3.6} r={1.2} />
          <Blush />
        </>
      )
    case 'check':
      return <path d="M6 17 L13 24 L26 8.6" stroke="#58b800" strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" />
    case 'user':
      return (
        <>
          <path d="M5 28 c0 -6.6 4.8 -9.4 11 -9.4 s11 2.8 11 9.4 Z" fill={u('blue')} />
          <circle cx={16} cy={11.4} r={7.6} fill={u('skin')} />
          <Eyes x={16} y={12} d={2.8} r={1.1} />
          <Gloss cx={12.4} cy={7.6} rx={2.4} ry={1} r={-35} o={0.5} />
        </>
      )
    case 'chart':
      return (
        <>
          <rect x={4.4} y={17} width={5.4} height={10} rx={2} fill={u('blue')} />
          <rect x={12.6} y={11.6} width={5.4} height={15.4} rx={2} fill={u('green')} />
          <rect x={20.8} y={6.4} width={5.4} height={20.6} rx={2} fill={u('orange')} />
          <Gloss cx={7.1} cy={19.6} rx={0.8} ry={1.8} r={0} o={0.6} />
          <Gloss cx={15.3} cy={14.4} rx={0.8} ry={2.4} r={0} o={0.6} />
          <Gloss cx={23.5} cy={10} rx={0.8} ry={2.8} r={0} o={0.6} />
        </>
      )
    case 'folder':
      return (
        <>
          <path d="M3.6 9 a2.6 2.6 0 0 1 2.6 -2.6 h6.4 l3 3.2 h10.2 a2.6 2.6 0 0 1 2.6 2.6 V24 a2.6 2.6 0 0 1 -2.6 2.6 H6.2 A2.6 2.6 0 0 1 3.6 24 Z" fill={u('yellow')} />
          <rect x={3.6} y={12.4} width={24.8} height={14.2} rx={2.6} fill={u('orange')} />
          <Gloss cx={9} cy={15.2} rx={3.4} ry={1} r={0} o={0.6} />
        </>
      )
    case 'telescope':
      return (
        <>
          <path d="M4.6 14.4 L21.4 6.4 L24 12 L7.2 20 Z" fill={u('blue')} />
          <path d="M21.4 6.4 L26 4.4 L28.4 9.6 L24 12 Z" fill={u('orange')} />
          <path d="M14.6 18 L10.4 28 M14.6 18 L19 28" stroke="#8d97b5" strokeWidth={2.2} strokeLinecap="round" />
          <Gloss cx={10.6} cy={14} rx={3.2} ry={0.9} r={-25} o={0.6} />
        </>
      )
    case 'rocket':
      return (
        <>
          <path d="M16 2.6 C22 7 23.4 14 21.4 21.4 H10.6 C8.6 14 10 7 16 2.6 Z" fill={u('grey')} />
          <path d="M10.6 21.4 L5.6 25.6 L7.6 17 L10.8 14 Z M21.4 21.4 L26.4 25.6 L24.4 17 L21.2 14 Z" fill={u('red')} />
          <circle cx={16} cy={12.4} r={3.2} fill={u('blue')} />
          <path d="M12.4 21.4 h7.2 l-1 5.4 q-2.6 3 -5.2 0 Z" fill={u('orange')} />
          <Gloss cx={13} cy={8.6} rx={1} ry={3} r={20} o={0.7} />
        </>
      )
    case 'wind':
      return (
        <g stroke="#0a86e8" strokeWidth={2.6} strokeLinecap="round" fill="none">
          <path d="M4 11 h14 a3.4 3.4 0 1 0 -3.4 -3.4" />
          <path d="M4 17 h20 a3.6 3.6 0 1 1 -3.6 3.6" stroke="#5ccaff" />
          <path d="M4 23.4 h9 a2.8 2.8 0 1 1 -2.8 2.8" />
        </g>
      )
    case 'heartg':
      return (
        <>
          <path d="M16 27.4 C5.6 20.4 3 14 6 9.2 C8.8 5.4 14 6 16 10.2 C18 6 23.2 5.4 26 9.2 C29 14 26.4 20.4 16 27.4 Z" fill={u('green')} />
          <Gloss cx={9.6} cy={11} rx={2.6} ry={1.2} r={-45} />
        </>
      )
    case 'kids':
      return (
        <>
          <circle cx={7.4} cy={9.2} r={3} fill={u('orange')} />
          <circle cx={16.4} cy={9.2} r={3} fill={u('orange')} />
          <circle cx={11.9} cy={17.4} r={8.6} fill={u('orange')} />
          <Eyes x={11.9} y={16.4} d={2.8} r={1.1} />
          <circle cx={11.9} cy={19.6} r={1.1} fill={INK} />
          <path d="M18.4 14.8 L20 10.6 L22.4 13.8 M24.4 13.4 L27 10.6 L27.6 15" fill={u('pink')} />
          <circle cx={23} cy={20.4} r={6.4} fill={u('pink')} />
          <Eyes x={23} y={19.6} d={2.4} r={1} />
          <Gloss cx={8.6} cy={12.8} rx={2.6} ry={1.1} r={-40} />
        </>
      )
    case 'lock':
      return (
        <>
          <path d="M10.2 14.6 V10.6 a5.8 5.8 0 0 1 11.6 0 V14.6" stroke="#aab3cc" strokeWidth={3.2} strokeLinecap="round" />
          <rect x={5.8} y={13} width={20.4} height={15} rx={5} fill={u('green')} />
          <circle cx={16} cy={19.6} r={2.2} fill="#fff" />
          <path d="M16 20.4 V23.6" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
          <Gloss cx={10.8} cy={16.4} rx={2.6} ry={1.1} r={-40} />
        </>
      )
    case 'trash':
      return (
        <>
          <path d="M12.6 8.4 V7 a1.8 1.8 0 0 1 1.8 -1.8 h3.2 a1.8 1.8 0 0 1 1.8 1.8 V8.4" stroke="#e8423a" strokeWidth={1.8} strokeLinecap="round" />
          <path d="M8.4 12 L9.8 25.4 a2.4 2.4 0 0 0 2.4 2.2 h7.6 a2.4 2.4 0 0 0 2.4 -2.2 L23.6 12 Z" fill={u('pink')} />
          <rect x={5.8} y={8} width={20.4} height={4.6} rx={2.3} fill={u('red')} />
          <path d="M13 15.4 V24 M16 15.4 V24 M19 15.4 V24" stroke="#fff" strokeWidth={1.4} strokeLinecap="round" opacity={0.7} />
        </>
      )
    case 'warning':
      return (
        <>
          <path d="M16 4.4 L28.2 25 a1.9 1.9 0 0 1 -1.6 2.9 H5.4 a1.9 1.9 0 0 1 -1.6 -2.9 Z" fill={u('yellow')} strokeLinejoin="round" />
          <path d="M16 12 V19" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
          <circle cx={16} cy={22.8} r={1.5} fill={INK} />
          <Gloss cx={12.4} cy={17.6} rx={0.9} ry={3.2} r={28} o={0.6} />
        </>
      )
    case 'bubble':
      return (
        <>
          <path d="M7 5 h18 a4.4 4.4 0 0 1 4.4 4.4 v9.4 a4.4 4.4 0 0 1 -4.4 4.4 H16 L9.6 28.6 V23.2 H7 a4.4 4.4 0 0 1 -4.4 -4.4 V9.4 A4.4 4.4 0 0 1 7 5 Z" fill={u('blue')} />
          <circle cx={10.6} cy={14.2} r={1.8} fill="#fff" />
          <circle cx={16} cy={14.2} r={1.8} fill="#fff" />
          <circle cx={21.4} cy={14.2} r={1.8} fill="#fff" />
          <Gloss cx={9} cy={8.4} rx={3} ry={1.1} r={-10} />
        </>
      )
    case 'happy':
      return (
        <>
          <MoodBase u={u} />
          <path d="M9.6 14.8 q2 -3 4 0 M18.4 14.8 q2 -3 4 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M11.4 19.4 q4.6 4.4 9.2 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <Blush />
        </>
      )
    case 'excited':
      return (
        <>
          <MoodBase u={u} />
          <Dots />
          <path d="M10.6 18.4 q5.4 6.6 10.8 0 Z" fill="#7a2a2a" />
          <path d="M13 21.8 q3 1.8 6 0" stroke="#ff7fa5" strokeWidth={1.8} strokeLinecap="round" />
          <Blush />
        </>
      )
    case 'calm':
      return (
        <>
          <MoodBase u={u} />
          <path d="M9.6 14.4 q2 2.6 4 0 M18.4 14.4 q2 2.6 4 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M13.4 20.4 q2.6 1.8 5.2 0" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
          <Blush />
        </>
      )
    case 'okay':
      return (
        <>
          <MoodBase u={u} />
          <Dots />
          <path d="M12 20 q4 2.6 8 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <Blush />
        </>
      )
    case 'tired':
      return (
        <>
          <MoodBase u={u} />
          <path d="M9.8 14.4 h3.8 M18.4 14.4 h3.8" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
          <path d="M12.6 21 h6.8" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </>
      )
    case 'worried':
      return (
        <>
          <MoodBase u={u} />
          <Dots />
          <path d="M12.4 21.4 q3.6 -2.6 7.2 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <path d="M26 5.6 c1.8 2.4 2.4 3.6 2.4 4.6 a2.4 2.4 0 0 1 -4.8 0 c0 -1 .6 -2.2 2.4 -4.6 Z" fill={u('blue')} />
        </>
      )
    case 'sad':
      return (
        <>
          <MoodBase u={u} />
          <Dots />
          <path d="M9.4 11.2 l4.2 -1.2 M22.6 11.2 l-4.2 -1.2" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
          <path d="M12 22 q4 -3.8 8 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </>
      )
    case 'grumpy':
      return (
        <>
          <MoodBase u={u} />
          <path d="M9.4 15 h4.4 M18.2 15 h4.4" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
          <path d="M9.4 12.6 h4.4 M18.2 12.6 h4.4" stroke="#ffab00" strokeWidth={1.8} strokeLinecap="round" />
          <path d="M12.6 21 q3.4 -1.8 6.8 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </>
      )
    case 'angry':
      return (
        <>
          <circle cx={16} cy={16} r={12.4} fill={u('red')} />
          <Gloss cx={11.4} cy={7.8} rx={4} ry={1.8} />
          <circle cx={12} cy={15.4} r={1.4} fill={INK} />
          <circle cx={20} cy={15.4} r={1.4} fill={INK} />
          <path d="M8.8 10.6 l5 2.4 M23.2 10.6 l-5 2.4" stroke={INK} strokeWidth={1.7} strokeLinecap="round" />
          <path d="M12.2 22 q3.8 -3 7.6 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </>
      )
    case 'sleepy':
      return (
        <>
          <MoodBase u={u} />
          <path d="M9.6 14.4 q2 2.6 4 0 M18.4 14.4 q2 2.6 4 0" stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
          <ellipse cx={16} cy={20.6} rx={1.8} ry={2.2} fill="#7a2a2a" />
          <path d="M23 5.4 h4.4 l-4.4 4.8 h4.4" stroke="#8a5ee8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )
  }
}

const GRAD: Record<string, [string, string]> = {
  blue: ['#5ccaff', '#0a86e8'],
  orange: ['#ffb15c', '#f46f10'],
  green: ['#b2ee45', '#58b800'],
  yellow: ['#ffe27a', '#ffb300'],
  pink: ['#ffa6c4', '#f0488a'],
  purple: ['#cfb8ff', '#8a5ee8'],
  red: ['#ff8a7a', '#e8423a'],
  skin: ['#ffe6d0', '#f5b98a'],
  tan: ['#f6dfae', '#dba85c'],
  grey: ['#ffffff', '#b4bdd4'],
}

export function EmoGlyph({ name, className }: { name: EmoName; className?: string }) {
  const id = useId().replace(/:/g, '')
  const u: U = (c) => `url(#${id}-${c})`
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" fill="none" className={className}>
      <defs>
        {Object.entries(GRAD).map(([k, [a, b]]) => (
          <linearGradient key={k} id={`${id}-${k}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={a} />
            <stop offset="1" stopColor={b} />
          </linearGradient>
        ))}
      </defs>
      {Glyph({ name, u })}
    </svg>
  )
}

export function Emo({ e, name, className }: { e?: string; name?: EmoName; className?: string }) {
  const n = name ?? MAP[norm(e ?? '').trim()]
  if (!n) return <>{e}</>
  return <EmoGlyph name={n} className={cn('inline-block size-[1.15em] shrink-0 align-[-0.2em]', className)} />
}

/** Renders a string with every known emoji swapped for its glossy glyph. */
export function EmoText({ children, className }: { children: string; className?: string }) {
  const parts = children.split(RE)
  if (parts.length === 1) return <>{children}</>
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <Emo key={i} e={p} className={className} /> : p))}
    </>
  )
}

export { RE_G as EMOJI_RE }
