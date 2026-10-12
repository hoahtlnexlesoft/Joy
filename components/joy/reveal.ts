// Staggered reveal: top-to-bottom, left-to-right, as elements load or scroll into view.
const SEL = 'h1, h2, h3, h4, p, li, article, table, a, button'

function eligible(el: Element): boolean {
  if (el.closest('[aria-hidden="true"], header, [data-no-reveal]')) return false
  const cs = getComputedStyle(el)
  if (cs.display === 'contents' || cs.display === 'none') return false
  if (cs.position === 'absolute' || cs.position === 'fixed' || cs.position === 'sticky') return false
  if (/\banimate-/.test(el.getAttribute('class') || '')) return false
  return true
}

export function startReveal(root: HTMLElement): () => void {
  if (typeof window === 'undefined') return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const scope = Array.from(root.querySelectorAll('main, footer'))
  const all = scope.flatMap((s) => Array.from(s.querySelectorAll(SEL)))
  root.querySelectorAll("img[loading=lazy]").forEach((im) => { (im as HTMLImageElement).loading = "eager"; (im as HTMLImageElement).decoding = "async" })
  const ok = new Set(all.filter(eligible))
  const targets: Element[] = []
  for (const el of all) {
    if (!ok.has(el)) { el.classList.add('rv-in', 'rv-now'); continue }
    let p = el.parentElement?.closest(SEL)
    let nested = false
    while (p) { if (ok.has(p)) { nested = true; break } p = p.parentElement?.closest(SEL) ?? null }
    if (nested) el.classList.add('rv-in', 'rv-now')
    else targets.push(el)
  }

  // Images / figures / videos outside any animated block: fade in on scroll too.
  // Only those below the first screen are hidden, so the hero image never waits.
  root.querySelectorAll('main img, main figure, main video, footer img').forEach((el) => {
    if (el.closest('[aria-hidden="true"], header, [data-no-reveal]')) return
    if (el.closest('.rv-pre, .joy-no-rv')) return
    const host = el.parentElement?.closest(SEL)
    if (host && ok.has(host)) return
    if (el.tagName === 'IMG' && el.closest('figure')) return
    const cs = getComputedStyle(el)
    if (cs.position === 'absolute' || cs.position === 'fixed' || cs.position === 'sticky') return
    if (/\banimate-/.test(el.getAttribute('class') || '')) return
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return
    el.classList.add('rv-pre')
    targets.push(el)
  })

  const io = new IntersectionObserver(
    (entries) => {
      const hit = entries.filter((e) => e.isIntersecting)
      if (!hit.length) return
      hit.sort((a, b) => {
        const ra = a.boundingClientRect, rb = b.boundingClientRect
        const ba = Math.round(ra.top / 60), bb = Math.round(rb.top / 60)
        return ba - bb || ra.left - rb.left
      })
      // Cards laid out side by side (3+ in one row) appear one after another.
      const rowIdx = new Map<Element, number>()
      const groups = new Map<Element, IntersectionObserverEntry[]>()
      hit.forEach((e) => {
        let par: Element | null = e.target.closest('ol, ul') ?? e.target.parentElement
        while (par && getComputedStyle(par).display === 'contents') par = par.parentElement
        if (par) groups.set(par, [...(groups.get(par) ?? []), e])
      })
      groups.forEach((g) => {
        if (g.length < 3) return
        const tops = g.map((x) => x.boundingClientRect.top)
        if (Math.max(...tops) - Math.min(...tops) > 160) return
        g.sort((a, b) => a.boundingClientRect.left - b.boundingClientRect.left).forEach((x, k) => rowIdx.set(x.target, k))
      })
      hit.forEach((e, i) => {
        const el = e.target as HTMLElement
        const k = rowIdx.get(el)
        el.style.animationDelay = k !== undefined ? `${k * 380}ms` : `${Math.min(i, 8) * 50}ms`
        if (k !== undefined) el.classList.add('rv-card')
        el.classList.add('rv-in')
        io.unobserve(el)
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -5% 0px' },
  )
  targets.forEach((t) => io.observe(t))

  // Content mounted later (accordions, dialogs, tabs) shows instantly.
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((n) => {
        if (!(n instanceof Element)) return
        if (n.matches(SEL)) n.classList.add('rv-in', 'rv-now')
        n.querySelectorAll(SEL).forEach((c) => c.classList.add('rv-in', 'rv-now'))
      })
    }
  })
  mo.observe(root, { childList: true, subtree: true })

  return () => { io.disconnect(); mo.disconnect() }
}
