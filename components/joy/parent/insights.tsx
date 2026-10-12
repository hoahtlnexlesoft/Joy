'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { cn } from '@/lib/utils'
import { Card, Empty, Seg } from './ui'
import { ELS, MOODS, STAGES, TAGS, childData, dayKey, dayLabel, fmtTime, rangeDays, startOfDay } from './data'
import type { Child, Stage } from './data'

/* ---------------- Improvement journey ---------------- */
function spiral(cx: number, cy: number, r: number, turns: number, rot: number) {
  let d = ''
  const n = 90
  for (let i = 0; i <= n; i++) {
    const t = i / n, a = rot + t * turns * 2 * Math.PI, rr = r * t
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1)
  }
  return d
}

function JourneySVG({ stage }: { stage: Stage }) {
  const uid = useId()
  const cur = Math.max(0, STAGES.findIndex((s) => s[0] === stage))
  const pos: [number, number][] = [[110, 230], [230, 110], [350, 230], [230, 350]]
  const lab: [number, number, 'end' | 'middle' | 'start', number, number][] = [[110, 230, 'end', -40, 0], [230, 110, 'middle', 0, -52], [350, 230, 'start', 40, 0], [230, 350, 'middle', 0, 62]]
  const arcs: [number, number, number, number, number, number][] = [[128, 190, 190, 128, 148, 148], [270, 128, 332, 190, 312, 148], [332, 270, 270, 332, 312, 312], [190, 332, 128, 270, 148, 312]]
  const status = (i: number) => (i < cur ? 'Completed' : i === cur ? 'Current' : 'Upcoming')
  return (
    <svg viewBox="-40 30 540 420" role="img" aria-label={`Improvement journey: ${STAGES.map((s, i) => s[0] + ' ' + status(i).toLowerCase()).join(', ')}`} className="mx-auto h-auto w-full max-w-[460px]">
      <defs>
        <marker id={`${uid}h`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#A9A8B4" /></marker>
      </defs>
      <g fontFamily="inherit">
        {arcs.map(([x1, y1, x2, y2, qx, qy], i) => (
          <path key={i} d={`M${x1} ${y1}Q${qx} ${qy} ${x2} ${y2}`} fill="none" stroke="#A9A8B4" strokeWidth={5} strokeLinecap="round" markerEnd={`url(#${uid}h)`} />
        ))}
        <g stroke="#E6A817" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.95}>
          <path d={spiral(230, 196, 26, 2.2, Math.PI * 1.5)} />
          <path d={spiral(204, 244, 26, 2.2, Math.PI * 0.9)} />
          <path d={spiral(256, 244, 26, 2.2, Math.PI * 0.1)} />
        </g>
        {STAGES.map(([n, col], i) => {
          const [x, y] = pos[i], st = status(i), done = st === 'Completed', now = st === 'Current'
          const cy = i === 0 ? y + 6 : y
          const [lx, ly, anc, dx, dy] = lab[i], tx = lx + dx, ty = ly + dy
          const w = 78, bx = anc === 'end' ? tx - w : anc === 'start' ? tx : tx - w / 2
          return (
            <g key={n}>
              {i === 0 ? (
                <path d={`M${x - 26} ${y - 2}L${x} ${y - 26}L${x + 26} ${y - 2}M${x - 19} ${y - 8}V${y + 22}H${x + 19}V${y - 8}`} fill="#fff" stroke={col} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
              ) : (
                <circle cx={x} cy={y} r={27} fill="#fff" stroke={col} strokeWidth={6} />
              )}
              {done ? <path d={`M${x - 10} ${cy}l7 7l13 -14`} fill="none" stroke={i === 0 ? col : '#D9A800'} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" /> : null}
              {now ? <path d={`M${x} ${cy - 12}l3.6 7.4 8.1 1.2 -5.9 5.7 1.4 8.1 -7.2 -3.8 -7.2 3.8 1.4 -8.1 -5.9 -5.7 8.1 -1.2z`} fill="#E03131" /> : null}
              <text x={tx} y={ty - 4} textAnchor={anc} fontSize={21} fontWeight={600} fill="#27253F">{n}</text>
              {now ? (
                <>
                  <rect x={bx} y={ty + 4} width={w} height={26} rx={13} fill="#22B8E8" />
                  <text x={bx + w / 2} y={ty + 22} textAnchor="middle" fontSize={15} fontWeight={700} fill="#fff">Current</text>
                </>
              ) : (
                <text x={tx} y={ty + 20} textAnchor={anc} fontSize={16} fontWeight={600} fill="#A6A4B8">{st}</text>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function JourneyCard({ child }: { child: Child }) {
  const cur = Math.max(0, STAGES.findIndex((s) => s[0] === child.stage))
  return (
    <Card title="Improvement journey" action={<Link href="/how-it-works#stages" className="text-sm font-semibold text-joy-pink hover:underline">What do stages mean?</Link>}>
      <div className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
        <JourneySVG stage={child.stage} />
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-[#f8f6fb] p-4" style={{ borderLeft: `6px solid ${STAGES[cur][1]}` }}>
            <small className="text-xs text-muted-foreground">Current stage</small>
            <b className="block font-display text-2xl font-medium">{STAGES[cur][0]}</b>
          </div>
          <div>
            <div className="h-2 overflow-hidden rounded-full bg-[#eeebf3]"><i className="block h-full rounded-full bg-gradient-joy" style={{ width: `${(cur / STAGES.length) * 100}%` }} /></div>
            <span className="mt-1.5 block text-xs text-muted-foreground">{cur} of {STAGES.length} stages completed</span>
          </div>
          <ol className="flex flex-col gap-1.5">
            {STAGES.map(([n, col], i) => (
              <li key={n} className="flex items-center gap-3 text-sm font-semibold">
                <span className="size-3 rounded-full" style={{ background: i <= cur ? col : '#e3e0ea' }} />
                {n}
                <em className={cn('ml-auto text-xs not-italic font-medium', i === cur ? 'text-[#1b9ac9]' : 'text-muted-foreground')}>{i < cur ? 'Completed' : i === cur ? 'Current' : 'Upcoming'}</em>
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground">🔁 The journey repeats and adapts as {child.name} grows.</p>
        </div>
      </div>
    </Card>
  )
}

/* ---------------- Feeling log ---------------- */
export function FeelingLog({ child }: { child: Child }) {
  const [period, setPeriod] = useState(30)
  const [month, setMonth] = useState(0)
  const [sel, setSel] = useState(() => dayKey(startOfDay(new Date())))
  const data = childData(child)
  if (!child.element || !Object.keys(data).length)
    return <Empty icon="💭" title="No check-ins yet">After each activity, {child.name} picks how they feel. Their feeling log starts here.</Empty>

  const keys = rangeDays(period)
  const entries = keys.flatMap((k) => data[k]?.feel ?? [])
  const elC = ELS.map((e) => [e, entries.filter((x) => x.el[0] === e[0]).length] as const).sort((a, b) => b[1] - a[1])
  const mC = MOODS.map((m) => [m, entries.filter((x) => x.mood[0] === m[0]).length] as const).filter((x) => x[1]).sort((a, b) => b[1] - a[1])
  const tot = entries.length || 1
  let acc = 0
  const cone = elC.map(([e, n]) => { const a = acc; acc += (n / tot) * 100; return `${e[2]} ${a}% ${acc}%` }).join(',')
  const maxM = Math.max(1, ...mC.map((x) => x[1]))

  const base = new Date(); base.setDate(1); base.setMonth(base.getMonth() + month); base.setHours(0, 0, 0, 0)
  const mTitle = base.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const first = (base.getDay() + 6) % 7
  const dim = new Date(base.getFullYear(), base.getMonth() + 1, 0).getDate()
  const todayK = dayKey(startOfDay(new Date()))
  const sd = data[sel] ?? { feel: [], acts: [] }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Seg label="Period" value={period} onChange={setPeriod} options={[[7, 'Last 7 days'], [30, 'Last 30 days'], [90, 'Last 90 days']]} />
        <span className="text-xs text-muted-foreground">{entries.length} check-ins · sample data</span>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Card title="Most element" action={elC[0][1] ? <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: elC[0][0][2] + '33' }}>{elC[0][0][1]} {elC[0][0][0]}</span> : null}>
          <div className="flex flex-wrap items-center gap-5">
            <div className="grid size-36 shrink-0 place-items-center rounded-full" role="img" aria-label={elC.map(([e, n]) => `${e[0]} ${n}`).join(', ')} style={{ background: `radial-gradient(circle,#fff 0 52%,transparent 53%),conic-gradient(${cone})` }}>
              <span className="text-center text-xs text-muted-foreground"><b className="block font-display text-2xl text-foreground">{entries.length}</b>check-ins</span>
            </div>
            <ul className="flex min-w-[10rem] flex-1 flex-col gap-1.5 text-sm">
              {elC.map(([e, n]) => (
                <li key={e[0]} className="flex items-center gap-2"><i className="size-2.5 rounded-full" style={{ background: e[2] }} /><span>{e[1]} {e[0]}</span><b className="ml-auto">{n}</b><em className="w-10 text-right text-xs not-italic text-muted-foreground">{Math.round((n / tot) * 100)}%</em></li>
              ))}
            </ul>
          </div>
        </Card>
        <Card title="Most mood" action={mC.length ? <span className="rounded-full bg-[#fff2b8] px-3 py-1 text-xs font-bold">{mC[0][0][1]} {mC[0][0][0]}</span> : null}>
          <div className="flex h-40 items-end gap-2" role="img" aria-label={mC.map(([m, n]) => `${m[0]} ${n}`).join(', ')}>
            {mC.map(([m, n], i) => (
              <div key={m[0]} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1 text-center">
                <em className="text-[11px] not-italic font-semibold text-muted-foreground">{n}</em>
                <i className={cn('block w-full max-w-9 rounded-t-xl', i === 0 ? 'bg-gradient-joy' : 'bg-[#e6def5]')} style={{ height: `${Math.max(8, (n / maxM) * 62)}%` }} />
                <span className="text-lg leading-none" aria-hidden="true">{m[1]}</span>
                <small className="hidden truncate text-[10px] text-muted-foreground sm:block">{m[0]}</small>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card
        title="Feeling calendar"
        action={
          <div className="flex items-center gap-2 text-sm">
            <button type="button" onClick={() => setMonth((m) => m - 1)} aria-label="Previous month" className="grid size-8 place-items-center rounded-full ring-1 ring-border hover:bg-[#f4f1f8]">‹</button>
            <b className="min-w-32 text-center">{mTitle}</b>
            <button type="button" onClick={() => setMonth((m) => Math.min(0, m + 1))} disabled={month >= 0} aria-label="Next month" className="grid size-8 place-items-center rounded-full ring-1 ring-border hover:bg-[#f4f1f8] disabled:opacity-40">›</button>
          </div>
        }
      >
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="grid grid-cols-7 gap-1.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => <span key={d} className="pb-1 text-center text-xs font-semibold text-muted-foreground">{d}</span>)}
            {Array.from({ length: first }, (_, i) => <span key={'b' + i} />)}
            {Array.from({ length: dim }, (_, i) => {
              const d = i + 1
              const k = dayKey(new Date(base.getFullYear(), base.getMonth(), d, 12))
              const f = data[k]?.feel ?? []
              const fut = k > todayK
              return (
                <button key={k} type="button" disabled={fut} onClick={() => setSel(k)} aria-label={new Date(k + 'T00:00').toDateString() + (f.length ? ', ' + f.map((x) => x.mood[0]).join(' and ') : '')}
                  className={cn('flex aspect-square flex-col items-center justify-center rounded-xl text-xs transition disabled:opacity-30', k === sel ? 'bg-gradient-joy text-white' : f.length ? 'bg-[#fff6ec] hover:bg-[#ffe9d2]' : 'bg-[#f8f6fb] hover:bg-[#efeaf6]', k === todayK && k !== sel && 'ring-2 ring-joy-pink/50')}>
                  <span className="font-semibold">{d}</span>
                  <span className="text-sm leading-none" aria-hidden="true">{f.slice(0, 2).map((x) => x.mood[1]).join('')}</span>
                </button>
              )
            })}
          </div>
          <aside aria-live="polite" className="rounded-2xl bg-[#faf8fc] p-4">
            <h3 className="font-display text-lg font-medium">{dayLabel(sel)}</h3>
            {sd.feel.length ? (
              <ul className="mt-3 flex flex-col gap-3">
                {sd.feel.map((x, i) => (
                  <li key={i} className="flex items-center gap-3"><span className="text-2xl" aria-hidden="true">{x.mood[1]}</span><div><b className="block text-sm">Felt {x.mood[0].toLowerCase()}</b><small className="text-xs text-muted-foreground">{fmtTime(x.time)} · picked {x.el[1]} {x.el[0]}</small></div></li>
                ))}
              </ul>
            ) : <p className="mt-3 text-sm text-muted-foreground">No check-ins on this day.</p>}
            {sd.acts.length ? (
              <>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Activities that day</p>
                <ul className="mt-2 flex flex-col gap-2">
                  {sd.acts.map((a, i) => { const t = TAGS.find((x) => x[0] === a.tag)!; return (
                    <li key={i} className="flex items-center gap-2 text-sm"><span className="rounded-full px-2.5 py-0.5 text-xs font-bold" style={{ color: t[2], background: t[3] }}>{t[1]} {a.tag}</span>{a.name}</li>
                  ) })}
                </ul>
              </>
            ) : null}
          </aside>
        </div>
      </Card>
    </div>
  )
}

/* ---------------- Activities ---------------- */
export function ActivitiesTab({ child }: { child: Child }) {
  const [period, setPeriod] = useState(7)
  const [tag, setTag] = useState('all')
  const [more, setMore] = useState(false)
  const data = childData(child)
  if (!child.element || !Object.keys(data).length)
    return <Empty icon="🎈" title="No activities yet">When {child.name} starts playing, every activity shows here with its movement tag.</Empty>

  const keys = rangeDays(period)
  const all = keys.flatMap((k) => data[k]?.acts ?? [])
  const cnt = Object.fromEntries(TAGS.map((t) => [t[0], all.filter((a) => a.tag === t[0]).length]))
  const list = all.filter((a) => tag === 'all' || a.tag === tag).sort((a, b) => b.time.getTime() - a.time.getTime())
  const shown = more ? list : list.slice(0, 12)
  const groups: Record<string, typeof shown> = {}
  shown.forEach((a) => { const k = dayKey(startOfDay(a.time)); (groups[k] = groups[k] || []).push(a) })
  const reset = (fn: () => void) => { fn(); setMore(false) }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Seg label="Period" value={period} onChange={(v) => reset(() => setPeriod(v))} options={[[1, 'Today'], [7, '7 days'], [30, '30 days'], [60, '60 days']]} />
        <span className="text-xs text-muted-foreground">{all.length} activities · sample data</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        <button type="button" aria-pressed={tag === 'all'} onClick={() => reset(() => setTag('all'))} className={cn('rounded-2xl p-3 text-left transition', tag === 'all' ? 'bg-foreground text-background' : 'bg-white ring-1 ring-border hover:ring-foreground/25')}>
          <b className="block font-display text-2xl">{all.length}</b><span className="text-xs">All activities</span>
        </button>
        {TAGS.map(([t, ic, col, bg]) => (
          <button key={t} type="button" aria-pressed={tag === t} onClick={() => reset(() => setTag(t))} className="rounded-2xl p-3 text-left transition hover:-translate-y-0.5" style={{ background: bg, boxShadow: tag === t ? `inset 0 0 0 2px ${col}` : 'none' }}>
            <i className="text-lg not-italic" aria-hidden="true">{ic}</i>
            <b className="block font-display text-2xl" style={{ color: col }}>{cnt[t]}</b>
            <span className="text-xs font-semibold">{t}</span>
          </button>
        ))}
      </div>
      {all.length ? (
        <div className="flex h-3 overflow-hidden rounded-full" role="img" aria-label={`Movement mix: ${TAGS.map((t) => t[0] + ' ' + cnt[t[0]]).join(', ')}`}>
          {TAGS.filter((t) => cnt[t[0]]).map(([t, , col]) => <span key={t} title={`${t}: ${cnt[t]}`} style={{ flex: cnt[t], background: col }} />)}
        </div>
      ) : null}
      <Card title={tag === 'all' ? 'All activities' : tag + ' activities'} action={<span className="text-xs text-muted-foreground">{list.length}</span>}>
        {list.length ? (
          <>
            {Object.entries(groups).map(([k, arr]) => (
              <div key={k}>
                <h3 className="mb-2 mt-4 text-sm font-semibold text-muted-foreground first:mt-0">{dayLabel(k)}</h3>
                <ul className="flex flex-col gap-2">
                  {arr.map((a, i) => { const t = TAGS.find((x) => x[0] === a.tag)!; return (
                    <li key={i} className="flex items-center gap-3 rounded-2xl bg-[#faf8fc] p-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-xl text-lg" style={{ background: t[3] }} aria-hidden="true">{t[1]}</span>
                      <div className="min-w-0 flex-1"><b className="block truncate text-sm">{a.name}</b><small className="text-xs text-muted-foreground">{a.secIc} {a.sec}</small></div>
                      <span className="hidden rounded-full px-2.5 py-0.5 text-xs font-bold sm:inline" style={{ color: t[2], background: t[3] }}>{a.tag}</span>
                      <time className="text-xs text-muted-foreground">{fmtTime(a.time)}</time>
                    </li>
                  ) })}
                </ul>
              </div>
            ))}
            {list.length > 12 ? <button type="button" onClick={() => setMore((m) => !m)} className="mt-4 h-9 rounded-full px-4 text-sm font-semibold ring-1 ring-border hover:bg-[#f4f1f8]">{more ? 'Show less' : `Show all ${list.length}`}</button> : null}
          </>
        ) : <p className="py-2 text-sm text-muted-foreground">No {tag === 'all' ? '' : tag + ' '}activities in this period.</p>}
      </Card>
    </div>
  )
}
