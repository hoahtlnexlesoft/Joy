import Link from 'next/link'
import { Check } from '@/components/joy/cute-icons'
import { StoreBadge } from '@/components/joy/site-footer'

/** Option B is switched on at build time with NEXT_PUBLIC_JOY_OPTION=b. Option A stays the default. */
export const isOptionB = process.env.NEXT_PUBLIC_JOY_OPTION === 'b'

export function StoreRow() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <StoreBadge store="apple" compact />
      <StoreBadge store="google" compact />
    </div>
  )
}

export function FreePlanNote() {
  return (
    <p className="text-sm text-muted-foreground">
      The free plan includes activity videos and free library content. Already have an account?{' '}
      <Link href="#download" className="font-semibold text-foreground underline underline-offset-4">
        Log in
      </Link>
    </p>
  )
}

const points = [
  'One parent account for all your children',
  '1,000+ activities, with new ones every week',
  'Only parents set up and manage a child profile',
]

export function TrustStrip() {
  return (
    <section aria-label="Why parents choose Joy" className="px-4 pb-6 pt-2 md:pb-8">
      <ul className="mx-auto grid max-w-6xl gap-2 rounded-[1.75rem] bg-white/80 p-3 ring-1 ring-border md:grid-cols-3 md:gap-0 md:p-4">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-3 px-3 py-2 text-sm font-semibold md:justify-center">
            <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#dcf5e8] text-[#1f9d6b]">
              <Check className="size-3.5" aria-hidden="true" />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </section>
  )
}

const cards = [
  {
    emoji: '🧸',
    title: "You're in charge",
    body: "One parent account holds all your children. Only you can set your child's unique needs and choose their plan.",
    tint: 'bg-[#ffe9dc]',
  },
  {
    emoji: '🌈',
    title: 'You see what matters',
    body: 'Your Parent Portal shows how they felt, which element they picked and what they did, all in one glance.',
    tint: 'bg-[#efe6ff]',
  },
  {
    emoji: '🎁',
    title: 'Plans without surprises',
    body: "Each plan covers one child. When a plan ends, your child's profile, growth path and history stay saved.",
    tint: 'bg-[#dcf5e8]',
  },
]

export function ParentTrust() {
  return (
    <section aria-labelledby="trust-title" className="px-4 py-12 md:py-14 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Peace of mind</p>
        <h2 id="trust-title" className="mt-2 text-center text-3xl font-medium tracking-tight md:text-4xl">
          Made for parents <span className="text-gradient-joy">to trust</span>
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {cards.map((c) => (
            <li key={c.title} className={`rounded-[1.75rem] p-6 ${c.tint}`}>
              <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm" aria-hidden="true">
                {c.emoji}
              </span>
              <h3 className="mt-4 font-display text-xl font-medium">{c.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
