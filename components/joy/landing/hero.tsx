import Image from 'next/image'
import Link from 'next/link'
import { Play, Sparkles } from '@/components/joy/cute-icons'
import { JoyButton } from '../ui'
import { VideoButton } from './video-button'
import { FeatureShowcase } from './feature-showcase'

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
            <VideoButton className="h-12 px-4 text-sm md:h-11 lg:h-14 lg:px-6 lg:text-base">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-gradient-joy text-white">
                <Play className="size-3 fill-current" aria-hidden="true" />
              </span>
              See how it works
            </VideoButton>
          </div>
          <p className="text-sm text-muted-foreground">
            Create your parent account in a few minutes. Already have one?{' '}
            <Link href="#download" className="font-semibold text-foreground underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>

        <div className="relative max-md:pt-14">
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
            className="relative mx-auto h-auto w-full max-w-[22rem] md:max-w-[19rem] lg:max-w-[28rem] drop-shadow-[0_20px_30px_rgba(244,150,120,0.18)]"
          />
          <div className="absolute left-0 top-0 flex md:origin-top-left md:scale-[0.7] lg:top-8 lg:scale-100 items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-border backdrop-blur md:px-4 md:py-3 lg:-left-10">
            <span className="text-2xl" aria-hidden="true">🦁</span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Child nature</p>
              <p className="font-display text-base font-medium">Dream Explorer</p>
            </div>
          </div>
          <div
            className="absolute bottom-6 right-0 flex md:origin-bottom-right md:scale-[0.7] lg:bottom-10 lg:scale-100 items-center gap-3 rounded-2xl bg-white/95 px-3 py-2 shadow-lg ring-1 ring-border backdrop-blur md:px-4 md:py-3 lg:-right-8"
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
