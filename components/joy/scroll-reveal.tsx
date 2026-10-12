'use client'

import { useLayoutEffect } from 'react'

const STAGGER_MS = 90
const MAX_DELAY_MS = 540

function isDecorative(el: Element) {
  const style = getComputedStyle(el)
  return style.position === 'absolute' || style.position === 'fixed' || el.getAttribute('aria-hidden') === 'true'
}

function expand(el: Element): Element[] {
  if (getComputedStyle(el).display === 'contents') {
    return Array.from(el.children).flatMap(expand)
  }
  return [el]
}

function findContainer(root: Element) {
  let node = root
  for (let depth = 0; depth < 3; depth++) {
    const children = Array.from(node.children).filter((c) => !isDecorative(c))
    if (children.length !== 1) break
    node = children[0]
  }
  return node
}

function collectTargets(root: Element) {
  const container = findContainer(root)
  const targets: Element[] = []

  for (const child of Array.from(container.children)) {
    if (isDecorative(child)) continue
    const tag = child.tagName
    const grandchildren = Array.from(child.children).filter((c) => !isDecorative(c))
    const isGroup =
      grandchildren.length >= 2 &&
      grandchildren.length <= 10 &&
      !['A', 'BUTTON', 'IMG', 'FIGURE', 'LI', 'P', 'H1', 'H2', 'H3', 'UL'].includes(tag)

    if (isGroup) targets.push(...grandchildren.flatMap(expand))
    else targets.push(...expand(child))
  }
  return targets
}

export function ScrollReveal() {
  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const header = document.querySelector('body > header, header.sticky')
    header?.classList.add('reveal-header')

    const roots = Array.from(document.querySelectorAll('main > section, body footer'))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          observer.unobserve(el)
          el.classList.remove('reveal-pending')
          el.classList.add('reveal-in')
          el.addEventListener(
            'animationend',
            () => {
              el.classList.remove('reveal-in')
              el.style.removeProperty('--reveal-delay')
            },
            { once: true },
          )
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    )

    const tracked: HTMLElement[] = []
    for (const root of roots) {
      collectTargets(root).forEach((target, index) => {
        const el = target as HTMLElement
        el.style.setProperty('--reveal-delay', `${Math.min(index * STAGGER_MS, MAX_DELAY_MS)}ms`)
        el.classList.add('reveal-pending')
        tracked.push(el)
        observer.observe(el)
      })
    }

    return () => {
      observer.disconnect()
      header?.classList.remove('reveal-header')
      for (const el of tracked) el.classList.remove('reveal-pending', 'reveal-in')
    }
  }, [])

  return null
}
