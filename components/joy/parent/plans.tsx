'use client'

import { Fragment, useEffect, useState } from 'react'
import { CalendarHeart, Check, ChevronRight, Gift, Plus, Timer, Zap } from '@/components/joy/cute-icons'
import { Btn, Card, DlgHead, Empty, Field, Note, Seg, UnlockChip, inputCls } from './ui'
import { BENEFITS, CATALOG, VOUCHERS, addDays, daysLeft, fmt, fmtDate, isExpired, isUpcoming, money, unlockOf } from './data'
import type { Channel, Child, Plan, PlanType } from './data'
import type { App } from './types'
import { ChildForm, QrCanvas } from './dialogs'
import { cn } from '@/lib/utils'
import { ANIMAL_IMG } from './data'

const TYPE_STYLE: Record<PlanType, { chip: string; bar: string; tint: string; emoji: string }> = {
  Premium: { chip: 'bg-[#e6f4ff] text-[#1b7fc4]', bar: '#1FA9E8', tint: '#eaf6ff', emoji: '🎈' },
  Special: { chip: 'bg-[#f1eaff] text-[#7a45d8]', bar: '#8E5CF0', tint: '#f4edff', emoji: '🔮' },
  'Premium Plus': { chip: 'bg-[#fff1cf] text-[#a56a00]', bar: '#F2A900', tint: '#fff6de', emoji: '👑' },
}

export function ChildThumb({ c, className }: { c: Child; className?: string }) {
  const f = c.animal ? ANIMAL_IMG[c.animal] : null
  return f ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/images/animals/${f}.webp`} alt="" className={cn('object-contain', className)} />
  ) : (
    <span className={cn('grid place-items-center text-2xl', className)} aria-hidden="true">🌱</span>
  )
}

export function KidChip({ c }: { c: Child }) {
  return <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold text-white" style={{ background: c.color }}>{c.name}</span>
}

export function PlanCard({ app, p }: { app: App; p: Plan }) {
  const { s } = app
  const exp = isExpired(p), up = isUpcoming(p), dl = daysLeft(p), soon = !exp && !up && dl <= 3
  const kids = p.children.map((id) => s.children.find((c) => c.id === id)).filter(Boolean) as Child[]
  const multi = p.type === 'Premium Plus'
  const canAssign = !exp && (multi ? kids.length < s.children.length : kids.length === 0) && s.children.length > 0
  const t = TYPE_STYLE[p.type]
  const st = exp ? ['Expired', 'bg-[#eeebf3] text-[#7d7691]'] : up ? [`Starts ${fmtDate(p.start)}`, 'bg-[#e6f4ff] text-[#1b7fc4]'] : soon ? ['Ends soon', 'bg-[#fff0e0] text-[#c4650b]'] : ['Active', 'bg-[#e4f7e6] text-[#2f8f3a]']
  const total = Math.max(1, p.end.getTime() - p.start.getTime())
  const left = exp ? 0 : up ? 1 : Math.min(1, Math.max(0, (p.end.getTime() - Date.now()) / total))
  const pct = Math.round(left * 100)
  return (
    <article className={cn('relative flex h-full flex-col rounded-[2rem] bg-white p-3 ring-1 ring-border shadow-[0_20px_50px_-30px_rgba(42,34,64,0.3)]', exp && 'opacity-80 saturate-[0.7]')}>
      <div className="flex flex-1 flex-col gap-4 p-2 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <UnlockChip type={p.type} label={<>{p.type}{multi ? ' · Premium & Special' : ''}</>} />
          <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold', st[1])}><i className="size-1.5 rounded-full bg-current" aria-hidden="true" />{st[0]}</span>
          {p.voucher ? <span className="rounded-full bg-[#ffe9f1] px-3 py-1 text-[11px] font-semibold text-[#c93a73]">🎁 Voucher</span> : null}
        </div>
        <div>
          <h3 className="text-2xl font-medium text-[#2f2a5c]"><span aria-hidden="true" className="mr-1.5">{t.emoji}</span>{p.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{p.label} · {fmt(p.start)} – {fmt(p.end)}</p>
        </div>
        <div>
          {p.price ? <p className="font-display text-4xl font-medium tracking-tight text-[#2f2a5c]"><span className="align-top text-xl">$</span>{p.price.toFixed(2)}</p> : <p className="font-display text-4xl font-medium tracking-tight text-[#2f8f3a]">Free</p>}
          <p className="text-sm text-muted-foreground">{p.price ? 'USD' : 'Trial gift'}</p>
        </div>

        <div className="rounded-2xl bg-muted/70 px-4 py-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{exp ? 'Plan ended' : up ? 'Not started yet' : 'Time left'}</span>
            <span style={{ color: t.bar }}>{exp ? '0 days' : `${dl} day${dl === 1 ? '' : 's'}`}</span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-white" role="progressbar" aria-label="Time left" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(left * 100, exp ? 0 : 8)}%`, background: t.bar }} />
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-2">
          {kids.length ? (
            <>
              <span className="flex -space-x-2">
                {kids.slice(0, 4).map((k) => (
                  <span key={k.id} title={k.name} className="grid size-8 place-items-center overflow-hidden rounded-full ring-2 ring-white" style={{ background: `${k.color}2e` }}><ChildThumb c={k} className="size-7" /></span>
                ))}
              </span>
              <span className="text-xs font-bold text-[#4a4670]">{kids.slice(0, 3).map((k) => k.name).join(', ')}{kids.length > 3 ? ` +${kids.length - 3}` : ''}</span>
            </>
          ) : <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Not assigned yet</span>}
        </div>

        {canAssign || exp ? (
          <div className="flex flex-col gap-2 [&>button]:w-full">
            {canAssign ? <Btn variant="dark" onClick={() => app.open({ k: 'assign', plan: p })}>Assign child</Btn> : null}
            {exp && p.price ? <Btn variant="dark" onClick={() => app.open({ k: 'buy', plan: p.name, child: p.children[0] })}>Buy again</Btn> : null}
            {exp && !p.price ? <Btn variant="dark" onClick={() => app.open({ k: 'buy' })}>Choose a plan</Btn> : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function PlansView({ app }: { app: App }) {
  const [tab, setTab] = useState<'active' | 'expired'>('active')
  const act = app.s.plans.filter((p) => !isExpired(p)), exp = app.s.plans.filter(isExpired)
  const list = [...(tab === 'active' ? act : exp)].sort((a, b) => a.end.getTime() - b.end.getTime())
  const soonN = act.filter((p) => !isUpcoming(p) && daysLeft(p) <= 3).length
  const tabs: ['active' | 'expired', string, string, number][] = [['active', '🌈', 'Active', act.length], ['expired', '🕰️', 'Expired', exp.length]]
  return (
    <div className="flex min-h-[34rem] flex-col gap-6">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#fff6f2] shadow-[0_18px_40px_-28px_rgba(236,100,150,0.55)] ring-1 ring-white/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/plans-bg.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 -z-10 h-44 w-full object-cover object-[82%_center] sm:inset-0 sm:h-full" />
        <div className="relative flex flex-col gap-4 px-5 pb-48 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
          <div className="max-w-[24rem]">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/90 text-[#f0668f] shadow-[0_8px_16px_-10px_rgba(240,102,143,0.7)] ring-1 ring-[#ffd3df]"><CalendarHeart className="size-6" /></span>
              <h1 className="font-display text-3xl font-bold leading-none tracking-tight text-[#2f2a5c] sm:text-4xl">All <span className="text-[#f0668f]">plans</span></h1>
              <svg aria-hidden="true" viewBox="0 0 28 28" className="-ml-1 -mt-3 size-5 text-[#ffc94d]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M6 22l4-8M14 20l2-12M22 22l-2-6" /></svg>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#5c5883]">Plans you’ve bought or redeemed, and the little ones they’re assigned to.</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1fbef]/90 px-3 py-1.5 text-[#2f8f3a] ring-1 ring-[#bfe5bd]"><Zap className="size-3.5" />{act.length} active</span>
              {soonN ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0f3]/90 px-3 py-1.5 text-[#e0457a] ring-1 ring-[#ffc6d4]"><Timer className="size-3.5" />{soonN} ending soon</span> : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:absolute sm:bottom-5 sm:right-6">
            <button type="button" onClick={() => app.open({ k: 'redeem' })} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#f1fbef]/95 px-4 text-sm font-bold text-[#2f8f3a] ring-1 ring-[#bfe5bd] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f8f3a]/50"><Gift className="size-4" />Redeem voucher</button>
            <button type="button" onClick={() => app.open({ k: 'buy' })} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f9709a] to-[#ee5a8a] px-4 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(238,90,138,0.85)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee5a8a]/60 focus-visible:ring-offset-2"><Plus className="size-4" />Buy new</button>
          </div>
        </div>
      </section>

      <div role="tablist" aria-label="Plan status" className="inline-flex w-fit gap-1.5 rounded-full bg-white/80 p-1.5 shadow-[0_0_0_1px_var(--border)]">
        {tabs.map(([k, emo, label, n]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all', tab === k ? 'bg-gradient-to-r from-[#ffd9a8] to-[#ffc7d6] text-[#7a3d12] shadow-sm' : 'text-[#6d6585] hover:bg-muted')}>
            <span aria-hidden="true">{emo}</span>{label}<span className={cn('grid min-w-6 place-items-center rounded-full px-1.5 text-xs', tab === k ? 'bg-white/80' : 'bg-[#f1eef6]')}>{n}</span>
          </button>
        ))}
      </div>

      {list.length ? <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <PlanCard key={p.id} app={app} p={p} />)}</div> : (
        <Empty icon={tab === 'active' ? '🎈' : '🕰️'} title={tab === 'active' ? 'No active plans' : 'No expired plans'} action={tab === 'active' ? <Btn onClick={() => app.open({ k: 'buy' })}>Buy new</Btn> : undefined}>
          {tab === 'active' ? 'Buy a plan or redeem a voucher to unlock more for your children.' : 'Plans that have ended will show here.'}
        </Empty>
      )}
    </div>
  )
}

/* ---------------- pickers ---------------- */
function PickRow({ type, name, value, checked, disabled, onChange, art, title, sub }: { type: 'radio' | 'checkbox'; name: string; value: string; checked: boolean; disabled?: boolean; onChange: () => void; art?: React.ReactNode; title: React.ReactNode; sub: string }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2.5 rounded-2xl p-2.5 ring-1 transition', checked ? 'bg-[#fff5f8] ring-joy-pink' : 'bg-white ring-border hover:ring-foreground/25', disabled && 'pointer-events-none opacity-50')}>
      <input type={type} name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="size-4 accent-[#f0449a]" />
      {art}
      <span className="min-w-0"><b className="block text-sm">{title}</b><small className="text-xs text-muted-foreground">{sub}</small></span>
    </label>
  )
}

export function AssignDialog({ app, plan, pre }: { app: App; plan: Plan; pre?: string }) {
  const multi = plan.type === 'Premium Plus'
  const [sel, setSel] = useState<string[]>(pre ? [pre] : [])
  const [err, setErr] = useState(false)
  const toggle = (id: string) => setSel((x) => (multi ? (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]) : [id]))
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sel.length) return setErr(true)
    app.setS((s) => ({ ...s, plans: s.plans.map((p) => (p.id === plan.id ? { ...p, children: [...p.children, ...sel] } : p)) }))
    app.open(null)
    app.toast(`${plan.name} assigned to ${sel.map((i) => app.s.children.find((c) => c.id === i)?.name).join(', ')}.`)
  }
  return (
    <>
      <DlgHead icon="🧒" title={`Assign ${plan.name}`} sub={multi ? 'Choose one or more children for this Trial Gift.' : 'Each plan covers one child. Choose who gets it.'} />
      <form onSubmit={submit}>
        <fieldset className="mb-4 grid gap-2 sm:grid-cols-2">
          <legend className="sr-only">Children</legend>
          {app.s.children.map((c) => {
            const blocked = plan.children.includes(c.id)
            return <PickRow key={c.id} type={multi ? 'checkbox' : 'radio'} name="as" value={c.id} checked={sel.includes(c.id)} disabled={blocked} onChange={() => { setErr(false); toggle(c.id) }} art={<ChildThumb c={c} className="size-9" />} title={c.name} sub={blocked ? 'Already on this plan' : `Now: ${unlockOf(app.s, c)}`} />
          })}
        </fieldset>
        {err ? <p className="mb-3 text-xs font-medium text-[#e5484d]">Choose a child to continue.</p> : null}
        <Btn type="submit" full>Assign</Btn>
      </form>
    </>
  )
}

export function AssignToChildDialog({ app, child }: { app: App; child: Child }) {
  const [sel, setSel] = useState('')
  const [err, setErr] = useState(false)
  const avail = app.s.plans.filter((p) => !isExpired(p) && (p.type === 'Premium Plus' || p.children.length === 0) && !p.children.includes(child.id))
  if (!avail.length)
    return (
      <>
        <DlgHead icon="🎟️" title="No plans to assign" sub={`You don’t have an unassigned plan that fits ${child.name}. Buy a new one instead.`} />
        <Btn full onClick={() => app.open({ k: 'buy', child: child.id })}>Buy a plan for {child.name}</Btn>
      </>
    )
  return (
    <>
      <DlgHead icon="🎟️" title={`Assign a plan to ${child.name}`} sub="Pick one of your available plans." />
      <form onSubmit={(e) => {
        e.preventDefault()
        if (!sel) return setErr(true)
        const p = app.s.plans.find((x) => x.id === sel)!
        app.setS((s) => ({ ...s, plans: s.plans.map((x) => (x.id === sel ? { ...x, children: [...x.children, child.id] } : x)) }))
        app.open(null); app.toast(`${p.name} assigned to ${child.name}.`)
      }}>
        <fieldset className="mb-4 flex flex-col gap-2">
          <legend className="sr-only">Available plans</legend>
          {avail.map((p) => <PickRow key={p.id} type="radio" name="ap" value={p.id} checked={sel === p.id} onChange={() => { setErr(false); setSel(p.id) }} title={<>{p.name} <UnlockChip type={p.type} label={p.type} className="ml-1 !px-2 !py-0.5 !text-[10px]" /></>} sub={`${daysLeft(p)} days left`} />)}
        </fieldset>
        {err ? <p className="mb-3 text-xs font-medium text-[#e5484d]">Choose a plan to continue.</p> : null}
        <Btn type="submit" full>Assign to {child.name}</Btn>
      </form>
    </>
  )
}

export function RedeemDialog({ app }: { app: App }) {
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/\s/g, '')
    if (!c) return setErr('Enter a code.')
    if (app.s.usedVouchers.includes(c)) return setErr('This code has already been used.')
    const v = VOUCHERS[c]
    if (!v) return setErr('This code isn’t valid. Check the code and try again.')
    const start = new Date()
    const p: Plan = { id: app.newId('p'), name: v.name, type: v.type, label: `${v.days} days`, price: 0, voucher: c, start, end: addDays(start, v.days), children: [] }
    app.setS((s) => ({ ...s, plans: [...s.plans, p], usedVouchers: [...s.usedVouchers, c] }))
    if (app.s.children.length) { app.toast('Trial Gift added.'); app.open({ k: 'assign', plan: p }) }
    else { app.open(null); app.toast('Trial Gift added. Add a child to assign it.') }
  }
  return (
    <>
      <DlgHead icon="🎁" title="Redeem a voucher" sub="Enter your code to claim a Trial Gift! Unlock Premium, Special, or both. Discover your gift now!" />
      <form onSubmit={submit} noValidate>
        <Field label="Voucher code" error={err}>{(id) => <input id={id} value={code} onChange={(e) => { setCode(e.target.value); setErr(null) }} autoComplete="off" placeholder="e.g. JOYTRIAL" className={cn(inputCls, 'font-semibold uppercase tracking-widest')} />}</Field>
        <Btn type="submit" full variant="green">Redeem</Btn>
        <p className="mt-3 text-center text-xs text-muted-foreground">Demo codes: JOYTRIAL or JOYGIFT10</p>
      </form>
    </>
  )
}

/* ---------------- buy flow ---------------- */
export const CHANNELS: Record<Channel, { label: string; sub: string; cls: string; icon: string }> = {
  AYA: { label: 'AYA Pay', sub: 'Website', cls: 'bg-[#ffe6e4] text-[#c4271f]', icon: '💳' },
  Apple: { label: 'App Store', sub: 'iPhone app', cls: 'bg-[#eceaf0] text-[#27253f]', icon: '' },
  Google: { label: 'Google Play', sub: 'Android app', cls: 'bg-[#e3f6ee] text-[#17795a]', icon: '▶' },
  Offline: { label: 'Offline', sub: 'Paid in person', cls: 'bg-[#fff1cf] text-[#a56a00]', icon: '🏢' },
}
export function ChannelBadge({ ch }: { ch: Channel }) {
  const c = CHANNELS[ch]
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold', c.cls)}><span aria-hidden="true">{c.icon}</span>{c.label}</span>
}

function CuteBulb() {
  return (
    <span aria-hidden="true" className="relative grid size-16 shrink-0 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#fff3c4] to-[#ffd9ea] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.9),0_6px_12px_-6px_rgba(238,90,138,0.45)]">
      <svg viewBox="0 0 48 48" className="size-12">
        <g stroke="#ffb703" strokeWidth="2.6" strokeLinecap="round"><path d="M24 3v4" /><path d="M7 11l3 3" /><path d="M41 11l-3 3" /><path d="M3 26h4" /><path d="M45 26h-4" /></g>
        <path d="M24 9c-8 0-13.5 6-13.5 13 0 4.6 2.4 7.4 4.6 9.6 1.4 1.4 2 2.7 2 4.4h14.8c0-1.7.6-3 2-4.4 2.2-2.2 4.6-5 4.6-9.6C37.5 15 32 9 24 9z" fill="#ffe27a" stroke="#ffb703" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16 15c1.8-2 4-3 6.5-3.3" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity=".9" />
        <rect x="17.5" y="36.5" width="13" height="4.5" rx="2.25" fill="#c9b8f5" stroke="#9b87e0" strokeWidth="2" />
        <circle cx="19.5" cy="23" r="1.9" fill="#4a3b5c" /><circle cx="28.5" cy="23" r="1.9" fill="#4a3b5c" />
        <circle cx="19" cy="22.4" r=".6" fill="#fff" /><circle cx="28" cy="22.4" r=".6" fill="#fff" />
        <path d="M21.5 27c1.4 1.6 3.6 1.6 5 0" stroke="#4a3b5c" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <ellipse cx="15.6" cy="27" rx="2.6" ry="1.6" fill="#ff9db8" opacity=".75" /><ellipse cx="32.4" cy="27" rx="2.6" ry="1.6" fill="#ff9db8" opacity=".75" />
      </svg>
    </span>
  )
}

type Step = 1 | 2 | 3 | 4 | 5
export function BuyFlow({ app, pre }: { app: App; pre: { plan?: string; child?: string } }) {
  const [step, setStep] = useState<Step>(1)
  const [sel, setSel] = useState<string[]>(pre.plan ? [pre.plan] : [])
  const [ref, setRef] = useState('')
  const [bought, setBought] = useState<{ id: string; name: string }[]>([])
  const [assign, setAssign] = useState<Record<string, string | null>>({})
  const [ayaTab, setAyaTab] = useState<'qr' | 'phone'>('qr')
  const [phone, setPhone] = useState('')
  const [phoneErr, setPhoneErr] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [addingFor, setAddingFor] = useState<string | null>(null)
  const chosen = CATALOG.filter((c) => sel.includes(c.name))
  const total = chosen.reduce((n, c) => n + c.price, 0)
  const many = chosen.length > 1
  const d = step === 4 ? 3 : step === 5 ? 4 : step
  const toggle = (n: string) => setSel((x) => (x.includes(n) ? x.filter((y) => y !== n) : [...x, n]))
  const planWord = (n: number) => `${n} plan${n > 1 ? 's' : ''}`

  useEffect(() => {
    if (!waiting) return
    const t = setTimeout(() => {
      if (!chosen.length) return
      const start = new Date()
      const made = chosen.map((p) => {
        const end = new Date(start)
        end.setMonth(end.getMonth() + p.months)
        const label = `${p.months} month${p.months > 1 ? 's' : ''}`
        return { p, id: app.newId('p'), end, label }
      })
      app.setS((s) => ({
        ...s,
        plans: [...s.plans, ...made.map((m) => ({ id: m.id, name: m.p.name, type: m.p.type, label: m.label, price: m.p.price, start, end: m.end, children: [] as string[], ref }))],
        payments: [...made.map((m) => ({ date: new Date(), item: `${m.p.name}, ${m.label}`, child: 'Not assigned yet', amount: m.p.price, channel: 'AYA' as const, ref, status: 'Paid' as const })), ...s.payments],
      }))
      setBought(made.map((m) => ({ id: m.id, name: m.p.name })))
      setAssign(Object.fromEntries(made.map((m) => [m.id, pre.child ?? null])))
      setWaiting(false); setStep(4)
    }, 1400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waiting])

  if (addingFor)
    return <ChildForm app={app} onSaved={(c) => { setAssign((a) => ({ ...a, [addingFor]: c.id })); setAddingFor(null) }} onBack={() => setAddingFor(null)} />

  const steps = ['Plan', 'Pay', 'Child']
  const stepper = (
    <ol aria-label="Steps" className="mb-7 flex items-center gap-2 pr-10 sm:gap-3">
      {steps.map((s, i) => {
        const n = i + 1
        const done = n < d, on = n === d
        return (
          <Fragment key={s}>
            <li aria-current={on ? 'step' : undefined} className="flex shrink-0 items-center gap-2">
              <span className={cn('grid size-9 place-items-center rounded-full text-sm font-bold transition', done ? 'bg-[#e4f7e6] text-[#2f8f3a]' : on ? 'bg-gradient-joy text-white shadow-[0_8px_18px_-6px_rgba(238,90,138,0.7)] ring-4 ring-[#ffe3ec]' : 'bg-[#f1edf7] text-[#9a8fb0]')}>
                {done ? <Check className="size-4" strokeWidth={3.5} /> : n}
              </span>
              <span className={cn('text-sm', on ? 'font-bold text-foreground' : done ? 'font-semibold text-foreground/70' : 'font-medium text-muted-foreground')}>{s}</span>
            </li>
            {n < steps.length && (
              <li role="presentation" aria-hidden="true" className="flex min-w-3 flex-1 items-center">
                <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#ece8f3]">
                  <span className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f9709a] to-[#ff9a5a] transition-all duration-500', done ? 'w-full' : 'w-0')} />
                </span>
                <ChevronRight className={cn('-ml-1 size-4 shrink-0', done ? 'text-[#ff7a5a]' : 'text-[#cfc5df]')} strokeWidth={3} />
              </li>
            )}
          </Fragment>
        )
      })}
    </ol>
  )

  if (step === 1)
    return (
      <>
        {stepper}
        <DlgHead title="Choose a plan" sub="Pick one or more plans. Each plan covers one child, and you’ll choose the child after paying." />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATALOG.map((c) => {
            const on = sel.includes(c.name)
            const sug = pre.plan === c.name
            return (
              <article key={c.name} onClick={() => toggle(c.name)} className={cn('relative flex cursor-pointer flex-col rounded-3xl p-4 ring-1 transition', on ? 'bg-[#fff5f8] ring-2 ring-joy-pink shadow-md shadow-pink-100' : c.popular ? 'ring-2 ring-[#ffb347]/70' : sug ? 'ring-2 ring-[#6aa8ff]/70' : 'ring-border hover:ring-foreground/25')}>
                {c.popular ? <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff9f43] to-[#ff6b6b] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-orange-200">🔥 Most popular</span> : sug ? <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#4facfe] to-[#7c6cff] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-blue-200">✨ Suggested</span> : null}
                <span aria-hidden="true" className={cn('absolute right-4 top-4 grid size-6 place-items-center rounded-full ring-1 transition', on ? 'bg-gradient-joy text-white ring-transparent' : 'bg-white text-transparent ring-border')}><Check className="size-3.5" strokeWidth={3.5} /></span>
                <UnlockChip type={c.type} />
                <h3 className="mt-2 font-display text-lg font-medium">{c.name}</h3>
                <div className="font-display text-3xl font-medium"><small className="mr-0.5 align-top text-sm">$</small>{c.price.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{c.months} month{c.months > 1 ? 's' : ''} · about ${(c.price / c.months).toFixed(2)} a month</p>
                <ul className="my-3 flex flex-1 flex-col gap-1.5 text-xs">{BENEFITS[c.type].map((b) => <li key={b} className="flex gap-1.5"><span className="text-[#2f8f3a]">✓</span>{b}</li>)}</ul>
                <Btn small variant={on ? 'gold' : 'blueSoft'} aria-pressed={on} aria-label={`${on ? 'Remove' : 'Choose'} ${c.name}`} onClick={(e: React.MouseEvent) => { e.stopPropagation(); toggle(c.name) }}>{on ? 'Selected ✓' : 'Choose plan'}</Btn>
              </article>
            )
          })}
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#faf8fc] px-4 py-3">
          <div className="text-sm" aria-live="polite">
            {chosen.length ? <><b>{planWord(chosen.length)} selected</b><span className="text-muted-foreground"> · {chosen.map((c) => c.name).join(' + ')}</span></> : <span className="text-muted-foreground">Select one or more plans to continue.</span>}
          </div>
          <div className="flex items-center gap-3">
            {chosen.length > 0 && <div className="text-right"><small className="block text-[10px] text-muted-foreground">Total</small><b className="font-display text-xl">{money(total)}</b></div>}
            <Btn disabled={!chosen.length} onClick={() => setStep(2)}>Continue</Btn>
          </div>
        </div>
        <p className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 rounded-2xl bg-[#f1ecfb] sm:flex-nowrap px-4 py-3 text-sm text-[#4b3f68]">
          <span className="flex items-center gap-3"><CuteBulb /><span>Put a Premium plan and Mastery on the same child to get <b>Premium Plus</b>, which unlocks everything.</span></span>
          <a href="/pricing#compare" onClick={() => app.open(null)} className="shrink-0 whitespace-nowrap font-semibold text-[#e2457a] underline underline-offset-4">Compare all plans</a>
        </p>
      </>
    )

  if (!chosen.length) return null

  if (step === 2)
    return (
      <>
        {stepper}
        <DlgHead title="Review and pay" sub="Plans don’t renew automatically. We’ll remind you 3 days before each one ends." />
        <ul className="mb-4 divide-y divide-border rounded-2xl bg-[#faf8fc] px-4 text-sm">
          {chosen.map((p) => (
            <li key={p.name} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1"><b className="block">{p.name}</b><span className="text-xs text-muted-foreground">{p.type} unlock · {p.months} month{p.months > 1 ? 's' : ''}</span></div>
              <b>{money(p.price)}</b>
              <button type="button" aria-label={`Remove ${p.name}`} onClick={() => { toggle(p.name); if (chosen.length === 1) setStep(1) }} className="text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground">Remove</button>
            </li>
          ))}
          <li className="flex items-center justify-between py-3"><span className="text-xs text-muted-foreground">Total · {planWord(chosen.length)}</span><b className="font-display text-xl">{money(total)}</b></li>
        </ul>
        <Note>👧 After paying, you’ll pick which child gets {many ? 'each plan' : 'this plan'}, or add a new child.</Note>
        <div className="mb-5 flex items-center gap-3 rounded-2xl p-4 ring-1 ring-border">
          <span className="relative grid size-16 shrink-0 -rotate-3 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#ff8a7a] to-[#ff5c8a] text-lg font-extrabold tracking-wide text-white shadow-[0_6px_14px_-4px_rgba(255,92,138,.6)] ring-2 ring-white">AYA<span className="absolute -right-2 -top-2 text-lg" aria-hidden="true">✨</span><span className="absolute -bottom-2 -left-1.5 text-sm" aria-hidden="true">💖</span></span>
          <div className="text-sm"><b className="block">Pay online with AYA Pay</b><span className="text-xs text-muted-foreground">You’ll confirm the payment on the secure AYA Pay page.</span></div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e4f7e6] to-[#d9f1ff] py-1 pl-1 pr-3 text-xs font-semibold text-[#2f7d5b] ring-1 ring-white"><span className="grid size-6 place-items-center rounded-full bg-white shadow-sm" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-4"><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#7cc9a0" strokeWidth="2.4" strokeLinecap="round"/><rect x="5" y="10.5" width="14" height="10" rx="4" fill="#ff9fc0"/><circle cx="10" cy="15" r="1" fill="#fff"/><circle cx="14" cy="15" r="1" fill="#fff"/><path d="M10.6 17.2c.8.6 1.8.6 2.8 0" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg></span>Secure</span>
        </div>
        <div className="flex justify-end gap-3">
          <Btn variant="ghost" onClick={() => setStep(1)}>Back to plans</Btn>
          <Btn variant="aya" onClick={() => { setRef('JOY' + Date.now().toString().slice(-8)); setStep(3) }}>Pay {money(total)} with AYA Pay</Btn>
        </div>
      </>
    )

  if (step === 3)
    return (
      <div role="group" aria-label="AYA Pay checkout (demo)">
        <div className="mb-4 mr-11 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff7a6b] to-[#ff5c8a] px-4 py-3 text-white">
          <span className="rounded-lg bg-white px-2 py-0.5 text-xs font-extrabold text-[#e8332a]">AYA</span><b>AYA Pay</b><span className="ml-auto text-xs opacity-90">Secure checkout · Demo</span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
          <div><small className="block text-xs text-muted-foreground">Merchant</small><b>Joy</b></div>
          <div><small className="block text-xs text-muted-foreground">Order no.</small><b>{ref}</b></div>
          <div className="text-right"><small className="block text-xs text-muted-foreground">Amount</small><b>{money(total)}</b></div>
        </div>
        <div className="mb-4 flex gap-1 rounded-full bg-[#f4f1f8] p-1" role="tablist">
          {([['qr', 'Scan QR'], ['phone', 'AYA Pay phone number']] as const).map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={ayaTab === k} disabled={waiting} onClick={() => setAyaTab(k)} className={cn('h-9 flex-1 rounded-full text-sm font-semibold', ayaTab === k ? 'bg-white shadow-sm' : 'text-muted-foreground')}>{l}</button>)}
        </div>
        {waiting ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center"><span className="size-8 animate-spin rounded-full border-4 border-[#eee] border-t-[#e8332a]" aria-hidden="true" /><b>Waiting for AYA Pay…</b><p className="text-sm text-muted-foreground">Approve the payment in your AYA Pay app.</p></div>
        ) : ayaTab === 'qr' ? (
          <div className="flex flex-col items-center gap-3 py-2"><QrCanvas seed={ref} size={200} /><p className="text-center text-sm text-muted-foreground">Open the AYA Pay app, scan this code, then approve the payment.</p></div>
        ) : (
          <><Field label="AYA Pay phone number" prefix="+95" error={phoneErr ? 'Enter the phone number linked to your AYA Pay account.' : null}>{(id) => <input id={id} type="tel" inputMode="tel" placeholder="9 123 456 789" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneErr(false) }} className={inputCls} />}</Field><p className="mb-2 text-sm text-muted-foreground">We’ll send a payment request to your AYA Pay app.</p></>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <Btn variant="ghost" disabled={waiting} onClick={() => { setStep(2); app.toast('Payment cancelled. You weren’t charged.') }}>Cancel payment</Btn>
          <Btn variant="aya" disabled={waiting} onClick={() => { if (ayaTab === 'phone' && phone.replace(/\D/g, '').length < 7) return setPhoneErr(true); setWaiting(true) }}>{ayaTab === 'qr' ? 'I’ve approved it' : 'Send payment request'}</Btn>
        </div>
      </div>
    )

  if (step === 4)
    return (
      <>
        {stepper}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#e4f7e6] p-4 text-sm"><span aria-hidden="true">✅</span><div><b className="block">Payment complete</b><span className="text-xs text-[#3b7a43]">{bought.map((b) => b.name).join(' + ')} · {money(total)} · AYA Pay · {ref}</span></div></div>
        <DlgHead title={many ? 'Who are these plans for?' : `Who is ${bought[0]?.name} for?`} sub="Pick a child, add a new one, or assign it later from Plans." />
        <div className="mb-5 flex flex-col gap-4">
          {bought.map((b) => (
            <fieldset key={b.id} className="rounded-2xl p-3 ring-1 ring-border">
              <legend className="px-1 text-sm font-bold">{b.name}</legend>
              <div className="grid gap-2 sm:grid-cols-3">
                {app.s.children.map((c) => <PickRow key={c.id} type="radio" name={`bc-${b.id}`} value={c.id} checked={assign[b.id] === c.id} onChange={() => setAssign((a) => ({ ...a, [b.id]: c.id }))} art={<ChildThumb c={c} className="size-9" />} title={c.name} sub={`Now: ${unlockOf(app.s, c)}`} />)}
                <PickRow type="radio" name={`bc-${b.id}`} value="" checked={!assign[b.id]} onChange={() => setAssign((a) => ({ ...a, [b.id]: null }))} title="Assign later" sub="Pick later in Plans" />
                <button type="button" onClick={() => setAddingFor(b.id)} className="flex min-h-[3.5rem] w-full items-center justify-center gap-2 rounded-2xl text-sm font-semibold ring-1 ring-dashed ring-foreground/30 hover:bg-[#faf8fc]"><span aria-hidden="true">+</span>Add a new child</button>
              </div>
            </fieldset>
          ))}
        </div>
        <div className="flex justify-end">
          <Btn onClick={() => {
            app.setS((s) => ({
              ...s,
              plans: s.plans.map((x) => (assign[x.id] ? { ...x, children: [assign[x.id] as string] } : x)),
              payments: s.payments.map((x) => {
                const b = x.ref === ref ? bought.find((y) => x.item.startsWith(`${y.name},`)) : undefined
                const cid = b ? assign[b.id] : null
                const nm = cid ? s.children.find((c) => c.id === cid)?.name : undefined
                return nm ? { ...x, child: nm } : x
              }),
            }))
            setStep(5)
          }}>Continue</Btn>
        </div>
      </>
    )

  return (
    <>
      <DlgHead icon="🎉" title={many ? 'Your plans are ready' : (() => { const c0 = assign[bought[0]?.id] ? app.s.children.find((x) => x.id === assign[bought[0].id]) : null; return c0 ? `${bought[0].name} is ready for ${c0.name}` : 'Your plan is ready' })()} />
      <ul className="mb-3 divide-y divide-border rounded-2xl bg-[#faf8fc] px-4 text-sm">
        {bought.map((b) => {
          const c = assign[b.id] ? app.s.children.find((x) => x.id === assign[b.id]) : null
          return <li key={b.id} className="flex items-center justify-between gap-3 py-3"><b>{b.name}</b><span className="text-muted-foreground">{c ? `For ${c.name}` : 'Not assigned yet'}</span></li>
        })}
        <li className="grid grid-cols-2 gap-3 py-3">
          <div><small className="block text-xs text-muted-foreground">Paid via</small><ChannelBadge ch="AYA" /></div>
          <div><small className="block text-xs text-muted-foreground">Transaction ID</small><b>{ref}</b></div>
          <div className="col-span-2 border-t pt-3"><small className="block text-xs text-muted-foreground">Total paid</small><b className="font-display text-xl">{money(total)}</b></div>
        </li>
      </ul>
      <p className="mb-5 text-sm text-muted-foreground">{bought.some((b) => assign[b.id]) ? 'New activities are unlocked.' : 'Assign it to a child anytime from Plans.'}</p>
      <div className="flex justify-end gap-3">
        <Btn variant="ghost" onClick={() => app.open(null)}>Close</Btn>
        <Btn onClick={() => { app.open(null); app.go({ name: 'plans' }) }}>Go to Plans</Btn>
      </div>
    </>
  )
}
