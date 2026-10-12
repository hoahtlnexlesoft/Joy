import Image from 'next/image'
import { CalendarHeart, ChevronLeft, ChevronRight, Droplet, Zap } from '@/components/joy/cute-icons'
import { JoyButton } from '../ui'

const highlights = [
  { icon: Droplet, title: 'Most element and mood', body: 'For any period you pick', tint: 'bg-sky text-joy-sky' },
  { icon: CalendarHeart, title: 'Feeling calendar', body: 'How they felt each day', tint: 'bg-blush text-joy-pink' },
  { icon: Zap, title: 'Activities by tag', body: 'What they did, and when', tint: 'bg-[#fff3d6] text-[#c08400]' },
]

const elements = [
  { name: 'Water', icon: '💧', value: 40, color: '#5cc3f5' },
  { name: 'Fire', icon: '🔥', value: 10, color: '#f5a14a' },
  { name: 'Sky', icon: '☁️', value: 18, color: '#b18cf0' },
  { name: 'Earth', icon: '🪨', value: 18, color: '#f6cf4f' },
  { name: 'Garden', icon: '🌿', value: 14, color: '#9bd96a' },
]

const elementTotal = elements.reduce((sum, e) => sum + e.value, 0)

const donutGradient = (() => {
  let start = 0
  const stops = elements.map((e) => {
    const end = start + (e.value / elementTotal) * 360
    const stop = `${e.color} ${start}deg ${end}deg`
    start = end
    return stop
  })
  return `conic-gradient(${stops.join(', ')})`
})()

const moods = [
  { day: 'Mon', emoji: '😊', value: 42 },
  { day: 'Tue', emoji: '😌', value: 30 },
  { day: 'Wed', emoji: '😁', value: 60, top: true },
  { day: 'Thu', emoji: '😥', value: 18 },
  { day: 'Fri', emoji: '🙂', value: 46 },
  { day: 'Sat', emoji: '😆', value: 38 },
  { day: 'Sun', emoji: '😴', value: 24 },
]

const maxMood = Math.max(...moods.map((m) => m.value))

const weekdays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const aprilOffset = 2
const today = 10
const feelingDays: Record<number, string> = {
  1: '😊',
  2: '😁',
  3: '🔥',
  4: '😌',
  6: '😥',
  7: '😊',
  8: '💧',
  9: '😁',
  10: '😊',
}

const tagCounts = [
  { icon: '💡', name: 'Think', count: 3, color: 'bg-[#f6cf4f]', tint: 'bg-[#fff3d6]' },
  { icon: '🌱', name: 'Ground', count: 4, color: 'bg-joy-mint', tint: 'bg-mint' },
  { icon: '🍃', name: 'Reset', count: 3, color: 'bg-joy-lilac', tint: 'bg-lavender' },
  { icon: '🌊', name: 'Flow', count: 2, color: 'bg-joy-sky', tint: 'bg-sky' },
  { icon: '⚡', name: 'Action', count: 1, color: 'bg-joy-orange', tint: 'bg-peach' },
  { icon: '🎨', name: 'Create', count: 1, color: 'bg-joy-pink', tint: 'bg-blush' },
]

const maxTag = Math.max(...tagCounts.map((t) => t.count))

function CardTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <p className="font-display text-base font-medium leading-tight">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function Sparkles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
      <span className="absolute left-3 top-10 size-2 rotate-45 rounded-[2px] bg-joy-pink/30" />
      <span className="absolute right-4 top-3 h-3 w-7 rounded-full bg-joy-pink/15" />
      <span className="absolute bottom-4 right-6 size-1.5 rounded-full bg-joy-lilac/40" />
      <span className="absolute bottom-8 left-5 size-2.5 rounded-full border-2 border-joy-sky/40" />
    </div>
  )
}

function MostElementCard() {
  return (
    <div className="relative rounded-2xl bg-sky/50 p-4 ring-1 ring-joy-sky/20">
      <Sparkles />
      <CardTitle title="Most Element" subtitle="Water → Activity Focus" />
      <div className="relative mt-3 flex items-center gap-4">
        <div
          role="img"
          aria-label={`Element share: ${elements.map((e) => `${e.name} ${e.value}`).join(', ')}`}
          className="relative size-28 shrink-0 rounded-full p-1.5 shadow-md ring-4 ring-white"
          style={{ background: donutGradient }}
        >
          <div className="flex size-full items-center justify-center rounded-full bg-white/50 p-3">
            <div className="flex size-full flex-col items-center justify-center rounded-full bg-white shadow-inner">
              <span className="text-xl leading-none" aria-hidden="true">
                💧
              </span>
              <span className="mt-0.5 text-[10px] font-semibold text-muted-foreground">Water</span>
            </div>
          </div>
        </div>
        <ul className="flex flex-1 flex-col gap-1">
          {elements.map((e) => (
            <li key={e.name} className="flex items-center gap-1.5 rounded-full bg-white/80 px-2 py-0.5 text-[11px]">
              <span className="size-2 rounded-full" style={{ backgroundColor: e.color }} aria-hidden="true" />
              <span className="flex-1 font-medium">{e.name}</span>
              <span className="font-semibold tabular-nums">{e.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function MostMoodCard() {
  return (
    <div className="relative rounded-2xl bg-[#fff6dc] p-4 ring-1 ring-[#f6cf4f]/30">
      <Sparkles />
      <CardTitle title="Most Mood" subtitle="Happy → Activated" />
      <ul className="relative mt-3 flex h-32 items-end justify-between gap-1.5" aria-label="Mood check-ins this week">
        {moods.map((m) => (
          <li key={m.day} className="relative flex h-full flex-1 flex-col items-center justify-end gap-1">
            {m.top && (
              <span className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-1.5 py-0.5 text-[9px] font-medium shadow-sm">
                Happy: <b>{m.value}</b>
              </span>
            )}
            <div
              className="relative w-full rounded-full bg-gradient-to-b from-[#ffe48a] to-[#f6c33b] shadow-[inset_0_-3px_0_rgba(0,0,0,0.06)]"
              style={{ height: `${Math.max((m.value / maxMood) * 72, 22)}%` }}
            >
              <span
                className="absolute -top-2.5 left-1/2 flex size-6 -translate-x-1/2 items-center justify-center rounded-full bg-white text-sm shadow-sm"
                aria-hidden="true"
              >
                {m.emoji}
              </span>
            </div>
            <span className="text-[9px] font-medium text-muted-foreground">
              <span className="sr-only">{`${m.value} check-ins on `}</span>
              {m.day}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function FeelingCalendarCard() {
  const cells = [...Array(aprilOffset).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)]
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-4 ring-1 ring-border">
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-4 text-6xl opacity-20">
        🍃
      </span>
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-medium">Feeling Log</p>
        <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <ChevronLeft className="size-3.5" aria-hidden="true" />
          April 2026
          <ChevronRight className="size-3.5" aria-hidden="true" />
        </div>
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((d, i) => (
          <span key={`${d}-${i}`} className="text-[9px] font-semibold text-muted-foreground">
            {d}
          </span>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />
          const feeling = feelingDays[day]
          const isToday = day === today
          return (
            <span
              key={day}
              className={`relative mx-auto flex size-6 items-center justify-center rounded-full text-[10px] font-medium ${
                feeling ? 'bg-blush/70' : 'text-muted-foreground ring-1 ring-border'
              } ${isToday ? 'ring-2 ring-joy-pink' : ''}`}
            >
              {feeling ? (
                <>
                  <span aria-hidden="true" className="text-xs leading-none">
                    {feeling}
                  </span>
                  <span className="sr-only">{`April ${day}, logged`}</span>
                </>
              ) : (
                day
              )}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function ActivitiesByTagCard() {
  return (
    <div className="rounded-2xl bg-white p-4 ring-1 ring-border">
      <CardTitle title="Activities by tag" subtitle="14 activities this week" />
      <ul className="mt-3 flex flex-col gap-2">
        {tagCounts.map((t) => (
          <li key={t.name} className="flex items-center gap-2 text-xs">
            <span className={`inline-flex size-6 shrink-0 items-center justify-center rounded-lg ${t.tint}`} aria-hidden="true">
              {t.icon}
            </span>
            <span className="w-12 font-medium">{t.name}</span>
            <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <span className={`block h-full rounded-full ${t.color}`} style={{ width: `${(t.count / maxTag) * 100}%` }} />
            </span>
            <span className="w-4 text-right font-semibold tabular-nums">{t.count}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FeelingLog() {
  return (
    <section
      id="feeling-log"
      aria-labelledby="feeling-title"
      className="scroll-mt-28 bg-foreground px-4 py-10 text-background md:py-9 lg:py-28"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col items-start gap-4 md:gap-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
            <span className="size-1.5 rounded-full bg-gradient-joy" aria-hidden="true" />
            Parent Portal
          </span>
          <h2 id="feeling-title" className="text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
            Know how they <em className="text-gradient-joy">feel and what they learn</em>
          </h2>
          <p className="text-pretty text-lg leading-relaxed text-white/70">
            After each activity, your child picks how they feel. Your Parent Portal turns those check-ins into a clear
            picture, in one glance.
          </p>
          <ul className="grid w-full gap-3 sm:grid-cols-3 lg:grid-cols-1">
            {highlights.map(({ icon: Icon, title, body, tint }) => (
              <li key={title} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <span className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ${tint}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/60">{body}</p>
                </div>
              </li>
            ))}
          </ul>
          <JoyButton href="#download">Try for free</JoyButton>
        </div>

        <figure className="relative">
          <div className="rounded-[2rem] bg-background p-4 text-foreground shadow-2xl md:p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="/images/feeling-log.webp"
                  alt=""
                  width={96}
                  height={96}
                  className="size-11 rounded-2xl object-cover"
                />
                <div>
                  <p className="font-display text-lg font-medium leading-tight">Thomas</p>
                  <p className="text-xs text-muted-foreground">5 years old · Premium unlock</p>
                </div>
              </div>
              <span className="rounded-full bg-gradient-joy px-3 py-1 text-[11px] font-semibold text-white">
                Parent Portal
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <MostElementCard />
              <MostMoodCard />
              <FeelingCalendarCard />
              <ActivitiesByTagCard />
            </div>
          </div>
          <figcaption className="mt-3 text-center text-xs text-white/50">Sample data shown.</figcaption>
        </figure>
      </div>
    </section>
  )
}
