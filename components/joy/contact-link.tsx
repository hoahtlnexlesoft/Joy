'use client'

import type { MouseEvent, ReactNode } from 'react'

const isMobile = () => typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

/**
 * Opens mail / Telegram / WhatsApp.
 * - With `appHref` (desktop): tries the installed app first; if the app doesn't take focus, falls back to `href` in a new window.
 * - On phones the https link is used directly (it opens the app when installed).
 */
export function ContactLink({
  href,
  appHref,
  className,
  children,
  title,
}: {
  href: string
  appHref?: string
  className?: string
  children: ReactNode
  title?: string
}) {
  const openWeb = () => {
    try {
      // no 'noopener' feature here: it makes window.open() return null even on success
      const w = window.open(href, '_blank')
      if (w) w.opener = null
      else window.location.href = href
    } catch {
      try {
        window.location.href = href
      } catch {}
    }
  }

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    if (!appHref || isMobile()) return openWeb()

    let appOpened = false
    const mark = () => {
      appOpened = true
    }
    const onVis = () => document.hidden && mark()
    window.addEventListener('blur', mark)
    document.addEventListener('visibilitychange', onVis)
    // launch the app protocol from a hidden iframe so this page never navigates away if no app handles it
    const frame = document.createElement('iframe')
    frame.style.cssText = 'position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none'
    frame.setAttribute('aria-hidden', 'true')
    frame.src = appHref
    document.body.appendChild(frame)
    setTimeout(() => frame.remove(), 3000)
    setTimeout(() => {
      window.removeEventListener('blur', mark)
      document.removeEventListener('visibilitychange', onVis)
      if (!appOpened) openWeb()
    }, 1600)
  }

  return (
    <a href={href} onClick={onClick} title={title} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  )
}
