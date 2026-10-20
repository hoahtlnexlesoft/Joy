'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight } from '@/components/joy/cute-icons'
import { BooksIcon, DayIcon, SmileyIcon, SproutIcon, StepsIcon } from '@/components/joy/landing/showcase-icons'
import { cn } from '@/lib/utils'

type Feature = {
  id: string
  label: string
  badge: string
  description: string
  image: string
  alt: string
  icon: (p: { className?: string }) => React.ReactElement
  badgeBg: string
  badgeFg: string
  overlay: string
  imageScale?: string
}

function scrollToSection(id: string) {
  const target = document.getElementById(id)
  if (!target) return false
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  history.replaceState(null, '', `#${id}`)
  return true
}

const features: Feature[] = [
  {
    id: 'child-nature',
    label: 'Child Nature',
    badge: 'Profile Card',
    description: "Discover your child's core element, animal friend, and natural growth archetype.",
    image: '/images/child-nature-animals.jpg',
    alt: 'A group of cute animal friends on a fluffy pastel cloud with a rainbow',
    icon: SproutIcon,
    badgeBg: '[--ic-main:#FF9F5A]',
    badgeFg: '',
    overlay: 'from-[#5a2a12]/95 via-[#5a2a12]/60',
    imageScale: 'scale-100',
  },
  {
    id: 'growth-path',
    label: 'Growth Path',
    badge: '4-Stage Pathway',
    description: 'A continuous journey through Alpha, Omega, Crystal, and Rainbow adapted to their age.',
    image: '/images/growth-path-cycle.jpg',
    alt: 'Growth path cycle of cute characters: Alpha, Omega, Crystal and Rainbow',
    icon: StepsIcon,
    badgeBg: '[--ic-main:#A97BF2]',
    badgeFg: '',
    overlay: 'from-[#5b1f4d]/95 via-[#5b1f4d]/60',
  },
  {
    id: 'daily-activities',
    label: 'Daily Activities',
    badge: '3 Daily Slots',
    description: 'Morning mindfulness, afternoon adventures, and evening enchantment routines.',
    image: '/images/daily-adventure.jpg',
    alt: 'Four happy kids and a puppy on a mountain trail with a map, binoculars and a tent by the lake',
    icon: DayIcon,
    badgeBg: '[--ic-main:#3CC9A5]',
    badgeFg: '',
    overlay: 'from-[#163d33]/95 via-[#163d33]/60',
  },
  {
    id: 'joy-collection',
    label: 'Joy Collection',
    badge: '1,000+ Activities',
    description: 'Explore 1,000+ interactive videos, exercises, music, and mindfulness stories.',
    image: '/images/joy-collection-yoga.jpg',
    alt: 'A group of cute animal friends on a fluffy pastel cloud with a rainbow',
    icon: BooksIcon,
    badgeBg: '[--ic-main:#7A78F0]',
    badgeFg: '',
    overlay: 'from-[#2e1f63]/95 via-[#2e1f63]/60',
  },
  {
    id: 'feeling-log',
    label: 'Feeling Log',
    badge: 'Parent Portal',
    description: 'Parents see daily emotion check-ins and activity summaries in one clear dashboard.',
    image: '/images/feeling-log-heart.jpg',
    alt: 'A cheerful child surrounded by floating emotion bubbles',
    icon: SmileyIcon,
    badgeBg: '[--ic-main:#FF7FA8]',
    badgeFg: '',
    overlay: 'from-[#1b3a63]/95 via-[#1b3a63]/60',
  },
]

export function FeatureShowcase() {
  const [active, setActive] = useState(1)
  const [revealed, setRevealed] = useState(false)
  const listRef = useRef<HTMLUListElement>(null)

  useEffect(() => {
    const node = listRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <nav aria-label="What Joy offers" data-no-reveal className="relative mx-auto mt-6 max-w-6xl md:mt-8 lg:mt-14">
      <ul
        ref={listRef}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-1 md:mx-0 md:overflow-visible md:px-0"
      >
        {features.map((feature, index) => {
          const isActive = index === active
          const Icon = feature.icon
          return (
            <li
              key={feature.id}
              style={{ '--reveal-delay': `${index * 120}ms` } as React.CSSProperties}
              className={cn(
                'flex w-72 shrink-0 snap-start flex-col gap-3 transition-[flex-grow] duration-500 ease-out md:w-auto md:min-w-0 md:shrink',
                isActive ? 'md:flex-[2.6]' : 'md:flex-1',
                revealed ? 'reveal-in' : 'reveal-pending',
              )}
            >
              <p
                className={cn(
                  'joy-feature-label text-center font-display text-lg font-semibold transition-colors',
                  isActive ? 'text-joy-pink' : 'text-muted-foreground',
                )}
              >
                {feature.label}
              </p>

              <div
                role="button"
                tabIndex={0}
                aria-expanded={isActive}
                aria-label={`Show ${feature.label}`}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setActive(index)
                  }
                }}
                className={cn(
                  'group relative h-[19rem] cursor-pointer overflow-hidden rounded-[2.25rem] outline-none transition-all duration-500 focus-visible:ring-4 focus-visible:ring-joy-pink/50 md:h-[21rem]',
                  isActive
                    ? 'shadow-[0_30px_60px_-30px_rgba(214,74,140,0.6)] ring-[6px] ring-[#f6c6dd]'
                    : 'shadow-[0_20px_40px_-25px_rgba(42,34,64,0.45)]',
                )}
              >
                <div className={cn('absolute inset-0', feature.imageScale)}>
                  <Image
                    src={feature.image || '/placeholder.svg'}
                    alt={feature.alt}
                    fill
                    sizes="(min-width: 768px) 40vw, 18rem"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div
                  className={cn(
                    'absolute inset-x-0 bottom-0 h-[52%] bg-gradient-to-t to-transparent',
                    feature.overlay,
                  )}
                  aria-hidden="true"
                />

                <div className="relative flex h-full flex-col justify-between p-5 md:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={cn(
                        'inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/85 shadow-[0_4px_12px_-6px_rgba(40,20,60,0.35)] ring-1 ring-white transition-transform duration-300 group-hover:scale-105 md:size-12',
                        feature.badgeBg,
                      )}
                    >
                      <Icon className="size-6 md:size-7" />
                    </span>
                    <span
                      className={cn(
                        'rounded-full bg-black/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white ring-1 ring-white/20 backdrop-blur-md transition-opacity duration-300',
                        isActive ? 'opacity-100' : 'opacity-100 md:hidden',
                      )}
                    >
                      {feature.badge}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 text-white">
                    <a
                      href={`#${feature.id}`}
                      aria-label={`Explore ${feature.label}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (scrollToSection(feature.id)) e.preventDefault()
                      }}
                      onKeyDown={(e) => e.stopPropagation()}
                      className={cn(
                        'inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-foreground transition-all duration-300 hover:gap-2.5',
                        isActive ? 'opacity-100' : 'opacity-100 md:pointer-events-none md:h-0 md:py-0 md:opacity-0',
                      )}
                    >
                      Explore
                      <ArrowRight className="size-4" aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
