'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { DEMO_PARENT, joyLogin, joyLogout, useJoySession } from '@/lib/joy-session'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, BookOpenCheck, Crown, Heart, Pencil, Plus, Trash2 } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'
import { Btn, Card, Empty, Modal, UnlockChip } from './ui'
import { ageOf, daysLeft, endingSoon, fmtDate, firstName, initialState, isExpired, unlockOf } from './data'
import type { Child, State, Unlock } from './data'
import type { App, Dlg, Section, View } from './types'
import { AvatarDialog, ChildForm, DeleteAccount, DeleteChild, InvoiceDialog, PasswordDialog, QrDialog } from './dialogs'
import { AssignDialog, AssignToChildDialog, BuyFlow, ChildThumb, PlanCard, PlansView, RedeemDialog } from './plans'
import { ActivitiesTab, FeelingLog, JourneyCard } from './insights'
import { ProfileView, SECTIONS } from './profile'
import { CuteIcon } from './icons'
import { ElementMascot, type ElementKey } from '@/components/joy/guide/element-mascots'

const UnlockBadge = ({ u }: { u: Unlock }) => <UnlockChip type={u} className="!text-xs" />

function hashToView(h: string, s: State): View {
  const x = h.replace('#', '')
  if (x === 'plans') return { name: 'plans' }
  if (x.startsWith('child-') && s.children.some((c) => c.id === x.slice(6))) return { name: 'child', id: x.slice(6) }
  if (x.startsWith('profile')) {
    const sec = x.split('-')[1] as Section
    return { name: 'profile', sec: SECTIONS.some((i) => i.id === sec) ? sec : 'account' }
  }
  return { name: 'children' }
}
const viewToHash = (v: View) => (v.name === 'children' ? '#children' : v.name === 'child' ? `#child-${v.id}` : v.name === 'plans' ? '#plans' : `#profile-${v.sec}`)

export function ParentPortal() {
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
    const sync = () => setS0((cur) => { if (cur) setView(hashToView(location.hash, cur)); return cur })
    window.addEventListener('hashchange', sync)
    window.addEventListener('joy:portal-nav', sync)
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('joy:portal-nav', sync) }
  }, [])

  useEffect(() => {
    const init = initialState()
    setS0(init)
    setView(hashToView(location.hash, init))
  }, [])

  const toast = useCallback((m: string) => {
    setToastMsg(m)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToastMsg(''), 3400)
  }, [])
  const go = useCallback((v: View) => {
    setView(v)
    try { history.replaceState(null, '', viewToHash(v)) } catch { /* history can be blocked in sandboxed frames */ }
    window.scrollTo({ top: 0 })
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
      router.push('/')
    },
  }
  const close = () => { setDlg(null); setBuyDone(false) }
  const nav = view.name === 'child' ? 'children' : view.name
  const sec = view.name === 'profile' ? view.sec : null
  const kidOf = (id: string) => s.children.find((c) => c.id === id)

  const navBtn = (active: boolean, onClick: () => void, icon: React.ReactNode, label: string, sub?: boolean) => (
    <button type="button" onClick={onClick} aria-current={active ? 'page' : undefined} className={cn('flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition', sub && 'pl-4', active ? 'bg-[#fff0f4] text-[#dd4e82]' : 'text-[#6f6985] hover:bg-[#faf7fb] hover:text-foreground')}>
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
                {navBtn(nav === 'children', () => go({ name: 'children' }), <CuteIcon name="children" active={nav === 'children'} />, 'Children')}
                {navBtn(nav === 'plans', () => go({ name: 'plans' }), <CuteIcon name="plans" active={nav === 'plans'} />, 'Plans')}
                <p className="mt-3 px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">My Profile</p>
                {SECTIONS.map((i) => navBtn(sec === i.id, () => go({ name: 'profile', sec: i.id }), <CuteIcon name={i.id} active={sec === i.id} className="size-8" />, i.label, true))}
              </nav>
              <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#f3fbe6] via-white to-[#fffaf0] p-5 shadow-[0_0_0_1px_var(--border)]">
                <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 size-28 opacity-[0.12]" style={{ backgroundImage: 'url(/images/triskele.webp)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }} />
                <CuteIcon name="gift" className="relative size-11" />
                <b className="relative mt-3 block text-sm text-[#27253f]">Have a voucher?</b>
                <p className="relative mt-1 text-xs leading-relaxed text-muted-foreground">Redeem a code to get a Trial Gift for your children.</p>
                <Btn small variant="green" className="relative mt-3" onClick={() => setDlg({ k: 'redeem' })}>Redeem code</Btn>
              </div>
              <Link href="/how-it-works" className="flex items-center gap-2 px-2 text-sm font-semibold text-muted-foreground hover:text-joy-pink"><BookOpenCheck className="size-4" />Need help? Read the guide</Link>
            </div>
          </aside>

          <div className="min-w-0">
            {view.name === 'children' ? <Children app={app} /> : view.name === 'child' && kidOf(view.id) ? <ChildDetail app={app} child={kidOf(view.id)!} /> : view.name === 'plans' ? <PlansView app={app} /> : view.name === 'profile' ? <ProfileView app={app} sec={view.sec} /> : <Children app={app} />}
          </div>
        </div>
      </div>

      <nav aria-label="Parent menu" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-1 border-t border-border bg-white/95 p-2 backdrop-blur lg:hidden">
        {([['children', 'children', 'Children', () => go({ name: 'children' })], ['plans', 'plans', 'Plans', () => go({ name: 'plans' })], ['profile', 'profile', 'My Profile', () => go({ name: 'profile', sec: 'account' })]] as const).map(([id, ic, l, fn]) => (
          <button key={id} type="button" onClick={fn} aria-current={nav === id ? 'page' : undefined} className={cn('flex flex-col items-center gap-0.5 rounded-xl py-1.5 text-[11px] font-semibold', nav === id ? 'bg-[#fff0f4] text-[#dd4e82]' : 'text-muted-foreground')}><CuteIcon name={ic} className="size-8" active={nav === id} />{l}</button>
        ))}
      </nav>
      {view.name === 'profile' ? (
        <div className="fixed inset-x-0 bottom-[3.9rem] z-30 flex justify-center gap-1 overflow-x-auto px-2 lg:hidden">
          <div className="flex gap-1 rounded-full bg-white/95 p-1 shadow-lg ring-1 ring-border backdrop-blur">
            {SECTIONS.map((i) => <button key={i.id} type="button" onClick={() => go({ name: 'profile', sec: i.id })} aria-current={sec === i.id ? 'page' : undefined} className={cn('whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold', sec === i.id ? 'bg-[#fff0f4] text-[#dd4e82]' : 'text-muted-foreground')}>{i.label}</button>)}
          </div>
        </div>
      ) : null}

      {dlg ? (
        <Modal onClose={close} size={dlg.k === 'buy' ? (buyDone ? 'lg' : 'xl') : 'md'} title="Dialog">
          {dlg.k === 'child' ? <ChildForm app={app} child={dlg.child} />
            : dlg.k === 'delChild' ? <DeleteChild app={app} child={dlg.child} />
            : dlg.k === 'buy' ? <BuyFlow app={app} onDone={setBuyDone} pre={{ plan: dlg.plan, child: dlg.child }} />
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
  const { s } = app
  const soon = endingSoon(s)
  return (
    <div className="flex flex-col gap-6">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#fff4ee] via-[#fff7f3] to-[#fdf0f6] shadow-[0_22px_50px_-30px_rgba(236,100,150,0.55)] ring-1 ring-white/80 sm:rounded-[2.5rem]">
        {/* family illustration as the banner background */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/family-bg.jpg" alt="" className="absolute bottom-0 right-0 h-[44%] w-full object-cover object-[86%_center] sm:inset-0 sm:h-full sm:object-[88%_center]" />
        </div>
        <div className="relative max-w-[34rem] px-5 pb-64 pt-6 sm:px-9 sm:pb-9 sm:pt-8 lg:px-11">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ffe9ee] py-1.5 pl-2 pr-4 text-xs font-extrabold uppercase tracking-[0.14em] text-[#4a4270] ring-1 ring-[#ffd3df]">
              <span className="text-lg leading-none" aria-hidden="true">🏠</span>Your family space
            </span>
            <svg aria-hidden="true" viewBox="0 0 28 28" className="size-6 text-[#ffc94d]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M4 6l7 3M3 14h9M5 23l7-4" /></svg>
          </div>
          <h1 className="relative mt-5 font-display text-[1.6rem] font-bold leading-[1.02] tracking-tight text-[#2f2a5c] sm:text-4xl">
            <span aria-hidden="true" className="absolute -left-1 top-[0.7rem] -rotate-12 text-xl drop-shadow sm:-left-7 sm:top-[2.9rem] sm:text-3xl">⭐</span>
            Welcome back,
            <br />
            <span className="inline-block bg-gradient-to-b from-[#ff6b9a] to-[#ee5a8a] bg-clip-text text-transparent sm:pl-1">{firstName(s.parent.name)}!</span>
            <svg aria-hidden="true" viewBox="0 0 40 36" className="ml-2 inline-block size-7 -translate-y-1 text-[#ffbf3c]" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M20 31C9 23 5 17 5 12.5 5 8.6 8 6 11.6 6c3 0 6 1.8 8.4 5 2.4-3.2 5.4-5 8.4-5C32 6 35 8.6 35 12.5 35 17 31 23 20 31Z" /><path d="M30 2l-1.6 3.4M36 6.5l-3 1.8M37 14l-3.4-.4" /></svg>
          </h1>
          <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-[#6c6788] sm:text-base">Small steps make a big difference. Here’s a little look at how your children are growing.</p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <button type="button" onClick={() => document.getElementById('children-grid')?.scrollIntoView({ behavior: 'smooth', block: 'start' })} className="group inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f9709a] to-[#ee5a8a] px-5 text-sm font-bold text-white shadow-[0_14px_26px_-12px_rgba(238,90,138,0.85)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a8a]/60 focus-visible:ring-offset-2">
              Meet your children<ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link href="/" className="inline-flex h-10 items-center gap-2 rounded-full bg-white/70 px-5 text-sm font-bold text-[#4a4270] shadow-[0_8px_20px_-14px_rgba(125,100,200,0.6)] ring-1 ring-[#e6dcff] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
              Explore Joy<Heart className="size-4 fill-[#b9a0ff] text-[#b9a0ff]" />
            </Link>
          </div>
        </div>
      </section>

      {soon.map((p) => (
        <div key={p.id} role="status" className="flex flex-wrap items-center gap-3 rounded-2xl bg-[#fff4e5] p-4 text-sm text-[#7a5a2b]">
          <span aria-hidden="true">🔔</span>
          <div className="min-w-0 flex-1"><b>{p.name} ends in {daysLeft(p)} day{daysLeft(p) === 1 ? '' : 's'}</b> for {p.children.map((i) => s.children.find((c) => c.id === i)?.name).join(', ')}. Plans don’t renew automatically.</div>
          <Btn small variant="blue" onClick={() => app.open({ k: 'buy', plan: p.type === 'Special' ? 'Mastery' : p.name, child: p.children[0] })}>Buy a new plan</Btn>
        </div>
      ))}

      {!s.children.length ? (
        <Empty icon="🧒" title="Add your first child" action={<Btn onClick={() => app.open({ k: 'child' })}>+ Add a child</Btn>}>Tell Joy a little about your child to start their journey. You can add all your children to one parent account.</Empty>
      ) : (
        <div id="children-grid" className="grid scroll-mt-28 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {s.children.map((c) => {
            const u = unlockOf(s, c)
            return (
              <article key={c.id} className="group relative overflow-hidden rounded-[2.4rem] border shadow-[0_16px_32px_-18px_rgba(39,37,63,0.3)] transition duration-300 hover:-translate-y-1.5 hover:rotate-[0.6deg] hover:shadow-[0_24px_44px_-24px_rgba(39,37,63,0.4)]" style={{ borderColor: `${c.color}66`, background: `linear-gradient(120deg,${c.color}2e 0%,#ffffff 62%,${c.color}1f 100%)` }}>
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-60" style={{ backgroundImage: `radial-gradient(${c.color}40 1.6px, transparent 1.8px)`, backgroundSize: '18px 18px', maskImage: 'linear-gradient(120deg, transparent 35%, #000)', WebkitMaskImage: 'linear-gradient(120deg, transparent 35%, #000)' }} />
                <span aria-hidden="true" className="pointer-events-none absolute right-16 top-4 text-sm opacity-80 transition group-hover:rotate-12 group-hover:scale-125">✨</span>
                <span aria-hidden="true" className="pointer-events-none absolute left-[44%] top-6 text-xs opacity-70">💗</span>
                <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 size-32 rounded-full blur-2xl" style={{ background: `${c.color}33` }} />
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-6 h-20 w-40 rounded-full blur-2xl" style={{ background: `${c.color}38` }} />
                <button type="button" onClick={() => app.go({ name: 'child', id: c.id })} aria-label={`Open ${c.name}'s profile`} className="relative flex min-h-[10.5rem] w-full items-stretch gap-2 p-5 text-left sm:min-h-[11.5rem]">
                  <div className="z-10 flex min-w-0 flex-1 flex-col items-start justify-between gap-1.5">
                    {c.element ? <ElementMascot name={c.element as ElementKey} className="size-12" /> : <span className="text-3xl" aria-hidden="true">✨</span>}
                    <div className="flex flex-col items-start gap-1">
                      <b className="font-display text-[1.7rem] font-semibold leading-tight text-[#27253f]">{c.name}<span className="ml-1 text-lg" aria-hidden="true">🌟</span></b>
                      <span className="text-sm text-[#6d6585]">{c.arch ?? 'Getting to know them'}</span>
                    </div>
                    <span className="relative z-10 inline-flex w-fit items-center gap-1.5 whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs font-bold shadow-sm" style={{ boxShadow: `inset 0 0 0 2px ${c.color}44`, color: c.color }}>
                      <Crown className="size-3.5" aria-hidden="true" />{u === 'Free' ? 'Free plan' : `${u} unlock`}
                    </span>
                  </div>
                  <ChildThumb c={c} className="absolute -bottom-1 right-0 size-28 transition duration-300 group-hover:scale-105 sm:size-32" />
                </button>
                <div className="absolute right-3 top-5 flex gap-1.5 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                  <button type="button" onClick={() => app.open({ k: 'child', child: c })} aria-label={`Edit ${c.name}`} className="grid size-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow ring-1 ring-border hover:text-joy-pink"><Pencil className="size-3.5" /></button>
                  <button type="button" onClick={() => app.open({ k: 'delChild', child: c })} aria-label={`Delete ${c.name}`} className="grid size-8 place-items-center rounded-full bg-white/90 text-muted-foreground shadow ring-1 ring-border hover:text-[#e5484d]"><Trash2 className="size-3.5" /></button>
                </div>
              </article>
            )
          })}
          <button type="button" onClick={() => app.open({ k: 'child' })} className="group flex min-h-[10.5rem] flex-col items-center justify-center gap-2 rounded-[2.4rem] sm:min-h-[11.5rem] border-[1.5px] border-dashed border-[#f4b7cb] bg-gradient-to-br from-[#fff8fb] to-[#fff1f6] p-6 text-[#d9467a] transition hover:-translate-y-0.5 hover:bg-[#fff1f6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a8a]/60">
            <span className="grid size-14 place-items-center rounded-full bg-white shadow-[0_10px_20px_-10px_rgba(238,90,138,0.6)] ring-1 ring-[#f9d3e0]"><Plus className="size-6" /></span>
            <span className="font-display text-lg font-bold">Add a child 🧸</span>
          </button>
        </div>
      )}
    </div>
  )
}

type CTab = 'info' | 'plans' | 'feel' | 'acts'
function ChildDetail({ app, child: c }: { app: App; child: Child }) {
  const [tab, setTab] = useState<CTab>('info')
  const u = unlockOf(app.s, c)
  const known = !!c.element
  const mine = app.s.plans.filter((p) => p.children.includes(c.id))
  const act = mine.filter((p) => !isExpired(p)), exp = mine.filter(isExpired)
  const tabs: [CTab, string][] = [['info', 'Information'], ['plans', 'Child Plans'], ['feel', 'Feeling Log'], ['acts', 'Activities']]
  const Row = ({ k, v }: { k: string; v: string }) => <><dt className="text-muted-foreground">{k}</dt><dd className="font-semibold">{v}</dd></>
  return (
    <div className="flex flex-col gap-5">
      <button type="button" onClick={() => app.go({ name: 'children' })} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-joy-pink"><ArrowLeft className="size-4" />All children</button>
      <section className="flex flex-wrap items-center gap-5 rounded-[2rem] p-6 sm:p-7" style={{ background: `linear-gradient(135deg,#fff 30%,${c.color}26)`, boxShadow: `inset 0 0 0 1px ${c.color}33` }}>
        <span className="grid size-24 shrink-0 place-items-center rounded-[1.75rem] bg-white shadow-sm"><ChildThumb c={c} className="size-20" /></span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-medium">{c.name}</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">{ageOf(c.dob)} years old · {c.gender}</p>
          <div className="mt-2"><UnlockBadge u={u} /></div>
        </div>
        <div className="flex gap-2">
          <Btn small variant="blueSoft" onClick={() => app.open({ k: 'child', child: c })}>Edit</Btn>
          <Btn small variant="ghost" className="text-[#e5484d]" onClick={() => app.open({ k: 'delChild', child: c })}>Delete</Btn>
        </div>
      </section>

      <div role="tablist" aria-label="Child profile" className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-[0_0_0_1px_var(--border)]">
        {tabs.map(([id, l]) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn('h-10 shrink-0 rounded-xl px-4 text-sm font-semibold transition', tab === id ? 'bg-[#fff0f4] text-[#dd4e82]' : 'text-muted-foreground hover:bg-[#faf7fb]')}>{l}</button>)}
      </div>

      {tab === 'info' ? (
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Card title="Information" action={<button type="button" onClick={() => app.open({ k: 'child', child: c })} className="rounded-full px-3.5 py-1 text-sm font-semibold text-joy-pink ring-1 ring-border hover:bg-[#fff5f8]">Edit</button>}>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-sm">
                <Row k="Child name" v={c.name} /><Row k="Age" v={`${ageOf(c.dob)} years old`} /><Row k="Date of birth" v={fmtDate(new Date(c.dob))} /><Row k="Gender" v={c.gender} /><Row k="Unique needs" v={c.needs.length ? c.needs.join(', ') : 'None set'} />
              </dl>
              {c.needs.length ? <p className="mt-4 rounded-2xl bg-[#fff8e6] px-4 py-3 text-xs text-[#8a6d2f]">✨ Calm Senses activities are on for {c.name} with a Premium or Premium Plus plan.</p> : null}
            </Card>
            <Card title={`${c.name}’s nature`}>
              {known ? (
                <div className="grid grid-cols-2 gap-3">
                  {([['Core element', c.element!, '#FF8A2A'], ['Animal nature', c.animal!, '#E3A500'], ['Child nature', c.nature!, '#5CC62A'], ['Potential archetype', c.arch!, '#1FA9E8']] as const).map(([k, v, col], i) => (
                    <div key={k} className={cn('rounded-2xl p-3', i > 1 && 'col-span-2')} style={{ background: col + '1a' }}>
                      {i === 0 ? <ElementMascot name={c.element as ElementKey} className="mb-1 size-9" /> : i === 1 ? <ChildThumb c={c} className="mb-1 size-9" /> : null}
                      <small className="block text-xs text-muted-foreground">{k}</small><b className="font-display text-lg font-medium">{v}</b>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl bg-[#f4fbef] p-4 text-sm"><span className="text-2xl" aria-hidden="true">🌱</span><p>Joy is still getting to know {c.name}. Their core element, animal nature and child nature appear here as they play.</p></div>
              )}
            </Card>
          </div>
          <JourneyCard child={c} />
        </div>
      ) : tab === 'plans' ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="font-display text-xl font-medium">{c.name}’s plans</h2><p className="text-sm text-muted-foreground">Current unlock: <b className="text-foreground">{u}</b>{u === 'Free' ? '. Pick a plan to unlock more activities.' : ''}</p></div>
            <div className="flex flex-wrap gap-2">
              <Btn small variant="blue" onClick={() => app.open({ k: 'assignTo', child: c })}>Assign a plan you have</Btn>
              <Btn small onClick={() => app.open({ k: 'buy', child: c.id })}>Buy a plan for {c.name}</Btn>
            </div>
          </div>
          {act.length ? <><h3 className="text-sm font-semibold text-muted-foreground">Active</h3><div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">{act.map((p) => <PlanCard key={p.id} app={app} p={p} />)}</div></> : <Empty icon="🎟️" title={`${c.name} has no active plan.`} />}
          {exp.length ? <><h3 className="text-sm font-semibold text-muted-foreground">Expired</h3><div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">{exp.map((p) => <PlanCard key={p.id} app={app} p={p} />)}</div></> : null}
        </div>
      ) : tab === 'feel' ? <FeelingLog child={c} /> : <ActivitiesTab child={c} />}
    </div>
  )
}
