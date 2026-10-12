import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Archive, ArrowRight, Baby, Check, ChevronDown, Crown, Eye, Gem, Lock, Minus, Repeat2, Sparkles } from '@/components/joy/cute-icons'
import { ChoosePlanButton } from '@/components/joy/choose-plan-button'
import { SiteHeader } from '@/components/joy/site-header'
import { SiteFooter, TryJoyCta } from '@/components/joy/site-footer'
import { Eyebrow, JoyButton, SectionHeading } from '@/components/joy/ui'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Plans that grow with your child. Each plan covers one child. Premium plans open everyday activities, Mastery opens the Special Plan program.',
}

const howPlans = [
  { icon: Sparkles, title: 'Try for free', body: 'Start with the free plan: activity videos and free library content.', tint: 'bg-peach' },
  { icon: Baby, title: 'One plan per child', body: 'Each plan covers one kid. Add a plan for each of your children in one parent account.', tint: 'bg-blush' },
  { icon: Repeat2, title: 'Buy or assign', body: 'Buy a new plan, or assign one you already have to any child from their Child Plans tab.', tint: 'bg-mint' },
  { icon: Archive, title: 'Keep their progress', body: "When a plan ends, your child's profile, growth path and history stay saved.", tint: 'bg-lavender' },
]

const premiumBenefits = [
  'All daily activities: activity and exercise videos, animal teacher videos, element activities, Calm Senses support, mood check-in and emotional balancing',
  'Premium activities in Joy Collection',
  'Premium animals in the animal library',
]

const plans = [
  {
    name: 'Discovery',
    badge: 'Premium unlock',
    duration: '1 month',
    price: '4.99',
    monthly: 'about $4.99 a month',
    image: '/images/child-nature-animals.jpg',
    tint: 'bg-peach',
    benefits: premiumBenefits,
    excluded: 'Not included: Special Plan program and library',
  },
  {
    name: 'Adventure',
    badge: 'Premium unlock',
    duration: '3 months',
    price: '12.99',
    monthly: 'about $4.33 a month',
    image: '/images/daily-adventure.jpg',
    tint: 'bg-mint',
    popular: true,
    benefits: premiumBenefits,
    excluded: 'Not included: Special Plan program and library',
  },
  {
    name: 'Guided Growth',
    badge: 'Premium unlock',
    duration: '12 months',
    price: '44.99',
    monthly: 'about $3.75 a month',
    image: '/images/growth-path-cycle.jpg',
    tint: 'bg-blush',
    benefits: premiumBenefits,
    excluded: 'Not included: Special Plan program and library',
  },
  {
    name: 'Mastery',
    badge: 'Special unlock',
    duration: '12 months',
    price: '59.99',
    monthly: 'about $5.00 a month',
    image: '/images/joy-collection-yoga.jpg',
    tint: 'bg-lavender',
    benefits: [
      'The Special Plan program: 12 programs across one year',
      'The Special Plan library',
      'Activity and exercise videos',
      'Premium activities in Joy Collection',
    ],
    excluded: 'Other daily activities show as previews only. Add a Premium plan for Premium Plus.',
  },
]

type Cell = 'in' | 'preview' | 'locked' | 'none'

const groups: { group: string; rows: { name: string; hint?: string; cells: [Cell, Cell, Cell, Cell] }[] }[] = [
  {
    group: 'Daily activities',
    rows: [
      { name: 'Activity and exercise videos', cells: ['in', 'in', 'in', 'in'] },
      { name: 'Animal teacher videos', hint: 'Picked for your child from the animal library', cells: ['none', 'in', 'preview', 'in'] },
      { name: 'Choose today’s element', hint: 'Your child picks the element they feel today', cells: ['preview', 'in', 'preview', 'in'] },
      { name: 'Calm Senses video or audio', hint: 'Support content based on the needs you add as a parent', cells: ['none', 'in', 'preview', 'in'] },
      { name: 'Element activity videos', hint: 'Picked for your child from the video library', cells: ['none', 'in', 'preview', 'in'] },
      { name: 'Special Plan program', hint: '12 programs across one year, starting on the plan date', cells: ['none', 'none', 'in', 'in'] },
      { name: 'Mood check-in', hint: 'Your child shares how they feel today', cells: ['preview', 'in', 'preview', 'in'] },
      { name: 'Emotional balancing video or audio', hint: 'Matched to your child’s mood', cells: ['preview', 'in', 'preview', 'in'] },
    ],
  },
  {
    group: 'Joy Collection',
    rows: [
      { name: 'Free activities', cells: ['in', 'in', 'in', 'in'] },
      { name: 'Premium activities', cells: ['locked', 'in', 'in', 'in'] },
    ],
  },
  {
    group: 'Animal library',
    rows: [
      { name: 'Free animals', cells: ['in', 'in', 'in', 'in'] },
      { name: 'Premium animals', cells: ['locked', 'in', 'locked', 'in'] },
    ],
  },
  {
    group: 'Special Plan library',
    rows: [{ name: 'Special Plan library', cells: ['locked', 'locked', 'in', 'in'] }],
  },
]

const columns = [
  { name: 'Free plan', sub: 'Try for free', cta: { label: 'Try for free', href: '#download' } },
  { name: 'Premium unlock', sub: 'Discovery, Adventure, Guided Growth', cta: { label: 'See plans', href: '#plans' } },
  { name: 'Special unlock', sub: 'Mastery', cta: { label: 'Choose Mastery', href: '#download' } },
  { name: 'Premium Plus', sub: 'A Premium plan + Mastery', cta: { label: 'Pick both', href: '#download' }, highlight: true },
]

const faqs = [
  {
    q: 'How does Try for free work?',
    a: 'Create a parent account and your child starts on the free plan, with activity and exercise videos plus free Joy Collection and animal library content. Some activities show as locked previews until you choose a plan.',
  },
  {
    q: 'I have more than one child. What do I need?',
    a: 'One parent account covers your whole family. Each child needs their own plan, and children can be on different plans.',
  },
  {
    q: 'Can I assign a plan I already bought?',
    a: "Yes. Open your child's Child Plans tab, pick one of your available plans and assign it to them.",
  },
  {
    q: "What's the difference between Premium and Special unlock?",
    a: 'Discovery, Adventure and Guided Growth are Premium unlocks. They open all everyday activities and premium library content. Mastery is a Special unlock. It opens the Special Plan program and library, while other daily activities stay as previews.',
  },
  {
    q: 'What is Premium Plus?',
    a: 'When the same child has both a Premium plan and Mastery, they get Premium Plus: everything in Joy is unlocked.',
  },
  {
    q: 'What happens when a plan ends?',
    a: "Plans don't renew automatically. Joy notifies you 3 days before your child's plan ends, so you can buy the next one. If a plan ends, your child's profile, growth path and history stay saved.",
  },
  { q: 'Where do I pay?', a: 'You pick and pay for plans in your parent account in the Joy app.' },
]

function CellMark({ value }: { value: Cell }) {
  if (value === 'in')
    return (
      <span className="inline-flex size-7 items-center justify-center rounded-full bg-mint text-joy-mint">
        <Check className="size-4" strokeWidth={3} aria-hidden="true" />
        <span className="sr-only">Included</span>
      </span>
    )
  if (value === 'preview')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff3d6] px-2.5 py-1 text-xs font-semibold text-[#9a6a00]">
        <Eye className="size-3.5" aria-hidden="true" />
        Preview
      </span>
    )
  if (value === 'locked')
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
        <Lock className="size-3.5" aria-hidden="true" />
        Locked
      </span>
    )
  return (
    <span className="inline-flex text-muted-foreground/60">
      <Minus className="size-4" aria-hidden="true" />
      <span className="sr-only">Not included</span>
    </span>
  )
}

export default function PricingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden px-4 pb-10 pt-8 md:pb-9 lg:pb-16 md:pt-8 lg:pt-14">
          <div
            className="pointer-events-none absolute -left-32 top-0 size-[34rem] rounded-full bg-[radial-gradient(circle,#fff0d9_0%,transparent_68%)]"
            aria-hidden="true"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-[1.05fr_.95fr] md:gap-7 lg:gap-12">
            <div className="flex flex-col items-center gap-5 text-center md:items-start md:text-left">
              <Eyebrow>Pricing</Eyebrow>
              <h1 className="text-4xl font-medium leading-[1.04] tracking-tight md:text-4xl lg:text-6xl xl:text-7xl">
                Plans that <em className="text-gradient-joy">grow with your child</em>
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Each plan covers one child. Premium plans open everyday activities, Mastery opens the Special Plan program,
                and together they unlock everything.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
                <JoyButton href="#plans" className="h-14 px-8 text-base">Explore plans</JoyButton>
                <JoyButton href="/how-it-works" variant="ghost" className="h-14 px-6 text-base">How Joy works</JoyButton>
              </div>
              <Link href="/parent" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition hover:text-joy-pink">
                One parent account for your whole family <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <figure className="relative mx-auto w-full max-w-[680px] lg:-mr-6">
              <div className="relative aspect-[6/5] w-full overflow-hidden rounded-[2.5rem] border-[6px] border-white shadow-[0_24px_60px_-30px_rgba(72,52,93,0.4)]">
                <Image
                  src="/images/family-picnic.jpg"
                  alt="A family with a puppy enjoying a picnic in the garden at sunset"
                  width={1536}
                  height={1024}
                  priority
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="absolute inset-0 h-full w-full origin-bottom scale-[1.12] object-cover object-bottom"
                />
              </div>
              <div className="animate-float absolute left-0 top-6 flex items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-border backdrop-blur md:origin-top-left md:scale-[0.75] lg:-left-10 lg:top-8 lg:scale-100 lg:px-4 lg:py-3">
                <span className="text-2xl" aria-hidden="true">🎈</span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Premium unlock</p>
                  <p className="font-display text-base font-medium">Daily activities</p>
                </div>
              </div>
              <div className="animate-float absolute bottom-8 right-0 flex items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-border backdrop-blur md:origin-bottom-right md:scale-[0.75] lg:-right-8 lg:bottom-10 lg:scale-100 lg:px-4 lg:py-3" style={{ animationDelay: '-3s' }}>
                <span className="text-2xl" aria-hidden="true">🔮</span>
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Special unlock</p>
                  <p className="font-display text-base font-medium">Mastery</p>
                </div>
              </div>
            </figure>
          </div>
        </section>

        <section aria-labelledby="how-plans" className="px-4 py-10 md:py-9 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <SectionHeading id="how-plans" title="How" accent="plans work" />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {howPlans.map(({ icon: Icon, ...plan }) => (
                <li key={plan.title} className={cn('flex flex-col gap-3 rounded-3xl p-6', plan.tint)}>
                  <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white text-[#856cae] shadow-sm" aria-hidden="true">
                    <Icon className="size-5" strokeWidth={1.9} />
                  </span>
                  <h3 className="text-xl font-medium">{plan.title}</h3>
                  <p className="text-sm leading-relaxed text-foreground/70">{plan.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="plans" aria-labelledby="plans-title" className="scroll-mt-28 px-4 py-10 md:py-9 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              id="plans-title"
              title="Pick a"
              accent="plan for your child"
              description="Open a plan to see what it unlocks. Longer Premium plans cost less per month."
            />
            <ul className="mt-12 grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <li
                  key={plan.name}
                  className={cn(
                    'relative flex flex-col rounded-[2rem] bg-white p-3 ring-1 ring-border shadow-[0_20px_50px_-30px_rgba(42,34,64,0.3)]',
                    plan.popular && 'ring-2 ring-joy-pink lg:-translate-y-3',
                  )}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-joy px-3 py-1 text-xs font-semibold text-white shadow">
                      Most popular
                    </span>
                  ) : null}
                  <div className="flex flex-1 flex-col gap-4 p-3 pt-4">
                    {plan.badge === 'Special unlock' ? (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8b5cf6] via-[#d946ef] to-[#f0449a] px-3 py-1 text-[11px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(217,70,239,0.9)] ring-1 ring-white/60"><Gem className="size-3.5" aria-hidden="true" />{plan.badge}<Sparkles className="size-3" aria-hidden="true" /></span>
                    ) : (
                      <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffe08a] to-[#ffc542] px-3 py-1 text-[11px] font-bold text-[#7a4a00] shadow-[0_6px_14px_-8px_rgba(255,170,0,0.8)] ring-1 ring-[#ffd166]"><Crown className="size-3.5" aria-hidden="true" />{plan.badge}</span>
                    )}
                    <div>
                      <h3 className="text-2xl font-medium">{plan.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {plan.duration} · 1 kid
                      </p>
                    </div>
                    <div>
                      <p className="font-display text-4xl font-medium tracking-tight">
                        <span className="align-top text-xl">$</span>
                        {plan.price}
                      </p>
                      <p className="text-sm text-muted-foreground">{plan.monthly}</p>
                    </div>
                    <ChoosePlanButton variant={plan.popular ? 'primary' : 'dark'} className="w-full" />
                    <details className="group mt-auto rounded-2xl bg-muted/70 px-4 py-3">
                      <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold [&::-webkit-details-marker]:hidden">
                        See benefits
                        <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden="true" />
                      </summary>
                      <ul className="mt-3 flex flex-col gap-2.5 text-sm leading-relaxed">
                        {plan.benefits.map((b) => (
                          <li key={b} className="flex gap-2">
                            <Check className="mt-0.5 size-4 shrink-0 text-joy-mint" strokeWidth={3} aria-hidden="true" />
                            {b}
                          </li>
                        ))}
                        <li className="flex gap-2 text-muted-foreground">
                          <Minus className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                          {plan.excluded}
                        </li>
                      </ul>
                    </details>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
              Prices are in US dollars (USD) and are sample prices for this mockup. Plans are bought and managed in your
              parent account in the Joy app.
            </p>
          </div>
        </section>

        <section id="compare" aria-labelledby="compare-title" className="scroll-mt-28 px-4 py-10 md:py-9 lg:py-24">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              id="compare-title"
              title="Compare what"
              accent="each unlock opens"
              description="Premium plans open everyday activities and premium library content. Mastery opens the Special Plan program. Have both on the same child to unlock everything."
            />
            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CellMark value="in" /> Included</li>
              <li className="flex items-center gap-2"><CellMark value="preview" /> Your child sees it, but it stays locked</li>
              <li className="flex items-center gap-2"><CellMark value="locked" /> Library content that stays locked</li>
              <li className="flex items-center gap-2"><CellMark value="none" /> Not included</li>
            </ul>

            <div className="relative mt-10 overflow-x-auto rounded-[2rem] bg-white ring-1 ring-border shadow-[0_20px_50px_-30px_rgba(42,34,64,0.25)]">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <caption className="sr-only">Features included in each plan type</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-[34%] p-5 text-sm font-semibold text-muted-foreground">Feature</th>
                    {columns.map((c) => (
                      <th key={c.name} scope="col" className={cn('p-5 text-center align-bottom', c.highlight && 'bg-lavender/60')}>
                        <span className="block font-display text-lg font-medium">{c.name}</span>
                        <span className="block text-xs font-normal text-muted-foreground">{c.sub}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                {groups.map((g) => (
                  <tbody key={g.group}>
                    <tr>
                      <th colSpan={5} scope="colgroup" className="bg-muted/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {g.group}
                      </th>
                    </tr>
                    {g.rows.map((r) => (
                      <tr key={r.name} className="border-t border-border/70">
                        <th scope="row" className="p-5 align-middle">
                          <span className="block text-sm font-semibold">{r.name}</span>
                          {r.hint ? <span className="block text-xs font-normal text-muted-foreground">{r.hint}</span> : null}
                        </th>
                        {r.cells.map((c, i) => (
                          <td key={i} className={cn('p-5 text-center', columns[i].highlight && 'bg-lavender/40')}>
                            <CellMark value={c} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                ))}
                <tfoot>
                  <tr className="border-t border-border">
                    <th scope="row" className="p-5 text-sm font-semibold">Get started</th>
                    {columns.map((c) => (
                      <td key={c.name} className={cn('p-5 text-center', c.highlight && 'bg-lavender/40')}>
                        <JoyButton href={c.cta.href} variant={c.highlight ? 'primary' : 'ghost'} className="h-10 px-4 text-xs">
                          {c.cta.label}
                        </JoyButton>
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="faq-title" className="px-4 py-10 md:py-9 lg:py-24">
          <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[0.8fr_1.2fr]">
            <SectionHeading id="faq-title" align="left" eyebrow="FAQ" title="Questions" accent="parents ask" />
            <ul className="flex flex-col gap-3">
              {faqs.map((f) => (
                <li key={f.q}>
                  <details className="group rounded-3xl bg-white px-6 py-5 ring-1 ring-border open:shadow-[0_20px_50px_-30px_rgba(42,34,64,0.3)]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold [&::-webkit-details-marker]:hidden">
                      {f.q}
                      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-muted transition-transform group-open:rotate-180">
                        <ChevronDown className="size-4" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TryJoyCta />
      </main>
      <SiteFooter />
    </>
  )
}
