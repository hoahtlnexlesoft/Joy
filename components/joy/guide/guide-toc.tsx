'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Sparkles } from '@/components/joy/cute-icons'

export type GuideLink = { id: string; title: string }

export function GuideToc({ topics }: { topics: GuideLink[] }) {
  const [activeId, setActiveId] = useState(topics[0]?.id ?? '')

  useEffect(() => {
    const sections = topics
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    let frame = 0

    const updateActiveSection = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const activationLine = 156
        const isAtPageEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        const currentSection = isAtPageEnd
          ? sections.at(-1)
          : sections.reduce<HTMLElement | undefined>((activeSection, section) => {
              return section.getBoundingClientRect().top <= activationLine ? section : activeSection
            }, sections[0])

        if (currentSection) setActiveId(currentSection.id)
      })
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    window.addEventListener('hashchange', updateActiveSection)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
      window.removeEventListener('hashchange', updateActiveSection)
    }
  }, [topics])

  return (
    <nav aria-label="Topics" data-no-reveal className="hidden lg:block">
      <div className="sticky top-28">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">On this page</p>
        <ul className="flex flex-col gap-1 border-l-2 border-border/70">
          {topics.map((topic) => {
            const active = topic.id === activeId
            return (
              <li key={topic.id}>
                <Link
                  href={`#${topic.id}`}
                  aria-current={active ? 'location' : undefined}
                  className={`joy-toclink group relative -ml-0.5 flex items-center gap-2.5 rounded-r-xl border-l-2 px-3 py-2 text-sm ${
                    active
                      ? 'border-joy-pink bg-blush/70 font-semibold text-joy-pink'
                      : 'border-transparent text-muted-foreground hover:border-[#e8ad4d] hover:bg-[#fff1c9] hover:text-[#805019]'
                  }`}
                >
                  {active ? <Sparkles className="size-3.5 shrink-0" aria-hidden="true" /> : <span className="size-3.5 shrink-0" aria-hidden="true" />}
                  <span>{topic.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

export default GuideToc
