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
  'what-is-joy': { Icon: BookOpen, color: 'text-[#ef8a48]', fill: 'none' },
  'how-to-use': { Icon: Play, color: 'text-[#ed648b]', fill: 'currentColor' },
  'unique-needs': { Icon: Heart, color: 'text-[#42a978]', fill: 'currentColor' },
  stages: { Icon: Sparkles, color: 'text-[#9271da]', fill: 'currentColor' },
  'child-nature': { Icon: Compass, color: 'text-[#e89a38]', fill: 'none' },
  elements: { Icon: Droplets, color: 'text-[#45a7cd]', fill: 'currentColor' },
  animals: { Icon: PawPrint, color: 'text-[#dd8c42]', fill: 'currentColor' },
  development: { Icon: Repeat2, color: 'text-[#55a980]', fill: 'none' },
  subscribe: { Icon: TicketCheck, color: 'text-[#e26b96]', fill: 'none' },
  contact: { Icon: MessageCircleHeart, color: 'text-[#8b74d3]', fill: 'none' },
} as const

export type GuideIconId = keyof typeof guideIcons

export function GuideIcon({ id, variant = 'tile', tintClass }: { id: string; variant?: 'tile' | 'section'; tintClass?: string }) {
  const config = guideIcons[id as GuideIconId] ?? guideIcons['what-is-joy']
  const { Icon } = config
  const isSection = variant === 'section'

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl shadow-[0_5px_14px_-8px_rgba(50,35,70,0.35)] ring-1 ring-white/80 ${
        isSection ? 'size-[3.25rem] bg-white' : `size-12 ${tintClass ?? 'bg-white'} transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110`
      }`}
      aria-hidden="true"
    >
      <Icon className={`${isSection ? 'size-6' : 'size-[1.35rem]'} ${config.color}`} strokeWidth={2.1} fill={config.fill} />
    </span>
  )
}
