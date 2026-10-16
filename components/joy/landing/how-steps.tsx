import Link from 'next/link'
import { ArrowRight, Baby, Gamepad2, Sparkles, Ticket, UserRound } from '@/components/joy/cute-icons'
import { JoyButton, SectionHeading } from '../ui'
import { DownloadButton } from '../download-cta'

const steps = [
  {
    icon: UserRound,
    title: 'Create a parent account',
    body: 'Sign up with your phone, email, Google or Apple. We send a verification code to your Telegram.',
    tint: 'bg-peach text-joy-orange',
  },
  {
    icon: Baby,
    title: 'Add your child',
    body: 'Enter their name, date of birth and gender, and share anything about their unique needs.',
    tint: 'bg-blush text-joy-pink',
  },
  {
    icon: Ticket,
    title: 'Pick a plan',
    body: 'Try Joy for free, then choose a plan for each child, from one month to a full year.',
    tint: 'bg-mint text-joy-mint',
    link: { href: '/pricing', label: 'See pricing' },
  },
  {
    icon: Gamepad2,
    title: 'Play and follow along',
    body: 'Your child plays along their growth path and explores Joy Collection. You follow their feelings.',
    tint: 'bg-lavender text-joy-lilac',
  },
]

export function HowSteps() {
  return (
    <section aria-labelledby="how-title" className="px-3 sm:px-4 py-8 md:py-9 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          id="how-title"
          eyebrow="Getting started"
          title="How"
          accent="Joy works"
          description="Set up takes a few minutes. After that, your child just taps play."
        />
        <ol className="mt-8 md:mt-8 lg:mt-14 grid gap-4 md:gap-5 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="group relative flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-[0_20px_50px_-30px_rgba(42,34,64,0.3)] ring-1 ring-border"
            >
              <div className="flex items-center justify-between">
                <span className={`relative inline-flex size-14 items-center md:size-12 lg:size-16 justify-center rounded-[1.35rem] ring-1 ring-white shadow-[0_10px_24px_-12px_currentColor] transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none ${step.tint}`}>
                  <step.icon className="size-7 stroke-[1.8]" aria-hidden="true" />
                  <Sparkles className="absolute -right-1.5 -top-1.5 size-5 rounded-full bg-white p-0.5 shadow-sm" aria-hidden="true" />
                </span>
                <span className="font-display text-4xl font-light text-border" aria-hidden="true">
                  0{i + 1}
                </span>
              </div>
              <h3 className="text-xl font-medium leading-snug">{step.title}</h3>
              <p className="text-[15px] leading-relaxed text-[#4f4766]">{step.body}</p>
              {step.link ? (
                <Link
                  href={step.link.href}
                  className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-joy-pink hover:underline"
                >
                  {step.link.label}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              ) : null}
            </li>
          ))}
        </ol>
        <div className="mt-8 md:mt-7 lg:mt-12 flex flex-wrap justify-center gap-3">
          <DownloadButton />
          <JoyButton href="/how-it-works" variant="ghost">
            Read the full guide
          </JoyButton>
        </div>
      </div>
    </section>
  )
}
