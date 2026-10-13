import type { Metadata } from 'next'
import { TelegramIcon } from '@/components/joy/telegram-icon'
import { WhatsAppIcon } from '@/components/joy/whatsapp-icon'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Mail, ShieldCheck, Sparkles } from '@/components/joy/cute-icons'
import { GrowthCycleIllustration } from '@/components/joy/landing/growth-cycle-slider'
import { ContactLink } from '@/components/joy/contact-link'
import { BlinkingAnimals } from '@/components/joy/blinking-animals'
import { SiteHeader } from '@/components/joy/site-header'
import { SiteFooter, TryJoyCta } from '@/components/joy/site-footer'
import { Eyebrow, JoyButton } from '@/components/joy/ui'
import { GuideDecorations } from '@/components/joy/guide/guide-decorations'
import { GuideIcon } from '@/components/joy/guide/guide-icons'
import { GuideToc } from '@/components/joy/guide/guide-toc'
import { DevCard, type DevKey } from '@/components/joy/guide/development-cards'
import { ElementCard, ElementMascot, type ElementKey } from '@/components/joy/guide/element-mascots'
import { TopicGrid, type Topic as TopicItem } from '@/components/joy/guide/topic-grid'
import { movementTags } from '@/components/joy/landing/features'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'How it works',
  description:
    "Everything parents need to know, from your child's first day in Joy to the words you'll see along the way.",
}

const topics: TopicItem[] = [
  { id: 'what-is-joy', icon: '🌈', title: 'What is Joy?', desc: 'The app in a minute', tint: 'bg-peach' },
  { id: 'how-to-use', icon: '▶️', title: 'How to use Joy', desc: 'Daily routine, characters, elements and moods, video and music', tint: 'bg-blush' },
  { id: 'unique-needs', icon: '💚', title: "Your child's unique needs", desc: 'What they are and how Joy uses them', tint: 'bg-mint' },
  { id: 'stages', icon: '✨', title: 'Alpha, Omega, Crystal and Rainbow', desc: 'The stages of the growth path', tint: 'bg-lavender' },
  { id: 'child-nature', icon: '🧭', title: 'Child nature', desc: 'Nine natures and the archetypes they grow toward', tint: 'bg-sky' },
  { id: 'elements', icon: '💧', title: "Your child's elements", desc: 'Flame, Stream, Spark, Stone and more', tint: 'bg-sky' },
  { id: 'animals', icon: '🦁', title: 'Animal friends', desc: 'Eighteen animals and the behavior they describe', tint: 'bg-peach' },
  { id: 'development', icon: '📈', title: 'Development and repetition', desc: 'How progress builds and why activities repeat', tint: 'bg-mint' },
  { id: 'subscribe', icon: '🎟️', title: 'Subscribe and extend', desc: 'Buy, assign and extend a plan', tint: 'bg-blush' },
  { id: 'contact', icon: '💬', title: 'Contact customer service', desc: 'Get help from the Joy team', tint: 'bg-lavender' },
]

const natures = [
  ['🧭', 'Dream Explorer', 'Explorer'],
  ['🤝', 'Kind Helper', 'Helper'],
  ['🎨', 'Creative Artist', 'Artist'],
  ['🗂️', 'Smart Organizer', 'Organizer'],
  ['💭', 'Curious Thinker', 'Thinker'],
  ['🌱', 'Caring Nurturer', 'Nurturer'],
  ['🔭', 'Wise Seeker', 'Seeker'],
  ['🚀', 'Brave Initiator', 'Initiator'],
  ['🌙', 'Big Dreamer', 'Dreamer'],
]

const elements: [string, string, string[]][] = [
  ['🔥', 'Flame', ['Fire']],
  ['💧', 'Stream', ['Water']],
  ['⚡', 'Spark', ['Fire', 'Air']],
  ['🪨', 'Stone', ['Earth']],
  ['🌬️', 'Wind', ['Air']],
  ['🌿', 'Garden', ['Water', 'Earth']],
  ['☁️', 'Sky', ['Sky']],
  ['⛰️', 'Mountain', ['Earth', 'Air', 'Sky']],
  ['🌊', 'Ocean', ['Fire', 'Water', 'Air', 'Earth', 'Sky']],
]

const animals = [
  { name: 'Lion', image: 'lion' },
  { name: 'Dolphin', image: 'dolphin' },
  { name: 'Panda', image: 'panda' },
  { name: 'Black Panther', image: 'black-panther' },
  { name: 'Bunny', image: 'bunny' },
  { name: 'Butterfly', image: 'butterfly' },
  { name: 'Caterpillar', image: 'caterpillar' },
  { name: 'Dragon', image: 'dragon' },
  { name: 'Duckling', image: 'duckling' },
  { name: 'Elephant', image: 'elephant' },
  { name: 'Firefly', image: 'firefly' },
  { name: 'Hummingbird', image: 'hummingbird' },
  { name: 'Ladybug', image: 'ladybug' },
  { name: 'Owl', image: 'owl' },
  { name: 'Squirrel', image: 'squirrel' },
  { name: 'Whale', image: 'whale' },
  { name: 'Deer', image: 'deer' },
  { name: 'Clownfish', image: 'clownfish' },
] as const

function Topic({
  id,
  title,
  intro,
  children,
}: {
  id: string
  title: string
  intro?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-32 relative z-[1] max-sm:rounded-[1.5rem] rounded-[2rem] bg-white/95 px-3 py-4 sm:px-4 sm:py-5 md:px-5 md:py-6 lg:py-8 shadow-[0_12px_38px_-30px_rgba(42,34,64,0.32)] ring-1 ring-border/70 backdrop-blur-[2px] md:px-9 md:py-5">
      <div className="flex items-center gap-4">
        <GuideIcon id={id} variant="section" />
        <h2 id={`${id}-title`} className="text-3xl font-medium tracking-tight md:text-4xl">
          {title}
        </h2>
      </div>
      {intro ? <p className="mt-3 md:mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</p> : null}
      {children ? <div className="mt-5 lg:mt-8">{children}</div> : null}
    </section>
  )
}

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn('rounded-3xl p-4 sm:p-6', className)}>{children}</div>
}

export default function HowItWorksPage() {
  return (
    <>
      <div
        className="relative isolate"
        style={{
          backgroundColor: '#fff8f2',
          backgroundImage: [
            'radial-gradient(circle at 12% 10%, rgba(255,177,129,0.23), transparent 30rem)',
            'radial-gradient(circle at 88% 22%, rgba(187,164,255,0.2), transparent 34rem)',
            'radial-gradient(circle at 74% 76%, rgba(133,218,191,0.2), transparent 38rem)',
            'radial-gradient(rgba(126,103,151,0.11) 0.75px, transparent 0.85px)',
            'linear-gradient(110deg, #fff4ec 0%, #f8f2ff 50%, #eff8ff 100%)',
          ].join(', '),
          backgroundSize: 'auto, auto, auto, 20px 20px, 100% 100%',
        }}
      >
      <GuideDecorations />
      <SiteHeader />
      <main className="relative overflow-clip">
        <section className="relative z-10 overflow-hidden px-3 sm:px-4 pb-3 pt-5 md:pb-4 md:pt-3 lg:pt-4">
          <div className="relative mx-auto grid max-w-6xl items-center gap-3 md:grid-cols-[.95fr_1.05fr] md:gap-4 lg:gap-8">
            <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
              <Eyebrow>Parent guide</Eyebrow>
              <h1 className="text-5xl font-medium leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
                How <em className="text-gradient-joy">Joy works</em>
              </h1>
              <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {"Everything parents need to know, from your child's first day in Joy to the words you'll see along the way. Pick a topic to get started."}
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
                <JoyButton href="#how-to-use">See Joy in action</JoyButton>
                <JoyButton href="/parent" variant="ghost">Visit parent portal</JoyButton>
              </div>
            </div>
            <div className="relative mx-auto flex w-full max-w-[520px] items-center justify-center md:-mt-8 md:-mb-2 md:max-w-[600px]">
              <BlinkingAnimals
                src="/images/joy-guide-animals-cutout.webp"
                alt="A group of cute animal friends sitting together on a fluffy cloud"
                priority
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </section>

        <section aria-label="Browse guide topics" className="relative z-10 px-3 sm:px-4 pb-6 pt-0 md:pb-6 lg:pb-10">
          <div className="mx-auto max-w-6xl">
            <TopicGrid topics={topics} />
          </div>
        </section>

        <div className="relative z-10 px-2.5 sm:px-4 pb-10">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-[220px_1fr] lg:gap-12">
            <GuideToc topics={topics} />

            <div className="flex min-w-0 flex-col gap-5 md:gap-4 lg:gap-12">
              <Topic
                id="what-is-joy"
                title="What is Joy?"
                intro="Joy is a learning app for children that turns a few short activities a day into a path for growth. It gets to know your child, picks activities that suit them, and shows you how they feel and what they learn."
              >
                <div className="grid gap-4 md:grid-cols-3">
                  <Card className="bg-peach">
                    <h3 className="text-xl font-medium">For your child</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      Daily activities with friendly characters, videos and music, plus more than 1,000 activities in Joy Collection.
                    </p>
                  </Card>
                  <Card className="bg-blush">
                    <h3 className="text-xl font-medium">For you</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      One parent account for all your children, with a feeling log and activity history for each child.
                    </p>
                  </Card>
                  <Card className="bg-lavender">
                    <h3 className="text-xl font-medium">Made for them</h3>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                      {"A profile of your child's nature and a growth path that adapts as they grow."}
                    </p>
                  </Card>
                </div>
              </Topic>

              <Topic
                id="how-to-use"
                title="How to use Joy"
                intro="Your child opens Joy, taps Start Journey and plays through today's activities. Here's what they'll meet along the way."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-white ring-1 ring-border">
                    <h3 className="text-xl font-medium">Daily routine</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Each day, Joy prepares a set of activities in three parts of the day. Your child taps Start Journey to begin.
                    </p>
                    <ul className="mt-4 flex flex-col gap-2 text-sm">
                      <li className="rounded-2xl bg-[#fff3d6] p-3"><strong>☀️ Morning Mindfulness</strong> — Calm, gentle activities to start the day.</li>
                      <li className="rounded-2xl bg-peach p-3"><strong>🎒 Afternoon Adventures</strong> — Active and curious activities.</li>
                      <li className="rounded-2xl bg-lavender p-3"><strong>🌙 Evening Enchantment</strong> — Soothing activities to wind down.</li>
                    </ul>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Every activity carries a movement tag: Think, Ground, Action, Create, Flow or Reset. Joy balances them across the day.
                    </p>
                  </Card>
                  <Card className="bg-white ring-1 ring-border">
                    <h3 className="text-xl font-medium">Characters</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {"Friendly characters guide your child through activities. Animal teachers lead some videos, picked from Joy's animal library to suit your child."}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      Your child also has their own animal friend, which reflects their nature. See{' '}
                      <Link href="#animals" className="font-semibold text-joy-pink underline underline-offset-4">Animal friends</Link>.
                    </p>
                  </Card>
                  <Card className="bg-white ring-1 ring-border">
                    <h3 className="text-xl font-medium">Elements and moods</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Joy asks your child two simple questions during the day:</p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                      <li className="rounded-2xl bg-sky p-3"><strong>Which element do you feel today?</strong> Your child picks the element they feel in the Element Log.</li>
                      <li className="rounded-2xl bg-blush p-3"><strong>Feeling okay?</strong> Your child picks the mood that matches how they feel. Joy then offers emotional balancing videos or audio for that mood.</li>
                    </ul>
                    <p className="mt-3 text-sm text-muted-foreground">
                      Their answers build the feeling log you see in your parent account, with their most common element and mood.
                    </p>
                  </Card>
                  <Card className="bg-white ring-1 ring-border">
                    <h3 className="text-xl font-medium">Video and music</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Activities come as short videos, and some calming activities come as audio your child can listen to.
                    </p>
                    <ul className="mt-3 flex flex-col gap-2 text-sm">
                      {[
                        'Activity and exercise videos to get moving',
                        'Calm Senses video or audio, based on the needs you add',
                        "Emotional balancing video or audio, matched to today's mood",
                        'More than 1,000 activities to explore in Joy Collection',
                      ].map((i) => (
                        <li key={i} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gradient-joy" aria-hidden="true" />{i}</li>
                      ))}
                    </ul>
                  </Card>
                </div>
                <figure className="mt-6 overflow-hidden rounded-[1.75rem] bg-[#f3efff] ring-1 ring-border">
                  <video
                    controls
                    playsInline
                    preload="none"
                    poster="/videos/joy-daily-activities-poster.webp"
                    className="aspect-video w-full bg-[#f3efff] object-cover"
                    aria-label="A short video of a child's day with Joy: morning, afternoon and evening activities"
                  >
                    <source src="/videos/joy-daily-activities.webm" type="video/webm" />
                    <source src="/videos/joy-daily-activities.mp4" type="video/mp4" />
                    Your browser does not support inline video playback.
                  </video>
                  <figcaption className="px-5 py-3 text-sm text-muted-foreground">A day with Joy: morning, afternoon and evening activities for your child.</figcaption>
                </figure>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {movementTags.map((t) => (
                    <li key={t.name} className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold', t.className)}>
                      <span aria-hidden="true">{t.icon}</span>
                      {t.name}
                    </li>
                  ))}
                </ul>
              </Topic>

              <Topic
                id="unique-needs"
                title="Your child's unique needs"
                intro="When you add a child, you can tell Joy about anything that makes them unique, like attention differences. Joy uses this to add support activities that suit them."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-mint">
                    <h3 className="text-xl font-medium">How Joy uses them</h3>
                    <p className="mt-2 text-sm text-foreground/70">{"Joy adds a Calm Senses video or audio to your child's daily activities"}</p>
                  </Card>
                  <Card className="bg-sky">
                    <h3 className="text-xl font-medium">Who can set them</h3>
                    <p className="mt-2 text-sm text-foreground/70">{"Only you, the parent, can set your child's unique needs"}</p>
                    <p className="mt-2 text-sm text-foreground/70">{"Set them in your child's profile when you add a new child, or change them later with Edit"}</p>
                  </Card>
                </div>
                <p className="mt-4 rounded-2xl bg-white p-4 text-sm ring-1 ring-border">
                  {"✨ Once you set them, Calm Senses activities unlock for your child. They're included with Premium and Premium Plus plans."}
                </p>
              </Topic>

              <section
                id="stages"
                aria-labelledby="stages-title"
                className="scroll-mt-32 relative z-[1] overflow-hidden max-sm:rounded-[1.5rem] rounded-[2rem] bg-white/95 px-3 py-6 sm:px-5 sm:py-8 shadow-[0_12px_38px_-30px_rgba(42,34,64,0.32)] ring-1 ring-border/70 backdrop-blur-[2px] md:px-9 md:py-5 lg:py-9"
              >
                <div className="relative">
                  <span aria-hidden="true" className="absolute -right-1 top-0 size-5 rotate-45 rounded-md bg-joy-lilac/15" />
                  <h2 id="stages-title" className="max-w-4xl text-3xl font-medium tracking-tight md:text-4xl">
                    <span className="text-joy-lilac">Alpha, Omega,</span> Crystal and Rainbow
                  </h2>
                  <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">
                    These are the stages of your child&apos;s growth path. Your child is always in one stage, marked Current in their Information tab. When they finish the path, it starts again and adapts to how they&apos;ve grown.
                  </p>
                </div>

                <div className="mt-6 grid items-center gap-5 lg:grid-cols-[1.15fr_0.95fr]">
                  <figure className="rounded-[1.75rem] bg-gradient-to-br from-white via-[#fffdfb] to-[#f7f3ff] p-3.5 ring-1 ring-border/80 sm:p-5">
                    <GrowthCycleIllustration />
                    <figcaption className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
                      The journey repeats and adapts as your child grows.
                    </figcaption>
                  </figure>

                  <ol className="flex flex-col gap-2.5" aria-label="Growth stage details">
                    {[
                      { name: 'Alpha', accent: 'bg-joy-orange', copy: 'A fresh start for noticing what makes your child shine.' },
                      { name: 'Omega', accent: 'bg-joy-pink', copy: 'A moment to practice new skills and build confidence.' },
                      { name: 'Crystal', accent: 'bg-joy-sky', copy: 'Small wins come together as your child keeps growing.' },
                      { name: 'Rainbow', accent: 'bg-joy-lilac', copy: 'Celebrate the journey before a new path begins.' },
                    ].map((stage) => (
                      <li key={stage.name} className="relative overflow-hidden rounded-2xl bg-[#f7f5fb] p-3.5 pl-5">
                        <span className={cn('absolute inset-y-0 left-0 w-1 rounded-full', stage.accent)} />
                        <h3 className="font-display text-base font-semibold">{stage.name}</h3>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{stage.copy}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <section aria-labelledby="improvement-title" className="relative mt-6 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fffaf3] via-white to-[#f6f1ff] p-4 ring-1 ring-border/80 sm:p-6 md:p-7">
                  <span aria-hidden="true" className="absolute -right-5 -top-6 size-20 rotate-45 rounded-2xl border-[10px] border-white/70" />
                  <div className="relative grid items-center gap-6 md:grid-cols-[1fr_0.85fr] md:gap-6 lg:gap-10">
                    <div>
                      <h3 id="improvement-title" className="text-2xl font-semibold tracking-tight">The improvement plan</h3>
                      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
                        Each stage follows your child&apos;s improvement plan. Its baseline program is shared across three action tags that form a triangle, helping your child grow in a balanced way.
                      </p>
                      <ul className="mt-4 flex flex-col gap-2">
                        {[
                          { name: 'Brave', color: 'text-joy-orange', marker: 'bg-joy-orange', icon: ShieldCheck, copy: 'Activities that build courage and confidence.' },
                          { name: 'Kind', color: 'text-joy-mint', marker: 'bg-joy-mint', icon: Heart, copy: 'Activities that build care for others.' },
                          { name: 'Dream', color: 'text-joy-lilac', marker: 'bg-joy-lilac', icon: Sparkles, copy: 'Activities that build imagination and hope.' },
                        ].map((tag) => (
                          <li key={tag.name} className="flex items-center gap-3 rounded-xl bg-white/90 px-3.5 py-2.5 shadow-sm ring-1 ring-border/50">
                            <span className={cn('size-3 shrink-0 rotate-45 rounded-[3px]', tag.marker)} aria-hidden="true" />
                            <span><strong className={tag.color}>{tag.name}</strong><span className="ml-2 text-sm text-muted-foreground">{tag.copy}</span></span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="relative mx-auto aspect-[1.2/1] w-full max-w-[330px]" role="img" aria-label="Brave, Kind, and Dream form a balanced improvement triangle around the baseline program">
                      <svg viewBox="0 0 320 250" className="absolute inset-0 size-full" aria-hidden="true">
                        <path d="M160 30 L42 218 L278 218 Z" fill="rgba(255,255,255,0.52)" stroke="#c9bfd6" strokeWidth="4" strokeDasharray="2 9" strokeLinecap="round" />
                      </svg>
                      <span className="absolute left-1/2 top-[4%] flex -translate-x-1/2 flex-col items-center gap-1.5 text-joy-orange">
                        <span className="grid size-[4.25rem] place-items-center rounded-full border-[3px] border-joy-orange bg-peach shadow-[0_0_0_7px_rgba(255,143,74,0.14)]"><ShieldCheck className="size-7 text-joy-orange" aria-hidden="true" /></span>
                        <span className="text-xs font-bold">Brave</span>
                      </span>
                      <span className="absolute bottom-[2%] left-[2%] flex flex-col items-center gap-1.5 text-joy-lilac">
                        <span className="grid size-[4.25rem] place-items-center rounded-full border-[3px] border-joy-lilac bg-lavender shadow-[0_0_0_7px_rgba(155,104,245,0.14)]"><Sparkles className="size-7 text-joy-lilac" aria-hidden="true" /></span>
                        <span className="text-xs font-bold">Dream</span>
                      </span>
                      <span className="absolute bottom-[2%] right-[2%] flex flex-col items-center gap-1.5 text-joy-mint">
                        <span className="grid size-[4.25rem] place-items-center rounded-full border-[3px] border-joy-mint bg-mint shadow-[0_0_0_7px_rgba(91,191,132,0.14)]"><Heart className="size-7 text-joy-mint" aria-hidden="true" /></span>
                        <span className="text-xs font-bold">Kind</span>
                      </span>
                      <span className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 text-center text-xs font-semibold leading-tight text-foreground/80">Baseline<br />program</span>
                      <span aria-hidden="true" className="absolute left-[17%] top-[48%] size-2 rotate-45 rounded-sm bg-joy-orange/70" />
                      <span aria-hidden="true" className="absolute right-[17%] top-[48%] size-2 rotate-45 rounded-sm bg-joy-mint/70" />
                    </div>
                  </div>
                </section>
              </section>

              <Topic
                id="child-nature"
                title="Child nature"
                intro="Your child's nature describes who they are today. Each nature points to a potential archetype, the kind of person they can grow into. You'll see both in your child's Information tab."
              >
                <div className="mb-6 inline-flex items-center gap-4 rounded-3xl bg-gradient-to-r from-peach to-lavender px-6 py-4">
                  <div><p className="text-xs text-muted-foreground">Child nature</p><p className="font-display text-xl font-medium">Dream Explorer</p></div>
                  <ArrowRight className="size-5 text-joy-pink" aria-hidden="true" />
                  <div><p className="text-xs text-muted-foreground">Potential archetype</p><p className="font-display text-xl font-medium">Explorer</p></div>
                </div>
                <h3 className="mb-4 text-xl font-medium">The nine child natures</h3>
                <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {natures.map(([icon, name, grows]) => (
                    <li key={name} className="flex items-center gap-3 rounded-2xl bg-white p-4 ring-1 ring-border">
                      <span className="text-2xl" aria-hidden="true">{icon}</span>
                      <div><p className="font-semibold">{name}</p><p className="text-xs text-muted-foreground">Grows toward {grows}</p></div>
                    </li>
                  ))}
                </ul>
              </Topic>

              <Topic
                id="elements"
                title="Your child's elements"
                intro="Your child's core element describes their energy. Some elements are pure, like Flame or Stream, and some blend two or three energies, like Garden or Mountain. You'll find your child's core element in their Information tab."
              >
                <div className="@container">
                  <ul className="grid grid-cols-1 gap-4 @md:grid-cols-2 @5xl:grid-cols-3">
                    {elements.map(([, name, energies], i) => (
                      <ElementCard key={name} name={name as ElementKey} energies={energies} index={i} />
                    ))}
                  </ul>
                </div>
                <div className="mt-6 rounded-3xl bg-gradient-to-r from-[#dcf5f7] to-[#e8f1ff] p-5 sm:p-6">
                  <p className="flex items-start gap-3 text-sm leading-relaxed"><ElementMascot name="Ocean" className="mt-0.5 size-9 shrink-0" /><span><strong className="text-foreground">Ocean holds every energy:</strong> Fire, Water, Air, Earth and Sky.</span></p>
                </div>
              </Topic>

              <Topic
                id="animals"
                title="Animal friends"
                intro="Your child's animal nature reflects how they tend to behave: how they play, learn and connect with others. You'll find it in your child's Information tab. Tap it in the app to read more."
              >
                <ul className="grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-4 md:grid-cols-6">
                  {animals.map(({ name, image }) => (
                    <li key={name} className="group flex min-w-0 flex-col items-center gap-2 py-2 text-center">
                      <Image
                        src={`/images/animals/${image}.webp`}
                        alt={name}
                        width={512}
                        height={512}
                        className="size-[4.5rem] object-contain transition-transform duration-300 group-hover:scale-110 sm:size-20"
                      />
                      <span className="font-display text-sm font-semibold text-[#302b3d]">{name}</span>
                    </li>
                  ))}
                </ul>
              </Topic>

              <Topic
                id="development"
                title="Development and repetition"
                intro="Children learn by doing new things and by coming back to things they know. Joy plans both, so your child keeps growing without feeling rushed."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  {(
                    [
                      ['balance', 'Variety', 'New and repeat, in balance', 'Each day mixes new activities with ones your child has done before. Repeats are spaced out, so they feel familiar, not boring.'],
                      ['movement', 'Movement', 'Balanced movement', 'Joy spreads Think, Ground, Action, Create, Flow and Reset activities across each stage of the growth path.'],
                      ['cycle', 'Cycle', 'A path that repeats and adapts', "When your child finishes the path, it starts again, adjusted to how they've grown."],
                      ['progress', 'Progress', 'Progress you can see', 'Your parent account shows activity counts by movement tag, the feeling log and each activity with its date.'],
                    ] as [DevKey, string, string, string][]
                  ).map(([kind, eyebrow, t, b]) => (
                    <DevCard key={kind} kind={kind} eyebrow={eyebrow} title={t}>{b}</DevCard>
                  ))}
                </div>
                <p className="mt-4 text-sm text-muted-foreground">With Mastery, the Special Plan program adds 12 programs across one year, starting on the plan date.</p>
              </Topic>

              <Topic
                id="subscribe"
                title="Subscribe and extend"
                intro="Each child needs their own plan. You buy and manage plans in your parent account in the Joy app."
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="bg-white ring-1 ring-border">
                    <h3 className="text-xl font-medium">Subscribe</h3>
                    <ol className="mt-4 flex flex-col gap-3">
                      {[
                        ['Log in to your parent account', 'Use your phone, email, Google or Apple.'],
                        ['Choose your child', 'Open their profile and go to the Child Plans tab.'],
                        ['Pick a plan', 'Choose Buy new, or assign a plan you already have.'],
                        ['Make payment', 'Confirm the plan and pay in the app.'],
                      ].map(([t, b], i) => (
                        <li key={t} className="flex gap-3">
                          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-joy text-sm font-bold text-white">{i + 1}</span>
                          <div><p className="font-semibold">{t}</p><p className="text-sm text-muted-foreground">{b}</p></div>
                        </li>
                      ))}
                    </ol>
                  </Card>
                  <Card className="flex flex-col gap-3 bg-blush">
                    <h3 className="text-xl font-medium">Extend</h3>
                    <p className="text-sm text-foreground/70">{"Plans don't renew automatically. To keep going, buy a new plan for your child from Child Plans."}</p>
                    <p className="rounded-2xl bg-white/80 p-3 text-sm">{"🔔 Joy sends you a notification 3 days before your child's plan ends, so there's time to choose the next one."}</p>
                    <p className="text-sm text-foreground/70">{"If a plan ends, your child's profile, growth path and history are still saved."}</p>
                    <JoyButton href="/pricing" className="mt-auto self-start">See plans and prices</JoyButton>
                  </Card>
                </div>
              </Topic>

              <Topic
                id="contact"
                title="Contact customer service"
                intro="Can't find what you need? Reach the Joy team by email, Telegram or WhatsApp."
              >
                <ul className="grid gap-3 md:grid-cols-3">
                  {[
                    { icon: Mail, label: 'Email', value: 'support@joykids.app', href: 'mailto:support@joykids.app', tint: 'bg-peach text-joy-orange' },
                    { icon: TelegramIcon, big: true, label: 'Telegram', value: '@JoyKidsSupport', href: 'https://t.me/JoyKidsSupport', appHref: 'tg://resolve?domain=JoyKidsSupport', tint: 'bg-sky text-joy-sky' },
                    { icon: WhatsAppIcon, big: true, label: 'WhatsApp', value: '+95 9 123 456 789', href: 'https://wa.me/959123456789', appHref: 'whatsapp://send?phone=959123456789', tint: 'bg-mint text-joy-mint' },
                  ].map((c) => (
                    <li key={c.label}>
                      <ContactLink href={c.href} appHref={(c as { appHref?: string }).appHref} className="flex items-center gap-4 rounded-3xl bg-white p-5 ring-1 ring-border transition-all hover:-translate-y-0.5 hover:shadow-lg">
                        <span className={cn('inline-flex size-12 shrink-0 items-center justify-center rounded-2xl', c.tint)}>
                          <c.icon className={cn('size-5', (c as { big?: boolean }).big && 'size-7')} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1"><span className="block text-xs text-muted-foreground">{c.label}</span><span className="block truncate font-semibold" title={c.value}>{c.value}</span></span>
                      </ContactLink>
                    </li>
                  ))}
                </ul>
              </Topic>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <TryJoyCta />
        </div>
        </main>
        <SiteFooter surface="guide" />
      </div>
    </>
  )
}
