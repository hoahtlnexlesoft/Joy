import Image from 'next/image'
import { CalendarDays, Compass, Library, Waypoints, type LucideIcon } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'

type FlowStep = {
  id: string
  title: string
  description: string
  outputs: string[]
  image: string
  alt: string
  icon: LucideIcon
  color: string
  solid: string
  soft: string
  text: string
}

const steps: FlowStep[] = [
  {
    id: 'child-nature',
    title: 'Child Nature Profile',
    description: "Joy learns your child's core element, animal nature and potential archetype.",
    outputs: ['Element', 'Animal', 'Archetype'],
    image: '/images/child-nature-animals.jpg',
    alt: 'A group of cute animal friends on a fluffy pastel cloud with a rainbow',
    icon: Compass,
    color: '#ff7a45',
    solid: 'bg-joy-orange',
    soft: 'bg-peach',
    text: 'text-[#b14a1d]',
  },
  {
    id: 'growth-path',
    title: 'Growth Path Journey',
    description: 'From that profile, Joy suggests a four-stage journey that adapts as they grow.',
    outputs: ['Alpha', 'Omega', 'Crystal', 'Rainbow'],
    image: '/images/growth-path-cycle.jpg',
    alt: 'Growth path cycle of cute characters: Alpha, Omega, Crystal and Rainbow',
    icon: Waypoints,
    color: '#f8608f',
    solid: 'bg-joy-pink',
    soft: 'bg-blush',
    text: 'text-[#b0305c]',
  },
  {
    id: 'daily-activities',
    title: 'Daily Balanced Routine',
    description: 'Every day, activities fit their current stage across three balanced moments.',
    outputs: ['Morning', 'Afternoon', 'Evening'],
    image: '/images/daily-adventure.jpg',
    alt: 'Four happy kids and a puppy on a mountain trail with a map and binoculars',
    icon: CalendarDays,
    color: '#2fb37f',
    solid: 'bg-joy-mint',
    soft: 'bg-mint',
    text: 'text-[#1d7a55]',
  },
  {
    id: 'joy-collection',
    title: 'Joy Collection Library',
    description: 'Each routine draws from 1,000+ videos and activities, with new ones every week.',
    outputs: ['1,000+ activities'],
    image: '/images/joy-collection-yoga.jpg',
    alt: 'Four children doing yoga and meditation on soft pastel clouds',
    icon: Library,
    color: '#8b78f0',
    solid: 'bg-joy-lilac',
    soft: 'bg-lavender',
    text: 'text-[#5a48c2]',
  },
]

const verbs = ['shapes', 'sets', 'draws from']

function StepCard({ step, index }: { step: FlowStep; index: number }) {
  const Icon = step.icon
  return (
    <article
      id={`flow-${step.id}`}
      className="relative flex w-full max-w-none sm:max-w-md flex-col items-center gap-4 rounded-[2rem] bg-white px-5 pb-6 pt-9 text-center shadow-[0_30px_60px_-30px_rgba(42,34,64,0.35)] ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1.5 md:max-w-none"
    >
      <span
        className={cn(
          'absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1.5 font-display text-sm font-semibold text-white shadow-md',
          step.solid,
        )}
      >
        Step {index + 1}
      </span>

      <div className="relative">
        <div className={cn('rounded-full p-1.5', step.soft)}>
          <Image
            src={step.image || '/placeholder.svg'}
            alt={step.alt}
            width={160}
            height={160}
            className="aspect-square size-28 rounded-full object-cover object-top xl:size-32"
          />
        </div>
        <span
          className={cn(
            'absolute -bottom-1 -right-1 inline-flex size-10 items-center justify-center rounded-full text-white ring-4 ring-white',
            step.solid,
          )}
          aria-hidden="true"
        >
          <Icon className="size-[18px]" />
        </span>
      </div>

      <h4 className="text-balance font-display text-xl font-semibold leading-tight text-[#2a2240] xl:text-2xl">
        {step.title}
      </h4>
      <p className="text-pretty text-[15px] leading-relaxed text-[#4f4766] xl:text-base">{step.description}</p>
      <p className={cn('mt-auto w-full rounded-full px-4 py-2.5 text-sm font-semibold leading-snug', step.soft, step.text)}>
        {step.outputs.join(' · ')}
      </p>
    </article>
  )
}

function VerbPill({ verb }: { verb: string }) {
  return (
    <span className="whitespace-nowrap rounded-full bg-white px-3 py-1 font-display text-xs xl:text-sm font-semibold italic text-[#2a2240] shadow-sm ring-1 ring-black/5">
      {verb}
    </span>
  )
}

function DesktopConnector({ index }: { index: number }) {
  const goesDown = index % 2 === 0
  const color = steps[index + 1].color
  const markerId = `flow-arrow-${index}`
  const path = goesDown ? 'M2 6 C 34 6, 30 124, 70 124' : 'M2 124 C 34 124, 30 6, 70 6'
  const node = goesDown ? { cx: 40, cy: 92 } : { cx: 40, cy: 38 }

  return (
    <div className="relative hidden w-8 shrink-0 self-stretch md:block lg:w-20 xl:w-24" aria-hidden="true">
      <svg viewBox="0 0 80 130" className="absolute left-0 top-28 h-32 w-full overflow-visible" fill="none">
        <defs>
          <marker id={markerId} viewBox="0 0 10 10" refX="2" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" fill={color} />
          </marker>
        </defs>
        <path d={path} stroke={color} strokeOpacity="0.15" strokeWidth="7" strokeLinecap="round" />
        <path
          d={path}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="2 6"
          markerEnd={`url(#${markerId})`}
          className="joy-flow-dash"
        />
        <circle cx={node.cx} cy={node.cy} r="4" fill="white" stroke={color} strokeWidth="2.5" />
      </svg>
      <div
        className={cn(
          'absolute left-1/2 -translate-x-1/2',
          'hidden lg:block',
          goesDown ? 'top-[17.5rem]' : 'top-[4.5rem]',
        )}
      >
        <VerbPill verb={verbs[index]} />
      </div>
    </div>
  )
}

function MobileConnector({ index }: { index: number }) {
  const color = steps[index + 1].color
  return (
    <div className="flex flex-col items-center gap-2 py-3 md:hidden" aria-hidden="true">
      <span className="h-6 w-0 border-l-[3px] border-dotted" style={{ borderColor: color }} />
      <VerbPill verb={verbs[index]} />
      <span className="h-6 w-0 border-l-[3px] border-dotted" style={{ borderColor: color }} />
    </div>
  )
}

export function JoyFlow() {
  return (
    <div className="relative mx-auto mb-10 max-w-6xl md:mb-9 lg:mb-32">
      <div className="relative overflow-hidden max-sm:rounded-[2rem] rounded-[2.5rem] bg-gradient-to-br from-peach/70 via-blush/60 to-lavender/70 px-2 sm:px-3 py-8 md:px-3 md:py-7 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute -left-20 -top-20 size-64 rounded-full bg-white/50 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 size-72 rounded-full bg-white/50 blur-3xl" aria-hidden="true" />

        <div className="relative mx-auto mb-8 flex max-w-2xl flex-col items-center gap-3 text-center md:mb-7 lg:mb-16">
          <span className="rounded-full bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-joy-pink">
            How Joy works
          </span>
          <h3 className="text-balance font-display text-3xl font-semibold leading-tight text-[#2a2240] md:text-4xl">
            Everything grows from your child&apos;s nature
          </h3>
          <p className="text-pretty leading-relaxed text-[#6b6480]">
            Their nature shapes the growth path, the path sets each day&apos;s routine, and every routine draws from
            the Joy Collection.
          </p>
        </div>

        <ol className="relative mx-auto flex flex-col items-center md:w-auto md:flex-row md:items-stretch">
          {steps.map((step, index) => (
            <li key={step.id} className="contents">
              <div className={cn('flex w-full items-start justify-center md:flex-1', index % 2 === 1 && 'md:pt-32')}>
                <StepCard step={step} index={index} />
              </div>
              {index < steps.length - 1 && (
                <>
                  <DesktopConnector index={index} />
                  <MobileConnector index={index} />
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
