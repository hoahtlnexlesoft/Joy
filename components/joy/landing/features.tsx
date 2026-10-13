import Image from 'next/image'
import { Play, Search } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'
import { Eyebrow } from '../ui'
import { JoyFlow } from './joy-flow'
import { GrowthCycleSlider } from './growth-cycle-slider'

function FeatureRow({
  id,
  eyebrow,
  title,
  body,
  reverse,
  tint,
  children,
  extra,
}: {
  id: string
  eyebrow: string
  title: string
  body: string
  reverse?: boolean
  tint: string
  children: React.ReactNode
  extra?: React.ReactNode
}) {
  return (
    <article
      id={id}
      aria-labelledby={`${id}-title`}
      className="mx-auto grid max-w-6xl scroll-mt-28 items-center gap-6 md:grid-cols-2 md:gap-4 lg:gap-16"
    >
      <div className={cn('flex flex-col items-start gap-5', reverse && 'md:order-2')}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h3 id={`${id}-title`} className="text-3xl font-medium leading-tight tracking-tight md:text-4xl">
          {title}
        </h3>
        <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{body}</p>
        {extra}
      </div>
      <div className={cn('relative rounded-[2.25rem] max-sm:rounded-[1.75rem] p-3 sm:p-5 md:p-7', tint, reverse && 'md:order-1')}>{children}</div>
    </article>
  )
}

const profile = [
  { icon: '🔥', label: 'Core element', value: 'Fire' },
  { icon: '🦁', label: 'Animal nature', value: 'Lion' },
  { icon: '🧭', label: 'Child nature', value: 'Dream Explorer' },
  { icon: '⭐', label: 'Potential archetype', value: 'Explorer' },
]


export const movementTags = [
  { icon: '💡', name: 'Think', className: 'bg-[#fff3d6] text-[#9a6a00]' },
  { icon: '🌱', name: 'Ground', className: 'bg-mint text-[#1d7a55]' },
  { icon: '⚡', name: 'Action', className: 'bg-peach text-[#b14a1d]' },
  { icon: '🎨', name: 'Create', className: 'bg-blush text-[#b0305c]' },
  { icon: '🌊', name: 'Flow', className: 'bg-sky text-[#1e6bb3]' },
  { icon: '🍃', name: 'Reset', className: 'bg-lavender text-[#5a48c2]' },
]

function TagList({ tags = movementTags }: { tags?: typeof movementTags }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <li key={t.name} className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold', t.className)}>
          <span aria-hidden="true">{t.icon}</span>
          {t.name}
        </li>
      ))}
    </ul>
  )
}

export function Features() {
  return (
    <section id="about" aria-labelledby="about-title" className="scroll-mt-28 px-3 sm:px-4 py-8 md:py-9 lg:py-24">
      <div className="mx-auto mb-8 max-w-4xl text-center md:mb-9 lg:mb-28">
        <h2 id="about-title" className="text-3xl font-normal leading-snug tracking-tight md:text-4xl md:leading-[1.15] lg:text-5xl">
          Every child grows in their own way. Joy gets to know yours, then{' '}
          <em className="text-gradient-joy">fills each day with activities made just for them.</em>
        </h2>
      </div>

      <JoyFlow />

      <div className="flex flex-col gap-12 md:gap-9 lg:gap-32">
        <FeatureRow
          id="child-nature"
          eyebrow="Child Nature"
          title="A profile of who your child is"
          body="When you add your child, Joy builds a profile of who they are: their core element, animal nature, child nature and potential archetype."
          tint="bg-peach"
        >
          <div className="grid gap-5 sm:grid-cols-[0.9fr_1fr] sm:items-center">
            <Image
              src="/images/child-nature-animals.jpg"
              alt="A group of cute animal friends on a fluffy pastel cloud with a rainbow"
              width={420}
              height={420}
              className="-m-2 aspect-square w-[calc(100%+1rem)] max-w-none rounded-[2.25rem] object-cover shadow-md md:-m-3 md:w-[calc(100%+1.5rem)]"
            />
            <ul className="flex flex-col gap-3">
              {profile.map((p) => (
                <li key={p.label} className="flex items-center gap-3 rounded-2xl bg-white/90 p-3 shadow-sm">
                  <span className="inline-flex size-10 items-center justify-center rounded-xl bg-peach text-xl" aria-hidden="true">
                    {p.icon}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">{p.label}</p>
                    <p className="font-display text-lg font-medium leading-tight">{p.value}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </FeatureRow>

        <FeatureRow
          id="growth-path"
          eyebrow="Growth Path"
          title="A journey that grows with them"
          body="From that profile, Joy suggests an improvement journey. Your child moves through Alpha, Omega, Crystal and Rainbow stages, and the path adapts as they grow."
          tint="bg-blush"
          reverse
        >
          <GrowthCycleSlider />
        </FeatureRow>

        <FeatureRow
          id="daily-activities"
          eyebrow="Daily Activities"
          title="Fresh, balanced play every day"
          body="Every day, Joy picks activities that fit your child's current stage, grouped into Morning Mindfulness, Afternoon Adventures and Evening Enchantment. One tap on Start Journey begins today's set."
          tint="bg-mint"
          extra={
            <div className="flex flex-col gap-3 pt-1">
              <p className="text-sm font-medium text-foreground/80">Every activity carries a movement tag, so the day stays balanced:</p>
              <TagList />
            </div>
          }
        >
          <div className="mx-auto max-w-none sm:max-w-sm rounded-[2rem] bg-white p-3 sm:p-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-gradient-joy px-3 py-1 text-xs font-semibold text-white">Premium Plus</span>
              <span className="text-xs font-medium text-muted-foreground">Today</span>
            </div>
            <Image
              src="/images/daily-adventure.jpg"
              alt="Four happy kids and a puppy on a mountain trail with a map and binoculars"
              width={480}
              height={480}
              className="mt-2.5 aspect-[16/10] w-full rounded-2xl object-cover object-[50%_28%]"
            />
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-2xl bg-blush px-3 py-2">
                <p className="text-xs text-muted-foreground">Feeling Okay?</p>
                <p className="text-lg" aria-hidden="true">😊 😌 😁</p>
              </div>
              <div className="rounded-2xl bg-sky px-3 py-2">
                <p className="text-xs text-muted-foreground">Element Log</p>
                <p className="text-lg" aria-hidden="true">🔥 💧 🌿</p>
              </div>
            </div>
            <div className="mt-2 rounded-2xl bg-[#fff3d6] px-3 py-2 text-sm font-semibold">☀️ Morning Mindfulness</div>
            <div className="mt-2.5 flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-joy text-sm font-semibold text-white">
              <Play className="size-4 fill-current" aria-hidden="true" />
              Start Journey
            </div>
          </div>
        </FeatureRow>

        <FeatureRow
          id="joy-collection"
          eyebrow="Joy Collection"
          title="A library of 1,000+ playful ideas"
          body="Beyond the daily set, your child can explore a library of more than 1,000 videos and activities, with new ones every week. Search, or filter by movement tag."
          tint="bg-lavender"
          reverse
        >
          <div className="mx-auto max-w-none sm:max-w-sm rounded-[2rem] bg-white p-3 sm:p-3.5 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-medium">Heart &amp; Mind Balance</p>
              <span className="rounded-full bg-mint px-2.5 py-1 text-[11px] font-semibold text-[#1d7a55]">Free Plan</span>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-full bg-muted px-4 py-2.5 text-sm text-muted-foreground">
              <Search className="size-4" aria-hidden="true" />
              Search activities
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-semibold">
              <span className="rounded-full bg-foreground px-3 py-1 text-background">All</span>
              {['Reset', 'Action', 'Think', 'Ground'].map((t) => (
                <span key={t} className="rounded-full bg-muted px-3 py-1">{t}</span>
              ))}
            </div>
            <Image
              src="/images/joy-collection-yoga.jpg"
              alt="Four children doing yoga and meditation on soft pastel clouds"
              width={480}
              height={480}
              className="mt-2.5 aspect-[16/11] w-full rounded-2xl object-cover object-[50%_45%]"
            />
            <p className="mt-3 text-sm font-semibold">⭐ Lesson type 1</p>
          </div>
        </FeatureRow>
      </div>
    </section>
  )
}
