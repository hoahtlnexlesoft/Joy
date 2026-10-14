'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Check, ClipboardCopy, MessageCircle, MousePointerClick, Trash2, X } from '@/components/joy/cute-icons'
import { Eye, EyeOff, ChevronsLeft, ChevronsRight, CircleCheck, Ellipsis, Copy as CopyIcon, SmilePlus, ArrowUp, Heart as HeartIcon, ListFilter, Search as SearchIcon, Smile as SmileIcon, ThumbsUp } from 'lucide-react'

/**
 * Customer review layer (Lovable-style): click "Comment", click any element,
 * leave a note. No account needed — just a name. Stored in localStorage for now.
 */

type Reply = { id: string; author: string; text: string; at: number }
const MAX_IMAGES = 3
const PANEL_W = 304
const RAIL_W = 56
const EMOJIS = ['😀','😂','😍','🤔','😅','😊','🥰','😎','🙏','👍','👎','❤️','🔥','✅','⭐','💡','🎉','🚀','💯','🤝','👏','💪','🙌','😭','🤣','😬','🫡','🤩','😤','😩','😮','🥳']

/** Shrink a picked image to a small JPEG data URL so it can live inside the comment itself (no storage bucket needed). */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, 1280 / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.max(1, Math.round(img.width * k))
      c.height = Math.max(1, Math.round(img.height * k))
      const g = c.getContext('2d')
      if (!g) return reject(new Error('canvas'))
      g.fillStyle = '#fff'
      g.fillRect(0, 0, c.width, c.height)
      g.drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.78))
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('image'))
    }
    img.src = url
  })
}
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
  images?: string[]
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
  const [draftImages, setDraftImages] = useState<string[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [active, setActive] = useState<string | null>(null)
  const [flash, setFlash] = useState<string | null>(null)
  const [tick, setTick] = useState(0)
  const [copied, setCopied] = useState(false)
  const [replyFor, setReplyFor] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all')
  const [query, setQuery] = useState('')
  const [menu, setMenu] = useState<string | null>(null) // 'filter' | 'more' | thread id
  const [hidden, setHidden] = useState(false)
  const [card, setCard] = useState<{ id: string; x: number; y: number } | null>(null)
  const [cardName, setCardName] = useState('')
  const [replyText, setReplyText] = useState('')
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
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
      setDraftImages([])
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

  // push the website aside while the comments dock is showing (wide screens only)
  useEffect(() => {
    const apply = () => {
      const w = hidden || window.innerWidth < 640 ? 0 : open ? PANEL_W : RAIL_W
      const el = document.documentElement
      el.style.setProperty('--joy-dock', `${w}px`)
      el.setAttribute('data-joy-dock', w ? '1' : '')
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      document.documentElement.style.removeProperty('--joy-dock')
      document.documentElement.removeAttribute('data-joy-dock')
    }
  }, [open, hidden])

  const openCard = useCallback(
    (id: string) => {
      const t = threadsRef.current.find((x) => x.id === id)
      if (!t) return
      const p = pos(t)
      setReplyText('')
      setEmojiOpen(false)
      setCard({ id, x: p.x - window.scrollX, y: p.y - window.scrollY })
    },
    [pos],
  )

  useEffect(() => {
    if (!card) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setCard(null)
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [card])

  const pageThreads = useMemo(() => threads.filter((t) => t.page === page), [threads, page])
  const shown = threads.filter((t) => {
    if (filter === 'open' && t.resolved) return false
    if (filter === 'resolved' && !t.resolved) return false
    const q = query.trim().toLowerCase()
    return !q || `${t.text} ${t.author} ${t.page} ${t.replies.map((r) => r.text).join(' ')}`.toLowerCase().includes(q)
  })
  const groups = shown.reduce<{ page: string; items: Thread[] }[]>((acc, t) => {
    const g = acc.find((x) => x.page === t.page)
    if (g) g.items.push(t)
    else acc.push({ page: t.page, items: [t] })
    return acc
  }, [])
  const pageLabel = (pg: string) => {
    const n = pg.replace(/\.html$/, '')
    return n === 'home' || n === 'index' ? 'Home' : `/${n}`
  }

  const addImages = async (files: FileList | File[] | null) => {
    if (!files) return
    const room = MAX_IMAGES - draftImages.length
    const list = Array.from(files).filter((f) => f.type.startsWith('image/')).slice(0, Math.max(0, room))
    const out: string[] = []
    for (const f of list) {
      try {
        out.push(await compressImage(f))
      } catch {}
    }
    if (out.length) setDraftImages((cur) => [...cur, ...out].slice(0, MAX_IMAGES))
  }

  const submitDraft = () => {
    if (!draft || (!draftText.trim() && !draftImages.length)) return
    let n = name
    if (!n) {
      n = nameInput.trim()
      if (!n) return
      setName(n)
      try {
        localStorage.setItem(NAME_KEY, n)
      } catch {}
    }
    const sig = `new|${page}|${authorKey(n)}|${draftText.trim()}|${draftImages.length}`
    const [lastSig, lastAt] = lastSend.current.split('@@')
    if (lastSig === sig && Date.now() - Number(lastAt) < 1500) return
    lastSend.current = `${sig}@@${Date.now()}`
    const t: Thread = { id: uid(), page, ...draft, author: n, text: draftText.trim(), at: Date.now(), resolved: false, replies: [], ...(draftImages.length ? { images: draftImages } : {}) }
    save([...threadsRef.current, t])
    setDraft(null)
    setDraftImages([])
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
        const q = threadsRef.current.find((x) => x.id === id)
        if (q) {
          const pp = pos(q)
          setCard({ id, x: pp.x - window.scrollX, y: pp.y - window.scrollY })
        }
      }, 750)
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
        (t.images?.length ? `\n  (${t.images.length} image${t.images.length > 1 ? 's' : ''} attached — see the comments panel)` : '') +
        t.replies.map((r) => `\n    ↳ ${r.author}: ${r.text}`).join(''),
    )
    navigator.clipboard?.writeText(lines.join('\n\n')).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  const addReply = (id: string) => {
    const text = replyText.trim()
    const who = name || cardName.trim()
    if (!text || !who) return
    if (!name) {
      setName(who)
      try {
        localStorage.setItem(NAME_KEY, who)
      } catch {}
    }
    // ignore a double submit (key repeat / double event) of the same reply
    const sig = `${id}|${authorKey(who)}|${text}`
    const now = Date.now()
    const [lastSig, lastAt] = lastSend.current.split('@@')
    if (lastSig === sig && now - Number(lastAt) < 1500) return
    lastSend.current = `${sig}@@${now}`
    setReplyText('')
    setReplyFor(null)
    save(
      threadsRef.current.map((t) =>
        t.id === id ? { ...t, replies: [...t.replies, { id: uid(), author: who, text, at: now }] } : t,
      ),
    )
  }

  const draftPos = draft ? pos(draft) : null
  void tick

  const hideAll = () => {
    setMode(false)
    setDraft(null)
    setCard(null)
    setMenu(null)
    setHidden(true)
  }

  if (hidden) {
    return (
      <button
        data-review-ui
        onClick={() => {
          setHidden(false)
          setOpen(true)
        }}
        className="fixed right-0 top-1/2 z-[85] flex -translate-y-1/2 items-center gap-1.5 rounded-l-full bg-[#fafafa] py-2.5 pl-3 pr-2.5 text-slate-700 shadow-[0_4px_18px_-4px_rgba(30,20,60,0.4)] ring-1 ring-black/10 transition hover:pl-4"
        aria-label="Show comments"
        title="Show comments"
      >
        <Eye className="size-4" />
        {threads.filter((t) => !t.resolved).length > 0 && (
          <span className="grid min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-5 text-white">{threads.filter((t) => !t.resolved).length}</span>
        )}
      </button>
    )
  }

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
                openCard(t.id)
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
              onPaste={(e) => {
                const imgs = Array.from(e.clipboardData.files).filter((f) => f.type.startsWith('image/'))
                if (imgs.length) {
                  e.preventDefault()
                  addImages(imgs)
                }
              }}
              className="w-full resize-none rounded-xl border border-indigo-200 p-2 text-sm outline-none focus:border-indigo-400"
            />
            {draftImages.length > 0 && (
              <div className="mt-2 flex gap-2">
                {draftImages.map((src, i) => (
                  <div key={i} className="relative size-16 overflow-hidden rounded-lg ring-1 ring-indigo-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="size-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setDraftImages((cur) => cur.filter((_, j) => j !== i))}
                      className="absolute right-0.5 top-0.5 grid size-5 place-items-center rounded-full bg-slate-900/70 text-white"
                      aria-label="Remove image"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={(e) => {
                addImages(e.target.files)
                e.target.value = ''
              }}
            />
            <div className="mt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={draftImages.length >= MAX_IMAGES}
                className="mr-auto inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 disabled:opacity-40"
                title="Attach images (or paste with Ctrl+V)"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="1.8" /><path d="m21 15-4.5-4.5L6 21" /></svg>
                Image{draftImages.length ? ` (${draftImages.length}/${MAX_IMAGES})` : ''}
              </button>
              <button onClick={() => setDraft(null)} className="h-8 rounded-full px-3 text-xs font-semibold text-slate-500 hover:bg-slate-100">
                Cancel
              </button>
              <button
                onClick={submitDraft}
                disabled={(!draftText.trim() && !draftImages.length) || (!name && !nameInput.trim())}
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
      <div data-review-ui style={{ left: 'calc(50% - var(--joy-dock, 0px) / 2)' }} className="fixed bottom-4 z-[80] flex -translate-x-1/2 flex-col items-center gap-2">
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

      {/* collapsed rail: avatars of the comments, click to expand */}
      {!open && (
        <div
          data-review-ui
          className="fixed bottom-0 right-0 top-0 z-[85] flex w-14 flex-col items-center gap-2.5 overflow-y-auto rounded-l-[1.4rem] bg-[#fafafa] pb-4 pt-4 shadow-[0_0_30px_-8px_rgba(30,20,60,0.35)] ring-1 ring-black/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-sm:w-11"
        >
          <button onClick={() => setOpen(true)} className="grid size-8 place-items-center rounded-full text-slate-600 hover:bg-black/5" aria-label="Open comments" title="Open comments">
            <ChevronsLeft className="size-[1.1rem]" />
          </button>
          <button onClick={hideAll} className="grid size-8 place-items-center rounded-full text-slate-500 hover:bg-black/5" aria-label="Hide comments" title="Hide comments (view full site)">
            <EyeOff className="size-4" />
          </button>
          {threads.slice(0, 8).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setOpen(true)
                setActive(t.id)
              }}
              style={{ backgroundColor: t.resolved ? '#10b981' : colorFor(t.author) }}
              className="grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold uppercase text-white ring-2 ring-transparent transition hover:ring-indigo-200"
              title={`${t.author}: ${t.text.slice(0, 60)}`}
              aria-label={`Comment by ${t.author}`}
            >
              {t.resolved ? <Check className="size-4" /> : (t.author.trim()[0] || '?').toUpperCase()}
            </button>
          ))}
          {threads.length > 8 && (
            <button onClick={() => setOpen(true)} className="grid size-8 place-items-center rounded-full bg-slate-200 text-xs font-bold text-slate-700 ring-1 ring-black/10 hover:bg-slate-300" aria-label="More comments">
              +{threads.length - 8}
            </button>
          )}
        </div>
      )}

      {/* docked comments panel (right side) */}
      {open && (
        <aside
          data-review-ui
          className="fixed bottom-0 right-0 top-0 z-[85] flex w-[19rem] max-w-full flex-col rounded-l-[1.4rem] bg-[#fafafa] text-left shadow-[0_0_30px_-8px_rgba(30,20,60,0.35)] ring-1 ring-black/10"
        >
          {menu && <div className="fixed inset-0 z-[1]" onClick={() => setMenu(null)} />}
          <header className="flex items-center justify-between gap-2 px-4 pb-2.5 pt-4">
            <h2 className="text-sm font-bold text-slate-900">Comments</h2>
            <div className="flex items-center gap-0.5">
              <button onClick={hideAll} className="grid size-7 place-items-center rounded-full text-slate-500 hover:bg-black/5" aria-label="Hide comments" title="Hide comments (view full site)">
                <EyeOff className="size-4" />
              </button>
              <button onClick={() => setOpen(false)} className="grid size-7 place-items-center rounded-full text-slate-600 hover:bg-black/5" aria-label="Collapse comments" title="Collapse">
                <ChevronsRight className="size-4" />
              </button>
            </div>
          </header>
          <div className="relative z-[2] flex items-center gap-1 px-4 pb-2.5">
            <label className="flex h-9 min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-3 text-slate-400 ring-1 ring-slate-200 focus-within:ring-indigo-300">
              <SearchIcon className="size-4 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 outline-none placeholder:text-slate-400"
              />
            </label>
            <div className="relative">
              <button
                onClick={() => setMenu(menu === 'filter' ? null : 'filter')}
                className={`grid size-9 place-items-center rounded-full hover:bg-black/5 ${filter !== 'all' ? 'text-indigo-600' : 'text-slate-700'}`}
                aria-label="Filter"
                title="Filter"
              >
                <ListFilter className="size-[1.1rem]" />
              </button>
              {menu === 'filter' && (
                <div className="absolute right-0 top-11 z-10 w-36 rounded-2xl bg-white p-1.5 text-sm font-semibold shadow-xl ring-1 ring-black/10">
                  {(['all', 'open', 'resolved'] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFilter(f)
                        setMenu(null)
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2 capitalize text-slate-700 hover:bg-slate-50"
                    >
                      {f}
                      {filter === f && <Check className="size-3.5 text-indigo-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setMenu(menu === 'more' ? null : 'more')} className="grid size-9 place-items-center rounded-full text-slate-700 hover:bg-black/5" aria-label="More">
                <Ellipsis className="size-[1.1rem]" />
              </button>
              {menu === 'more' && (
                <div className="absolute right-0 top-11 z-10 w-40 rounded-2xl bg-white p-1.5 text-sm font-semibold shadow-xl ring-1 ring-black/10">
                  <button
                    onClick={() => {
                      exportText()
                      setMenu(null)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50"
                  >
                    <ClipboardCopy className="size-4" /> {copied ? 'Copied' : 'Copy all'}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pb-24">
            {groups.length === 0 && (
              <p className="px-5 py-10 text-center text-sm text-slate-400">
                {query || filter !== 'all' ? 'No comments match.' : 'No comments yet. Switch to “Comment” and click anything on the page.'}
              </p>
            )}
            {groups.map((g) => (
              <section key={g.page} className="mb-2">
                <h3 className="flex items-center gap-2.5 px-4 pb-1 pt-2.5 text-xs font-bold text-slate-500">
                  {pageLabel(g.page)}
                  <span className="h-px flex-1 bg-slate-200" />
                </h3>
                {g.items.map((t) => {
                  const isActive = active === t.id
                  const long = t.text.length > 90 || t.text.includes('\n')
                  return (
                    <div
                      key={t.id}
                      className={`group relative mx-1.5 rounded-xl px-2.5 py-2 text-[13px] transition ${isActive ? 'bg-white shadow-sm ring-2 ring-indigo-300' : 'hover:bg-white/70'} ${t.resolved && !isActive ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span style={{ backgroundColor: colorFor(t.author) }} className="grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold uppercase text-white">
                          {(t.author.trim()[0] || '?').toUpperCase()}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => goTo(t)} className="flex min-w-0 flex-1 items-center gap-1.5 text-left">
                              <b className="truncate text-[13px] text-slate-900">{t.author}</b>
                              <span className="shrink-0 text-[11px] text-slate-400">· {ago(t.at)}</span>
                              <span className={`size-1.5 shrink-0 rounded-full ${t.resolved ? 'bg-emerald-500' : 'bg-rose-500'}`} title={t.resolved ? 'Resolved' : 'Open'} />
                            </button>
                            <button
                              type="button"
                              onClick={() => save(threads.map((x) => (x.id === t.id ? { ...x, resolved: !x.resolved } : x)))}
                              className={`grid size-6 shrink-0 place-items-center rounded-full text-slate-700 transition hover:bg-black/5 ${t.resolved ? '' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100'}`}
                              aria-label={t.resolved ? 'Reopen' : 'Resolve'}
                              title={t.resolved ? 'Reopen' : 'Resolve'}
                            >
                              <CircleCheck className={`size-4 ${t.resolved ? 'text-emerald-600' : ''}`} />
                            </button>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setMenu(menu === t.id ? null : t.id)}
                                className={`grid size-6 shrink-0 place-items-center rounded-full text-slate-700 transition hover:bg-black/5 ${menu === t.id ? 'bg-black/5 opacity-100' : 'opacity-0 focus-visible:opacity-100 group-hover:opacity-100'}`}
                                aria-label="More"
                              >
                                <Ellipsis className="size-4" />
                              </button>
                              {menu === t.id && (
                                <div className="absolute right-0 top-8 z-10 w-44 rounded-2xl bg-white p-1.5 text-sm font-semibold shadow-xl ring-1 ring-black/10">
                                  <button
                                    onClick={() => {
                                      copyOne(t)
                                      setMenu(null)
                                    }}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50"
                                  >
                                    <ClipboardCopy className="size-4" /> Copy comment
                                  </button>
                                  <button
                                    onClick={() => {
                                      save(threads.filter((x) => x.id !== t.id))
                                      setMenu(null)
                                    }}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-rose-600 hover:bg-rose-50"
                                  >
                                    <Trash2 className="size-4" /> Delete thread
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <button onClick={() => goTo(t)} className="mt-0.5 block w-full text-left">
                            <span className={`block whitespace-pre-line break-words text-[13px] leading-snug text-slate-700 ${isActive ? '' : 'line-clamp-3'}`}>{t.text}</span>
                          </button>
                          {long && !isActive && (
                            <button onClick={() => setActive(t.id)} className="mt-1 text-xs text-slate-500 hover:text-slate-800">
                              Show more
                            </button>
                          )}
                          {!!t.images?.length && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                              {t.images.map((src, i) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  key={i}
                                  src={src}
                                  alt="Attached"
                                  onClick={() => setLightbox(src)}
                                  className={`cursor-zoom-in rounded-lg object-cover ring-1 ring-black/10 ${isActive ? 'h-20 w-20' : 'size-11'}`}
                                />
                              ))}
                            </div>
                          )}
                          {!isActive && t.replies.length > 0 && (
                            <button onClick={() => setActive(t.id)} className="mt-1 block text-xs text-slate-400 hover:text-slate-600">
                              {t.replies.length} {t.replies.length === 1 ? 'reply' : 'replies'}
                            </button>
                          )}
                          {isActive && (
                            <div className="mt-2">
                              <div className="flex gap-1.5">
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
                              {t.replies.map((r) => (
                                <p key={r.id} className="mt-2 border-l-2 pl-2 text-xs text-slate-600" style={{ borderColor: colorFor(r.author) }}>
                                  <b style={{ color: colorFor(r.author) }}>{r.author}</b> · {r.text}
                                </p>
                              ))}
                              <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-500">
                                <button
                                  type="button"
                                  onClick={() => setReplyFor(replyFor === t.id ? null : t.id)}
                                  className={`rounded-full px-2.5 py-1 hover:bg-slate-100 ${replyFor === t.id ? 'bg-slate-100 text-indigo-600' : ''}`}
                                >
                                  Reply
                                </button>
                                <button type="button" onClick={() => goTo(t)} className="rounded-full px-2.5 py-1 hover:bg-slate-100" title="Scroll to where this comment was left">
                                  Show on page
                                </button>
                                <span className="flex-1" />
                                <button type="button" onClick={() => setActive(null)} className="rounded-full px-2.5 py-1 hover:bg-slate-100">
                                  Show less
                                </button>
                              </div>
                              {replyFor === t.id && (
                                <input
                                  autoFocus
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key !== 'Enter' || e.nativeEvent.isComposing || e.repeat) return
                                    e.preventDefault()
                                    addReply(t.id)
                                  }}
                                  placeholder={name ? 'Write a reply, press Enter…' : 'Add a comment first to set your name'}
                                  disabled={!name}
                                  className="mt-2 h-8 w-full rounded-full border border-slate-200 bg-white px-3 text-xs outline-none focus:border-indigo-400"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </section>
            ))}
          </div>
        </aside>
      )}

      {card && (() => {
        const t = threads.find((x) => x.id === card.id)
        if (!t) return null
        const W = 304
        const rightEdge = window.innerWidth - (window.innerWidth >= 640 ? (open ? PANEL_W : RAIL_W) : 0) - 12
        const left = Math.min(Math.max(12, card.x - 24), Math.max(12, rightEdge - W))
        const below = card.y < window.innerHeight * 0.5
        const style: React.CSSProperties = below
          ? { left, top: Math.max(12, card.y + 14), maxHeight: window.innerHeight - card.y - 28 }
          : { left, bottom: Math.max(12, window.innerHeight - card.y + 44), maxHeight: card.y - 60 }
        const who = name || cardName.trim()
        const canSend = !!replyText.trim() && !!who
        return (
          <section
            data-review-ui
            role="dialog"
            aria-label="Comment"
            className="fixed z-[88] flex w-[19rem] max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-[1.6rem] bg-white text-left shadow-[0_20px_60px_-12px_rgba(30,20,60,0.4)] ring-1 ring-black/10"
            style={style}
          >
            <header className="flex items-center gap-1 px-4 pb-2 pt-3.5">
              <h3 className="flex-1 text-[0.95rem] font-bold text-slate-900">Comment</h3>
              <button
                onClick={() => {
                  copyOne(t)
                  setLinkCopied(true)
                  setTimeout(() => setLinkCopied(false), 1500)
                }}
                className="grid size-8 place-items-center rounded-full text-slate-700 hover:bg-black/5"
                aria-label="Copy comment"
                title="Copy comment"
              >
                {linkCopied ? <Check className="size-4 text-emerald-600" /> : <CopyIcon className="size-4" />}
              </button>
              <button
                onClick={() => save(threads.map((x) => (x.id === t.id ? { ...x, resolved: !x.resolved } : x)))}
                className="grid size-8 place-items-center rounded-full text-slate-700 hover:bg-black/5"
                aria-label={t.resolved ? 'Reopen' : 'Resolve'}
                title={t.resolved ? 'Reopen' : 'Resolve'}
              >
                <CircleCheck className={`size-[1.1rem] ${t.resolved ? 'text-emerald-600' : ''}`} />
              </button>
              <button
                onClick={() => {
                  save(threads.filter((x) => x.id !== t.id))
                  setCard(null)
                }}
                className="grid size-8 place-items-center rounded-full text-rose-600 hover:bg-rose-50"
                aria-label="Delete thread"
                title="Delete thread"
              >
                <Trash2 className="size-4" />
              </button>
              <button onClick={() => setCard(null)} className="grid size-8 place-items-center rounded-full text-slate-700 hover:bg-black/5" aria-label="Close">
                <X className="size-4" />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-3">
              {!!t.images?.length && (
                <div className="mb-3 grid gap-1.5">
                  {t.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={src} alt="Attached" onClick={() => setLightbox(src)} className="max-h-44 w-full cursor-zoom-in rounded-xl bg-slate-100 object-contain ring-1 ring-black/5" />
                  ))}
                </div>
              )}
              {[{ id: t.id, author: t.author, text: t.text, at: t.at }, ...t.replies].map((m) => (
                <div key={m.id} className="mb-3 flex items-start gap-2.5">
                  <span style={{ backgroundColor: colorFor(m.author) }} className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold uppercase text-white">
                    {(m.author.trim()[0] || '?').toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-baseline gap-2">
                      <b className="truncate text-sm text-slate-900">{m.author}</b>
                      <span className="shrink-0 text-xs text-slate-400">{ago(m.at ?? t.at)}</span>
                    </p>
                    <p className="whitespace-pre-line break-words text-sm leading-snug text-slate-700">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative flex items-start gap-2.5 px-4 pb-4 pt-1">
              <span style={{ backgroundColor: colorFor(who || '?') }} className="mt-1 grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold uppercase text-white">
                {(who.trim()[0] || '?').toUpperCase()}
              </span>
              <div className="min-w-0 flex-1 rounded-2xl bg-slate-50 ring-1 ring-slate-200 focus-within:ring-indigo-300">
                {!name && (
                  <input
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="Your name"
                    className="h-9 w-full rounded-t-2xl border-b border-slate-200 bg-transparent px-3 text-sm outline-none"
                  />
                )}
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter' || e.shiftKey || e.nativeEvent.isComposing || e.repeat) return
                    e.preventDefault()
                    addReply(t.id)
                  }}
                  placeholder="Reply"
                  rows={1}
                  className="block max-h-28 min-h-9 w-full resize-none bg-transparent px-3 py-2 text-sm outline-none"
                />
                <div className="flex items-center justify-between px-2 pb-1.5">
                  <button type="button" onClick={() => setEmojiOpen((o) => !o)} className="grid size-8 place-items-center rounded-full text-slate-600 hover:bg-black/5" aria-label="Add emoji">
                    <SmilePlus className="size-[1.15rem]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => addReply(t.id)}
                    disabled={!canSend}
                    className={`grid size-8 place-items-center rounded-full text-white transition ${canSend ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-400/70'}`}
                    aria-label="Send reply"
                  >
                    <ArrowUp className="size-4" />
                  </button>
                </div>
              </div>
              {emojiOpen && (
                <div className="absolute bottom-[3.4rem] left-12 z-10 grid grid-cols-8 gap-0.5 rounded-2xl bg-white p-2 shadow-xl ring-1 ring-black/10">
                  {EMOJIS.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setReplyText((v) => v + em)
                        setEmojiOpen(false)
                      }}
                      className="grid size-7 place-items-center rounded-lg text-lg hover:bg-slate-100"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })()}

      {lightbox && (
        <div data-review-ui onClick={() => setLightbox(null)} className="fixed inset-0 z-[100] grid cursor-zoom-out place-items-center bg-black/80 p-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightbox} alt="Attached" className="max-h-full max-w-full rounded-xl shadow-2xl" />
        </div>
      )}
    </div>
  )
}
