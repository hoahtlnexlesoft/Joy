import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Leaf } from '@/components/joy/cute-icons'
import { LoginTrigger } from './login-modal'

const tryPoints = [
  "Daily activities picked for your child's growth path",
  '1,000+ activities to explore in Joy Collection',
  "A feeling log to follow how they're doing",
  'One parent account for all your children',
]

function StoreBadge({ store, light = false }: { store: 'apple' | 'google'; light?: boolean }) {
  return (
    <Link
      href="#download"
      className={
        light
          ? 'inline-flex h-16 w-56 items-center gap-3 rounded-full bg-white px-6 text-foreground shadow-[0_12px_30px_-18px_rgba(248,96,143,0.6)] transition-transform hover:-translate-y-0.5'
          : 'inline-flex h-14 items-center gap-3 rounded-2xl bg-foreground px-5 text-background transition-transform hover:-translate-y-0.5'
      }
    >
      {store === 'apple' ? (
        <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
          <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66ZM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
          <path d="M3.6 2.2c-.2.2-.3.6-.3 1v17.6c0 .4.1.8.3 1l9.7-9.8-9.7-9.8Zm10.7 10.8 2.6 2.6-11.3 6.4 8.7-9Zm0-2-8.7-9 11.3 6.4-2.6 2.6Zm3.6 3.6-2.9-2.6 2.9-2.6 3.3 1.9c.9.5.9 1.3 0 1.8l-3.3 1.5Z" />
        </svg>
      )}
      <span className="flex flex-col leading-tight">
        <span className="whitespace-nowrap text-[10px] uppercase tracking-wider opacity-70">
          {store === 'apple' ? 'Download on the' : 'Get it on'}
        </span>
        <span className="text-base font-semibold">{store === 'apple' ? 'App Store' : 'Google Play'}</span>
      </span>
    </Link>
  )
}

const checkColors = ['#f27b85', '#f9c95c', '#5fae6e', '#a97ff0']

function FlowerCheck({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" className="size-9 shrink-0 drop-shadow-sm" aria-hidden="true">
      <g fill={color}>
        <circle cx="20" cy="20" r="14" />
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i * Math.PI * 2) / 10
          return <circle key={i} cx={20 + Math.cos(angle) * 13} cy={20 + Math.sin(angle) * 13} r="5.5" />
        })}
      </g>
      <path d="m13.5 20.5 4.5 4.5 8.5-9" fill="none" stroke="#fff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BottomLeftDecor() {
  return (
    <svg
      className="pointer-events-none absolute -bottom-2 -left-6 hidden w-44 md:block lg:w-56"
      viewBox="0 0 320 330"
      fill="none"
      aria-hidden="true"
    >
      <g transform="translate(150 30) rotate(-12)">
        <path d="M0 34C-14 30-20 14-14 0c6 6 10 10 14 12 4-2 8-6 14-12 6 14 0 30-14 34Z" fill="#f9d77a" />
        <path d="M0 12C-6 4-4-6 2-12c6 6 6 16-2 24Z" fill="#f6c95b" />
        <path d="M-14 0c4 10 10 14 14 12M14 0c-4 10-10 14-14 12" stroke="#efb94a" strokeWidth="1.5" strokeLinecap="round" />
      </g>
      <path
        d="M0 330V175c40-12 80-50 112-82 30-30 70-28 84 6 12 30-2 58 18 84 30 36 80 60 106 147H0Z"
        fill="#fde7a8"
        opacity="0.9"
      />
      <path d="M150 165c10-18 22-30 34-36M162 196c12-18 28-32 40-36M190 215c10-10 22-18 32-20" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
      <path d="M78 262C38 214 22 140 34 86c34 30 64 104 44 176Z" fill="#9cc48a" />
      <path d="M76 250C62 200 50 150 40 102" stroke="#6f9c5e" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M84 268c4-62 40-128 92-150 4 54-32 118-92 150Z" fill="#8bb878" />
      <path d="M90 256c18-48 42-92 76-124" stroke="#628f52" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

const BLOB_RADIUS = '58% 42% 46% 54% / 44% 52% 48% 56%'

function CtaStoreButton({ store }: { store: 'apple' | 'google' }) {
  const isApple = store === 'apple'
  return (
    <Link
      href="#download"
      className={
        isApple
          ? 'group inline-flex h-16 items-center gap-3 rounded-full bg-[#1a1625] pl-7 pr-6 text-white shadow-[0_16px_30px_-14px_rgba(26,22,37,0.7)] transition-transform hover:-translate-y-0.5'
          : 'group inline-flex h-16 items-center gap-3 rounded-full bg-white pl-7 pr-6 text-foreground shadow-[0_16px_30px_-18px_rgba(42,34,64,0.35)] ring-1 ring-black/5 transition-transform hover:-translate-y-0.5'
      }
    >
      {isApple ? (
        <svg viewBox="0 0 24 24" className="size-7 fill-current" aria-hidden="true">
          <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66ZM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true">
          <path d="M3.6 2.2 13.3 12l-9.7 9.8c-.2-.2-.3-.6-.3-1V3.2c0-.4.1-.8.3-1Z" fill="#34a853" />
          <path d="m16.9 8.4-3.6 3.6-9.7-9.8c.3-.3.8-.3 1.3 0l12 6.2Z" fill="#4285f4" />
          <path d="M16.9 15.6 4.9 21.8c-.5.3-1 .3-1.3 0l9.7-9.8 3.6 3.6Z" fill="#ea4335" />
          <path d="m20.6 13-3.7 2.6-3.6-3.6 3.6-3.6 3.7 2.6c.9.6.9 1.4 0 2Z" fill="#fbbc04" />
        </svg>
      )}
      <span className="flex flex-col leading-tight">
        <span className="text-[10px] font-medium uppercase tracking-wider opacity-80">
          {isApple ? 'Download on the' : 'Get it on'}
        </span>
        <span className="font-display text-xl font-medium">{isApple ? 'App Store' : 'Google Play'}</span>
      </span>
      <ArrowRight
        className={`ml-2 size-5 transition-transform group-hover:translate-x-1 ${isApple ? '' : 'text-joy-pink'}`}
        aria-hidden="true"
      />
    </Link>
  )
}

export function TryJoyCta() {
  return (
    <section id="download" aria-labelledby="try-title" className="scroll-mt-28 px-4 pb-8 pt-10 md:pb-7 lg:pb-12 md:pt-11 lg:pt-20">
      <div className="relative mx-auto max-w-7xl">
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#fdebdc] via-[#fff4ea] to-[#fdeee4]"
          style={{ borderRadius: '6rem 9rem 7rem 10rem / 8rem 6rem 9rem 7rem' }}
          aria-hidden="true"
        />

        <svg className="pointer-events-none absolute left-6 top-28 hidden w-10 text-joy-lilac/70 md:block" viewBox="0 0 40 80" fill="none" aria-hidden="true">
          <path d="M20 4c10 8 10 18 0 22-10 4-10 14 0 18s10 14 0 18c-6 3-6 10 0 14" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
        <Heart className="pointer-events-none absolute left-4 top-1/2 hidden size-10 -rotate-12 text-[#f8607a]/80 md:block" strokeWidth={2.5} aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ borderRadius: '6rem 9rem 7rem 10rem / 8rem 6rem 9rem 7rem' }}
          aria-hidden="true"
        >
          <BottomLeftDecor />
        </div>

        <div className="relative grid items-center gap-8 px-6 py-10 md:px-8 md:py-7 lg:px-14 lg:py-12 md:grid-cols-[1fr_0.9fr]">
          <div className="relative flex flex-col gap-4">
            <div className="relative -rotate-6 self-start">
              <p className="font-hand text-3xl font-bold text-[#f8607a]">Happy Childhood</p>
              <svg className="absolute -bottom-2 left-0 w-full text-[#f8607a]" viewBox="0 0 200 14" fill="none" aria-hidden="true">
                <path d="M2 12C50 2 130 0 198 6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <Heart className="absolute -right-8 -top-2 size-6 rotate-12 fill-[#f8607a] text-[#f8607a]" aria-hidden="true" />
            </div>

            <h2
              id="try-title"
              className="flex flex-wrap items-center gap-x-3 text-3xl font-semibold leading-[1.05] tracking-tight text-[#2a2240] md:text-4xl xl:text-5xl"
            >
              <span>Try</span>
              <Image src="/images/joy-logo.webp" alt="Joy" width={200} height={92} className="h-9 w-auto md:h-11 xl:h-12" />
              <span>for free</span>
            </h2>

            <p className="max-w-md text-lg leading-relaxed text-foreground/75 md:text-xl">
              A safe and loving space where parents support their children&apos;s growth every day.
            </p>

            <ul className="flex flex-col gap-2.5">
              {tryPoints.map((point, i) => (
                <li key={point} className="flex items-center gap-4 text-base text-foreground/80 md:text-lg">
                  <FlowerCheck color={checkColors[i]} />
                  {point}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3 pt-3 [&>a]:pl-5 [&>a]:pr-4">
              <CtaStoreButton store="apple" />
              <CtaStoreButton store="google" />
            </div>

            <p className="text-base text-foreground/70">
              Already have a parent account?{' '}
              <LoginTrigger className="font-semibold text-[#2a2240] underline underline-offset-4">
                Log in
              </LoginTrigger>
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm md:max-w-[26rem]">
            <div
              className="absolute -bottom-6 -left-6 h-1/3 w-1/2 bg-[#fbc7cf]/80"
              style={{ borderRadius: '50% 50% 40% 60% / 60% 50% 50% 40%' }}
              aria-hidden="true"
            />
            <div className="relative aspect-[5/4] overflow-hidden" style={{ borderRadius: BLOB_RADIUS }}>
              <Image
                src="/images/family-festival.jpg"
                alt="A family hanging glowing lanterns and floating lotus candles together under a full moon"
                fill
                sizes="(min-width: 1024px) 448px, 100vw"
                className="object-cover object-[50%_42%]"
              />
              <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/15 to-transparent" aria-hidden="true" />
            </div>

            <p className="pointer-events-none absolute left-[10%] bottom-[15%] -rotate-6 font-hand text-4xl leading-none text-white drop-shadow-lg md:text-5xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              <span className="font-light opacity-80">Better</span>
              <br />
              <span className="font-semibold">Together</span>
            </p>

            <svg className="pointer-events-none absolute -right-4 -top-12 size-20 md:-right-8" viewBox="0 0 80 80" aria-hidden="true">
              <circle cx="40" cy="40" r="15" fill="#fcd96b" />
              {Array.from({ length: 8 }).map((_, i) => (
                <line
                  key={i}
                  x1="40"
                  y1="12"
                  x2="40"
                  y2="4"
                  stroke="#fbc23c"
                  strokeWidth="4"
                  strokeLinecap="round"
                  transform={`rotate(${i * 45} 40 40)`}
                />
              ))}
            </svg>

            <Leaf className="pointer-events-none absolute -right-6 top-[12%] size-16 rotate-12 fill-[#9cc48a] text-[#7aab6a] md:-right-10" strokeWidth={1.2} aria-hidden="true" />

            <div
              className="absolute -right-2 top-[32%] flex rotate-[-8deg] items-center gap-2 bg-[#fde79a] px-5 py-3 shadow-md md:-right-10"
              style={{ borderRadius: '55% 45% 50% 50% / 60% 55% 45% 40%' }}
            >
              <Heart className="size-7 fill-[#f8607a] text-[#f8607a]" aria-hidden="true" />
              <span className="font-hand text-2xl font-bold leading-none text-[#2a2240]">
                Growing
                <br />
                with you
              </span>
            </div>

            <div className="absolute -bottom-8 -right-2 w-32 rotate-[8deg] md:-right-6 md:w-40">
              <div className="absolute inset-0 translate-x-2 translate-y-1 rotate-6 rounded-md bg-white shadow-md" aria-hidden="true" />
              <div className="relative rounded-md bg-white p-2 pb-6 shadow-lg">
                <Image
                  src="/images/mom-child-illustration.webp"
                  alt="Illustration of a mother hugging her daughter"
                  width={200}
                  height={200}
                  className="aspect-square w-full rounded-sm object-cover"
                />
              </div>
            </div>
            <Leaf className="pointer-events-none absolute -bottom-2 -right-10 hidden size-12 -rotate-45 fill-[#9cc48a] text-[#7aab6a] md:block" strokeWidth={1.2} aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

const footerNav = [
  {
    title: 'Joy',
    links: [
      { label: 'About Joy', href: '/#about' },
      { label: 'Parent Guide', href: '/how-it-works' },
      { label: 'Pricing', href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Contact us', href: '/how-it-works#contact' },
      { label: 'Privacy policy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
  {
    title: 'Social Media',
    links: [
      { label: 'TikTok', href: '#' },
      { label: 'YouTube', href: '#' },
      { label: 'Facebook', href: '#' },
      { label: 'Instagram', href: '#' },
    ],
  },
]

export function SiteFooter({ surface = 'default' }: { surface?: 'default' | 'guide' }) {
  const isGuideSurface = surface === 'guide'

  return (
    <footer
      className={`relative overflow-hidden ${isGuideSurface ? 'bg-transparent' : 'bg-gradient-to-b from-transparent via-blush to-[#ffd6e4]'}`}
    >
      {!isGuideSurface && (
        <>
          <div
            className="pointer-events-none absolute -bottom-40 -left-32 size-[28rem] rounded-full bg-peach blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-40 -right-32 size-[28rem] rounded-full bg-lavender blur-3xl"
            aria-hidden="true"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/footer-clouds.jpg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 size-full object-cover object-bottom"
            style={{ WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 55%)', maskImage: 'linear-gradient(to bottom, transparent 0%, #000 55%)' }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-6xl px-4 pb-10 lg:px-6 pt-16 md:pt-13 lg:pt-24">
        <div className="grid gap-8 md:gap-7 md:grid-cols-[auto_1fr] md:gap-8 lg:gap-20">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center lg:gap-10">
            <Image src="/images/joy-logo.webp" alt="Joy" width={140} height={64} className="h-16 w-auto self-start sm:self-center" />
            <div className="flex flex-col gap-4">
              <StoreBadge store="apple" light />
              <StoreBadge store="google" light />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:gap-6 lg:gap-10">
            {footerNav.map((group) => (
              <nav key={group.title} aria-label={group.title} className="flex flex-col gap-5">
                <h3 className="font-display text-lg font-semibold text-joy-pink">{group.title}</h3>
                <ul className="flex flex-col gap-3.5">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="font-display text-base font-medium text-foreground/80 transition-colors hover:text-joy-pink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 text-sm font-medium text-foreground/70 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex flex-wrap items-center gap-2">
            <span>© 2026 Joy</span>
            <span aria-hidden="true">·</span>
            <Link href="#" className="transition-colors hover:text-joy-pink">
              Terms
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="#" className="transition-colors hover:text-joy-pink">
              Privacy
            </Link>
          </p>
          <p className="font-display text-foreground/60">Made with love for curious little minds</p>
        </div>
      </div>
    </footer>
  )
}
