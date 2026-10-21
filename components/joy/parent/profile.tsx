'use client'

import { useState } from 'react'
import { Btn, Card, Field, Pagination, Seg, Switch, inputCls } from './ui'
import { fmtDate, money } from './data'
import type { Channel } from './data'
import type { App, Section } from './types'
import { AvatarBubble, QrPanel } from './dialogs'
import { ChildThumb } from './plans'
import { CuteIcon } from './icons'
import { CHANNELS, ChannelBadge } from './plans'
import { cn } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import { CalendarHeart, Crown, FileText, Heart, Pencil, TriangleAlert, UserRound, Users } from '@/components/joy/cute-icons'
import { isExpired } from './data'

export const SECTIONS: { id: Section; icon: string; label: string; title: string; sub: string }[] = [
  { id: 'account', icon: '👤', label: 'Account details', title: 'Account details', sub: 'Your personal information.' },
  { id: 'payments', icon: '💳', label: 'Payments', title: 'Payments', sub: 'Everything you’ve paid for, and how you paid.' },
  { id: 'prefs', icon: '🔔', label: 'Notifications', title: 'Notifications', sub: 'Choose what Joy tells you about, and where.' },
  { id: 'security', icon: '🔒', label: 'Login & security', title: 'Login & security', sub: 'How you log in, and account controls.' },
]

function PrefRow({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/70 py-4 first:pt-0 last:border-0 last:pb-0">
      <div className="min-w-0 max-w-md"><b className="block text-sm">{title}</b><p className="mt-0.5 text-sm text-muted-foreground">{sub}</p></div>
      {children}
    </div>
  )
}

function InfoRow({ app, k, label, value, prefix, login, type, ph, required }: { app: App; k: 'name' | 'phone' | 'email'; label: string; value: string; prefix?: string; login?: boolean; type: string; ph: string; required?: boolean }) {
  const [editing, setEditing] = useState(false)
  const [v, setV] = useState(value)
  const [err, setErr] = useState<string | null>(null)
  const msg = { name: 'Enter your full name.', phone: 'Enter a valid phone number.', email: 'Enter a valid email address.' }[k]
  const tag = login ? <span className="ml-2 rounded-full bg-[#e3f1ff] px-2 py-0.5 text-[10px] font-bold text-[#0a86e8]">Used to log in</span> : null
  const save = (e: React.FormEvent) => {
    e.preventDefault()
    const t = v.trim()
    const ok = k === 'name' ? t.length > 1 : k === 'phone' ? (t ? t.replace(/\D/g, '').length >= 7 : !login) : t ? /^\S+@\S+\.\S+$/.test(t) : !login
    if (!ok) return setErr(msg)
    app.setS((s) => ({ ...s, parent: { ...s.parent, [k]: t } }))
    setEditing(false); setErr(null)
    app.toast(`${{ name: 'Name', phone: 'Phone', email: 'Email' }[k]} saved.`)
  }
  if (editing)
    return (
      <li className="py-4">
        <form onSubmit={save} noValidate onKeyDown={(e) => { if (e.key === 'Escape') { e.stopPropagation(); setEditing(false) } }}>
          <Field label={<>{label}{tag}</>} prefix={prefix} error={err}>{(id) => <input id={id} autoFocus type={type} value={v} placeholder={ph} onChange={(e) => setV(e.target.value)} className={inputCls} />}</Field>
          {login ? <p className="-mt-2 mb-3 text-xs text-muted-foreground">You log in with this, so it can’t be empty.</p> : null}
          <div className="flex items-center justify-end gap-2">
            {!required && !login && value ? <button type="button" className="mr-auto text-sm font-semibold text-[#e5484d] hover:underline" onClick={() => { app.setS((s) => ({ ...s, parent: { ...s.parent, [k]: '' } })); setEditing(false); app.toast(`${k === 'phone' ? 'Phone' : 'Email'} removed.`) }}>Remove</button> : null}
            <Btn small variant="ghost" onClick={() => { setEditing(false); setErr(null) }}>Cancel</Btn>
            <Btn small type="submit">Save</Btn>
          </div>
        </form>
      </li>
    )
  const shown = value ? (prefix ? prefix + ' ' : '') + value : ''
  return (
    <li className="flex items-center justify-between gap-3 py-4">
      <div className="min-w-0"><span className="block text-xs font-semibold text-muted-foreground">{label}{tag}</span><span className={cn('block truncate font-semibold', !shown && 'font-normal text-muted-foreground')}>{shown || 'Not added yet'}</span></div>
      <button type="button" onClick={() => { setV(value); setEditing(true) }} aria-label={`${shown ? 'Edit' : 'Add'} ${label.toLowerCase()}`} className="shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold text-joy-pink ring-1 ring-border hover:bg-[#f6f1fb]">{shown ? 'Edit' : '+ Add'}</button>
    </li>
  )
}

function Payments({ app }: { app: App }) {
  const t = useT()
  const [f, setF] = useState<'all' | Channel>('all')
  const { payments } = app.s
  const list = payments.filter((p) => f === 'all' || p.channel === f)
  const PER = 5
  const [pg, setPg] = useState(1)
  const pages = Math.max(1, Math.ceil(list.length / PER))
  const cur = Math.min(pg, pages)
  const shown = list.slice((cur - 1) * PER, cur * PER)
  const counts = (k: Channel) => payments.filter((p) => p.channel === k).length
  const review = process.env.NEXT_PUBLIC_JOY_REVIEW === '1'
  return (
    <Card>
      {review ? (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-[#e6d6ff] bg-[#f6f1fb] px-3 py-2 text-xs text-[#6b6380]">
          <b className="text-[#5b3fc4]">Review view</b>
          <button type="button" aria-pressed={payments.length > 0} onClick={() => { location.hash = '#profile-payments' }} className={cn('rounded-full px-3 py-1 font-semibold ring-1', payments.length ? 'bg-[#5b3fc4] text-white ring-[#5b3fc4]' : 'bg-white ring-border')}>List with pagination</button>
          <button type="button" aria-pressed={payments.length === 0} onClick={() => { location.hash = '#profile-payments-empty' }} className={cn('rounded-full px-3 py-1 font-semibold ring-1', payments.length === 0 ? 'bg-[#5b3fc4] text-white ring-[#5b3fc4]' : 'bg-white ring-border')}>Empty state</button>
        </div>
      ) : null}
      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#ffffff] p-3">
        <CuteIcon name="payments" className="size-10 rounded-xl" />
        <p className="text-xs leading-relaxed text-muted-foreground">{t('Buy on the website with AYA Pay. Payments made in the Joy app or in person show here too.')}</p>
      </div>
      {payments.length ? (
      <div role="group" aria-label={t('Filter by payment channel')} className="mb-4 flex flex-wrap gap-2">
        {([['all', t('All'), payments.length], ...(Object.keys(CHANNELS) as Channel[]).map((k) => [k, CHANNELS[k].label, counts(k)])] as [string, string, number][]).map(([k, l, n]) => (
          <button key={k} type="button" aria-pressed={f === k} onClick={() => { setF(k as 'all' | Channel); setPg(1) }} className={cn('rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 transition', f === k ? 'bg-foreground text-background ring-foreground' : 'bg-white ring-border hover:ring-foreground/30')}>{l} <span className="opacity-60">{n}</span></button>
        ))}
      </div>
      ) : null}
      {list.length ? (
        <div role="table" aria-label="Payments" className="overflow-hidden rounded-2xl ring-1 ring-border">
          <div role="row" className="hidden grid-cols-[1fr_1.6fr_1fr_1.2fr_auto_5.5rem] gap-3 bg-[#ffffff] px-4 py-2.5 text-xs font-semibold text-muted-foreground md:grid">
            <span role="columnheader">{t('Date')}</span><span role="columnheader">{t('Plan')}</span><span role="columnheader">{t('Child')}</span><span role="columnheader">{t('Paid via')}</span><span role="columnheader" className="text-right">{t('Amount')}</span><span role="columnheader" className="text-right">{t('Invoice')}</span>
          </div>
          {shown.map((p) => (
            <div key={`${p.ref}-${p.item}`} role="row" onClick={() => app.open({ k: 'invoice', pay: p })} className="grid cursor-pointer gap-1 border-t border-border/70 px-4 py-3 text-sm transition hover:bg-[#f6f1fb] first:border-0 md:grid-cols-[1fr_1.6fr_1fr_1.2fr_auto_5.5rem] md:items-center md:gap-3">
              <span role="cell">{fmtDate(p.date)}</span>
              <span role="cell"><b className="block">{p.item}</b><small className="text-xs text-muted-foreground">{p.ref}</small></span>
              <span role="cell">{t(p.child)}</span>
              <span role="cell" className="flex flex-col items-start gap-0.5"><ChannelBadge ch={p.channel} /></span>
              <span role="cell" className="flex items-center gap-2 md:flex-col md:items-end md:gap-0.5"><b>{money(p.amount)}</b><span className="rounded-full bg-[#e2f6ec] px-2 py-0.5 text-[10px] font-bold text-[#2f8f3a]">{t(p.status)}</span></span>
              <span role="cell" className="md:text-right"><button type="button" aria-label={`View invoice for ${p.item}`} onClick={(e) => { e.stopPropagation(); app.open({ k: 'invoice', pay: p }) }} className="inline-flex h-8 items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ffe7ef] to-[#fff3d6] px-3 text-xs font-bold text-[#d6336c] ring-1 ring-[#ffd0e2] transition hover:-translate-y-0.5"><FileText className="size-3.5" />{t('Invoice')}</button></span>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-2 overflow-hidden rounded-[1.5rem] bg-gradient-to-b from-[#f6f1fb] via-[#f6f1fb] to-[#f6f1fb] px-6 pb-10 pt-8 text-center">
          <img src="/images/empty-receipt.webp" alt="" width={720} height={290} className="h-auto w-full max-w-[22rem] select-none" draggable={false} />
          <h3 className="mt-1 flex items-center gap-3 font-display text-2xl font-bold text-[#30235f]">
            <span aria-hidden="true" className="flex flex-col gap-1"><i className="block h-[3px] w-3 rotate-[-30deg] rounded-full bg-[#ffb300]" /><i className="block h-[3px] w-3 rotate-[30deg] rounded-full bg-[#ff7fa5]" /></span>
            {t('No payments yet')}
            <span aria-hidden="true" className="flex flex-col gap-1"><i className="block h-[3px] w-3 rotate-[30deg] rounded-full bg-[#ffb300]" /><i className="block h-[3px] w-3 rotate-[-30deg] rounded-full bg-[#ff7fa5]" /></span>
          </h3>
          <p className="max-w-sm text-sm leading-relaxed text-[#6b6380] sm:text-base">{payments.length ? t('No payments for this channel.') : t('When you buy a plan, your payments and invoices will show up here.')}</p>
        </div>
      )}
      <Pagination page={cur} pages={pages} onChange={setPg} label={t('Payments pages')} />
    </Card>
  )
}

export function ProfileView({ app, sec }: { app: App; sec: Section }) {
  const t = useT()
  const { parent, settings } = app.s
  const meta = SECTIONS.find((x) => x.id === sec)!
  const activePlans = app.s.plans.filter((p) => !isExpired(p)).length
  return (
    <div className="flex flex-col gap-6">
      {sec === 'account' ? (
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#e3f1ff] p-5 shadow-[0_18px_40px_-28px_rgba(123, 151, 255, 0.6)] ring-1 ring-white/80 sm:p-7">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/profile-bg.jpg" alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 size-full object-cover object-center" />
          <div className="relative flex flex-wrap items-center gap-5 sm:gap-6">
            <div className="relative">
              <AvatarBubble avatar={parent.avatar} name={parent.name} className="relative size-28 text-3xl shadow-[0_10px_24px_-10px_rgba(120, 90, 200, 0.6)] ring-[3px] ring-white sm:size-32" />
              <button type="button" onClick={() => app.open({ k: 'avatar' })} aria-label={t('Change profile photo')} className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-white text-[#8e5cf0] shadow-md ring-1 ring-[#e6d6ff] transition hover:scale-110"><Pencil className="size-4" /></button>
            </div>
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-[#8f72e6]">{t('Hello, parent')}<Crown className="size-4 fill-[#fbc23c] text-[#e3a500]" aria-hidden="true" /></p>
              <h1 className="mt-1 flex items-center gap-3 font-display text-3xl font-bold tracking-tight text-[#30235f] sm:text-4xl"><span className="truncate">{parent.name}</span><Heart className="size-6 shrink-0 text-[#ff7fa5]" aria-hidden="true" /></h1>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/85 px-3.5 py-1.5 text-[#785ac8] shadow-sm ring-1 ring-white"><UserRound className="size-3.5" />{t('Parent account')}</span>
                <span className="rounded-full bg-white/85 px-3.5 py-1.5 text-[#4a3a63] shadow-sm ring-1 ring-white">{t('Signed up with')} {parent.method}</span>
              </div>
              {app.s.children.length ? (
                <div className="mt-3 flex items-center gap-2">
                  <span className="flex -space-x-2.5">
                    {app.s.children.slice(0, 5).map((c) => (
                      <span key={c.id} title={c.name} className="grid size-9 place-items-center overflow-hidden rounded-full ring-2 ring-white" style={{ background: `${c.color}2e` }}><ChildThumb c={c} className="size-8" /></span>
                    ))}
                  </span>
                  <span className="text-xs font-semibold text-[#6b6380]">{app.s.children.map((c) => c.name).slice(0, 3).join(', ')}{app.s.children.length > 3 ? ` +${app.s.children.length - 3}` : ''}</span>
                </div>
              ) : null}
            </div>
            <div className="grid w-full grid-cols-2 gap-3 sm:w-auto">
              <button type="button" onClick={() => app.go({ name: 'children' })} className="group rounded-[1.5rem] bg-white/90 px-6 py-3.5 text-center shadow-[0_8px_20px_-14px_rgba(31, 169, 232, 0.7)] ring-1 ring-[#d6f0ff] transition hover:-translate-y-0.5 hover:bg-white"><span className="mx-auto grid size-8 place-items-center rounded-xl bg-[#e3f1ff] text-[#0a86e8]" aria-hidden="true"><Users className="size-4" /></span><b className="block font-display text-3xl font-semibold text-[#0a86e8]">{app.s.children.length}</b><span className="text-xs font-semibold text-muted-foreground">Children</span></button>
              <button type="button" onClick={() => app.go({ name: 'plans' })} className="group rounded-[1.5rem] bg-white/90 px-6 py-3.5 text-center shadow-[0_8px_20px_-14px_rgba(88, 184, 0, 0.7)] ring-1 ring-[#ddf1bd] transition hover:-translate-y-0.5 hover:bg-white"><span className="mx-auto grid size-8 place-items-center rounded-xl bg-[#eaf7e1] text-[#3f8a00]" aria-hidden="true"><CalendarHeart className="size-4" /></span><b className="block font-display text-3xl font-semibold text-[#3f8a00]">{activePlans}</b><span className="text-xs font-semibold text-muted-foreground">Active plans</span></button>
            </div>
          </div>
        </section>
      ) : (
        <div>
          <h1 className="font-display text-3xl font-medium sm:text-4xl">{t(meta.title)}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t(meta.sub)}</p>
        </div>
      )}

      {sec === 'account' ? (
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <Card title={t('Personal information')}>
            <ul className="divide-y divide-border/70">
              <InfoRow app={app} k="name" label="Full name" value={parent.name} type="text" ph="Your full name" required />
              <InfoRow app={app} k="phone" label="Phone" value={parent.phone} prefix="+95" login={parent.method === 'Phone'} type="tel" ph="9 123 456 789" />
              <InfoRow app={app} k="email" label="Email" value={parent.email} login={parent.method === 'Email'} type="email" ph="you@example.com" />
            </ul>
          </Card>
          <div className="min-w-0"><QrPanel app={app} size={150} compact /></div>
        </div>
      ) : sec === 'payments' ? (
        <Payments app={app} />
      ) : sec === 'prefs' ? (
        <Card>
          <PrefRow title={t('Plan reminders')} sub={t('A reminder 3 days before a plan ends.')}>
            <Switch label="Plan reminders" on={settings.notif} onChange={(v) => { app.setS((s) => ({ ...s, settings: { ...s.settings, notif: v } })); app.toast(v ? t('Notifications on. We’ll remind you 3 days before a plan ends.') : t('Notifications off.')) }} />
          </PrefRow>
          <PrefRow title={t('Child updates')} sub={t('A weekly summary of progress and the feeling log.')}>
            <Switch label="Child updates" on={settings.childUpdates ?? true} onChange={(v) => app.setS((s) => ({ ...s, settings: { ...s.settings, childUpdates: v } }))} />
          </PrefRow>
          <PrefRow title={t('New activities & tips')} sub={t('News and new content from Joy.')}>
            <Switch label="New activities & tips" on={settings.tips ?? false} onChange={(v) => app.setS((s) => ({ ...s, settings: { ...s.settings, tips: v } }))} />
          </PrefRow>
          <PrefRow title={t('Send notifications via')} sub={t('Where Joy sends your notifications.')}>
            <Seg label={t('Send notifications via')} value={settings.channel ?? 'Telegram'} onChange={(c) => { app.setS((s) => ({ ...s, settings: { ...s.settings, channel: c } })); app.toast(c === 'Telegram' ? t('We’ll send notifications to your Telegram.') : t('We’ll send notifications to your email.')) }} options={(['Telegram', 'Email'] as const).map((c) => [c, c] as ['Telegram' | 'Email', string])} />
          </PrefRow>
        </Card>
      ) : (
        <>
          <Card>
            <PrefRow title={t('Sign-up method')} sub={t('You log in with this method.')}><span className="rounded-full bg-[#f6f1fb] px-3.5 py-1.5 text-sm font-bold">{parent.method}</span></PrefRow>
            <PrefRow title={t('Password')} sub={t('Change the password for your parent account.')}><Btn small variant="blueSoft" onClick={() => app.open({ k: 'pw' })}>{t('Change password')}</Btn></PrefRow>
            <PrefRow title={t('Sign out')} sub={t('Log out of Joy on this browser.')}><Btn small variant="orangeSoft" onClick={() => app.logout()}>↪ {t('Sign out')}</Btn></PrefRow>
          </Card>
          <Card title={<span className="inline-flex items-center gap-2.5"><span className="grid size-9 place-items-center rounded-2xl bg-gradient-to-br from-[#ffe6ee] to-[#ffd0e2] text-[#e5446d] shadow-[0_6px_14px_-8px_rgba(229, 68, 109, 0.8)]"><TriangleAlert className="size-5" aria-hidden="true" /></span>{t('Danger zone')}</span>} className="bg-gradient-to-br from-[#f6f1fb] via-[#ffe7ef] to-[#ffe6ee] ring-1 ring-[#ffd3d3]">
            <PrefRow title={t('Delete account')} sub={t('Permanently delete your account and all associated data.')}><Btn small variant="danger" onClick={() => app.open({ k: 'delAcc' })}>{t('Delete account')}</Btn></PrefRow>
          </Card>
        </>
      )}
      <p className="text-center text-xs text-muted-foreground">Version 1.1.0 · © 2026 Joy. {t('All rights reserved.')}</p>
    </div>
  )
}
