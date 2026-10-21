'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search } from '@/components/joy/cute-icons'
import { GuideIcon } from './guide-icons'

export type Topic = { id: string; icon: string; title: string; desc: string; tint: string }

export function TopicGrid({ topics }: { topics: Topic[] }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const filtered = q ? topics.filter((t) => `${t.title} ${t.desc}`.toLowerCase().includes(q)) : []

  return (
    <div className="flex flex-col gap-5">
      <label className="mx-auto flex h-12 w-full max-w-lg items-center gap-3 rounded-full bg-white px-5 shadow-[0_8px_24px_-16px_rgba(42, 34, 64, 0.28)] ring-1 ring-border focus-within:ring-2 focus-within:ring-ring">
        <Search className="size-5 text-muted-foreground" aria-hidden="true" />
        <span className="sr-only">Search topics</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search topics, like elements or Alpha"
          className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
        />
      </label>

      {!q ? null : filtered.length ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <li key={t.id}>
              <Link
                href={`#${t.id}`}
                className="group flex h-full items-start gap-3.5 rounded-3xl bg-gradient-to-b from-white to-[#ffffff] p-4 ring-1 ring-border transition-all duration-200 hover:-translate-y-1 hover:from-[#fff3d6] hover:to-[#fff3d6] hover:ring-[#f5b73b]/60 hover:shadow-[0_18px_38px_-22px_rgba(122, 74, 0, 0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-pink/70"
              >
                <GuideIcon id={t.id} tintClass={t.tint} />
                <span className="pt-0.5">
                  <span className="block font-semibold leading-snug transition-colors group-hover:text-[#9a561c]">{t.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{t.desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-muted-foreground" role="status">
          {'No topics match your search. Try a word like "elements", "plan" or "Alpha".'}
        </p>
      )}
    </div>
  )
}
