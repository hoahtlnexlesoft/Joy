'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DEMO_PARENT, joyGoHome, joyLogin, joyLogout, useJoySession } from '@/lib/joy-session'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpenCheck, Crown, Heart, Pencil, Plus, Trash2 } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { Btn, Card, Empty, Modal, Pagination, UnlockChip } from './ui'
import { ageOf, daysLeft, endingSoon, fmtDate, firstName, initialState, isExpired, unlockOf } from './data'
import type { Child, State, Unlock } from './data'
import type { App, Dlg, Section, View } from './types'
import { AvatarDialog, ChildForm, DeleteAccount, DeleteChild, InvoiceDialog, PasswordDialog, QrDialog } from './dialogs'
import { AssignDialog, AssignToChildDialog, BuyFlow, ChildThumb, PlanCard, PlansView, RedeemDialog } from './plans'
import { ActivitiesTab, FeelingLog, JourneyCard } from './insights'
import { ProfileView, SECTIONS } from './profile'
import { CuteIcon } from './icons'
import { ElementMascot, type ElementKey } from '@/components/joy/guide/element-mascots'
import { Emo, EmoText } from '@/components/joy/emo'

const UNLOCK_STYLE: Record<Unlock, string> = {
  Free: 'bg-[#f6f1fb] text-[#6b6380]',
  Premium: 'bg-[#e3f1ff] text-[#0a86e8]',
  Special: 'bg-[#efeaff] text-[#8a45d6]',
  'Premium Plus': 'bg-[#fff3d6] text-[#9a6a00]',
}
const UnlockBadge = ({ u }: { u: Unlock }) => <UnlockChip type={u} className="!text-xs" />

function hashToView(h: string, s: State): View {
  const x = h.replace('#', '')
  if (x === 'plans' || x.startsWith('buy')) return { name: 'plans' }
  if (x.startsWith('child-') && s.children.some((c) => c.id === x.slice(6))) return { name: 'child', id: x.slice(6) }
  if (x.startsWith('profile')) {
    const sec = x.split('-')[1] as Section
    return { name: 'profile', sec: SECTIONS.some((i) => i.id === sec) ? sec : 'account' }
  }
  return { name: 'children' }
}
const viewToHash = (v: View) => (v.name === 'children' ? '#children' : v.name === 'child' ? `#child-${v.id}` : v.name === 'plans' ? '#plans' : `#profile-${v.sec}`)

export function ParentPortal() {
  const t = useT()
  const [s, setS0] = useState<State | null>(null)
  const [view, setView] = useState<View>({ name: 'children' })
  const [dlg, setDlg] = useState<Dlg | null>(null)
  const [buyDone, setBuyDone] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const seq = useRef(10)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const router = useRouter()
  const session = useJoySession()
  const leaving = useRef(false)

  // The portal is for signed-in parents: in this demo, opening it signs in as the sample parent.
  const signedInOnce = useRef(false)
  useEffect(() => {
    if (session === undefined || signedInOnce.current) return
    signedInOnce.current = true // only on arrival, so a later log out (from the header or here) sticks
    if (session === null && !leaving.current) joyLogin(DEMO_PARENT)
  }, [session])

  useEffect(() => {
    // The header's account menu links here (e.g. /parent#plans); follow the hash when it changes.
    const sync = () => setS0((cur) => {
      if (!cur) return cur
      let n = cur
      if (process.env.NEXT_PUBLIC_JOY_REVIEW === '1' && location.hash.startsWith('#profile-payments')) {
        // Review aid: switch between the full list (with pagination) and the empty state.
        const empty = /-empty$/.test(location.hash)
        if (empty && cur.payments.length) n = { ...cur, payments: [] }
        else if (!empty && !cur.payments.length) n = { ...cur, payments: initialState().payments }
      }
      setView(hashToView(location.hash, n))
      return n
    })
    window.addEventListener('hashchange', sync)
    window.addEventListener('joy:portal-nav', sync)
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('joy:portal-nav', sync) }
  }, [])

  useEffect(() => {
    let init = initialState()
    // Review aid: open /parent#profile-payments-empty or #children-empty to see the empty states.
    if (process.env.NEXT_PUBLIC_JOY_REVIEW === '1' && /-empty$/.test(location.hash)) init = { ...init, payments: [], ...(location.hash.startsWith('#children') ? { children: [], plans: [] } : {}) }
    setS0(init)
    setView(hashToView(location.hash, init))
    // Arrived from a public "Choose plan" button (/parent#buy-Adventure): open the Choose a plan dialog.
    const buy = location.hash.match(/^#buy(?:-(.+))?$/)
    if (buy) {
      let plan: string | undefined
      try { plan = buy[1] ? decodeURIComponent(buy[1]) : undefined } catch { /* ignore */ }
      setDlg({ k: 'buy', plan })
      try { history.replaceState(null, '', '#plans') } catch { /* preview frames can block this */ }
    }
  }, [])

  const toast = useCallback((m: string) => {
    setToastMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(''), 3400)
  }, [])
  const go = useCallback((v: View) => {
    setView(v)
    try { history.replaceState(null, '', viewToHash(v)) } catch { /* preview frames can block this */ }
    window.scrollTo({ top: 0 })
  }, [])

  const sRef = useRef<State | null>(null)
  sRef.current = s
  // let the review layer know which popup is open (so a comment left inside it can reopen it later)
  useEffect(() => {
    const w = window as any
    if (!dlg) { w.__joyView = null; return }
    if (dlg.k === 'buy') return // BuyFlow publishes its own step
    const v: any = { k: dlg.k }
    if (dlg.k === 'child' && dlg.child) v.cid = dlg.child.id
    if (dlg.k === 'delChild' || dlg.k === 'assignTo') v.cid = dlg.child.id
    if (dlg.k === 'assign') v.pid = dlg.plan.id
    if (dlg.k === 'invoice') v.pref = dlg.pay.ref
    w.__joyView = v
  }, [dlg])
  useEffect(() => {
    const on = (e: Event) => {
      const d: any = (e as CustomEvent).detail
      const cur = sRef.current
      if (!d || !cur) return
      const kids: any[] = (cur as any).children ?? []
      const child = (id?: string) => kids.find((c) => c.id === id)
      if (d.k === 'buy') setDlg({ k: 'buy', plan: d.plan, child: d.child, restore: { ...d.restore, nonce: Date.now() } })
      else if (d.k === 'child') setDlg({ k: 'child', child: child(d.cid) })
      else if ((d.k === 'delChild' || d.k === 'assignTo') && child(d.cid)) setDlg({ k: d.k, child: child(d.cid) } as Dlg)
      else if (['redeem', 'qr', 'pw', 'delAcc', 'avatar'].includes(d.k)) setDlg({ k: d.k } as Dlg)
      else {
        const plans: any[] = (cur as any).plans ?? []
        const pays: any[] = (cur as any).payments ?? []
        if (d.k === 'assign') { const pl = plans.find((x) => x.id === d.pid); if (pl) setDlg({ k: 'assign', plan: pl }) }
        if (d.k === 'invoice') { const py = pays.find((x) => x.ref === d.pref); if (py) setDlg({ k: 'invoice', pay: py }) }
      }
    }
    window.addEventListener('joy:restore-view', on)
    return () => window.removeEventListener('joy:restore-view', on)
  }, [])

  if (!s) return <main className="min-h-[60vh]" aria-busy="true" />

  const app: App = {
    s,
    setS: (fn) => setS0((cur) => (cur ? fn(cur) : cur)),
    toast,
    open: setDlg,
    go,
    newId: (p) => p + ++seq.current,
    logout: () => {
      leaving.current = true
      joyLogout()
      joyGoHome(router)
    },
  }
  const close = () => { setDlg(null); setBuyDone(false) }
  const nav = view.name === 'child' ? 'children' : view.name
  const sec = view.name === 'profile' ? view.sec : null
  const kidOf = (id: string) => s.children.find((c) => c.id === id)

  const navBtn = (active: boolean, onClick: () => void, icon: React.ReactNode, label: string, sub?: boolean) => (
    <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined} className={cn('flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition', sub && 'pl-4', active ? 'bg-[#ffe7ef] text-[#f0488a]' : 'text-[#6b6380] hover:bg-[#ffffff] hover:text-foreground')}>
      {icon}<span>{label}</span>
    </button>
  )

  return (
    <main className="relative min-h-[calc(100vh-5rem)] overflow-clip px-4 pb-28 pt-6 lg:px-6 lg:pb-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.07]"
        style={{ backgroundImage: 'url(/images/triskele.webp)', backgroundSize: '120px 120px', backgroundRepeat: 'repeat' }}
      />
      <div className="relative z-10 mx-auto max-w-6xl">

        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-10">
          <aside className="hidden self-start lg:sticky lg:top-20 lg:block">
            <div className="flex flex-col gap-4">
              <nav aria-label="Parent menu" className="flex flex-col gap-1 rounded-[1.75rem] bg-white p-3 shadow-[0_0_0_1px_var(--border)]">
                {navBtn(nav === 'children', () => go({ name: 'children' }), <CuteIcon name="children" active={nav === 'children'} />, t('Children'))}
                {navBtn(nav === 'plans', () => go({ name: 'plans' }), <CuteIcon name="plans" active={nav === 'plans'} />, t('Plans'))}
                <p className="mt-3 px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{t('My Profile')}</p>
                {SECTIONS.map((i) => navBtn(sec === i.id, () => go({ name: 'profile', sec: i.id }), <CuteIcon name={i.id} active={sec === i.id} className="size-8" />, t(i.label), true))}
              </nav>
              <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#e2f6ec] via-white to-[#fffaf4] p-5 shadow-[0_0_0_1px_var(--border)]">
                <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 opacity-[0.12]" style={{ backgroundImage: 'url(/images/triskele.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                <CuteIcon name="gift" className="relative size-11" />
                <b className="relative mt-3 block text-sm text-[#27253f]">{t('Have a voucher?')}</b>
                <p className="relative mt-1 text-xs leading-relaxed text-muted-foreground">{t('Redeem a code to get a Trial Gift for your children.')}</p>
                <Btn small variant="green" className="relative mt-3" onClick={() => setDlg({ k: 'redeem' })}>{t('Redeem code')}</Btn>
              </div>
              <Link href="/how-it-works" className="flex items-center gap-2 px-2 text-sm font-semibold text-muted-foreground hover:text-joy-pink"><BookOpenCheck className="size-4" />{t('Need help? Read the guide')}</Link>
            </div>
          </aside>

          <div className="min-w-0">
            {view.name === 'children' ? <Children app={app} /> : view.name === 'child' && kidOf(view.id) ? <ChildDetail app={app} child={kidOf(view.id)!} /> : view.name === 'plans' ? <PlansView app={app} /> : view.name === 'profile' ? <ProfileView app={app} sec={view.sec} /> : <Children app={app} />}
          </div>
        </div>
      </div>

      <nav aria-label="Parent menu" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-1 border-t border-border bg-white/95 p-2 backdrop-blur lg:hidden">
        {([['children', 'children', 'Children', () => go({ name: 'children' })], ['plans', 'plans', 'Plans', () => go({ name: 'plans' })], ['profile', 'profile', 'My Profile', () => go({ name: 'profile', sec: 'account' })]] as const).map(([id, ic, l, fn]) => (
          <button key={id} type="button" onClick={fn} aria-current={nav === id ? 'page' : undefined} className={cn('flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold', nav === id ? 'bg-[#ffe7ef] text-[#f0488a]' : 'text-muted-foreground')}><CuteIcon name={ic} className="size-8" active={nav === id} />{t(l)}</button>
        ))}
      </nav>
      {view.name === 'profile' ? (
        <div className="fixed inset-x-0 bottom-[3.9rem] z-30 flex justify-center gap-1 overflow-x-auto px-2 lg:hidden">
          <div className="flex gap-1 rounded-full bg-white/95 p-1 shadow-lg ring-1 ring-border backdrop-blur">
            {SECTIONS.map((i) => <button key={i.id} type="button" onClick={() => go({ name: 'profile', sec: i.id })} aria-current={sec === i.id ? 'page' : undefined} className={cn('whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold', sec === i.id ? 'bg-[#ffe7ef] text-[#f0488a]' : 'text-muted-foreground')}>{t(i.label)}</button>)}
          </div>
        </div>
      ) : null}

      {dlg ? (
        <Modal onClose={close} size={dlg.k === 'buy' ? (buyDone ? 'lg' : 'xl') : 'md'} title="Dialog">
          {dlg.k === 'child' ? <ChildForm app={app} child={dlg.child} />
            : dlg.k === 'delChild' ? <DeleteChild app={app} child={dlg.child} />
            : dlg.k === 'buy' ? <BuyFlow key={dlg.restore?.nonce ?? 'b'} app={app} onDone={setBuyDone} pre={{ plan: dlg.plan, child: dlg.child, restore: dlg.restore }} />
            : dlg.k === 'assign' ? <AssignDialog app={app} plan={dlg.plan} />
            : dlg.k === 'assignTo' ? <AssignToChildDialog app={app} child={dlg.child} />
            : dlg.k === 'redeem' ? <RedeemDialog app={app} />
            : dlg.k === 'qr' ? <QrDialog app={app} />
            : dlg.k === 'invoice' ? <InvoiceDialog app={app} pay={dlg.pay} />
            : dlg.k === 'pw' ? <PasswordDialog app={app} />
            : dlg.k === 'avatar' ? <AvatarDialog app={app} />
            : <DeleteAccount app={app} />}
        </Modal>
      ) : null}

      <div role="status" aria-live="polite" className={cn('pointer-events-none fixed bottom-24 left-1/2 z-[120] max-w-[90vw] -translate-x-1/2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-xl transition-all lg:bottom-8', toastMsg ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0')}>{toastMsg}</div>
    </main>
  )
}

function Children({ app }: { app: App }) {
  const t = useT()
  const { s } = app
  const soon = endingSoon(s)
  const KID_PER = 4
  const [kidPg, setKidPg] = useState(1)
  const kidPages = Math.max(1, Math.ceil(s.children.length / KID_PER))
  const kidPage = Math.min(kidPg, kidPages)
  const kidsShown = s.children.slice((kidPage - 1) * KID_PER, kidPage * KID_PER)
  return (
    <div className="flex flex-col gap-6">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#fffaf4] via-[#fffaf4] to-[#f6f1fb] shadow-[0_22px_50px_-30px_rgba(248, 96, 143, 0.55)] ring-1 ring-white/80 sm:rounded-[2.5rem]">
        {/* family illustration as the banner background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/family-bg.jpg" alt="" className="absolute bottom-0 right-0 h-[44%] w-full object-cover object-[86%_center] sm:inset-0 sm:h-full sm:object-[88%_center]" />
        </div>
        <div className="relative max-w-[34rem] px-5 pb-64 pt-6 sm:px-9 sm:pb-9 sm:pt-8 lg:px-11">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffe7ef] py-1.5 pl-2 pr-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4a3a63] ring-1 ring-[#ffd0e2]">
              <span className="text-lg leading-none" aria-hidden="true"><Emo e="🏠" className="size-[1.1em]" /></span>{t('Your family space')}
            </span>
            <svg aria-hidden="true" viewBox="0 0 28 28" className="size-6 text-[#fbc23c]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M4 6l7 3M3 14h9M5 23l7-4" /></svg>
          </div>
          <h1 className="relative mt-5 font-display text-[1.6rem] font-bold leading-[1.02] tracking-tight text-[#30235f] sm:text-4xl">
            <span aria-hidden="true" className="absolute -left-1 top-[0.7rem] -rotate-12 text-xl drop-shadow sm:-left-7 sm:top-[2.9rem] sm:text-3xl"><Emo e="⭐" /></span>
            {t('Welcome back,')}
            <br />
            <span className="inline-block bg-gradient-to-b from-[#f8608f] to-[#f8608f] bg-clip-text text-transparent sm:pl-1">{firstName(s.parent.name)}!</span>
            <svg aria-hidden="true" viewBox="0 0 40 36" className="ml-2 inline-block size-7 -translate-y-1 text-[#fbc23c]" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 31C9 23 5 17 5 12.5 5 8.6 8 6 11.6 6c3 0 6 1.8 8.4 5 2.4-3.2 5.4-5 8.4-5C32 6 35 8.6 35 12.5 35 17 31 23 20 31Z" /><path d="M30 2l-1.6 3.4M36 6.5l-3 1.8M37 14l-3.4-.4" /></svg>
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[#6b6380] sm:text-base">{t('Small steps make a big difference. Here’s a little look at how your children are growing.')}</p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button type="button" onClick={() => document.getElementById('children-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f8608f] to-[#f8608f] px-5 text-sm font-bold text-white shadow-[0_14px_26px_-12px_rgba(248, 96, 143, 0.85)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]/60 focus-visible:ring-offset-2">
              {t('Meet your children')}<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full bg-white/70 px-5 text-sm font-bold text-[#4a3a63] shadow-[0_8px_20px_-14px_rgba(120, 90, 200, 0.6)] ring-1 ring-[#e6d6ff] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
              {t('Explore Joy')}<Heart className="size-4 fill-[#b9a0ff] text-[#b9a0ff]" />
            </Link>
          </div>
        </div>
      </section>

      {soon.map((p) => (
        <div key={p.id} role="status" className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#f7f0e7] p-4 text-sm text-[#7a5a2b]">
          <span aria-hidden="true"><Emo e="🔔" /></span>
          <div className="min-w-0 flex-1"><b>{p.name} {t('ends in')} {daysLeft(p)} {t(daysLeft(p) === 1 ? 'day' : 'days')}</b> {t('for')} {p.children.map((i) => s.children.find((c) => c.id === i)?.name).join(', ')}. {t('Plans don’t renew automatically.')}</div>
          <Btn small variant="blue" onClick={() => app.open({ k: 'buy', plan: p.type === 'Special' ? 'Mastery' : p.name, child: p.children[0] })}>{t('Buy a new plan')}</Btn>
        </div>
      ))}

      {!s.children.length ? (
        <Empty cute="children" title={t('Add your first child')} action={<Btn onClick={() => app.open({ k: 'child' })}>{t('+ Add a child')}</Btn>}>{t('Tell Joy a little about your child to start their journey. You can add all your children to one parent account.')}</Empty>
      ) : (
        <>
        <div className="-mb-2 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-[#27253f]">{t('Your children')} <span className="text-base font-medium text-[#6b6380]">({s.children.length})</span></h2>
          <Btn small onClick={() => app.open({ k: 'child' })}><Plus className="size-4" aria-hidden="true" /> {t('Add a child')}</Btn>
        </div>
        <div id="children-grid" className="grid scroll-mt-28 gap-4 sm:grid-cols-2">
          {kidsShown.map((c) => {
            const u = unlockOf(s, c)
            return (
              <article key={c.id} className="group relative overflow-hidden rounded-[2.4rem] border shadow-[0_16px_32px_-18px_rgba(39, 37, 63, 0.3)] transition duration-300 hover:-translate-y-1.5 hover:rotate-[0.6deg] hover:shadow-[0_24px_44px_-24px_rgba(39, 37, 63, 0.4)]" style={{ borderColor: `${c.color}66`, background: `linear-gradient(120deg,${c.color}2e 0%,#ffffff 62%,${c.color}1f 100%)` }}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: `radial-gradient(${c.color}40 1.6px, transparent 1.8px)`, backgroundSize: '18px 18px', maskImage: 'linear-gradient(120deg, transparent 35%, #000)', WebkitMaskImage: 'linear-gradient(120deg, transparent 35%, #000)' }} />
                <span aria-hidden="true" className="pointer-events-none absolute right-16 top-4 text-sm opacity-80 transition group-hover:rotate-12 group-hover:scale-125"><Emo e="✨" /></span>
                <span aria-hidden="true" className="pointer-events-none absolute left-[44%] top-6 text-xs opacity-70"><Emo e="💗" /></span>
                <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full blur-2xl" style={{ background: `${c.color}33` }} />
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-6 h-20 w-40 rounded-full blur-2xl" style={{ background: `${c.color}38` }} />
                <button type="button" onClick={() => app.go({ name: 'child', id: c.id })} aria-label={`${t('Open')} ${c.name}`} className="relative flex min-h-[10.5rem] w-full items-stretch gap-2 p-5 text-left sm:min-h-[11.5rem]">
                  <div className="z-10 flex min-w-0 flex-1 flex-col items-start justify-between gap-1.5">
                    {c.element ? <ElementMascot name={c.element as ElementKey} className="size-12" /> : <span className="text-3xl" aria-hidden="true"><Emo e="✨" /></span>}
                    <div className="flex flex-col items-start gap-1">
                      <b className="font-display text-[1.7rem] font-semibold leading-tight text-[#27253f]">{c.name}<span className="ml-1 text-lg" aria-hidden="true"><Emo e="🌟" /></span></b>
                      <span className="text-sm text-[#6b6380]">{c.arch ?? t('Getting to know them')}</span>
                    </div>
                    <span className="relative z-10 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs font-bold shadow-sm" style={{ boxShadow: `inset 0 0 0 2px ${c.color}44`, color: c.color }}>
                      <Crown className="size-3.5" aria-hidden="true" />{u === 'Free' ? t('Free plan') : `${u} ${t('unlock')}`}
                    </span>
                  </div>
                  <ChildThumb c={c} className="absolute -bottom-1 right-0 size-28 transition duration-300 group-hover:scale-105 sm:size-32" />
                </button>
                <div className="absolute right-3 top-5 flex gap-1.5 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <button type="button" onClick={() => app.open({ k: 'child', child: c })} aria-label={`${t('Edit')} ${c.name}`} className="grid size-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow ring-1 ring-border hover:text-joy-pink"><Pencil className="size-3.5" /></button>
                  <button type="button" onClick={() => app.open({ k: 'delChild', child: c })} aria-label={`${t('Delete')} ${c.name}`} className="grid size-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow ring-1 ring-border hover:text-[#e5484d]"><Trash2 className="size-3.5" /></button>
                </div>
              </article>
            )
          })}
        </div>
        </>
      )}
      <Pagination page={kidPage} pages={kidPages} onChange={(n) => { setKidPg(n); document.getElementById('children-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }} label={t('Children pages')} />
    </div>
  )
}

type CTab = 'info' | 'plans' | 'feel' | 'acts'
function ChildDetail({ app, child: c }: { app: App; child: Child }) {
  const t = useT()
  const [tab, setTab] = useState<CTab>('info')
  const u = unlockOf(app.s, c)
  const known = !!c.element
  const mine = app.s.plans.filter((p) => p.children.includes(c.id))
  const act = mine.filter((p) => !isExpired(p)), exp = mine.filter(isExpired)
  const tabs: [CTab, string][] = [['info', t('Information')], ['plans', t('Child Plans')], ['feel', t('Feeling Log')], ['acts', t('Activities')]]
  const Row = ({ k, v }: { k: string; v: string }) => <><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></>
  return (
    <div className="flex flex-col gap-5">
      <button type="button" onClick={() => app.go({ name: 'children' })} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-joy-pink"><ArrowLeft className="size-4" />{t('All children')}</button>
      <section className="flex flex-wrap items-center gap-5 rounded-[2rem] p-6 sm:p-7" style={{ background: `linear-gradient(135deg,#fff 30%,${c.color}26)`, boxShadow: `inset 0 0 0 1px ${c.color}33` }}>
        <span className="grid size-24 shrink-0 place-items-center rounded-[1.75rem] bg-white shadow-sm"><ChildThumb c={c} className="size-20" /></span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium">{c.name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{ageOf(c.dob)} {t('years old')} · {t(c.gender)}</p>
          <div className="mt-2"><UnlockBadge u={u} /></div>
        </div>
        <div className="flex gap-2">
          <Btn small variant="blueSoft" onClick={() => app.open({ k: 'child', child: c })}>{t('Edit')}</Btn>
          <Btn small variant="ghost" className="text-[#e5484d]" onClick={() => app.open({ k: 'delChild', child: c })}>{t('Delete')}</Btn>
        </div>
      </section>

      <div role="tablist" aria-label="Child profile" className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_var(--border)]">
        {tabs.map(([id, l]) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('h-10 shrink-0 rounded-xl px-4 text-sm font-semibold transition', tab === id ? 'bg-[#ffe7ef] text-[#f0488a]' : 'text-muted-foreground hover:bg-[#ffffff]')}>{l}</button>)}
      </div>

      {tab === 'info' ? (
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Card title={t('Information')} action={<button type="button" onClick={() => app.open({ k: 'child', child: c })} className="rounded-full px-3.5 py-1 text-sm font-semibold text-joy-pink ring-1 ring-border hover:bg-[#f6f1fb]">{t('Edit')}</button>}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
                <Row k={t('Child name')} v={c.name} /><Row k={t('Age')} v={`${ageOf(c.dob)} ${t('years old')}`} /><Row k={t('Date of birth')} v={fmtDate(new Date(c.dob))} /><Row k={t('Gender')} v={t(c.gender)} /><Row k={t('Unique needs')} v={c.needs.length ? c.needs.map((n) => t(n)).join(', ') : t('None set')} />
              </dl>
              {c.needs.length ? <p className="mt-4 rounded-2xl bg-[#fff3d6] px-4 py-3 text-xs text-[#8a6d2f]"><Emo e="✨" /> {t('Calm Senses activities are on for')} {c.name} {t('with a Premium or Premium Plus plan.')}</p> : null}
            </Card>
            <Card title={`${c.name}${t('’s nature')}`}>
              {known ? (
                <div className="grid grid-cols-2 gap-3">
                  {([['Core element', c.element!, '#ff9e50'], ['Animal nature', c.animal!, '#f5b73b'], ['Child nature', c.nature!, '#58b800'], ['Potential archetype', c.arch!, '#1fa9e8']] as const).map(([k, v, col], i) => (
                    <div key={k} className={cn('rounded-2xl p-3', i > 1 && 'col-span-2')} style={{ background: col + '1a' }}>
                      {i === 0 ? <ElementMascot name={c.element as ElementKey} className="mb-1 size-9" /> : i === 1 ? <ChildThumb c={c} className="mb-1 size-9" /> : null}
                      <small className="block text-xs text-muted-foreground">{t(k)}</small><b className="font-display text-lg font-medium">{v}</b>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl bg-[#e2f6ec] p-4 text-sm"><span className="text-2xl" aria-hidden="true"><Emo e="🌱" /></span><p>{t('Joy is still getting to know')} {c.name}. {t('Their core element, animal nature and child nature appear here as they play.')}</p></div>
              )}
            </Card>
          </div>
          <JourneyCard child={c} />
        </div>
      ) : tab === 'plans' ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="font-display text-xl font-medium">{c.name}{t('’s plans')}</h2><p className="text-sm text-muted-foreground">{t('Current unlock:')} <b className="text-foreground">{u}</b>{u === 'Free' ? '. ' + t('Pick a plan to unlock more activities.') : ''}</p></div>
            <div className="flex flex-wrap gap-2">
              <Btn small variant="blue" onClick={() => app.open({ k: 'assignTo', child: c })}>{t('Assign a plan you have')}</Btn>
              <Btn small onClick={() => app.open({ k: 'buy', child: c.id })}>{t('Buy a plan for')} {c.name}</Btn>
            </div>
          </div>
          {act.length ? <><h3 className="text-sm font-semibold text-muted-foreground">{t('Active')}</h3><div className="grid items-stretch gap-4 sm:grid-cols-2">{act.map((p) => <PlanCard key={p.id} app={app} p={p} />)}</div></> : <Empty cute="plans" title={`${c.name} ${t('has no active plan.')}`} />}
          {exp.length ? <><h3 className="text-sm font-semibold text-muted-foreground">{t('Expired')}</h3><div className="grid items-stretch gap-4 sm:grid-cols-2">{exp.map((p) => <PlanCard key={p.id} app={app} p={p} />)}</div></> : null}
        </div>
      ) : tab === 'feel' ? <FeelingLog child={c} /> : <ActivitiesTab child={c} />}
    </div>
  )
}
