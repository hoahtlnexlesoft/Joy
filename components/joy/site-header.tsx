'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { BookOpen, ChevronDown, ChevronRight, Globe, Heart, LogOut, Menu, Sparkles, Ticket, X, type LucideIcon } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'
import { LoginModal } from './login-modal'
import { joyGoHome, joyLogout, useJoySession } from '@/lib/joy-session'
import { joyButtonClass } from './ui'
import { useT } from '@/lib/i18n'
import { LangSwitch } from './lang-switch'
import { CuteIcon, type CuteName } from './parent/icons'

const links = [
  { href: '/#about', label: 'About Joy' },
  { href: '/how-it-works', label: 'Parent Guide' },
  { href: '/pricing', label: 'Pricing' },
]

const mobileLinkStyle: Record<string, { Icon: LucideIcon; tile: string }> = {
  'About Joy': { Icon: Sparkles, tile: 'bg-[#ffeadf] text-[#ff765f]' },
  'Parent Guide': { Icon: BookOpen, tile: 'bg-[#efeaff] text-[#8e5cf0]' },
  Pricing: { Icon: Ticket, tile: 'bg-[#e2f6ec] text-[#23915a]' },
}

export function SiteHeader() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()
  const session = useJoySession()
  const router = useRouter()
  const logOut = () => { setOpen(false); joyLogout(); joyGoHome(router) }

  const showLogin = () => {
    setOpen(false)
    setAuthMode('login')
    setLoginOpen(true)
  }
  const showSignup = () => {
    setOpen(false)
    setAuthMode('signup')
    setLoginOpen(true)
  }

  const closeLogin = useCallback(() => setLoginOpen(false), [])

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // mobile menu: lock page scroll, close on Escape and when the page changes
  useEffect(() => {
    if (!open) return
    const root = document.documentElement
    const prev = root.style.overflowY
    root.style.overflowY = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      root.style.overflowY = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  if (pathname && /(^|\/)parent(\.html)?(\/|$)/.test(pathname)) {
    return (
      <header className="sticky top-0 z-50 border-y border-[#efe4d7] bg-[#fffaf4]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-3 sm:px-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" aria-label="Joy home" className="shrink-0">
              <Image src="/images/joy-logo.webp" alt="Joy" width={110} height={50} priority className="h-9 w-auto" />
            </Link>
            <span className="inline-flex h-8 items-center whitespace-nowrap rounded-full px-4 font-display text-sm font-semibold bg-gradient-joy text-white shadow-sm">{t('Parent Portal')}</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangSwitch />
            {session ? (
              <AccountMenu name={session.name} onLogout={logOut} portal />
            ) : (
              <button type="button" onClick={showLogin} className="rounded-full bg-white px-5 py-2 text-sm font-semibold ring-1 ring-border hover:bg-muted">{t('Log in')}</button>
            )}
          </div>
        </div>
        <LoginModal open={loginOpen} onClose={closeLogin} mode={authMode} />
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent px-4 pt-4">
      <div className={cn(
        'relative isolate z-10 mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full py-2 pl-3 pr-2 lg:gap-4 lg:pl-4 transition-all duration-300',
        hasScrolled
          ? 'shadow-[0_10px_30px_-18px_rgba(240, 72, 138, 0.4)] ring-1 ring-[#ffeadf]/80'
          : '',
      )}>
        <span
          aria-hidden="true"
          data-no-reveal
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full bg-[#fffaf4] transition-opacity duration-300',
            hasScrolled ? 'opacity-100' : 'opacity-0',
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/footer-clouds.jpg" alt="" className="size-full object-cover object-bottom" />
          <span className="absolute inset-0 bg-[#fffaf4]/25" />
        </span>
        <Link
          href="/"
          aria-label="Joy home"
          className="shrink-0"
          onClick={(e) => {
            // Already on the home page: jump to the top instead of doing nothing.
            if (pathname === '/' || pathname === '/home' || pathname === '/index') {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
        >
          <Image src="/images/joy-logo.webp" alt="Joy" width={110} height={50} priority className="h-10 w-auto" />
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {links.map((link) => {
              const active = link.href === '/#about' ? pathname === '/' : !link.href.startsWith('/#') && pathname === link.href
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => { if (!link.href.includes('#') && pathname === link.href) window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'joy-navlink whitespace-nowrap rounded-full px-2.5 py-2 font-display text-[13px] font-semibold text-[#2a2240] lg:px-4 lg:text-[15px]',
                      active && 'is-active text-[#c2307a]',
                    )}
                  >
                    {t(link.label)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch compact className="lg:hidden" />
          <LangSwitch className="hidden lg:inline-grid" />
          {session ? (
            <AccountMenu name={session.name} onLogout={logOut} portal />
          ) : (
            <>
              <button type="button" onClick={showLogin} className="inline-flex h-9 items-center whitespace-nowrap rounded-full bg-white/80 px-3.5 text-[13px] font-semibold text-[#2a2240] ring-2 ring-[#2a2240]/10 transition hover:bg-white lg:h-10 lg:px-5 lg:text-sm">
                {t('Log in')}
              </button>
              <button type="button" onClick={showSignup} className={joyButtonClass('primary', 'h-9 whitespace-nowrap px-3.5 text-[13px] lg:h-10 lg:px-5 lg:text-sm')}>
                {t('Try for free')}
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
        <LangSwitch compact />
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full bg-[#ffe7ef] text-[#c2307a] transition active:scale-95"
          aria-label={open ? t('Close menu') : t('Open menu')}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-menu" className="joy-sheet fixed inset-0 z-0 flex flex-col overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-[linear-gradient(180deg,#fff7f1_0%,#fdeef5_55%,#f3eefc_100%)] px-6 pb-28 pt-[5.5rem] md:hidden" role="dialog" aria-label={t('Menu')}>
          <nav aria-label="Main">
            <ul className="flex flex-col gap-2.5">
              {links.map((link, i) => {
                const active = link.href === '/#about' ? pathname === '/' : pathname === link.href
                const { Icon, tile } = mobileLinkStyle[link.label] ?? mobileLinkStyle['About Joy']
                return (
                  <li key={link.label} className="joy-sheet-item" style={{ animationDelay: `${60 + i * 60}ms` }}>
                    <Link
                      href={link.href}
                      onClick={() => { setOpen(false); if (!link.href.includes('#') && pathname === link.href) window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3.5 rounded-2xl p-3 pr-4 ring-1 transition active:scale-[0.99]',
                        active ? 'bg-white shadow-[0_10px_24px_-16px_rgba(240, 72, 138, 0.55)] ring-[#f6bfd5]' : 'bg-white/70 ring-white/80',
                      )}
                    >
                      <span className={cn('grid size-11 shrink-0 place-items-center rounded-xl', tile)}>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <span className={cn('flex-1 font-display text-[17px] font-medium', active ? 'text-[#c2307a]' : 'text-[#2a2240]')}>{t(link.label)}</span>
                      <ChevronRight className="size-4 shrink-0 text-[#2a2240]/35" aria-hidden="true" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="joy-sheet-item mt-auto flex flex-col gap-3 pt-8" style={{ animationDelay: `${60 + links.length * 60}ms` }}>
            {session ? (
              <>
                <Link href="/parent" onClick={() => setOpen(false)} className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-joy px-6 text-[15px] font-semibold text-white shadow-[0_12px_22px_-12px_rgba(248, 96, 143, 0.8)]">{t('Hi,')} {session.name.split(' ')[0]} · {t('Parent Portal')}</Link>
                <button type="button" onClick={logOut} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white/80 px-6 text-[15px] font-semibold text-[#2a2240] ring-1 ring-[#2a2240]/10">
                  <LogOut className="size-4" aria-hidden="true" /> {t('Log out')}
                </button>
              </>
            ) : (
              <>
                <button type="button" onClick={showSignup} className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-joy px-6 text-[15px] font-semibold text-white shadow-[0_12px_22px_-12px_rgba(248, 96, 143, 0.8)]">{t('Try for free')}</button>
                <button type="button" onClick={showLogin} className="inline-flex h-11 items-center justify-center rounded-full bg-white/80 px-6 text-[15px] font-semibold text-[#2a2240] ring-1 ring-[#2a2240]/10">{t('Log in')}</button>
              </>
            )}
            <p className="flex items-center justify-center gap-1 pt-1 text-xs text-[#6b6380]">{t('Made with')} <Heart className="size-3 fill-[#f27b85] text-[#f27b85]" aria-hidden="true" /> {t('for curious little minds')}</p>
          </div>
        </div>
      ) : null}
      <LoginModal open={loginOpen} onClose={closeLogin} mode={authMode} />
    </header>
  )
}

const accountLinks: { href: string; icon: CuteName; label: string }[] = [
  { href: '/parent#children', icon: 'children', label: 'Children' },
  { href: '/parent#plans', icon: 'plans', label: 'Plans' },
  { href: '/parent#profile-account', icon: 'account', label: 'Account details' },
  { href: '/parent#profile-payments', icon: 'payments', label: 'Payments' },
  { href: '/parent#profile-prefs', icon: 'prefs', label: 'Notifications' },
  { href: '/parent#profile-security', icon: 'security', label: 'Login & security' },
]

function AccountMenu({ name, onLogout, portal }: { name: string; onLogout: () => void; portal?: boolean }) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('joy:portal-nav', close)
    return () => window.removeEventListener('joy:portal-nav', close)
  }, [])
  useEffect(() => {
    if (!open) return
    const click = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', click)
    document.addEventListener('keydown', key)
    return () => { document.removeEventListener('mousedown', click); document.removeEventListener('keydown', key) }
  }, [open])
  const item = 'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold hover:bg-muted'
  const go = () => { setOpen(false); setTimeout(() => window.dispatchEvent(new Event('joy:portal-nav')), 0) }
  return (
    <div ref={ref} className="relative">
      {portal ? (
        <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-left shadow-[0_2px_8px_-4px_rgba(39, 37, 63, 0.2)] ring-1 ring-[#ede5f5] transition hover:shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/parent-avatar.webp" alt="" aria-hidden="true" className="size-10 rounded-full object-cover" />
          <span className="hidden min-w-0 flex-col leading-tight sm:flex"><b className="truncate font-display text-[0.8rem] font-semibold text-[#27253f]">{name}</b><small className="text-[0.68rem] text-muted-foreground">{t('Parent account')}</small></span>
          <ChevronDown className={cn('size-3 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      ) : (
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex h-10 items-center gap-2 rounded-full bg-white/80 py-1 pl-1 pr-3 text-sm font-semibold ring-1 ring-border transition hover:bg-white">
        <span className="grid size-8 place-items-center rounded-full bg-gradient-joy text-xs font-bold text-white" aria-hidden="true">{initials}</span>
        {t('Hi,')} {name.split(' ')[0]}
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      )}
      {open ? (
        <div role="menu" className="absolute right-0 top-[2.9rem] z-50 w-64 rounded-2xl bg-white p-2 shadow-[0_20px_50px_-20px_rgba(39, 37, 63, 0.45)] ring-1 ring-border">
          <div className="px-3 py-2.5"><b className="block truncate text-sm">{name}</b><small className="text-xs text-muted-foreground">{t('Parent account')}</small></div>
          <hr className="my-1 border-border/70" />
          {accountLinks.map((l) => (
            <Link key={l.href} role="menuitem" href={l.href} onClick={go} className={item}><CuteIcon name={l.icon} className="size-8" />{t(l.label)}</Link>
          ))}
          <hr className="my-1 border-border/70" />
          <Link role="menuitem" href="/" onClick={() => setOpen(false)} className={item}><Globe className="size-4" aria-hidden="true" />{t('Joy website')}</Link>
          <button role="menuitem" type="button" className={cn(item, 'text-[#e5484d]')} onClick={() => { setOpen(false); onLogout() }}><LogOut className="size-4" aria-hidden="true" />{t('Log out')}</button>
        </div>
      ) : null}
    </div>
  )
}
