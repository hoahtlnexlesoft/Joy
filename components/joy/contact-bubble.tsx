'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { ContactLink } from '@/components/joy/contact-link'
import { Mail, MessageCircle, MessageCircleHeart, Phone, X } from '@/components/joy/cute-icons'

const CHANNELS = [
  { icon: Mail, label: 'Email', value: 'support@joykids.app', note: 'Reply within 24 hours', href: 'mailto:support@joykids.app' },
  { icon: MessageCircle, label: 'Telegram', value: '@JoyKidsSupport', note: 'Chat with the Joy team', href: 'https://t.me/JoyKidsSupport' },
  { icon: Phone, label: 'WhatsApp', value: '+95 9 123 456 789', note: 'Quick answers, any time', href: 'https://wa.me/959123456789' },
]

export function ContactBubble() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname() || '/'
  const last = pathname.replace(/\.html$/, '').replace(/\/$/, '').split('/').pop() || ''

  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', k)
    return () => document.removeEventListener('keydown', k)
  }, [open])

  if (['parent', 'device'].includes(last)) return null

  return (
    <div data-review-ui data-no-reveal className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 text-left">
      {open && (
        <section
          role="dialog"
          aria-label="Quick contact"
          className="w-[20rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl bg-white ring-1 ring-black/5 shadow-[0_18px_50px_-12px_rgba(60,30,60,0.35)]"
        >
          <header className="relative bg-gradient-joy px-5 pb-4 pt-5 text-white">
            <h2 className="text-base font-extrabold">Contact customer service</h2>
            <p className="mt-1 pr-8 text-xs leading-snug text-white/85">
              Can’t find what you need? Reach the Joy team by email, Telegram or WhatsApp.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid size-7 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </header>
          <ul className="space-y-1 px-3 py-3 pb-4">
            {CHANNELS.map(({ icon: Icon, label, value, note, href }) => (
              <li key={label}>
                <ContactLink
                  href={href}
                  className="flex items-center gap-3 rounded-2xl px-2 py-2 transition hover:bg-pink-50"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-pink-50 text-pink-600 ring-1 ring-pink-100">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[11px] font-extrabold uppercase tracking-[0.14em] text-pink-600">{label}</span>
                    <span className="block truncate text-sm font-bold text-slate-900">{value}</span>
                    <span className="block truncate text-xs text-slate-500">{note}</span>
                  </span>
                </ContactLink>
              </li>
            ))}
          </ul>
        </section>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="grid size-14 place-items-center rounded-full bg-gradient-joy text-white shadow-xl ring-4 ring-white/70 transition hover:scale-105"
        aria-label={open ? 'Close contact' : 'Contact customer service'}
        aria-expanded={open}
      >
        {open ? <X className="size-6" /> : <MessageCircleHeart className="size-7" />}
      </button>
    </div>
  )
}
