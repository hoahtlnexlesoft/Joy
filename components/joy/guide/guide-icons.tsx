import {
  BookOpen,
  Compass,
  Droplets,
  Heart,
  MessageCircleHeart,
  PawPrint,
  Play,
  Repeat2,
  Sparkles,
  TicketCheck,
} from '@/components/joy/cute-icons'

const guideIcons = {
  'what-is-joy': { Icon: BookOpen, color: 'text-[#ff8a2a]', fill: 'none' },
  'how-to-use': { Icon: Play, color: 'text-[#f8608f]', fill: 'currentColor' },
  'unique-needs': { Icon: Heart, color: 'text-[#2fb37f]', fill: 'currentColor' },
  stages: { Icon: Sparkles, color: 'text-[#8f72e6]', fill: 'currentColor' },
  'child-nature': { Icon: Compass, color: 'text-[#f59a2e]', fill: 'none' },
  elements: { Icon: Droplets, color: 'text-[#1b9ac9]', fill: 'currentColor' },
  animals: { Icon: PawPrint, color: 'text-[#dd8c42]', fill: 'currentColor' },
  development: { Icon: Repeat2, color: 'text-[#2fb37f]', fill: 'none' },
  subscribe: { Icon: TicketCheck, color: 'text-[#e7609e]', fill: 'none' },
  contact: { Icon: MessageCircleHeart, color: 'text-[#8f72e6]', fill: 'none' },
} as const

export type GuideIconId = keyof typeof guideIcons

export function GuideIcon({ id, variant = 'tile', tintClass }: { id: string; variant?: 'tile' | 'section'; tintClass?: string }) {
  const config = guideIcons[id as GuideIconId] ?? guideIcons['what-is-joy']
  const { Icon } = config
  const isSection = variant === 'section'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl shadow-[0_5px_14px_-8px_rgba(42, 34, 64, 0.35)] ring-1 ring-white/80 ${
        isSection ? 'size-[3.25rem] bg-white' : `size-12 ${tintClass ?? 'bg-white'} transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110`
      }`}
      aria-hidden="true"
    >
      <Icon className={`${isSection ? 'size-6' : 'size-[1.35rem]'} ${config.color}`} strokeWidth={2.1} fill={config.fill} />
    </span>
  )
}
