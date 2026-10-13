import Link from 'next/link'

/** Option B is switched on at build time with NEXT_PUBLIC_JOY_OPTION=b. Option A stays the default. */
export const isOptionB = process.env.NEXT_PUBLIC_JOY_OPTION === 'b'

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
