'use client'

import type { MouseEvent, ReactNode } from 'react'

/** Opens mail / Telegram / WhatsApp. Plain <a> semantics for normal browsers; falls back to location when popups are blocked. */
export function ContactLink({
  href,
  className,
  children,
  title,
}: {
  href: string
  className?: string
  children: ReactNode
  title?: string
}) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    try {
      const w = window.open(href, '_blank', 'noopener,noreferrer')
      if (!w) window.location.href = href
    } catch {
      try {
        window.location.href = href
      } catch {}
    }
  }
  return (
    <a
      href={href}
      onClick={onClick}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  )
}
