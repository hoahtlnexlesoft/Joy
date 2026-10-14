'use client'

import { useEffect, useRef, useState } from 'react'
import { Camera, Download, FileText, RefreshCw, Share2, TriangleAlert } from '@/components/joy/cute-icons'
import { Btn, DlgHead, Field, Modal, Note, inputCls } from './ui'
import { NEEDS, COLORS, initials, fmtDate, money } from './data'
import type { Child, Gender, Payment } from './data'
import type { App } from './types'
import { cn } from '@/lib/utils'
import { Switch } from './ui'

export function ChildForm({ app, child, onSaved, onBack }: { app: App; child?: Child; onSaved?: (c: Child) => void; onBack?: () => void }) {
  const edit = !!child
  const [name, setName] = useState(child?.name ?? '')
  const [dob, setDob] = useState(child?.dob ?? '')
  const [gender, setGender] = useState<string>(child?.gender ?? '')
  const [needsOn, setNeedsOn] = useState(!!child?.needs.length)
  const [needs, setNeeds] = useState<string[]>(child?.needs ?? [])
  const [tried, setTried] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const eName = tried && !name.trim() ? 'Enter your child’s name.' : null
  const eDob = tried && (!dob || dob > today) ? 'Pick your child’s date of birth.' : null
  const eGen = tried && !gender ? 'Pick a gender.' : null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setTried(true)
    if (!name.trim() || !dob || dob > today || !gender) return
    const n = name.trim(), nd = needsOn ? needs : []
    if (child) {
      app.setS((s) => ({ ...s, children: s.children.map((c) => (c.id === child.id ? { ...c, name: n, dob, gender: gender as Gender, needs: nd } : c)) }))
      app.open(null)
      app.toast(`${n}’s details saved.`)
      return
    }
    const c: Child = { id: app.newId('c'), name: n, dob, gender: gender as Gender, needs: nd, element: null, animal: null, nature: null, arch: null, stage: 'Alpha', color: COLORS[app.s.children.length % COLORS.length] }
    app.setS((s) => ({ ...s, children: [...s.children, c] }))
    if (onSaved) { app.toast(`${n} added.`); onSaved(c); return }
    app.open(null)
    app.go({ name: 'children' })
    app.toast(`${n} added. Pick a plan to unlock more for ${n}.`)
  }

  return (
    <>
      <DlgHead icon="🧒" title={edit ? `Edit ${child!.name}` : 'Add a child'} sub={edit ? 'Update your child’s details.' : 'Tell Joy a little about your child.'} />
      <form onSubmit={submit} noValidate>
        <Field label="Child name *" error={eName}>{(id) => <input id={id} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" className={inputCls} />}</Field>
        <div className="grid gap-x-3 sm:grid-cols-2">
          <Field label="Date of birth *" error={eDob}>{(id) => <input id={id} type="date" max={today} value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />}</Field>
          <Field label="Gender *" error={eGen}>{(id) => (
            <select id={id} value={gender} onChange={(e) => setGender(e.target.value)} className={cn(inputCls, 'bg-transparent')}>
              <option value="">Select</option><option>Boy</option><option>Girl</option>
            </select>
          )}</Field>
        </div>
        <div className="mb-5 rounded-2xl bg-[#faf8fc] p-4">
          <div className="flex items-center justify-between gap-4 text-sm font-semibold"><span>Tell us a bit more about your child’s unique needs</span><Switch on={needsOn} onChange={setNeedsOn} label="Add unique needs" /></div>
          {needsOn ? (
            <div className="mt-3 flex flex-col gap-2">
              {NEEDS.map((n) => (
                <label key={n} className="flex items-center gap-3 text-sm">
                  <input type="checkbox" className="size-4 accent-[#f0449a]" checked={needs.includes(n)} onChange={(e) => setNeeds((x) => (e.target.checked ? [...x, n] : x.filter((i) => i !== n)))} />{n}
                </label>
              ))}
              <p className="mt-1 text-xs text-muted-foreground">Only you can see and change these. Setting them unlocks Calm Senses activities with a Premium or Premium Plus plan.</p>
            </div>
          ) : null}
        </div>
        <div className="flex gap-3">
          {onBack ? <Btn variant="ghost" full onClick={onBack}>Back</Btn> : null}
          <Btn type="submit" full>{edit ? 'Save changes' : onSaved ? 'Save and continue' : 'Save'}</Btn>
        </div>
      </form>
    </>
  )
}

export function DeleteChild({ app, child }: { app: App; child: Child }) {
  return (
    <>
      <DlgHead icon="🗑️" title={`Delete ${child.name}?`} sub={`This removes ${child.name}’s profile, feeling log and activity history. You can’t undo this.`} />
      <div className="flex justify-end gap-3">
        <Btn variant="ghost" onClick={() => app.open(null)}>Keep {child.name}</Btn>
        <Btn variant="danger" onClick={() => {
          app.setS((s) => ({ ...s, children: s.children.filter((k) => k.id !== child.id), plans: s.plans.map((p) => ({ ...p, children: p.children.filter((i) => i !== child.id) })) }))
          app.open(null); app.go({ name: 'children' }); app.toast(`${child.name} deleted.`)
        }}>Delete {child.name}</Btn>
      </div>
    </>
  )
}

export function DeleteAccount({ app }: { app: App }) {
  const [v, setV] = useState('')
  const [tried, setTried] = useState(false)
  return (
    <>
      <DlgHead icon={<TriangleAlert className="size-7 text-[#e5446d]" aria-hidden="true" />} title="Delete your account?" sub="This permanently deletes your parent account, your children’s profiles and all their data. You can’t undo this." />
      <Field label="Type DELETE to confirm" error={tried && v !== 'DELETE' ? 'Type DELETE in capital letters.' : null}>{(id) => <input id={id} value={v} onChange={(e) => setV(e.target.value)} autoComplete="off" className={inputCls} />}</Field>
      <div className="flex justify-end gap-3">
        <Btn variant="ghost" onClick={() => app.open(null)}>Cancel</Btn>
        <Btn variant="danger" onClick={() => { setTried(true); if (v === 'DELETE') { app.open(null); app.logout() } }}>Delete account</Btn>
      </div>
    </>
  )
}

export function PasswordDialog({ app }: { app: App }) {
  const [o, setO] = useState(''), [n, setN] = useState(''), [c, setC] = useState('')
  const [tried, setTried] = useState(false)
  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setTried(true)
    if (o && n.length >= 8 && c === n) { app.open(null); app.toast('Password changed.') }
  }
  return (
    <>
      <DlgHead icon="🔒" title="Change password" sub="Use at least 8 characters." />
      <form onSubmit={submit} noValidate>
        <Field label="Current password" error={tried && !o ? 'Enter your current password.' : null}>{(id) => <input id={id} type="password" value={o} onChange={(e) => setO(e.target.value)} autoComplete="current-password" className={inputCls} />}</Field>
        <Field label="New password" error={tried && n.length < 8 ? 'Use at least 8 characters.' : null}>{(id) => <input id={id} type="password" value={n} onChange={(e) => setN(e.target.value)} autoComplete="new-password" className={inputCls} />}</Field>
        <Field label="Confirm new password" error={tried && (c !== n || !c) ? 'Passwords don’t match.' : null}>{(id) => <input id={id} type="password" value={c} onChange={(e) => setC(e.target.value)} autoComplete="new-password" className={inputCls} />}</Field>
        <Btn type="submit" full>Save password</Btn>
      </form>
    </>
  )
}

const AV_PRESETS: [string, string][] = [['/images/animals/lion.webp', '#FFE3C9'], ['/images/animals/dolphin.webp', '#D6F1FF'], ['/images/animals/panda.webp', '#EDF9E6'], ['/images/animals/owl.webp', '#F3EEFF'], ['/images/animals/bunny.webp', '#FFE6F1'], ['/images/animals/butterfly.webp', '#E7F7FA'], ['/images/animals/elephant.webp', '#EEF1F7'], ['/images/animals/ladybug.webp', '#FFF1CC']]
export function AvatarDialog({ app }: { app: App }) {
  const [pick, setPick] = useState(app.s.parent.avatar ?? { type: 'initials' as const })
  const [err, setErr] = useState('')
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    if (!/^image\/(png|jpeg|webp)$/.test(f.type)) return setErr('Choose a JPG, PNG or WebP image.')
    if (f.size > 5 * 1024 * 1024) return setErr('This photo is over 5 MB. Choose a smaller one.')
    setErr('')
    const rd = new FileReader()
    rd.onload = () => setPick({ type: 'photo', value: String(rd.result) })
    rd.readAsDataURL(f)
  }
  return (
    <>
      <DlgHead title="Change profile photo" sub="Upload a photo, or pick a Joy friend." />
      <div className="mb-4 flex justify-center"><AvatarBubble avatar={pick} name={app.s.parent.name} className="size-48 text-5xl" /></div>
      <label className="mb-1 flex h-14 w-full cursor-pointer items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#f9709a] to-[#ee5a8a] text-base font-bold text-white shadow-[0_12px_22px_-12px_rgba(238,90,138,0.85)] transition hover:-translate-y-0.5">
        <span className="grid size-9 place-items-center rounded-full bg-white/25"><Camera className="size-5" /></span>Upload a photo<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={onFile} />
      </label>
      {err ? <p className="mt-1 text-xs font-medium text-[#e5484d]">{err}</p> : null}
      <p className="my-3 text-center text-xs text-muted-foreground">or choose a Joy friend</p>
      <div className="mb-5 grid grid-cols-5 gap-2">
        {AV_PRESETS.map(([e, bg]) => (
          <button key={e} type="button" aria-label="Use this Joy friend as avatar" aria-pressed={pick.type === 'emoji' && pick.value === e} onClick={() => setPick({ type: 'emoji', value: e, bg })} className="grid aspect-square place-items-center rounded-[1.4rem] ring-2 ring-transparent transition hover:-translate-y-0.5 aria-pressed:ring-joy-pink aria-pressed:ring-4" style={{ background: bg }}>{/\.(png|webp)$/.test(e) ? <img src={e} alt="" className="size-[82%] object-contain" /> : e}</button>
        ))}
        <button type="button" aria-label="Use the default avatar" aria-pressed={pick.type === 'initials'} onClick={() => setPick({ type: 'initials' })} className="grid aspect-square place-items-center rounded-[1.4rem] bg-[#f4f1f8] ring-2 ring-transparent transition hover:-translate-y-0.5 aria-pressed:ring-joy-pink aria-pressed:ring-4"><img src="/images/parent-avatar.webp" alt="" className="size-[82%] rounded-full object-cover" /></button>
      </div>
      <div className="flex justify-end gap-3">
        <Btn variant="ghost" onClick={() => app.open(null)}>Cancel</Btn>
        <Btn onClick={() => { app.setS((s) => ({ ...s, parent: { ...s.parent, avatar: pick } })); app.open(null); app.toast('Profile photo updated.') }}>Save</Btn>
      </div>
    </>
  )
}

export function AvatarBubble({ avatar, name, className }: { avatar?: import('./data').Avatar; name: string; className?: string }) {
  const a = avatar ?? { type: 'initials' as const }
  return (
    <span className={cn('inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-bold text-white', a.type === 'emoji' && 'bg-gradient-joy', className)} style={a.type === 'emoji' ? { background: a.bg } : undefined} aria-hidden="true">
      {a.type === 'photo' ? <img src={a.value} alt="" className="size-full object-cover" /> : a.type === 'emoji' ? (/\.(png|webp)$/.test(a.value) ? <img src={a.value} alt="" className="size-[78%] object-contain" /> : a.value) : <img src="/images/parent-avatar.webp" alt="" className="size-full object-cover" />}
    </span>
  )
}

export function QrCanvas({ seed, size = 232, cute = false, canvasRef }: { seed: string; size?: number; cute?: boolean; canvasRef?: React.MutableRefObject<HTMLCanvasElement | null> }) {
  return (
    <canvas
      width={232}
      height={232}
      style={{ width: size, maxWidth: '100%', height: 'auto', aspectRatio: '1 / 1', display: 'block' }}
      role="img"
      aria-label="QR code"
      ref={(cv) => {
        if (!cv) return
        if (canvasRef) canvasRef.current = cv
        const g = cv.getContext('2d')
        if (!g) return
        const N = 29, s = 8
        let h = 0
        for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0
        const rnd = () => ((h = (h * 1103515245 + 12345) >>> 0) / 4294967296)
        const ink = cute ? '#52428a' : '#27253F'
        g.fillStyle = '#fff'; g.fillRect(0, 0, 232, 232); g.fillStyle = ink
        const rr = (x: number, y: number, w: number, hh: number, r: number) => { g.beginPath(); g.roundRect(x, y, w, hh, r); g.fill() }
        const finder = (x: number, y: number) => {
          if (!cute) { g.fillRect(x * s, y * s, 7 * s, 7 * s); g.fillStyle = '#fff'; g.fillRect((x + 1) * s, (y + 1) * s, 5 * s, 5 * s); g.fillStyle = ink; g.fillRect((x + 2) * s, (y + 2) * s, 3 * s, 3 * s); return }
          g.fillStyle = ink; rr(x * s, y * s, 7 * s, 7 * s, 2.6 * s)
          g.fillStyle = '#fff'; rr((x + 1) * s, (y + 1) * s, 5 * s, 5 * s, 1.8 * s)
          g.fillStyle = '#e0608a'; rr((x + 2) * s, (y + 2) * s, 3 * s, 3 * s, 1.2 * s)
          g.fillStyle = ink
        }
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
          const inF = (x < 8 && y < 8) || (x > N - 9 && y < 8) || (x < 8 && y > N - 9)
          const mid = x > 11 && x < 17 && y > 11 && y < 17
          if (!inF && !mid && rnd() > 0.52) { if (cute) { g.beginPath(); g.arc(x * s + s / 2, y * s + s / 2, s * 0.38, 0, Math.PI * 2); g.fill() } else g.fillRect(x * s, y * s, s, s) }
        }
        finder(0, 0); finder(N - 7, 0); finder(0, N - 7)
        if (cute) {
          const cx = 116, cy = 116
          g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, 25, 0, Math.PI * 2); g.fill()
          g.fillStyle = '#fbe0ea'; g.beginPath(); g.arc(cx, cy, 21, 0, Math.PI * 2); g.fill()
          g.fillStyle = '#e0608a'; g.beginPath(); g.moveTo(cx, cy + 12)
          g.bezierCurveTo(cx - 20, cy - 2, cx - 9, cy - 17, cx, cy - 6); g.bezierCurveTo(cx + 9, cy - 17, cx + 20, cy - 2, cx, cy + 12); g.fill()
        }
      }}
    />
  )
}

const fmtLeft = (sec: number) => {
  const h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), r = sec % 60
  const p = (n: number) => String(n).padStart(2, '0')
  return h > 0 ? `${p(h)}:${p(m)}` : `${p(m)}:${p(r)}`
}

export function QrDialog({ app }: { app: App }) {
  return (
    <>
      <DlgHead title="My QR code" />
      <QrPanel app={app} />
    </>
  )
}

export function QrPanel({ app, size = 192, compact }: { app: App; size?: number; compact?: boolean }) {
  const name = app.s.parent.name
  const [ver, setVer] = useState(1)
  const [left, setLeft] = useState(24 * 3600 - 60)
  const cv = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const t = setInterval(() => setLeft((x) => (x > 0 ? x - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [])

  const refresh = () => { setVer((v) => v + 1); setLeft(24 * 3600 - 1); app.toast('New code ready. The old one no longer works.') }
  const save = () => {
    const c = cv.current
    if (!c) return
    const out = document.createElement('canvas'); out.width = out.height = 320
    const g = out.getContext('2d'); if (!g) return
    g.fillStyle = '#fff'; g.fillRect(0, 0, 320, 320); g.drawImage(c, 44, 44, 232, 232)
    out.toBlob((b) => {
      if (!b) return
      const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'joy-qr-code.png'; a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      app.toast('QR code saved.')
    })
  }
  const share = async () => {
    const text = `Link a child's device to ${name}'s Joy parent account.`
    try {
      if (navigator.share) await navigator.share({ title: 'My Joy QR code', text })
      else { await navigator.clipboard.writeText(text); app.toast('Copied to your clipboard.') }
    } catch {}
  }

  const actions = [
    { label: 'Refresh', icon: RefreshCw, tile: 'from-[#ffe6d2] to-[#ffd0a8]', ink: 'text-[#e8731f]', run: refresh },
    { label: 'Save', icon: Download, tile: 'from-[#dff0ff] to-[#c4e0ff]', ink: 'text-[#2f7fd1]', run: save },
    { label: 'Share', icon: Share2, tile: 'from-[#e3f6ee] to-[#c7ecd8]', ink: 'text-[#2f9a62]', run: share },
  ]

  return (
    <>
      <div className="relative mb-3 overflow-hidden rounded-[1.75rem] bg-gradient-to-b from-[#fff3f8] via-[#fff8ee] to-[#fffdf5] p-4 text-center ring-2 ring-[#ffd3e2]">
        <span aria-hidden="true" className="pointer-events-none absolute -left-4 -top-4 size-20 rounded-full bg-[#ffe3ec]/80" />
        <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-5 size-24 rounded-full bg-[#fff0bf]/80" />
        <span aria-hidden="true" className="pointer-events-none absolute right-5 top-4 text-lg">✨</span>
        <span aria-hidden="true" className="pointer-events-none absolute left-5 top-14 text-sm opacity-80">💗</span>
        <div className="relative mx-auto mb-2.5 w-fit max-w-full rounded-[1.5rem] bg-white p-3 shadow-[0_14px_30px_-14px_rgba(240,86,139,0.55)] ring-4 ring-[#ffe3ec]">
          <QrCanvas seed={`${name}:${ver}`} cute canvasRef={cv} size={size} />
        </div>
        <b className="relative block font-display text-lg leading-tight text-foreground">{name}</b>
        <p className="relative mt-1 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-0.5 text-sm shadow-sm ring-1 ring-[#ffe3ec]">
          Code expires in: <b className="font-display text-base text-[#3aa6dd]" aria-live="off">{fmtLeft(left)}</b>
        </p>
        <p className="relative mx-auto mt-2 max-w-xs text-[0.8rem] leading-snug text-foreground/80">Show this to your child’s device to link instantly. Refreshed every 24h.</p>
      </div>
      <div className="mb-3 grid grid-cols-3 gap-2">
        {actions.map(({ label, icon: Icon, tile, ink, run }) => (
          <button key={label} type="button" onClick={run} className="group flex flex-col items-center gap-1 rounded-3xl p-1 transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-joy-pink/60">
            <span className={cn('grid size-11 place-items-center rounded-2xl bg-gradient-to-br shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.9),0_8px_16px_-8px_rgba(39,37,63,0.4)] transition group-active:scale-95', tile, ink)}><Icon className="size-5" strokeWidth={2.6} /></span>
            <span className={cn('text-sm font-bold', ink)}>{label}</span>
          </button>
        ))}
      </div>
      {compact ? null : <p className="rounded-2xl bg-[#fff8e6] px-3 py-2 text-center text-[0.7rem] leading-snug text-[#8a6d2f]">Refreshing invalidates the old code - anyone with a saved copy of it will need the new one</p>}
    </>
  )
}

const CHANNEL_LABEL: Record<Payment['channel'], string> = { AYA: 'AYA Pay (website)', Apple: 'App Store (iPhone app)', Google: 'Google Play (Android app)', Offline: 'Paid in person' }
const ascii = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').replace(/[^\x20-\x7e]/g, '?').replace(/([\\()])/g, '\\$1')

function invoiceNo(pay: Payment) { return `INV-${pay.ref}` }

// Builds a small, real one-page PDF (Helvetica text) so the invoice can be saved and printed.
function buildInvoicePdf(pay: Payment, parent: { name: string; email: string; phone: string }): Blob {
  const L: string[] = []
  const T = (x: number, y: number, size: number, text: string, bold = false) => L.push(`BT /F${bold ? 2 : 1} ${size} Tf ${x} ${y} Td (${ascii(text)}) Tj ET`)
  const line = (y: number) => L.push(`0.9 0.88 0.93 RG 0.8 w 56 ${y} m 539 ${y} l S`)
  L.push('1 0.93 0.95 rg 0 770 595 72 re f'); L.push('0.94 0.34 0.55 rg')
  T(56, 800, 22, 'Joy', true); L.push('0.16 0.14 0.25 rg'); T(380, 800, 20, 'INVOICE', true)
  L.push('0.16 0.14 0.25 rg')
  T(56, 730, 10, 'Invoice no.'); T(56, 715, 12, invoiceNo(pay), true)
  T(220, 730, 10, 'Date'); T(220, 715, 12, fmtDate(pay.date), true)
  T(380, 730, 10, 'Status'); T(380, 715, 12, pay.status, true)
  T(56, 670, 10, 'Billed to'); T(56, 654, 13, parent.name, true)
  T(56, 638, 10, parent.email || parent.phone || '')
  T(380, 670, 10, 'Paid via'); T(380, 654, 12, CHANNEL_LABEL[pay.channel], true)
  line(600); T(56, 584, 10, 'Description', true); T(300, 584, 10, 'Child', true); T(480, 584, 10, 'Amount', true); line(574)
  T(56, 552, 12, pay.item); T(300, 552, 12, pay.child); T(480, 552, 12, money(pay.amount)); line(530)
  T(380, 500, 11, 'Total paid'); T(470, 498, 16, money(pay.amount), true)
  T(56, 430, 10, 'Plans do not renew automatically. Thank you for choosing Joy!')
  T(56, 414, 9, 'Questions about this invoice? Contact support from the Joy app.')
  const content = L.join('\n')
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>',
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
  ]
  let pdf = '%PDF-1.4\n'
  const offs: number[] = []
  objs.forEach((o, i) => { offs.push(pdf.length); pdf += `${i + 1} 0 obj\n${o}\nendobj\n` })
  const x = pdf.length
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + offs.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${x}\n%%EOF`
  return new Blob([pdf], { type: 'application/pdf' })
}

export function InvoiceDialog({ app, pay }: { app: App; pay: Payment }) {
  const parent = app.s.parent
  const download = () => {
    const url = URL.createObjectURL(buildInvoicePdf(pay, parent))
    const a = document.createElement('a'); a.href = url; a.download = `${invoiceNo(pay)}.pdf`; a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1500)
    app.toast('Invoice PDF saved.')
  }
  return (
    <>
      <DlgHead title="Invoice" />
      <div className="mb-4 overflow-hidden rounded-[1.25rem] bg-white shadow-[0_16px_34px_-18px_rgba(39,37,63,0.45)] ring-1 ring-border">
        <div className="flex items-center justify-between bg-gradient-to-r from-[#ffe9f0] to-[#fff3d6] px-5 py-4">
          <img src="/images/joy-logo.webp" alt="Joy" className="h-9 w-auto" />
          <span className="font-display text-lg font-semibold tracking-wide text-[#2a2240]">INVOICE</span>
        </div>
        <div className="grid grid-cols-[1.7fr_1fr_auto] gap-3 px-5 pt-4 text-sm">
          <div><small className="block text-xs text-muted-foreground">Invoice no.</small><b className="whitespace-nowrap">{invoiceNo(pay)}</b></div>
          <div><small className="block text-xs text-muted-foreground">Date</small><b>{fmtDate(pay.date)}</b></div>
          <div className="text-right"><span className="inline-block rounded-full bg-[#e4f7e6] px-2.5 py-0.5 text-xs font-bold text-[#2f8f3a]">{pay.status}</span></div>
        </div>
        <div className="grid grid-cols-2 gap-3 px-5 pt-4 text-sm">
          <div><small className="block text-xs text-muted-foreground">Billed to</small><b className="block">{parent.name}</b><span className="text-xs text-muted-foreground">{parent.email || parent.phone}</span></div>
          <div><small className="block text-xs text-muted-foreground">Paid via</small><b>{CHANNEL_LABEL[pay.channel]}</b></div>
        </div>
        <div className="mx-5 mt-4 rounded-2xl ring-1 ring-border">
          <div className="grid grid-cols-[1.6fr_1fr_auto] gap-3 bg-[#faf8fc] px-4 py-2 text-xs font-semibold text-muted-foreground"><span>Description</span><span>Child</span><span className="text-right">Amount</span></div>
          <div className="grid grid-cols-[1.6fr_1fr_auto] items-center gap-3 px-4 py-3 text-sm"><b>{pay.item}</b><span>{pay.child}</span><b className="text-right">{money(pay.amount)}</b></div>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-xs text-muted-foreground">Plans don’t renew automatically.</span>
          <span className="text-right"><small className="block text-xs text-muted-foreground">Total paid</small><b className="font-display text-2xl">{money(pay.amount)}</b></span>
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Btn variant="ghost" onClick={() => app.open(null)}>Close</Btn>
        <Btn onClick={download}><span className="inline-flex items-center gap-2"><Download className="size-4" />Download PDF</span></Btn>
      </div>
    </>
  )
}
