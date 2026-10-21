'use client'

import { AppActivationGuide } from './app-guide'
import { Fragment, useEffect, useState } from 'react'
import { CalendarHeart, Check, ChevronRight, Gift, Plus, Timer, Zap } from '@/components/joy/cute-icons'
import { Btn, Card, DlgHead, Empty, Field, Note, Seg, UnlockChip, inputCls } from './ui'
import { BENEFITS, CATALOG, VOUCHERS, addDays, daysLeft, fmt, fmtDate, isExpired, isUpcoming, money, unlockOf } from './data'
import type { Channel, Child, Plan, PlanType } from './data'
import type { App, BuyRestore } from './types'
import { ChildForm, QrCanvas } from './dialogs'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { ANIMAL_IMG } from './data'
import { Emo, EmoText } from '@/components/joy/emo'
import { PlanCarousel } from '@/components/joy/plan-carousel'

const TYPE_STYLE: Record<PlanType, { chip: string; bar: string; tint: string; emoji: string }> = {
  Premium: { chip: 'bg-[#e3f1ff] text-[#0a86e8]', bar: '#1fa9e8', tint: '#e3f1ff', emoji: '🎈' },
  Special: { chip: 'bg-[#efeaff] text-[#8a45d6]', bar: '#8e5cf0', tint: '#f4eeff', emoji: '🔮' },
  'Premium Plus': { chip: 'bg-[#fff3d6] text-[#9a6a00]', bar: '#ffb300', tint: '#fff3d6', emoji: '👑' },
}

export function ChildThumb({ c, className }: { c: Child; className?: string }) {
  const f = c.animal ? ANIMAL_IMG[c.animal] : null
  return f ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={`/images/animals/${f}.webp`} alt="" className={cn('object-contain', className)} />
  ) : (
    <span className={cn('grid place-items-center text-2xl', className)} aria-hidden="true"><Emo e="🌱" /></span>
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
  const ts = TYPE_STYLE[p.type]
  const tr = useT()
  const st = exp ? [tr('Expired'), 'bg-[#f6f1fb] text-[#7a7399]'] : up ? [`${tr('Starts')} ${fmtDate(p.start)}`, 'bg-[#e3f1ff] text-[#0a86e8]'] : soon ? [tr('Ends soon'), 'bg-[#efe4d7] text-[#f46f10]'] : [tr('Active'), 'bg-[#e2f6ec] text-[#2f8f3a]']
  const total = Math.max(1, p.end.getTime() - p.start.getTime())
  const left = exp ? 0 : up ? 1 : Math.min(1, Math.max(0, (p.end.getTime() - Date.now()) / total))
  const pct = Math.round(left * 100)
  return (
    <article className={cn('relative flex h-full flex-col rounded-[2rem] bg-white p-3 ring-1 ring-border shadow-[0_20px_50px_-30px_rgba(42, 34, 64, 0.3)]', exp && 'opacity-80 saturate-[0.7]')}>
      <div className="flex flex-1 flex-col gap-4 p-2 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <UnlockChip type={p.type} label={<>{p.type}{multi ? ' · Premium & Special' : ''}</>} />
          <span className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold', st[1])}><i className="size-1.5 rounded-full bg-current" aria-hidden="true" />{st[0]}</span>
          {p.voucher ? <span className="rounded-full bg-[#ffe7ef] px-3 py-1 text-[11px] font-semibold text-[#d6336c]"><Emo e="🎁" /> {tr('Voucher')}</span> : null}
        </div>
        <div>
          <h3 className="text-2xl font-medium text-[#30235f]"><span aria-hidden="true" className="mr-1.5"><Emo e={ts.emoji} /></span>{p.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{p.label} · {fmt(p.start)} – {fmt(p.end)}</p>
        </div>
        <div>
          {p.price ? <p className="font-display text-4xl font-medium tracking-tight text-[#30235f]"><span className="align-top text-xl">$</span>{p.price.toFixed(2)}</p> : <p className="font-display text-4xl font-medium tracking-tight text-[#2f8f3a]">{tr('Free')}</p>}
          <p className="text-sm text-muted-foreground">{p.price ? 'USD' : tr('Trial gift')}</p>
        </div>

        <div className="rounded-2xl bg-muted/70 px-4 py-3">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span>{exp ? tr('Plan ended') : up ? tr('Not started yet') : tr('Time left')}</span>
            <span style={{ color: ts.bar }}>{exp ? `0 ${tr('days')}` : `${dl} ${tr(dl === 1 ? 'day' : 'days')}`}</span>
          </div>
          <div className="mt-2 h-2.5 rounded-full bg-white" role="progressbar" aria-label={tr('Time left')} aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(left * 100, exp ? 0 : 8)}%`, background: ts.bar }} />
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
              <span className="text-xs font-bold text-[#4a3a63]">{kids.slice(0, 3).map((k) => k.name).join(', ')}{kids.length > 3 ? ` +${kids.length - 3}` : ''}</span>
            </>
          ) : <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{tr('Not assigned yet')}</span>}
        </div>

        {canAssign || exp ? (
          <div className="flex flex-col gap-2 [&>button]:w-full">
            {canAssign ? <Btn variant="dark" onClick={() => app.open({ k: 'assign', plan: p })}>{tr('Assign child')}</Btn> : null}
            {exp && p.price ? <Btn variant="dark" onClick={() => app.open({ k: 'buy', plan: p.name, child: p.children[0] })}>{tr('Buy again')}</Btn> : null}
            {exp && !p.price ? <Btn variant="dark" onClick={() => app.open({ k: 'buy' })}>{tr('Choose a plan')}</Btn> : null}
          </div>
        ) : null}
      </div>
    </article>
  )
}

export function PlansView({ app }: { app: App }) {
  const t = useT()
  const [tab, setTab] = useState<'active' | 'expired'>('active')
  const act = app.s.plans.filter((p) => !isExpired(p)), exp = app.s.plans.filter(isExpired)
  const list = [...(tab === 'active' ? act : exp)].sort((a, b) => a.end.getTime() - b.end.getTime())
  const soonN = act.filter((p) => !isUpcoming(p) && daysLeft(p) <= 3).length
  const tabs: ['active' | 'expired', string, string, number][] = [['active', '🌈', t('Active'), act.length], ['expired', '🕰️', t('Expired'), exp.length]]
  return (
    <div className="flex min-h-[34rem] flex-col gap-6">
      <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-[#fffaf4] shadow-[0_18px_40px_-28px_rgba(248, 96, 143, 0.55)] ring-1 ring-white/80">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/plans-bg.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 -z-10 h-44 w-full object-cover object-[82%_center] sm:inset-0 sm:h-full" />
        <div className="relative flex flex-col gap-4 px-5 pb-48 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
          <div className="max-w-[24rem]">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-2xl bg-white/90 text-[#f8608f] shadow-[0_8px_16px_-10px_rgba(248, 96, 143, 0.7)] ring-1 ring-[#ffd0e2]"><CalendarHeart className="size-6" /></span>
              <h1 className="font-display text-3xl font-bold leading-none tracking-tight text-[#30235f] sm:text-4xl">{t('All')} <span className="text-[#f8608f]">{t('plans')}</span></h1>
              <svg aria-hidden="true" viewBox="0 0 28 28" className="-ml-1 -mt-3 size-5 text-[#fbc23c]" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round"><path d="M6 22l4-8M14 20l2-12M22 22l-2-6" /></svg>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#6b5f93]">{t('Plans you’ve bought or redeemed, and the little ones they’re assigned to.')}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e2f6ec]/90 px-3 py-1.5 text-[#2f8f3a] ring-1 ring-[#bfe5bd]"><Zap className="size-3.5" />{act.length} {t('active')}</span>
              {soonN ? <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ffe7ef]/90 px-3 py-1.5 text-[#d6336c] ring-1 ring-[#f6bfd5]"><Timer className="size-3.5" />{soonN} {t('ending soon')}</span> : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:absolute sm:bottom-5 sm:right-6">
            <button type="button" onClick={() => app.open({ k: 'redeem' })} className="inline-flex h-10 items-center gap-2 rounded-full bg-[#e2f6ec]/95 px-4 text-sm font-bold text-[#2f8f3a] ring-1 ring-[#bfe5bd] transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f8f3a]/50"><Gift className="size-4" />{t('Redeem voucher')}</button>
            <button type="button" onClick={() => app.open({ k: 'buy' })} className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#f8608f] to-[#f8608f] px-4 text-sm font-bold text-white shadow-[0_10px_20px_-10px_rgba(248, 96, 143, 0.85)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]/60 focus-visible:ring-offset-2"><Plus className="size-4" />{t('Buy new')}</button>
          </div>
        </div>
      </section>

      <div role="tablist" aria-label={t('Plan status')} className="inline-flex w-fit gap-1.5 rounded-full bg-white/80 p-1.5 shadow-[0_0_0_1px_var(--border)]">
        {tabs.map(([k, emo, label, n]) => (
          <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn('inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition-all', tab === k ? 'bg-gradient-to-r from-[#ffd0a8] to-[#ffd0e2] text-[#7a4a2b] shadow-sm' : 'text-[#6b6380] hover:bg-muted')}>
            <span aria-hidden="true"><Emo e={emo} /></span>{label}<span className={cn('grid min-w-6 place-items-center rounded-full px-1.5 text-xs', tab === k ? 'bg-white/80' : 'bg-[#f6f1fb]')}>{n}</span>
          </button>
        ))}
      </div>

      {list.length ? <div className="grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">{list.map((p) => <PlanCard key={p.id} app={app} p={p} />)}</div> : (
        <Empty cute={tab === 'active' ? 'balloon' : 'clock'} title={tab === 'active' ? t('No active plans') : t('No expired plans')} action={tab === 'active' ? <Btn onClick={() => app.open({ k: 'buy' })}>{t('Buy new')}</Btn> : undefined}>
          {tab === 'active' ? t('Buy a plan or redeem a voucher to unlock more for your children.') : t('Plans that have ended will show here.')}
        </Empty>
      )}
    </div>
  )
}

/* ---------------- pickers ---------------- */
function PickRow({ type, name, value, checked, disabled, onChange, art, title, sub }: { type: 'radio' | 'checkbox'; name: string; value: string; checked: boolean; disabled?: boolean; onChange: () => void; art?: React.ReactNode; title: React.ReactNode; sub: string }) {
  return (
    <label className={cn('flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-1.5 ring-1 transition', checked ? 'bg-[#f6f1fb] ring-joy-pink' : 'bg-white ring-border hover:ring-foreground/25', disabled && 'pointer-events-none opacity-50')}>
      <input type={type} name={name} value={value} checked={checked} disabled={disabled} onChange={onChange} className="size-3.5 shrink-0 accent-[#f0488a]" />
      {art}
      <span className="min-w-0 leading-tight"><b className="block truncate text-[13px]">{title}</b><small className="block truncate text-[11px] text-muted-foreground">{sub}</small></span>
    </label>
  )
}

export function AssignDialog({ app, plan, pre }: { app: App; plan: Plan; pre?: string }) {
  const t = useT()
  const multi = plan.type === 'Premium Plus'
  const [sel, setSel] = useState<string[]>(pre ? [pre] : [])
  const [err, setErr] = useState(false)
  const toggle = (id: string) => setSel((x) => (multi ? (x.includes(id) ? x.filter((i) => i !== id) : [...x, id]) : [id]))
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sel.length) return setErr(true)
    app.setS((s) => ({ ...s, plans: s.plans.map((p) => (p.id === plan.id ? { ...p, children: [...p.children, ...sel] } : p)) }))
    app.open(null)
    app.toast(`${plan.name} ${t('assigned to')} ${sel.map((i) => app.s.children.find((c) => c.id === i)?.name).join(', ')}.`)
  }
  return (
    <>
      <DlgHead cute="children" title={`${t('Assign')} ${plan.name}`} sub={multi ? t('Choose one or more children for this Trial Gift.') : t('Each plan covers one child. Choose who gets it.')} />
      <form onSubmit={submit}>
        <fieldset className="mb-4 grid gap-2 sm:grid-cols-2">
          <legend className="sr-only">{t('Children')}</legend>
          {app.s.children.map((c) => {
            const blocked = plan.children.includes(c.id)
            return <PickRow key={c.id} type={multi ? 'checkbox' : 'radio'} name="as" value={c.id} checked={sel.includes(c.id)} disabled={blocked} onChange={() => { setErr(false); toggle(c.id) }} art={<ChildThumb c={c} className="size-7" />} title={c.name} sub={blocked ? t('Already on this plan') : `${t('Now:')} ${unlockOf(app.s, c)}`} />
          })}
        </fieldset>
        {err ? <p className="mb-3 text-xs font-medium text-[#e5484d]">{t('Choose a child to continue.')}</p> : null}
        <Btn type="submit" full>{t('Assign')}</Btn>
      </form>
    </>
  )
}

export function AssignToChildDialog({ app, child }: { app: App; child: Child }) {
  const t = useT()
  const [sel, setSel] = useState('')
  const [err, setErr] = useState(false)
  const avail = app.s.plans.filter((p) => !isExpired(p) && (p.type === 'Premium Plus' || p.children.length === 0) && !p.children.includes(child.id))
  if (!avail.length)
    return (
      <>
        <DlgHead cute="plans" title={t('No plans to assign')} sub={`${t('You don’t have an unassigned plan that fits')} ${child.name}. ${t('Buy a new one instead.')}`} />
        <Btn full onClick={() => app.open({ k: 'buy', child: child.id })}>{t('Buy a plan for')} {child.name}</Btn>
      </>
    )
  return (
    <>
      <DlgHead cute="plans" title={`${t('Assign a plan to')} ${child.name}`} sub={t('Pick one of your available plans.')} />
      <form onSubmit={(e) => {
        e.preventDefault()
        if (!sel) return setErr(true)
        const p = app.s.plans.find((x) => x.id === sel)!
        app.setS((s) => ({ ...s, plans: s.plans.map((x) => (x.id === sel ? { ...x, children: [...x.children, child.id] } : x)) }))
        app.open(null); app.toast(`${p.name} ${t('assigned to')} ${child.name}.`)
      }}>
        <fieldset className="mb-4 flex flex-col gap-2">
          <legend className="sr-only">{t('Available plans')}</legend>
          {avail.map((p) => <PickRow key={p.id} type="radio" name="ap" value={p.id} checked={sel === p.id} onChange={() => { setErr(false); setSel(p.id) }} title={<>{p.name} <UnlockChip type={p.type} label={p.type} className="ml-1 !px-2 !py-0.5 !text-[10px]" /></>} sub={`${daysLeft(p)} ${t('days left')}`} />)}
        </fieldset>
        {err ? <p className="mb-3 text-xs font-medium text-[#e5484d]">{t('Choose a plan to continue.')}</p> : null}
        <Btn type="submit" full>{t('Assign to')} {child.name}</Btn>
      </form>
    </>
  )
}

export function RedeemDialog({ app }: { app: App }) {
  const t = useT()
  const [code, setCode] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const c = code.trim().toUpperCase().replace(/\s/g, '')
    if (!c) return setErr(t('Enter a code.'))
    if (app.s.usedVouchers.includes(c)) return setErr(t('This code has already been used.'))
    const v = VOUCHERS[c]
    if (!v) return setErr(t('This code isn’t valid. Check the code and try again.'))
    const start = new Date()
    const p: Plan = { id: app.newId('p'), name: v.name, type: v.type, label: `${v.days} days`, price: 0, voucher: c, start, end: addDays(start, v.days), children: [] }
    app.setS((s) => ({ ...s, plans: [...s.plans, p], usedVouchers: [...s.usedVouchers, c] }))
    if (app.s.children.length) { app.toast(t('Trial Gift added.')); app.open({ k: 'assign', plan: p }) }
    else { app.open(null); app.toast(t('Trial Gift added. Add a child to assign it.')) }
  }
  return (
    <>
      <DlgHead cute="gift" title={t('Redeem a voucher')} sub={t('Enter your code to claim a Trial Gift! Unlock Premium, Special, or both. Discover your gift now!')} />
      <form onSubmit={submit} noValidate>
        <Field label={t('Voucher code')} error={err}>{(id) => <input id={id} value={code} onChange={(e) => { setCode(e.target.value); setErr(null) }} autoComplete="off" placeholder="e.g. JOYTRIAL" className={cn(inputCls, 'font-semibold uppercase tracking-widest')} />}</Field>
        <Btn type="submit" full variant="green">{t('Redeem')}</Btn>
        <p className="mt-3 text-center text-xs text-muted-foreground">{t('Demo codes:')} JOYTRIAL / JOYGIFT10</p>
      </form>
    </>
  )
}

/* ---------------- buy flow ---------------- */
export const CHANNELS: Record<Channel, { label: string; sub: string; cls: string; icon: string }> = {
  AYA: { label: 'AYA Pay', sub: 'Website', cls: 'bg-[#ffe7ef] text-[#e8332a]', icon: '💳' },
  Apple: { label: 'App Store', sub: 'iPhone app', cls: 'bg-[#f6f1fb] text-[#27253f]', icon: '' },
  Google: { label: 'Google Play', sub: 'Android app', cls: 'bg-[#e2f6ec] text-[#1d7a55]', icon: '▶' },
  Offline: { label: 'Offline', sub: 'Paid in person', cls: 'bg-[#fff3d6] text-[#9a6a00]', icon: '🏢' },
}
export function ChannelBadge({ ch }: { ch: Channel }) {
  const c = CHANNELS[ch]
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold', c.cls)}><span aria-hidden="true"><Emo e={c.icon} /></span>{c.label}</span>
}

function CuteBulb() {
  return (
    <span aria-hidden="true" className="relative grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#f6dfae] to-[#ffd0e2]">
      <svg viewBox="0 0 48 48" className="size-7">
        <g stroke="#ffb300" strokeWidth="2.6" strokeLinecap="round"><path d="M24 3v4" /><path d="M7 11l3 3" /><path d="M41 11l-3 3" /><path d="M3 26h4" /><path d="M45 26h-4" /></g>
        <path d="M24 9c-8 0-13.5 6-13.5 13 0 4.6 2.4 7.4 4.6 9.6 1.4 1.4 2 2.7 2 4.4h14.8c0-1.7.6-3 2-4.4 2.2-2.2 4.6-5 4.6-9.6C37.5 15 32 9 24 9z" fill="#ffe27a" stroke="#ffb300" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16 15c1.8-2 4-3 6.5-3.3" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" fill="none" opacity=".9" />
        <rect x="17.5" y="36.5" width="13" height="4.5" rx="2.25" fill="#cfb8ff" stroke="#8f72e6" strokeWidth="2" />
        <circle cx="19.5" cy="23" r="1.9" fill="#4a3a63" /><circle cx="28.5" cy="23" r="1.9" fill="#4a3a63" />
        <circle cx="19" cy="22.4" r=".6" fill="#fff" /><circle cx="28" cy="22.4" r=".6" fill="#fff" />
        <path d="M21.5 27c1.4 1.6 3.6 1.6 5 0" stroke="#4a3a63" strokeWidth="1.9" strokeLinecap="round" fill="none" />
        <ellipse cx="15.6" cy="27" rx="2.6" ry="1.6" fill="#ff9db8" opacity=".75" /><ellipse cx="32.4" cy="27" rx="2.6" ry="1.6" fill="#ff9db8" opacity=".75" />
      </svg>
    </span>
  )
}

type Step = 1 | 2 | 3 | 4 | 5
export function BuyFlow({ app, pre, onDone }: { app: App; onDone?: (done: boolean) => void; pre: { plan?: string; child?: string; restore?: BuyRestore } }) {
  const t = useT()
  const rs = pre.restore
  const [step, setStep] = useState<Step>((rs?.step as Step) ?? 1)
  useEffect(() => { onDone?.(step === 5) }, [step, onDone])
  const [sel, setSel] = useState<string[]>(rs?.sel ?? (pre.plan ? [pre.plan] : []))
  const [ref, setRef] = useState(rs?.ref ?? '')
  const [bought, setBought] = useState<{ id: string; name: string }[]>(rs?.bought ?? [])
  const [assign, setAssign] = useState<Record<string, string | null>>(rs?.assign ?? {})
  const [ayaTab, setAyaTab] = useState<'qr' | 'phone'>('qr')
  const [phone, setPhone] = useState('')
  const [phoneErr, setPhoneErr] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [addingFor, setAddingFor] = useState<string | null>(null)
  // publish the current step so a review comment can reopen this popup exactly here
  useEffect(() => {
    ;(window as unknown as { __joyView?: unknown }).__joyView = { k: 'buy', plan: pre.plan, child: pre.child, restore: { step, sel, ref, bought, assign } }
  }, [step, sel, ref, bought, assign, pre.plan, pre.child])
  useEffect(() => () => { (window as unknown as { __joyView?: unknown }).__joyView = null }, [])
  const chosen = CATALOG.filter((c) => sel.includes(c.name))
  const total = chosen.reduce((n, c) => n + c.price, 0)
  const many = chosen.length > 1
  const d = step === 4 ? 3 : step === 5 ? 4 : step
  const pick = (n: string) => setSel([n])
  const planWord = (n: number) => `${n} ${t(n > 1 ? 'plans' : 'plan')}`
  const monthsOf = (n: number) => `${n} ${t(n > 1 ? 'months' : 'month')}`

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

  const steps = [t('Plan'), t('Pay'), t('Child')]
  const stepper = (
    <ol aria-label={t('Steps')} className="mb-7 flex items-center gap-2 pr-10 sm:gap-3">
      {steps.map((s, i) => {
        const n = i + 1
        const done = n < d, on = n === d
        return (
          <Fragment key={s}>
            <li aria-current={on ? 'step' : undefined} className="flex shrink-0 items-center gap-2">
              <span className={cn('grid size-9 place-items-center rounded-full text-sm font-bold transition', done ? 'bg-gradient-to-br from-[#6ee7a0] to-[#37c677] text-white shadow-[0_6px_14px_-6px_rgba(55, 198, 119, 0.8)] ring-4 ring-[#e2f6ec]' : on ? 'bg-gradient-joy text-white shadow-[0_8px_18px_-6px_rgba(248, 96, 143, 0.7)] ring-4 ring-[#ffe6ee]' : 'bg-[#f6f1fb] text-[#aaa6c8]')}>
                {done ? <svg viewBox="0 0 20 20" className="size-5 drop-shadow-[0_1px_1px_rgba(29, 122, 85, 0.35)]" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4.5 10.5 3.7 3.7 7.3-8" /></svg> : n}
              </span>
              <span className={cn('text-sm', on ? 'font-bold text-foreground' : done ? 'font-semibold text-foreground/70' : 'font-medium text-muted-foreground')}>{s}</span>
            </li>
            {n < steps.length && (
              <li role="presentation" aria-hidden="true" className="flex min-w-3 flex-1 items-center">
                <span className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-[#f6f1fb]">
                  <span className={cn('absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#f8608f] to-[#ff9e50] transition-all duration-500', done ? 'w-full' : 'w-0')} />
                </span>
                <ChevronRight className={cn('-ml-1 size-4 shrink-0', done ? 'text-[#ff765f]' : 'text-[#c9bfd6]')} strokeWidth={3} />
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
        <DlgHead title={t('Choose a plan')} sub={t('Pick a plan. Each plan covers one child, and you’ll choose the child after paying.')} />
        <PlanCarousel size="sm" label={t('Plans')} prevLabel={t('Previous plans')} nextLabel={t('Next plans')}>
          {CATALOG.map((c) => {
            const on = sel.includes(c.name)
            const sug = pre.plan === c.name
            return (
              <article key={c.name} onClick={() => pick(c.name)} className={cn('relative flex cursor-pointer flex-col rounded-3xl p-4 ring-1 transition', on ? 'bg-[#f6f1fb] ring-2 ring-joy-pink shadow-md shadow-pink-100' : c.popular ? 'ring-2 ring-[#ffb15c]/70' : sug ? 'ring-2 ring-[#7fb5e6]/70' : 'ring-border hover:ring-foreground/25')}>
                {c.popular ? <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#ff9e50] to-[#ff6b6b] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-orange-200"><Emo e="🔥" /> {t('Most popular')}</span> : sug ? <span className="absolute -top-2.5 left-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#7fb5e6] to-[#8b78f0] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-sm shadow-blue-200">✨ {t('Suggested')}</span> : null}
                <span aria-hidden="true" className={cn('absolute right-4 top-4 grid size-6 place-items-center rounded-full ring-1 transition', on ? 'bg-gradient-joy text-white ring-transparent' : 'bg-white text-transparent ring-border')}><Check className="size-3.5" strokeWidth={3.5} /></span>
                <UnlockChip type={c.type} />
                <h3 className="mt-2 font-display text-lg font-medium">{c.name}</h3>
                <div className="font-display text-3xl font-medium"><small className="mr-0.5 align-top text-sm">$</small>{c.price.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">{monthsOf(c.months)} · {t('about')} ${(c.price / c.months).toFixed(2)} {t('a month')}</p>
                <ul className="my-3 flex flex-1 flex-col gap-1.5 text-xs">{BENEFITS[c.type].map((b) => <li key={b} className="flex gap-1.5"><span className="text-[#2f8f3a]"><Emo e="✓" /></span>{t(b)}</li>)}</ul>
                <Btn small variant={on ? 'gold' : 'blueSoft'} aria-pressed={on} aria-label={`${t('Choose')} ${c.name}`} onClick={(e: React.MouseEvent) => { e.stopPropagation(); pick(c.name) }}>{on ? <>{t('Selected')} <Emo e="✓" /></> : t('Choose plan')}</Btn>
              </article>
            )
          })}
        </PlanCarousel>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#ffffff] px-4 py-3">
          <div className="text-sm" aria-live="polite">
            {chosen.length ? <><b>{planWord(chosen.length)} {t('selected')}</b><span className="text-muted-foreground"> · {chosen.map((c) => c.name).join(' + ')}</span></> : <span className="text-muted-foreground">{t('Select a plan to continue.')}</span>}
          </div>
          <div className="flex items-center gap-3">
            {chosen.length > 0 && <div className="text-right"><small className="block text-[10px] text-muted-foreground">{t('Total')}</small><b className="font-display text-xl">{money(total)}</b></div>}
            <Btn disabled={!chosen.length} onClick={() => setStep(2)}>{t('Continue')}</Btn>
          </div>
        </div>
        <p className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl bg-[#f6f1fb] px-3 py-2 text-xs text-[#6b6380] sm:flex-nowrap">
          <span className="flex items-center gap-2.5"><CuteBulb /><span>{t('Put a Premium plan and Mastery on the same child to get Premium Plus, which unlocks everything.')}</span></span>
          <a href="/pricing#compare" onClick={() => app.open(null)} className="shrink-0 whitespace-nowrap text-xs font-semibold text-[#d6336c] underline underline-offset-4">{t('Compare all plans')}</a>
        </p>
      </>
    )

  if (!chosen.length) return null

  if (step === 2)
    return (
      <>
        {stepper}
        <DlgHead title={t('Review and pay')} sub={t('Plans don’t renew automatically. We’ll remind you 3 days before each one ends.')} />
        <ul className="mb-4 divide-y divide-border rounded-2xl bg-[#ffffff] px-4 text-sm">
          {chosen.map((p) => (
            <li key={p.name} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1"><b className="block">{p.name}</b><span className="text-xs text-muted-foreground">{p.type} {t('unlock')} · {monthsOf(p.months)}</span></div>
              <b>{money(p.price)}</b>
              <button type="button" aria-label={`${t('Remove')} ${p.name}`} onClick={() => { setSel([]); setStep(1) }} className="text-xs font-semibold text-muted-foreground underline underline-offset-2 hover:text-foreground">{t('Remove')}</button>
            </li>
          ))}
          <li className="flex items-center justify-between py-3"><span className="text-xs text-muted-foreground">{t('Total')} · {planWord(chosen.length)}</span><b className="font-display text-xl">{money(total)}</b></li>
        </ul>
        <Note><Emo e="👧" /> {t(many ? 'After paying, you’ll pick which child gets each plan, or add a new child.' : 'After paying, you’ll pick which child gets this plan, or add a new child.')}</Note>
        <div className="mb-5 flex items-center gap-3 rounded-2xl p-4 ring-1 ring-border">
          <span className="relative grid size-16 shrink-0 -rotate-3 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#ff765f] to-[#f8608f] text-lg font-extrabold tracking-wide text-white shadow-[0_6px_14px_-4px_rgba(248, 96, 143, .6)] ring-2 ring-white">AYA<span className="absolute -right-2 -top-2 text-lg" aria-hidden="true"><Emo e="✨" /></span><span className="absolute -bottom-2 -left-1.5 text-sm" aria-hidden="true"><Emo e="💖" /></span></span>
          <div className="text-sm"><b className="block">{t('Pay online with AYA Pay')}</b><span className="text-xs text-muted-foreground">{t('You’ll confirm the payment on the secure AYA Pay page.')}</span></div>
          <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#e2f6ec] to-[#d6f0ff] py-1 pl-1 pr-3 text-xs font-semibold text-[#1d7a55] ring-1 ring-white"><span className="grid size-6 place-items-center rounded-full bg-white shadow-sm" aria-hidden="true"><svg viewBox="0 0 24 24" className="size-4"><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="#79bf8b" strokeWidth="2.4" strokeLinecap="round"/><rect x="5" y="10.5" width="14" height="10" rx="4" fill="#ff9db8"/><circle cx="10" cy="15" r="1" fill="#fff"/><circle cx="14" cy="15" r="1" fill="#fff"/><path d="M10.6 17.2c.8.6 1.8.6 2.8 0" fill="none" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/></svg></span>Secure</span>
        </div>
        <div className="flex justify-end gap-3">
          <Btn variant="ghost" onClick={() => setStep(1)}>{t('Back to plans')}</Btn>
          <Btn variant="aya" onClick={() => { setRef('JOY' + Date.now().toString().slice(-8)); setStep(3) }}>{t('Pay')} {money(total)} {t('with AYA Pay')}</Btn>
        </div>
      </>
    )

  if (step === 3)
    return (
      <div role="group" aria-label={t('AYA Pay checkout (demo)')}>
        <div className="mb-4 mr-11 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#ff765f] to-[#f8608f] px-4 py-3 text-white">
          <span className="rounded-lg bg-white px-2 py-0.5 text-xs font-extrabold text-[#e8332a]">AYA</span><b>AYA Pay</b><span className="ml-auto text-xs opacity-90">{t('Secure checkout')} · Demo</span>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-3 text-sm">
          <div><small className="block text-xs text-muted-foreground">{t('Merchant')}</small><b>Joy</b></div>
          <div><small className="block text-xs text-muted-foreground">{t('Order no.')}</small><b>{ref}</b></div>
          <div className="text-right"><small className="block text-xs text-muted-foreground">{t('Amount')}</small><b>{money(total)}</b></div>
        </div>
        <div className="mb-4 flex gap-1 rounded-full bg-[#f6f1fb] p-1" role="tablist">
          {([['qr', t('Scan QR')], ['phone', t('AYA Pay phone number')]] as const).map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={ayaTab === k} disabled={waiting} onClick={() => setAyaTab(k)} className={cn('h-9 flex-1 rounded-full text-sm font-semibold', ayaTab === k ? 'bg-white shadow-sm' : 'text-muted-foreground')}>{l}</button>)}
        </div>
        {waiting ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center"><span className="size-8 animate-spin rounded-full border-4 border-[#eee] border-t-[#e8332a]" aria-hidden="true" /><b>{t('Waiting for AYA Pay…')}</b><p className="text-sm text-muted-foreground">{t('Approve the payment in your AYA Pay app.')}</p></div>
        ) : ayaTab === 'qr' ? (
          <div className="flex flex-col items-center gap-3 py-2"><div className="rounded-[1.75rem] bg-white p-3 shadow-[0_14px_30px_-14px_rgba(240, 72, 138, 0.55)] ring-[6px] ring-[#ffe6ee]"><QrCanvas seed={ref} size={200} cute /></div><p className="text-center text-sm text-muted-foreground">{t('Open the AYA Pay app, scan this code, then approve the payment.')}</p></div>
        ) : (
          <><Field label={t('AYA Pay phone number')} prefix="+95" error={phoneErr ? t('Enter the phone number linked to your AYA Pay account.') : null}>{(id) => <input id={id} type="tel" inputMode="tel" placeholder="9 123 456 789" value={phone} onChange={(e) => { setPhone(e.target.value); setPhoneErr(false) }} className={inputCls} />}</Field><p className="mb-2 text-sm text-muted-foreground">{t('We’ll send a payment request to your AYA Pay app.')}</p></>
        )}
        <div className="mt-4 flex justify-end gap-3">
          <Btn variant="ghost" disabled={waiting} onClick={() => { setStep(2); app.toast(t('Payment cancelled. You weren’t charged.')) }}>{t('Cancel payment')}</Btn>
          <Btn variant="aya" disabled={waiting} onClick={() => { if (ayaTab === 'phone' && phone.replace(/\D/g, '').length < 7) return setPhoneErr(true); setWaiting(true) }}>{ayaTab === 'qr' ? t('I’ve approved it') : t('Send payment request')}</Btn>
        </div>
      </div>
    )

  if (step === 4)
    return (
      <>
        {stepper}
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-[#e2f6ec] to-[#e3f1ff] p-3.5 text-sm ring-1 ring-[#e2f6ec]"><span aria-hidden="true" className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-white shadow-[0_6px_14px_-8px_rgba(55, 150, 119, 0.6)] ring-1 ring-[#e2f6ec]"><svg viewBox="0 0 40 40" className="size-9"><rect x="4" y="9" width="28" height="20" rx="5" fill="#ffd0e2" stroke="#ff9db8" strokeWidth="2" /><rect x="4" y="14" width="28" height="5" fill="#ff9db8" /><rect x="8" y="23" width="9" height="3" rx="1.5" fill="#fff" /><circle cx="30" cy="28" r="8" fill="#37c677" stroke="#fff" strokeWidth="2.5" /><path d="m26.5 28.2 2.4 2.4 4.2-4.6" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /><path d="M33 4v5M30.5 6.5h5" stroke="#ffb300" strokeWidth="2" strokeLinecap="round" /></svg></span><div className="min-w-0"><b className="block">Payment complete</b><span className="block break-words text-xs text-[#1d7a55]">{bought.map((b) => b.name).join(' + ')} · {money(total)} · AYA Pay · {ref}</span></div></div>
        <DlgHead title={many ? t('Who are these plans for?') : `${t('Who is')} ${bought[0]?.name} ${t('for?')}`} sub={t('Pick a child, add a new one, or assign it later from Plans.')} />
        <div className="mb-4 flex flex-col gap-3">
          {bought.map((b) => (
            <fieldset key={b.id} className="rounded-xl p-3.5 ring-1 ring-border">
              <legend className="px-1 text-sm font-bold">{b.name}</legend>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-x-4">
                {app.s.children.map((c) => <PickRow key={c.id} type="radio" name={`bc-${b.id}`} value={c.id} checked={assign[b.id] === c.id} onChange={() => setAssign((a) => ({ ...a, [b.id]: c.id }))} art={<ChildThumb c={c} className="size-7" />} title={c.name} sub={`${t('Now:')} ${unlockOf(app.s, c)}`} />)}
                <PickRow type="radio" name={`bc-${b.id}`} value="" checked={!assign[b.id]} onChange={() => setAssign((a) => ({ ...a, [b.id]: null }))} title={t('Assign later')} sub={t('Pick later in Plans')} />
                <button type="button" onClick={() => setAddingFor(b.id)} className="group flex min-h-[2.5rem] w-full items-center justify-center gap-2 rounded-xl bg-[#f6f1fb] text-[13px] font-bold text-[#c2307a] ring-1 ring-dashed ring-[#ff9db8] transition hover:bg-[#ffe7ef] hover:ring-joy-pink"><span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-gradient-to-br from-[#ff7fa5] to-[#ff7a45] text-white shadow-[0_4px_10px_-4px_rgba(240, 72, 138, 0.7)] transition group-hover:scale-110"><svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M8 2.5v11M2.5 8h11" /></svg></span>{t('Add a new child')}</button>
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
          }}>{t('Continue')}</Btn>
        </div>
      </>
    )

  return (
    <>
<div className="relative min-h-[3.25rem] pr-12 sm:pr-14">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/butterfly-purple.webp" alt="" className="pointer-events-none absolute -top-2 right-6 size-14 object-contain drop-shadow-[0_6px_10px_rgba(142, 92, 240, 0.25)] sm:right-8 sm:size-16" />
        <DlgHead title={many ? t('Your plans are ready') : (() => { const c0 = assign[bought[0]?.id] ? app.s.children.find((x) => x.id === assign[bought[0].id]) : null; return c0 ? `${bought[0].name} ${t('is ready for')} ${c0.name}` : t('Your plan is ready') })()} />
      </div>
      <div className="mb-3 rounded-2xl bg-gradient-to-br from-[#e2f6ec] via-[#d6f0ff] to-[#e3f1ff] px-3.5 py-2.5 ring-1 ring-[#e2f6ec]">
        <ul className="space-y-1.5">
          {bought.map((b) => {
            const c = assign[b.id] ? app.s.children.find((x) => x.id === assign[b.id]) : null
            return (
              <li key={b.id} className="flex items-center justify-between gap-3 text-sm">
                <b className="font-display text-sm">{b.name}</b>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-semibold text-[#23915a] ring-1 ring-[#e2f6ec]">{c ? `${t('For')} ${c.name}` : t('Not assigned yet')}</span>
              </li>
            )
          })}
        </ul>
        <dl className="mt-2 grid grid-cols-3 gap-2 border-t border-dashed border-[#e2f6ec] pt-2 text-center">
          <div><dt className="text-[10px] text-muted-foreground">{t('Paid via')}</dt><dd className="mt-0.5 flex justify-center [&>*]:scale-90"><ChannelBadge ch="AYA" /></dd></div>
          <div className="min-w-0"><dt className="text-[10px] text-muted-foreground">{t('Transaction')}</dt><dd className="mt-0.5 truncate text-[11px] font-bold">{ref}</dd></div>
          <div><dt className="text-[10px] text-muted-foreground">{t('Total paid')}</dt><dd className="font-display text-base font-extrabold leading-tight text-[#23915a]">{money(total)}</dd></div>
        </dl>
      </div>
      <p className="mb-4 text-center text-sm text-muted-foreground">{bought.some((b) => assign[b.id]) ? <>{t('New activities are unlocked.')} <Emo e="✨" /></> : t('Assign it to a child anytime from Plans.')}</p>
      <AppActivationGuide />
      <div className="flex items-center justify-end gap-2">
        <Btn variant="ghost" onClick={() => app.open(null)}>{t('Close')}</Btn>
        <Btn onClick={() => { app.open(null); app.go({ name: 'plans' }) }}>{t('Go to Plans')}</Btn>
      </div>
    </>
  )
}
