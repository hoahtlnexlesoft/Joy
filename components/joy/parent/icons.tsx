import { cn } from '@/lib/utils'
import { EmoGlyph, type EmoName } from '../emo'

export type CuteName = 'children' | 'plans' | 'account' | 'payments' | 'prefs' | 'security' | 'profile' | 'gift' | 'trash' | 'warning' | 'bubble' | 'balloon' | 'clock'

const TILE: Record<CuteName, string> = {
  children: 'from-[#ffe6d2] to-[#ffd3e2]',
  plans: 'from-[#fff0bf] to-[#ffdca6]',
  account: 'from-[#eadfff] to-[#ffd9ea]',
  profile: 'from-[#eadfff] to-[#ffd9ea]',
  payments: 'from-[#d6f0ff] to-[#dfe6ff]',
  prefs: 'from-[#fff0bf] to-[#ffe0cf]',
  security: 'from-[#d9f6dd] to-[#d6f0ff]',
  gift: 'from-[#ffe0ec] to-[#fff0c9]',
  trash: 'from-[#ffe0ec] to-[#ffd3d3]',
  warning: 'from-[#fff0bf] to-[#ffd9c4]',
  bubble: 'from-[#eadfff] to-[#d6f0ff]',
  balloon: 'from-[#ffe0ec] to-[#ffe9c9]',
  clock: 'from-[#fff0bf] to-[#ffe3b8]',
}

const GLYPH: Record<CuteName, EmoName> = {
  children: 'kids',
  plans: 'ticket',
  account: 'user',
  profile: 'user',
  payments: 'card',
  prefs: 'bell',
  security: 'lock',
  gift: 'gift',
  trash: 'trash',
  warning: 'warning',
  bubble: 'bubble',
  balloon: 'balloon',
  clock: 'clock',
}

/** Pastel tile holding a glossy JOY-palette glyph; used across the Parent portal. */
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
      <EmoGlyph name={GLYPH[name]} className={cn('size-[78%]', glyphClassName)} />
    </span>
  )
}
