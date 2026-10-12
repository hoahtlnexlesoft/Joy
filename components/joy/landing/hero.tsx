import Image from 'next/image'
import Link from 'next/link'
import { Play, Sparkles } from '@/components/joy/cute-icons'
import { JoyButton } from '../ui'
import { FeatureShowcase } from './feature-showcase'

function Butterfly({ a, b, className, style, small }: { a: string; b: string; className?: string; style?: React.CSSProperties; small?: boolean }) {
  return (
    <span className={className} style={style}>
      <svg viewBox="0 0 40 32" className={small ? 'size-8' : 'size-11'}>
        <g className="joy-wing joy-wing-l"><path d="M20 16C14 2 2 2 3 12c1 8 10 8 17 4z" fill={a} /><path d="M20 17C13 24 6 30 11 28c6-1 9-5 9-11z" fill={b} /></g>
        <g className="joy-wing joy-wing-r"><path d="M20 16C26 2 38 2 37 12c-1 8-10 8-17 4z" fill={a} /><path d="M20 17C27 24 34 30 29 28c-6-1-9-5-9-11z" fill={b} /></g>
        <rect x="19" y="9" width="2" height="14" rx="1" fill="#5b3a4a" />
      </svg>
    </span>
  )
}

export function Hero() {
  return (
    <section className="relative -mt-20 overflow-hidden px-4 pb-8 pt-24 md:pb-9 lg:pb-16 md:pt-18 lg:pt-32">
      <div
        className="pointer-events-none absolute -right-32 -top-40 size-[34rem] rounded-full bg-[radial-gradient(circle,#ffd6c2_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-40 top-64 size-[28rem] rounded-full bg-[radial-gradient(circle,#e4dcff_0%,transparent_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-4 lg:gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="flex flex-col items-start gap-4 lg:gap-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-muted-foreground ring-1 ring-border">
            <Sparkles className="size-3.5 text-joy-pink" aria-hidden="true" />
            For parents of curious little ones
          </span>
          <h1 className="text-4xl font-medium leading-[1.04] tracking-tight md:text-[2rem] lg:text-6xl">
            Joyful daily play that <em className="text-gradient-joy font-medium">helps your child grow</em>
          </h1>
          <p className="max-w-xl text-pretty text-base leading-normal md:text-sm md:leading-snug lg:text-lg lg:leading-relaxed text-muted-foreground">
            {
              "Joy learns your child's nature, maps a path for them to grow, and picks fun activities for every day. You see how they feel and what they learn."
            }
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <JoyButton href="#download" className="h-12 px-6 text-sm md:h-11 md:px-5 lg:h-14 lg:px-8 lg:text-base">
              Try for free
            </JoyButton>
            <JoyButton href="/how-it-works" variant="ghost" className="h-12 px-4 text-sm md:h-11 lg:h-14 lg:px-6 lg:text-base">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-joy text-white">
                <Play className="size-3 fill-current" aria-hidden="true" />
              </span>
              See how it works
            </JoyButton>
          </div>
          <p className="text-sm text-muted-foreground">
            Create your parent account in a few minutes. Already have one?{' '}
            <Link href="#download" className="font-semibold text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>

        <div className="relative">
          <div
            className="pointer-events-none absolute inset-[-10%] rounded-full bg-[radial-gradient(closest-side,#fde3ee_0%,#fdf0f5_55%,transparent_100%)]"
            aria-hidden="true"
          />
          <Image
            src="/images/hero-kids.webp"
            alt="A happy girl and boy waving while sitting together on a fluffy peach cloud"
            width={749}
            height={594}
            priority
            className="relative mx-auto h-auto w-full max-w-[22rem] md:max-w-[19rem] lg:max-w-[28rem] animate-bounce-gentle drop-shadow-[0_20px_30px_rgba(244,150,120,0.18)]"
          />
          <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            <span className="joy-giggle absolute left-[30%] top-[6%] rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-joy-pink shadow ring-1 ring-border">Hehe!</span>
            <span className="joy-giggle absolute right-[24%] top-[10%] rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-joy-pink shadow ring-1 ring-border" style={{ animationDelay: '-1.1s' }}>Haha!</span>
            <Butterfly className="joy-fly absolute left-[4%] top-[18%]" a="#f0449a" b="#ffb3d4" />
            <Butterfly className="joy-fly absolute right-[6%] top-[42%]" a="#4aa8ff" b="#bfe0ff" style={{ animationDelay: '-4s', animationDuration: '9s' }} small />
            <Butterfly className="joy-fly absolute left-[10%] top-[62%]" a="#ff9a3c" b="#ffd8a8" style={{ animationDelay: '-2s', animationDuration: '11s' }} small />
          </div>
          <div className="animate-float absolute left-0 top-2 flex md:origin-top-left md:scale-[0.7] lg:top-8 lg:scale-100 items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-border backdrop-blur md:px-4 md:py-3 lg:-left-10">
            <span className="text-2xl" aria-hidden="true">🦁</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Child nature</p>
              <p className="font-display text-base font-medium">Dream Explorer</p>
            </div>
          </div>
          <div
            className="animate-float absolute bottom-6 right-0 flex md:origin-bottom-right md:scale-[0.7] lg:bottom-10 lg:scale-100 items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-border backdrop-blur md:px-4 md:py-3 lg:-right-8"
            style={{ animationDelay: '-3s' }}
          >
            <span className="text-2xl" aria-hidden="true">😊</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Feeling today</p>
              <p className="font-display text-base font-medium">Happy</p>
            </div>
          </div>
        </div>
      </div>

      <FeatureShowcase />
    </section>
  )
}
