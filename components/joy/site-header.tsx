'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronDown, Globe, LogOut, Menu, X } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'
import { JoyButton } from './ui'
import { LoginModal } from './login-modal'
import { joyLogout, useJoySession } from '@/lib/joy-session'
import { CuteIcon, type CuteName } from './parent/icons'

const links = [
  { href: '/#about', label: 'About Joy' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/parent', label: 'Parent Portal' },
  { href: '/#download', label: 'Download' },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const pathname = usePathname()
  const session = useJoySession()
  const router = useRouter()
  const logOut = () => { setOpen(false); joyLogout(); router.push('/') }

  const showLogin = () => {
    setOpen(false)
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

  if (pathname && /(^|\/)parent(\.html)?(\/|$)/.test(pathname)) {
    return (
      <header className="sticky top-0 z-50 border-y border-[#efe6d3] bg-[#fffaf0]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-3 sm:px-4 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Link href="/" aria-label="Joy home" className="shrink-0">
              <Image src="/images/joy-logo.webp" alt="Joy" width={110} height={50} priority className="h-9 w-auto" />
            </Link>
            <span className="inline-flex h-8 items-center whitespace-nowrap rounded-full px-4 font-display text-sm font-semibold bg-gradient-joy text-white shadow-sm">Parent Portal</span>
          </div>
          {session ? (
            <AccountMenu name={session.name} onLogout={logOut} portal />
          ) : (
            <button type="button" onClick={showLogin} className="rounded-full bg-white px-5 py-2 text-sm font-semibold ring-1 ring-border hover:bg-muted">Log in</button>
          )}
        </div>
        <LoginModal open={loginOpen} onClose={closeLogin} />
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-transparent px-4 pt-4">
      <div className={cn(
        'relative isolate mx-auto flex max-w-6xl items-center justify-between gap-2 rounded-full py-2 pl-3 pr-2 lg:gap-4 lg:pl-4 transition-all duration-300',
        hasScrolled
          ? 'bg-[#fff4ec] shadow-[0_8px_30px_-12px_rgba(240,68,154,0.28)] ring-1 ring-white/80'
          : 'bg-transparent'
      )}>
        <span aria-hidden="true" className={cn('pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-full transition-opacity duration-300', hasScrolled ? 'opacity-100' : 'opacity-0')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/header-bg.jpg" alt="" className="size-full object-cover object-center" />
        </span>
        <Link href="/" aria-label="Joy home" className="shrink-0">
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
                      'joy-navlink whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-medium text-muted-foreground lg:px-4 lg:text-sm',
                      active && 'is-active text-foreground',
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <AccountMenu name={session.name} onLogout={logOut} portal />
          ) : (
            <>
              <button type="button" onClick={showLogin} className="whitespace-nowrap rounded-full px-2 py-2 text-[13px] font-semibold text-foreground hover:bg-muted lg:px-4 lg:text-sm">
                Log in
              </button>
              <JoyButton href="/pricing" className="h-9 whitespace-nowrap px-3 text-[13px] lg:h-10 lg:px-5 lg:text-sm">
                Try for free
              </JoyButton>
            </>
          )}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-full text-foreground hover:bg-muted md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div
          id="mobile-menu"
          className="mx-auto mt-2 max-w-6xl rounded-3xl bg-white p-3 shadow-xl ring-1 ring-border md:hidden"
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => { setOpen(false); if (!link.href.includes('#') && pathname === link.href) window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  className="joy-navlink block rounded-2xl px-4 py-3 text-base font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {session ? (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/parent" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-joy px-4 text-sm font-semibold text-white shadow-sm">Hi, {session.name.split(' ')[0]}</Link>
              <button type="button" onClick={logOut} className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-foreground hover:bg-muted">Log out</button>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2">
              <button type="button" onClick={showLogin} className="inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold text-foreground hover:bg-muted">
                Log in
              </button>
              <Link href="/pricing" onClick={() => setOpen(false)} className="inline-flex min-h-11 items-center justify-center rounded-full bg-gradient-joy px-4 text-sm font-semibold text-white shadow-sm">Try for free</Link>
            </div>
          )}
        </div>
      ) : null}
      <LoginModal open={loginOpen} onClose={closeLogin} />
    </header>
  )
}

const accountLinks: { href: string; icon: CuteName; label: string }[] = [
  { href: '/parent#children', icon: 'children', label: 'Children List' },
  { href: '/parent#plans', icon: 'plans', label: 'Plans' },
  { href: '/parent#profile-account', icon: 'account', label: 'Account details' },
  { href: '/parent#profile-payments', icon: 'payments', label: 'Payments' },
  { href: '/parent#profile-prefs', icon: 'prefs', label: 'Preferences' },
  { href: '/parent#profile-security', icon: 'security', label: 'Login & security' },
]

function AccountMenu({ name, onLogout, portal }: { name: string; onLogout: () => void; portal?: boolean }) {
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
        <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex items-center gap-2 rounded-full bg-white py-1 pl-1 pr-3 text-left shadow-[0_2px_8px_-4px_rgba(39,37,63,0.2)] ring-1 ring-[#e8e0f0] transition hover:shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/parent-avatar.webp" alt="" aria-hidden="true" className="size-10 rounded-full object-cover" />
          <span className="hidden min-w-0 flex-col leading-tight sm:flex"><b className="truncate font-display text-[0.8rem] font-semibold text-[#27253f]">{name}</b><small className="text-[0.68rem] text-muted-foreground">Parent account</small></span>
          <ChevronDown className={cn('size-3 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
        </button>
      ) : (
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="flex h-10 items-center gap-2 rounded-full bg-white/80 py-1 pl-1 pr-3 text-sm font-semibold ring-1 ring-border transition hover:bg-white">
        <span className="grid size-8 place-items-center rounded-full bg-gradient-joy text-xs font-bold text-white" aria-hidden="true">{initials}</span>
        Hi, {name.split(' ')[0]}
        <ChevronDown className={cn('size-4 text-muted-foreground transition-transform', open && 'rotate-180')} aria-hidden="true" />
      </button>
      )}
      {open ? (
        <div role="menu" className="absolute right-0 top-[2.9rem] z-50 w-64 rounded-2xl bg-white p-2 shadow-[0_20px_50px_-20px_rgba(39,37,63,0.45)] ring-1 ring-border">
          <div className="px-3 py-2.5"><b className="block truncate text-sm">{name}</b><small className="text-xs text-muted-foreground">Parent account</small></div>
          <hr className="my-1 border-border/70" />
          {accountLinks.map((l) => (
            <Link key={l.href} role="menuitem" href={l.href} onClick={go} className={item}><CuteIcon name={l.icon} className="size-8" />{l.label}</Link>
          ))}
          <hr className="my-1 border-border/70" />
          <Link role="menuitem" href="/" onClick={() => setOpen(false)} className={item}><Globe className="size-4" aria-hidden="true" />Joy website</Link>
          <button role="menuitem" type="button" className={cn(item, 'text-[#e5484d]')} onClick={() => { setOpen(false); onLogout() }}><LogOut className="size-4" aria-hidden="true" />Log out</button>
        </div>
      ) : null}
    </div>
  )
}
