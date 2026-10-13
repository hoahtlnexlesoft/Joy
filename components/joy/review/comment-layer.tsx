'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ClipboardCopy, MessageCircle, MousePointerClick, Trash2, X } from '@/components/joy/cute-icons'
import { Heart as HeartIcon, Smile as SmileIcon, ThumbsUp } from 'lucide-react'

/**
 * Customer review layer (Lovable-style): click "Comment", click any element,
 * leave a note. No account needed — just a name. Stored in localStorage for now.
 */

type Reply = { id: string; author: string; text: string; at: number }
type ReactionKey = 'like' | 'heart' | 'smile'
const REACTIONS: { key: ReactionKey; label: string; Icon: typeof ThumbsUp; on: string }[] = [
  { key: 'like', label: 'Like', Icon: ThumbsUp, on: 'bg-sky-100 text-sky-700 ring-sky-300' },
  { key: 'heart', label: 'Love', Icon: HeartIcon, on: 'bg-rose-100 text-rose-600 ring-rose-300' },
  { key: 'smile', label: 'Smile', Icon: SmileIcon, on: 'bg-amber-100 text-amber-600 ring-amber-300' },
]
type Thread = {
  id: string
  page: string
  selector: string
  rx: number
  ry: number
  ax: number
  ay: number
  author: string
  text: string
  at: number
  resolved: boolean
  replies: Reply[]
  reactions?: Partial<Record<ReactionKey, string[]>>
}

const KEY = 'joy-review-comments'
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const REMOTE = !!(SB_URL && SB_KEY)
const sbHeaders = { apikey: SB_KEY || '', Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' }

async function remoteLoad(): Promise<Thread[]> {
  const r = await fetch(`${SB_URL}/rest/v1/review_comments?select=data&order=created_at.asc`, { headers: sbHeaders })
  if (!r.ok) throw new Error(String(r.status))
  return ((await r.json()) as { data: Thread }[]).map((x) => x.data)
}
async function remoteUpsert(ts: Thread[]) {
  if (!ts.length) return
  await fetch(`${SB_URL}/rest/v1/review_comments?on_conflict=id`, {
    method: 'POST',
    headers: { ...sbHeaders, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(ts.map((t) => ({ id: t.id, data: t }))),
  })
}
async function remoteDelete(ids: string[]) {
  for (const id of ids) await fetch(`${SB_URL}/rest/v1/review_comments?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', headers: sbHeaders })
}
const NAME_KEY = 'joy-review-name'
const uid = () => Math.random().toString(36).slice(2, 10)

function selectorFor(el: Element): string {
  const parts: string[] = []
  let cur: Element | null = el
  while (cur && cur !== document.body && parts.length < 12) {
    if (cur.id) {
      parts.unshift(`#${CSS.escape(cur.id)}`)
      break
    }
    const parent: Element | null = cur.parentElement
    if (!parent) break
    const tag = cur.tagName.toLowerCase()
    const same = Array.from(parent.children).filter((c) => c.tagName === cur!.tagName)
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(cur) + 1})` : tag)
    cur = parent
  }
  return parts.join(' > ')
}

const USER_COLORS = ['#4f46e5', '#0d9488', '#d97706', '#0284c7', '#c026d3', '#16a34a', '#dc2626', '#7c3aed', '#0891b2', '#65a30d', '#db2777', '#ca8a04', '#2563eb', '#059669', '#ea580c', '#9333ea']
// authors in order of first appearance: each gets its own colour (no two share one until the palette runs out)
let AUTHOR_ORDER: string[] = []
const authorKey = (n: string) => n.trim().toLowerCase()
function colorFor(name: string) {
  const idx = AUTHOR_ORDER.indexOf(authorKey(name))
  if (idx >= 0) return USER_COLORS[idx % USER_COLORS.length]
  let h = 0
  for (const ch of name.trim().toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0
  return USER_COLORS[h % USER_COLORS.length]
}

const GOTO_KEY = 'joy-review-goto'

function ago(t: number) {
  const s = Math.max(1, Math.round((Date.now() - t) / 1000))
  if (s < 60) return 'just now'
  if (s < 3600) return `${Math.round(s / 60)}m ago`
  if (s < 86400) return `${Math.round(s / 3600)}h ago`
  return `${Math.round(s / 86400)}d ago`
}

function pagePath() {
  return location.pathname.replace(/\/$/, '').split('/').pop() || 'home'
}

export function CommentLayer() {
  const [threads, setThreads] = useState<Thread[]>([])
  {
    const seen: { at: number; k: string }[] = []
    for (const t of threads) {
      seen.push({ at: t.at, k: authorKey(t.author) })
      for (const r of t.replies) seen.push({ at: r.at ?? t.at, k: authorKey(r.author) })
    }
    seen.sort((a, b) => a.at - b.at)
    AUTHOR_ORDER = Array.from(new Set(seen.map((x) => x.k)))
  }
  const [name, setName] = useState('')
  const [mode, setMode] = useState(false)
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<{ selector: string; rx: number; ry: number; ax: number; ay: number } | null>(null)
  const [draftText, setDraftText] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [copied, setCopied] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const hoverRef = useRef<HTMLElement | null>(null)
  const page = typeof window === 'undefined' ? '' : pagePath()

  const pending = useRef(0)
  const writes = useRef(0)
  const lastSend = useRef('')
  const threadsRef = useRef<Thread[]>([])
  threadsRef.current = threads

  useEffect(() => {
    try {
      setName(localStorage.getItem(NAME_KEY) || '')
      if (!REMOTE) setThreads(JSON.parse(localStorage.getItem(KEY) || '[]'))
    } catch {}
    if (!REMOTE) return
    let stop = false
    const pull = async () => {
      if (pending.current > 0 || document.hidden) return
      const w = writes.current
      try {
        const rows = await remoteLoad()
        if (!stop && pending.current === 0 && writes.current === w) setThreads(rows)
      } catch {}
    }
    pull()
    const iv = setInterval(pull, 5000)
    return () => {
      stop = true
      clearInterval(iv)
    }
  }, [])

  const save = useCallback((next: Thread[]) => {
    const prev = threadsRef.current
    writes.current++
    setThreads(next)
    threadsRef.current = next
    if (!REMOTE) {
      try {
        localStorage.setItem(KEY, JSON.stringify(next))
      } catch {}
      return
    }
    const prevMap = new Map(prev.map((t) => [t.id, JSON.stringify(t)]))
    const changed = next.filter((t) => prevMap.get(t.id) !== JSON.stringify(t))
    const gone = prev.filter((t) => !next.some((n) => n.id === t.id)).map((t) => t.id)
    pending.current++
    Promise.all([remoteUpsert(changed), remoteDelete(gone)])
      .catch(() => {})
      .finally(() => {
        pending.current--
      })
  }, [])

  // keep pins aligned on resize / layout change
  useEffect(() => {
    const r = () => setTick((t) => t + 1)
    window.addEventListener('resize', r)
    const iv = setInterval(r, 1200)
    return () => {
      window.removeEventListener('resize', r)
      clearInterval(iv)
    }
  }, [])

  // comment mode: hover outline + capture click
  useEffect(() => {
    if (!mode) return
    const inUi = (t: EventTarget | null) => !!(t as HTMLElement | null)?.closest?.('[data-review-ui]')
    const move = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (inUi(t)) return clear()
      if (hoverRef.current !== t) {
        clear()
        hoverRef.current = t
        t.style.outline = '2px dashed #4f46e5'
        t.style.outlineOffset = '2px'
      }
    }
    const clear = () => {
      if (hoverRef.current) {
        hoverRef.current.style.outline = ''
        hoverRef.current.style.outlineOffset = ''
        hoverRef.current = null
      }
    }
    const click = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      if (inUi(t)) return
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      clear()
      const r = t.getBoundingClientRect()
      setDraft({
        selector: selectorFor(t),
        rx: r.width ? (e.clientX - r.left) / r.width : 0.5,
        ry: r.height ? (e.clientY - r.top) / r.height : 0.5,
        ax: e.clientX + window.scrollX,
        ay: e.clientY + window.scrollY,
      })
      setDraftText('')
      setMode(false)
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && (clear(), setMode(false))
    document.addEventListener('mousemove', move, true)
    document.addEventListener('click', click, true)
    document.addEventListener('keydown', key)
    document.documentElement.style.cursor = 'crosshair'
    return () => {
      clear()
      document.removeEventListener('mousemove', move, true)
      document.removeEventListener('click', click, true)
      document.removeEventListener('keydown', key)
      document.documentElement.style.cursor = ''
    }
  }, [mode])

  const pos = useCallback((t: { selector: string; rx: number; ry: number; ax: number; ay: number }) => {
    try {
      const el = document.querySelector(t.selector)
      if (el) {
        const r = el.getBoundingClientRect()
        return { x: r.left + window.scrollX + r.width * t.rx, y: r.top + window.scrollY + r.height * t.ry }
      }
    } catch {}
    return { x: t.ax, y: t.ay }
  }, [])

  const pageThreads = useMemo(() => threads.filter((t) => t.page === page), [threads, page])
  const shown = threads.filter((t) => (filter === 'all' ? true : filter === 'open' ? !t.resolved : t.resolved))

  const submitDraft = () => {
    if (!draft || !draftText.trim()) return
    let n = name
    if (!n) {
      n = nameInput.trim()
      if (!n) return
      setName(n)
      try {
        localStorage.setItem(NAME_KEY, n)
      } catch {}
    }
    const sig = `new|${page}|${authorKey(n)}|${draftText.trim()}`
    const [lastSig, lastAt] = lastSend.current.split('@@')
    if (lastSig === sig && Date.now() - Number(lastAt) < 1500) return
    lastSend.current = `${sig}@@${Date.now()}`
    const t: Thread = { id: uid(), page, ...draft, author: n, text: draftText.trim(), at: Date.now(), resolved: false, replies: [] }
    save([...threadsRef.current, t])
    setDraft(null)
    setActive(t.id)
    setOpen(true)
  }

  const focusThread = useCallback(
    (id: string) => {
      const t = threadsRef.current.find((x) => x.id === id)
      if (!t) return
      setActive(id)
      setFlash(id)
      const p = pos(t)
      window.scrollTo({ top: Math.max(0, p.y - window.innerHeight / 2), behavior: 'smooth' })
      let el: HTMLElement | null = null
      try {
        el = document.querySelector(t.selector)
      } catch {}
      if (el) {
        el.style.outline = `3px solid ${colorFor(t.author)}`
        el.style.outlineOffset = '3px'
      }
      setTimeout(() => {
        if (el) {
          el.style.outline = ''
          el.style.outlineOffset = ''
        }
        setFlash((f) => (f === id ? null : f))
      }, 2600)
    },
    [pos],
  )

  const goTo = (t: Thread) => {
    if (t.page !== page) {
      try {
        sessionStorage.setItem(GOTO_KEY, t.id)
      } catch {}
      const isStatic = location.pathname.endsWith('.html')
      location.href = isStatic ? `./${t.page.replace(/\.html$/, '')}.html` : t.page === 'home' ? '/' : `/${t.page.replace(/\.html$/, '')}`
      return
    }
    focusThread(t.id)
  }

  // arriving from another page: jump to the comment that was clicked
  useEffect(() => {
    if (!threads.length) return
    let id: string | null = null
    try {
      id = sessionStorage.getItem(GOTO_KEY)
    } catch {}
    if (!id || !threads.some((x) => x.id === id)) return
    try {
      sessionStorage.removeItem(GOTO_KEY)
    } catch {}
    const target = id
    const tm = setTimeout(() => focusThread(target), 900)
    return () => clearTimeout(tm)
  }, [threads, focusThread])

  const toggleReaction = (id: string, key: ReactionKey) => {
    if (!name) return
    const me = authorKey(name)
    save(
      threads.map((t) => {
        if (t.id !== id) return t
        const cur = t.reactions?.[key] ?? []
        const next = cur.some((n) => authorKey(n) === me) ? cur.filter((n) => authorKey(n) !== me) : [...cur, name]
        return { ...t, reactions: { ...t.reactions, [key]: next } }
      }),
    )
  }

  const copyOne = (t: Thread) => {
    const text = t.text
    const done = () => {
      setCopiedId(t.id)
      setTimeout(() => setCopiedId((c) => (c === t.id ? null : c)), 1600)
    }
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, done)
    else done()
  }

  const exportText = () => {
    const lines = threads.map(
      (t, i) =>
        `#${i + 1} [${t.resolved ? 'resolved' : 'open'}] page: ${t.page} | element: ${t.selector}\n  ${t.author}: ${t.text}` +
        t.replies.map((r) => `\n    ↳ ${r.author}: ${r.text}`).join(''),
    )
    navigator.clipboard?.writeText(lines.join('\n\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const [replyText, setReplyText] = useState('')
  const addReply = (id: string) => {
    const text = replyText.trim()
    if (!text || !name) return
    // ignore a double submit (key repeat / double event) of the same reply
    const sig = `${id}|${authorKey(name)}|${text}`
    const now = Date.now()
    const [lastSig, lastAt] = lastSend.current.split('@@')
    if (lastSig === sig && now - Number(lastAt) < 1500) return
    lastSend.current = `${sig}@@${now}`
    setReplyText('')
    save(
      threadsRef.current.map((t) =>
        t.id === id ? { ...t, replies: [...t.replies, { id: uid(), author: name, text, at: now }] } : t,
      ),
    )
  }

  const draftPos = draft ? pos(draft) : null
  void tick

  return (
    <div data-review-ui>
      {/* pins */}
      <div className="pointer-events-none absolute left-0 top-0 z-[60]" style={{ width: 0, height: 0 }}>
        {pageThreads.map((t) => {
          const p = pos(t)
          const idx = threads.indexOf(t) + 1
          return (
            <button
              key={t.id}
              data-review-ui
              onClick={() => {
                setActive(t.id)
                setOpen(true)
              }}
              className={`pointer-events-auto absolute grid size-8 -translate-x-1/2 -translate-y-full place-items-center rounded-full rounded-bl-none text-xs font-bold text-white shadow-lg ring-2 ring-white transition hover:scale-110 ${
                t.resolved ? 'bg-emerald-500' : ''
              } ${active === t.id ? 'scale-125' : ''}`}
              style={{ left: p.x, top: p.y, ...(t.resolved ? {} : { backgroundColor: colorFor(t.author) }) }}
              aria-label={`Comment ${idx}`}
            >
              {flash === t.id && <span className="absolute inset-0 -z-10 animate-ping rounded-full opacity-70" style={{ backgroundColor: t.resolved ? '#10b981' : colorFor(t.author) }} />}
              {t.resolved ? <Check className="size-4" /> : idx}
            </button>
          )
        })}
        {draftPos && (
          <div
            data-review-ui
            className="pointer-events-auto absolute z-[70] w-72 max-w-[calc(100vw-24px)] rounded-2xl bg-white p-3 text-left shadow-2xl ring-1 ring-indigo-200"
            style={{ left: Math.min(Math.max(12, draftPos.x - 20), Math.max(12, window.innerWidth - 300)), top: draftPos.y + 12 }}
          >
            {!name && (
              <input
                autoFocus
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="Your name"
                className="mb-2 h-9 w-full rounded-xl border border-indigo-200 px-3 text-sm outline-none focus:border-indigo-400"
              />
            )}
            <textarea
              autoFocus={!!name}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              placeholder="Leave a comment…"
              rows={3}
              className="w-full resize-none rounded-xl border border-indigo-200 p-2 text-sm outline-none focus:border-indigo-400"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => setDraft(null)} className="h-8 rounded-full px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={submitDraft}
                disabled={!draftText.trim() || (!name && !nameInput.trim())}
                className="h-8 rounded-full bg-indigo-600 px-4 text-xs font-bold text-white disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      {process.env.NEXT_PUBLIC_JOY_BUILD && (
        <span data-review-ui className="pointer-events-none fixed left-2 top-2 z-[90] rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-semibold text-white">
          build {process.env.NEXT_PUBLIC_JOY_BUILD}
        </span>
      )}

      {/* bottom-center mode pill (Browse / Comment) */}
      <div data-review-ui className="fixed bottom-4 left-1/2 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
        {mode && (
          <span className="whitespace-nowrap rounded-full bg-slate-900/90 px-3 py-1.5 text-xs font-semibold text-white">
            Click anything to comment · Esc to cancel
          </span>
        )}
        <div className="flex items-center gap-1 rounded-full bg-slate-900 p-1 text-sm font-semibold shadow-xl ring-1 ring-white/10">
          <button
            onClick={() => {
              setDraft(null)
              setMode(false)
            }}
            className={`flex h-9 items-center gap-2 rounded-full px-4 transition ${!mode ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            <MousePointerClick className="size-4" />
            Browse
          </button>
          <button
            onClick={() => {
              setDraft(null)
              setMode(true)
            }}
            className={`flex h-9 items-center gap-2 rounded-full px-4 transition ${mode ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
          >
            <MessageCircle className="size-4" />
            Comment
          </button>
        </div>
      </div>

      {/* slim open/close tab on the panel edge */}
      <button
        data-review-ui
        onClick={() => setOpen((o) => !o)}
        className={`fixed top-1/2 z-[86] grid h-20 w-5 -translate-y-1/2 place-items-center rounded-l-xl bg-indigo-600 text-white shadow-lg transition-all hover:w-6 ${
          open ? 'right-0 max-sm:hidden sm:right-[22rem]' : 'right-0'
        }`}
        aria-label={open ? 'Collapse comments' : 'Open comments'}
      >
        {threads.filter((t) => !t.resolved).length > 0 && (
          <span className="absolute -left-2.5 -top-2.5 grid min-w-5 place-items-center rounded-full bg-white px-1 text-[10px] font-bold leading-5 text-indigo-600 shadow ring-1 ring-indigo-200">
            {threads.filter((t) => !t.resolved).length}
          </span>
        )}
        <svg viewBox="0 0 24 24" className={`size-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
      </button>

      {/* docked comments panel (right side) */}
      {open && (
        <aside
          data-review-ui
          className="fixed bottom-0 right-0 top-0 z-[85] flex w-[22rem] max-w-full flex-col bg-[#f3f4f6] text-left shadow-2xl ring-1 ring-black/5"
        >
          <header className="flex items-center justify-between gap-2 px-5 pb-2 pt-5">
            <h2 className="text-sm font-bold text-slate-900">Comments</h2>
            <div className="flex items-center gap-1">
              <button onClick={exportText} className="flex h-8 items-center gap-1 rounded-full px-3 text-xs font-semibold text-slate-600 hover:bg-black/5">
                {copied ? <Check className="size-3.5" /> : <ClipboardCopy className="size-3.5" />}
                {copied ? 'Copied' : 'Copy all'}
              </button>
              <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-slate-600 hover:bg-black/5" aria-label="Close">
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M15 4v16" /></svg>
              </button>
            </div>
          </header>
          <div className="px-5 pb-2">
            <div className="inline-flex gap-1 rounded-full bg-black/5 p-1 text-xs font-bold">
              {(['all', 'open', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`rounded-full px-3 py-1 capitalize ${filter === f ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pb-24">
            {shown.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-slate-400">
                {filter === 'resolved' ? 'Nothing resolved yet.' : 'No comments yet. Switch to “Comment” and click anything on the page.'}
              </p>
            )}
            {shown.map((t) => {
              const isActive = active === t.id
              return (
                <div key={t.id} className={`group relative px-5 py-3 text-sm transition ${isActive ? 'bg-white' : 'hover:bg-white/60'} ${t.resolved && !isActive ? 'opacity-60' : ''}`}>
                  <button
                    onClick={() => copyOne(t)}
                    className="absolute right-3 top-3 z-10 grid size-7 place-items-center rounded-full bg-white/80 text-slate-500 shadow-sm ring-1 ring-black/5 hover:bg-white hover:text-indigo-600"
                    aria-label="Copy comment"
                    title="Copy comment"
                  >
                    {copiedId === t.id ? <Check className="size-3.5 text-emerald-600" /> : <ClipboardCopy className="size-3.5" />}
                  </button>
                  <button onClick={() => goTo(t)} className="flex w-full items-start gap-3 pr-8 text-left">
                    <span style={{ backgroundColor: colorFor(t.author) }} className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold uppercase text-white">
                      {(t.author.trim()[0] || '?').toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline gap-1.5">
                        <b className="truncate" style={{ color: colorFor(t.author) }}>{t.author}</b>
                        <span className="shrink-0 text-xs text-slate-400">· {ago(t.at)}</span>
                        {t.resolved && (
                          <span className="inline-flex shrink-0 items-center gap-0.5 self-center rounded-full bg-emerald-50 px-1.5 text-[10px] font-bold text-emerald-600">
                            <Check className="size-3" /> Resolved
                          </span>
                        )}
                      </span>
                      <span className={`mt-0.5 block text-slate-700 ${isActive ? '' : 'line-clamp-2'}`}>{t.text}</span>
                      <span className="mt-0.5 block text-[11px] text-slate-400">
                        #{threads.indexOf(t) + 1} · {t.page}
                      </span>
                    </span>
                  </button>
                  <div className="ml-11 mt-1.5 flex gap-1.5">
                    {REACTIONS.map(({ key, label, Icon, on }) => {
                      const who = t.reactions?.[key] ?? []
                      const mine = !!name && who.some((n) => authorKey(n) === authorKey(name))
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleReaction(t.id, key)}
                          disabled={!name}
                          aria-pressed={mine}
                          aria-label={label}
                          title={name ? (who.length ? `${label}: ${who.join(', ')}` : label) : 'Add a comment first to set your name'}
                          className={`inline-flex h-7 items-center gap-1 rounded-full px-2 text-xs font-semibold ring-1 transition disabled:cursor-not-allowed disabled:opacity-60 ${mine ? on : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'}`}
                        >
                          <Icon className="size-3.5" aria-hidden="true" />
                          {who.length > 0 && <span>{who.length}</span>}
                        </button>
                      )
                    })}
                  </div>
                  {isActive && (
                    <div className="ml-11">
                      {t.replies.map((r) => (
                        <p key={r.id} className="mt-2 border-l-2 pl-2 text-xs text-slate-600" style={{ borderColor: colorFor(r.author) }}>
                          <b style={{ color: colorFor(r.author) }}>{r.author}</b> · {r.text}
                        </p>
                      ))}
                      <div className="mt-2 flex gap-1">
                        <input
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.repeat) return
                            e.preventDefault()
                            addReply(t.id)
                          }}
                          placeholder={name ? 'Reply…' : 'Add a comment first to set your name'}
                          disabled={!name}
                          className="h-8 min-w-0 flex-1 rounded-full border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                        />
                        <button
                          onClick={() => save(threads.map((x) => (x.id === t.id ? { ...x, resolved: !x.resolved } : x)))}
                          className="grid size-8 place-items-center rounded-full bg-emerald-50 text-emerald-600"
                          aria-label="Resolve"
                          title={t.resolved ? 'Reopen' : 'Resolve'}
                        >
                          <Check className="size-4" />
                        </button>
                        <button
                          onClick={() => save(threads.filter((x) => x.id !== t.id))}
                          className="grid size-8 place-items-center rounded-full bg-rose-50 text-rose-500"
                          aria-label="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </aside>
      )}
    </div>
  )
}
