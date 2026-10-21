'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { JoyAnim, type AnimKind } from '@/components/joy/anim/joy-anim'
import { PageLoader } from '@/components/joy/page-loader'

type Card = {
  kind: AnimKind
  letter: string
  name: string
  tag: string
  where: string
  how: string
  bg: string
  caption?: string
  full?: { label: string; kind: 'orbit' | 'land' | 'night'; text: string }
}

const CARDS: Card[] = [
  { kind: 'orbit', letter: 'A', name: 'Figure-8 butterfly', tag: 'Page loader', bg: 'linear-gradient(160deg,#fff4e6,#ffe1ee 55%,#ece4ff)',
    where: 'Full-page loader when you move between pages.', how: 'Click any link (Pricing, How it works, Parent Portal) on a slow connection.',
    full: { label: 'Preview full page', kind: 'orbit', text: 'Joy is getting ready' } },
  { kind: 'night', letter: 'B', name: 'Night light', tag: 'First load', bg: 'linear-gradient(170deg,#2a2550,#4b3f86 70%,#6a4f9c)',
    where: 'The very first screen when the site opens on a slow network.', how: 'Open the site on a slow connection. It stays hidden if the page loads fast.',
    full: { label: 'Preview full page', kind: 'night', text: 'Joy is getting ready' } },
  { kind: 'land', letter: 'C', name: 'Butterfly lands on the logo', tag: 'Opening Parent Portal', bg: 'linear-gradient(160deg,#eaf4ff,#f6ecff 60%,#fff0f4)',
    where: 'Loader while the Parent Portal opens.', how: 'Open the Parent Portal on a slow connection.',
    full: { label: 'Preview full page', kind: 'land', text: 'Opening your Parent Portal…' } },
  { kind: 'gift', letter: 'D', name: 'Gift box opens', tag: 'After buying a plan', bg: 'linear-gradient(160deg,#ffeef3,#fff4e0 55%,#efe8ff)', caption: 'Discovery is ready for Thomas',
    where: 'Top of the "… is ready for …" dialog after a purchase.', how: 'Parent Portal → Plans → Buy a plan → finish checkout.' },
  { kind: 'steps', letter: 'E', name: 'Kid hops through the steps', tag: 'Buy flow', bg: 'linear-gradient(160deg,#f3eefc,#fff1f5)', caption: 'All set for Thomas',
    where: 'The Plan → Pay → Child steps at the top of the buy dialog. The kid hops to the step you are on.', how: 'Parent Portal → Plans → Buy a plan, then move between steps.' },
  { kind: 'plant', letter: 'F', name: 'Growing plant', tag: 'Child profile', bg: 'linear-gradient(170deg,#e6f6ee,#fff6e8)',
    where: 'Header of each child profile. A seed grows into a flower and a butterfly visits.', how: 'Parent Portal → Children → open a child (screens wider than a phone).' },
]

export function AnimationGallery() {
  const [keys, setKeys] = useState<Record<string, number>>({})
  const [full, setFull] = useState<Card['full'] | null>(null)
  useEffect(() => {
    if (!full) return
    const t = window.setTimeout(() => setFull(null), 8000)
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setFull(null)
    window.addEventListener('keydown', k)
    return () => { window.clearTimeout(t); window.removeEventListener('keydown', k) }
  }, [full])

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <article key={c.kind} className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white shadow-[0_18px_40px_-28px_rgba(58,40,100,0.45)] ring-1 ring-[#efe4d7]">
            <div style={{ background: c.bg }}>
              <JoyAnim kind={c.kind} caption={c.caption} replayKey={keys[c.kind] ?? 0} className="block h-auto w-full" />
            </div>
            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-[#efe8fa] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#5b3fc0]">{c.tag}</span>
                <button type="button" onClick={() => setKeys((k) => ({ ...k, [c.kind]: (k[c.kind] ?? 0) + 1 }))} className="rounded-full bg-[#ff7a45] px-4 py-1.5 text-xs font-bold text-white transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a45]/60 focus-visible:ring-offset-2">Replay</button>
              </div>
              <h2 className="font-display text-xl font-bold text-[#27253f]"><span className="mr-2 inline-grid size-6 place-items-center rounded-full bg-[#ff7a45] text-sm text-white">{c.letter}</span>{c.name}</h2>
              <p className="text-sm text-[#6b6380]"><b className="text-[#27253f]">Used for:</b> {c.where}</p>
              <p className="text-sm text-[#6b6380]"><b className="text-[#27253f]">See it:</b> {c.how}</p>
              {c.full && (
                <button type="button" onClick={() => setFull(c.full!)} className="mt-auto w-fit rounded-full bg-[#f6f1fb] px-4 py-2 text-sm font-semibold text-[#5b3fc0] transition hover:bg-[#ece4fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5b3fc0]/50">{c.full.label}</button>
              )}
            </div>
          </article>
        ))}
      </div>

      {full && (
        <div className="fixed inset-0 z-[2147483000]">
          <PageLoader kind={full.kind} label={full.text} />
          <button type="button" autoFocus onClick={() => setFull(null)} className="fixed right-4 top-4 z-[101] rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-[#27253f] shadow-lg backdrop-blur focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff7a45]">Close preview</button>
        </div>
      )}
    </>
  )
}

export function AnimationHeader() {
  return (
    <header className="flex flex-col gap-3">
      <a href="/" className="inline-flex w-fit items-center gap-3 text-sm font-semibold text-[#6b6380] hover:text-[#27253f]">
        <Image src="/images/joy-logo.webp" alt="Joy" width={72} height={33} className="h-auto w-[4.5rem]" />
        <span>← Back to Joy</span>
      </a>
      <h1 className="font-display text-3xl font-extrabold text-[#27253f] sm:text-4xl">Joy animations</h1>
      <p className="max-w-2xl text-base text-[#6b6380]">Six small animations used across the site. Each card says where it appears and how to see it. Press Replay to watch one again.</p>
    </header>
  )
}
