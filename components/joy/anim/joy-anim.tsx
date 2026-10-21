'use client'

import { useEffect, useMemo, useRef } from 'react'

/**
 * Joy's six cute animations. Each one is a small SVG stage (400 x 260) driven by a
 * clock, so the same stage works inside a card, a dialog or a full-page loader.
 *
 *   orbit  Butterfly figure-8 around the logo   -> page-to-page loader
 *   land   Butterfly lands on the logo          -> opening the Parent Portal
 *   plant  Seed -> flower, butterfly visits     -> child profile header
 *   gift   Gift opens, confetti, butterfly      -> "<Plan> is ready for <Child>"
 *   steps  Child hops Plan -> Pay -> Child      -> showcase of the buy stepper
 *   night  Moon, stars, glowing butterfly       -> first load on a slow network
 */
export type AnimKind = 'orbit' | 'land' | 'plant' | 'gift' | 'steps' | 'night'

type Frame = (t: number) => void
type Init = (svg: SVGSVGElement) => { frame: Frame; dur: number; rest: number }

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const E = {
  out: (t: number) => 1 - Math.pow(1 - t, 3),
  io: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  back: (t: number) => { const c = 1.70158; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2) },
}
type P = [number, number]
const arc = (p0: P, p1: P, p2: P, u: number) => {
  const m = 1 - u
  return {
    x: m * m * p0[0] + 2 * m * u * p1[0] + u * u * p2[0],
    y: m * m * p0[1] + 2 * m * u * p1[1] + u * u * p2[1],
    ang: Math.atan2(2 * m * (p1[1] - p0[1]) + 2 * u * (p2[1] - p1[1]), 2 * m * (p1[0] - p0[0]) + 2 * u * (p2[0] - p1[0])) * 180 / Math.PI + 90,
  }
}
const place = (g: Element, x: number, y: number, ang: number, sc: number) =>
  g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${sc})`)
const bounce = (d: number) => (d > 0 && d < 1.4 ? Math.exp(-d * 5) * Math.cos(d * 18) : 0)
const burst = (els: Element[], cx: number, cy: number, d: number, r: number) =>
  els.forEach((el, i) => {
    const a = (i * (360 / els.length) * Math.PI) / 180, k = clamp(d)
    el.setAttribute('transform', `translate(${(cx + Math.cos(a) * (8 + r * E.out(k))).toFixed(1)} ${(cy + Math.sin(a) * (8 + r * E.out(k))).toFixed(1)}) scale(${((1 - k) * 1.1).toFixed(2)})`)
    el.setAttribute('opacity', d > 0 && d < 1 ? String(1 - k) : '0')
  })
const $ = (s: Element, sel: string) => s.querySelector(sel) as SVGElement
const $$ = (s: Element, sel: string) => Array.from(s.querySelectorAll(sel)) as SVGElement[]

const SPARK_COL = ['#ffb04a', '#ff6b8b', '#9a7bff', '#ffd166']
const DEFS = '<defs><path id="joy-sp" d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z"/></defs>'
const sparks = (n: number) => Array.from({ length: n }, (_, i) => `<use href="#joy-sp" class="sk" fill="${SPARK_COL[i % 4]}" opacity="0"/>`).join('')
/** The real Joy butterfly. `class="bf"` flaps; the wrapper `bw` is moved by the frame function. */
const BUTTERFLY = (x: number, y: number, extra = '') =>
  `<g class="bw" transform="translate(${x} ${y})" ${extra}><g class="joy-bf"><image href="/images/butterfly-purple.webp" x="-24" y="-18" width="48" height="36"/></g></g>`
const LOGO = (x: number, y: number, w: number) => `<image href="/images/joy-logo.webp" x="${x}" y="${y}" width="${w}" height="${(w * 119) / 260}"/>`
const FONT = "font-family=\"'Plus Jakarta Sans',system-ui,sans-serif\" font-weight=\"700\""

const MARKUP: Record<AnimKind, (caption?: string) => string> = {
  orbit: () =>
    DEFS + LOGO(130, 98, 140) +
    Array.from({ length: 16 }, (_, i) => `<use href="#joy-sp" class="tr" fill="${['#ffb04a', '#ff6b8b', '#9a7bff'][i % 3]}" opacity="0"/>`).join('') +
    BUTTERFLY(200, 130),

  land: () => DEFS + `<g class="lo">${LOGO(105, 100, 190)}</g>` + sparks(6) + BUTTERFLY(206, 92),

  plant: () => DEFS +
    `<ellipse cx="200" cy="246" rx="70" ry="6" fill="#000" opacity=".06"/>
     <path class="stem" d="M200 206 C200 170 192 138 200 104" pathLength="1" stroke="#3ec46d" stroke-width="5" stroke-linecap="round" fill="none" stroke-dasharray="1" stroke-dashoffset="1"/>
     <g class="l1" transform="translate(198 168) scale(0)"><ellipse cx="-15" cy="0" rx="15" ry="7" fill="#58d68d" transform="rotate(-18)"/></g>
     <g class="l2" transform="translate(200 140) scale(0)"><ellipse cx="-15" cy="0" rx="15" ry="7" fill="#3ec46d" transform="rotate(-18)"/></g>
     <g class="fl" transform="translate(200 100) scale(0)">${[0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="0" cy="-12" rx="7.5" ry="12" fill="${i % 2 ? '#ff8fab' : '#ff6b8b'}" transform="rotate(${i * 60})"/>`).join('')}<circle r="7" fill="#ffd166"/></g>
     <ellipse class="seed" cx="200" cy="205" rx="5" ry="3.4" fill="#8a5a3b"/>
     <path d="M160 206 H240 L232 246 H168 Z" fill="#ff9e50"/><rect x="156" y="200" width="88" height="12" rx="6" fill="#ff8a3d"/>
     <ellipse cx="200" cy="203" rx="40" ry="3" fill="#6b4226" opacity=".5"/>` + BUTTERFLY(-30, 70),

  gift: (caption) => DEFS +
    `<g class="gift"><rect x="140" y="136" width="120" height="84" rx="8" fill="#7c5cff"/><rect x="192" y="136" width="16" height="84" fill="#ffd166"/>
      <g class="lid"><rect x="132" y="114" width="136" height="28" rx="8" fill="#9a7bff"/><rect x="192" y="114" width="16" height="28" fill="#ffd166"/>
      <ellipse cx="188" cy="108" rx="13" ry="8" fill="#ffd166" transform="rotate(-20 188 108)"/><ellipse cx="212" cy="108" rx="13" ry="8" fill="#ffd166" transform="rotate(20 212 108)"/><circle cx="200" cy="111" r="5" fill="#f4b73a"/></g></g>` +
    Array.from({ length: 22 }, (_, i) => `<rect class="cf" width="7" height="${i % 3 ? 7 : 11}" rx="1.5" fill="${['#ff6b8b', '#ffb04a', '#3ec46d', '#2f8cff', '#9a7bff', '#ffd166'][i % 6]}" opacity="0"/>`).join('') +
    BUTTERFLY(200, 126, 'opacity="0"') +
    (caption ? `<g class="cap" opacity="0"><rect x="64" y="230" width="272" height="24" rx="12" fill="#fff"/><text x="200" y="246.5" text-anchor="middle" ${FONT} font-size="12.5" fill="#27253f">${caption}</text></g>` : ''),

  steps: (caption) => DEFS +
    `<path d="M70 124 H330" stroke="#e1d9f1" stroke-width="6" stroke-linecap="round"/>
     <path class="prog" d="M70 124 H330" pathLength="1" stroke="#ff8a3d" stroke-width="6" stroke-linecap="round" stroke-dasharray="1" stroke-dashoffset="1" fill="none"/>` +
    [70, 200, 330].map((x, i) => `<g class="nd" data-x="${x}"><circle cx="${x}" cy="124" r="15" class="nc" fill="#ece6f6"/><text x="${x}" y="129" text-anchor="middle" class="nt" ${FONT} font-size="14" fill="#9a94b8">${i + 1}</text><text x="${x}" y="164" text-anchor="middle" ${FONT} font-size="13" fill="#5f5a80">${['Plan', 'Pay', 'Child'][i]}</text></g>`).join('') +
    `<g class="kid" transform="translate(70 82)"><circle r="17" fill="#ffd9a8"/><path d="M-17 -2 A17 17 0 0 1 17 -2 Q9 -10 0 -9 Q-9 -10 -17 -2Z" fill="#6b4226"/><circle cx="-5.5" cy="3" r="1.9" fill="#3a2a22"/><circle cx="5.5" cy="3" r="1.9" fill="#3a2a22"/><path d="M-5 8.5 Q0 13 5 8.5" stroke="#3a2a22" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="-10" cy="8" r="2.6" fill="#ff9fb0" opacity=".7"/><circle cx="10" cy="8" r="2.6" fill="#ff9fb0" opacity=".7"/></g>` +
    sparks(6) + BUTTERFLY(330, 36, 'opacity="0"') +
    (caption ? `<g class="cap" opacity="0"><rect x="112" y="206" width="176" height="26" rx="13" fill="#fff"/><text x="200" y="223.5" text-anchor="middle" ${FONT} font-size="13" fill="#27253f">${caption}</text></g>` : ''),

  night: () =>
    `<defs><path id="joy-sp" d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z"/><mask id="joy-moon-mask"><rect width="400" height="260" fill="#fff"/><circle cx="214" cy="48" r="27" fill="#000"/></mask>
      <filter id="joy-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="9"/></filter></defs>
     <circle class="mg" cx="196" cy="62" r="38" fill="#ffe9a8" opacity=".35" filter="url(#joy-soft)"/>
     <circle cx="196" cy="62" r="31" fill="#ffe9a8" mask="url(#joy-moon-mask)"/>` +
    [[48, 40], [92, 90], [330, 50], [360, 120], [300, 96], [60, 150], [120, 40], [260, 30], [372, 40], [28, 96], [340, 180], [44, 200]].map((p) => `<use href="#joy-sp" class="st" x="${p[0]}" y="${p[1]}" fill="#fff6d6" opacity=".6"/>`).join('') +
    BUTTERFLY(200, 150, 'style="filter:drop-shadow(0 0 7px rgba(255,236,170,.95)) drop-shadow(0 0 16px rgba(190,160,255,.7))"'),
}

const INIT: Record<AnimKind, Init> = {
  orbit: (s) => {
    const trail = $$(s, '.tr'), b = $(s, '.bw')
    const Pt = (t: number): P => { const u = t * 1.1; return [200 + 140 * Math.sin(u), 130 + 58 * Math.sin(2 * u) + 4 * Math.sin(t * 9)] }
    return { dur: 0, rest: 3, frame: (t) => {
      const [x, y] = Pt(t), [x2] = Pt(t + 0.03)
      place(b, x, y, clamp((x2 - x) * 6, -1, 1) * 12, 1.3)
      trail.forEach((el, i) => {
        const [tx, ty] = Pt(t - (i + 1) * 0.07), k = 1 - i / trail.length
        el.setAttribute('transform', `translate(${tx.toFixed(1)} ${ty.toFixed(1)}) scale(${((0.35 + 0.65 * k) * (0.8 + 0.4 * Math.sin(t * 8 + i))).toFixed(2)})`)
        el.setAttribute('opacity', (0.85 * k).toFixed(2))
      })
    } }
  },

  land: (s) => {
    const b = $(s, '.bw'), bf = $(s, '.joy-bf'), lo = $(s, '.lo'), sk = $$(s, '.sk')
    const IN: [P, P, P] = [[-30, 230], [120, 10], [206, 92]], OUT: [P, P, P] = [[206, 92], [300, 10], [440, -30]]
    return { dur: 6.8, rest: 3.4, frame: (t) => {
      let r: { x: number; y: number; ang: number }, sc = 0.9, slow = false
      if (t < 2.4) { const u = E.out(t / 2.4); r = arc(...IN, u); r.x += Math.sin(t * 7) * 6 * (1 - u); r.ang = clamp(r.ang - 90, -25, 25) * (1 - seg(t, 1.7, 2.4)) }
      else if (t < 5.2) { r = { x: 206, y: 92 + Math.sin(t * 2) * 1.2, ang: Math.sin(t * 1.5) * 5 }; slow = true; sc = 0.8 }
      else { r = arc(...OUT, E.io(seg(t, 5.2, 6.3))); r.ang = 12; sc = 0.9 }
      place(b, r.x, r.y, r.ang, sc); bf.classList.toggle('joy-bf-slow', slow)
      const d = t - 2.4
      lo.setAttribute('transform', `translate(200 187) scale(${(1 + 0.05 * bounce(d)).toFixed(3)} ${(1 - 0.08 * bounce(d)).toFixed(3)}) translate(-200 -187)`)
      burst(sk, 206, 104, d, 34)
    } }
  },

  plant: (s) => {
    const stem = $(s, '.stem'), l1 = $(s, '.l1'), l2 = $(s, '.l2'), fl = $(s, '.fl'), seed = $(s, '.seed'), b = $(s, '.bw'), bf = $(s, '.joy-bf')
    const IN: [P, P, P] = [[-30, 70], [110, 0], [206, 84]], OUT: [P, P, P] = [[206, 84], [300, 20], [440, -20]]
    return { dur: 9, rest: 6, frame: (t) => {
      stem.setAttribute('stroke-dashoffset', (1 - E.out(seg(t, 0.8, 2.6))).toFixed(3))
      seed.setAttribute('transform', `rotate(${(t < 0.8 ? Math.sin(t * 30) * 12 : 0).toFixed(1)} 200 205)`); seed.setAttribute('opacity', String(1 - seg(t, 1, 1.4)))
      const a = E.back(seg(t, 2.2, 3.2)), c = E.back(seg(t, 2.6, 3.6)), f = E.back(seg(t, 3.3, 4.5))
      l1.setAttribute('transform', `translate(198 168) scale(${a.toFixed(3)})`)
      l2.setAttribute('transform', `translate(200 140) scale(${(-c).toFixed(3)} ${c.toFixed(3)})`)
      fl.setAttribute('transform', `translate(200 100) rotate(${(f > 0 ? seg(t, 3.3, 9) * 40 : 0).toFixed(1)}) scale(${f.toFixed(3)})`)
      let r: { x: number; y: number; ang: number }, slow = false
      if (t < 4.6) r = { x: -30, y: 70, ang: 0 }
      else if (t < 7.4) { const u = E.out(seg(t, 4.6, 5.9)); r = arc(...IN, u); r.ang = clamp(r.ang - 90, -25, 25) * (1 - seg(t, 5.3, 5.9)); r.y += Math.sin(t * 1.8) * 0.8 * seg(t, 5.9, 6); slow = t > 5.9 }
      else { r = arc(...OUT, E.io(seg(t, 7.4, 8.5))); r.ang = 12 }
      place(b, r.x, r.y, r.ang, 0.8); bf.classList.toggle('joy-bf-slow', slow)
    } }
  },

  gift: (s) => {
    const gift = $(s, '.gift'), lid = $(s, '.lid'), cf = $$(s, '.cf'), b = $(s, '.bw'), cap = s.querySelector('.cap')
    const par = cf.map((_, i) => ({ a: ((-160 + ((i * 37) % 140)) * Math.PI) / 180, v: 100 + ((i * 53) % 110), dir: i % 2 ? 1 : -1 }))
    return { dur: 6, rest: 3.5, frame: (t) => {
      gift.setAttribute('transform', `rotate(${(t < 1 ? Math.sin(t * 34) * 3 * seg(t, 0.2, 0.9) : 0).toFixed(2)} 200 220)`)
      const p = E.out(seg(t, 1, 1.5))
      lid.setAttribute('transform', `translate(${(p * 50).toFixed(1)} ${(-p * 60).toFixed(1)}) rotate(${(-p * 24).toFixed(1)} 200 128)`)
      const d = t - 1.05
      cf.forEach((el, i) => {
        const q = par[i]
        if (d < 0 || d > 2.4) { el.setAttribute('opacity', '0'); return }
        el.setAttribute('transform', `translate(${(200 + Math.cos(q.a) * q.v * d).toFixed(1)} ${(126 + Math.sin(q.a) * q.v * d + 0.5 * 300 * d * d).toFixed(1)}) rotate(${(d * 360 * q.dir).toFixed(0)})`)
        el.setAttribute('opacity', String(1 - seg(d, 1.3, 2.4)))
      })
      const bt = t - 1.3
      if (bt < 0) b.setAttribute('opacity', '0')
      else { b.setAttribute('opacity', '1'); const k = E.out(clamp(bt / 1.6)); place(b, 200 + 46 * Math.sin(bt * 1.7) * k, 126 - 84 * k + Math.sin(bt * 2.4) * 5 * k, Math.cos(bt * 1.7) * 10, 0.2 + 0.8 * E.out(clamp(bt / 0.6))) }
      cap?.setAttribute('opacity', String(seg(t, 2, 2.6)))
    } }
  },

  steps: (s) => {
    const kid = $(s, '.kid'), prog = $(s, '.prog'), nd = $$(s, '.nd'), sk = $$(s, '.sk'), b = $(s, '.bw'), cap = s.querySelector('.cap')
    const cols = ['#f46f10', '#ff6b8b', '#7c5cff'], reach = [0, 2, 4]
    return { dur: 7, rest: 5, frame: (t) => {
      let x = 70
      if (t >= 0.8 && t < 2) x = 70 + 130 * E.io(seg(t, 0.8, 2)); else if (t >= 2 && t < 2.8) x = 200; else if (t >= 2.8 && t < 4) x = 200 + 130 * E.io(seg(t, 2.8, 4)); else if (t >= 4) x = 330
      const hop = t >= 0.8 && t < 2 ? 26 * Math.sin(seg(t, 0.8, 2) * Math.PI) : t >= 2.8 && t < 4 ? 26 * Math.sin(seg(t, 2.8, 4) * Math.PI) : 0
      kid.setAttribute('transform', `translate(${x.toFixed(1)} ${(82 - hop).toFixed(1)}) rotate(${(Math.sin(t * 8) * (hop > 0 ? 6 : 0)).toFixed(1)})`)
      prog.setAttribute('stroke-dashoffset', (1 - (x - 70) / 260).toFixed(3))
      nd.forEach((n, i) => {
        const nx = Number(n.getAttribute('data-x')), on = t >= reach[i] && x >= 70 + 130 * i - 1
        $(n, '.nc').setAttribute('fill', on ? cols[i] : '#ece6f6'); $(n, '.nt').setAttribute('fill', on ? '#fff' : '#9a94b8')
        n.setAttribute('transform', `translate(${nx} 124) scale(${(on ? 1 + 0.35 * bounce(t - reach[i]) : 1).toFixed(3)}) translate(${-nx} -124)`)
      })
      const bt = t - 4
      if (bt < 0) b.setAttribute('opacity', '0')
      else { b.setAttribute('opacity', '1'); const k = E.out(clamp(bt)); place(b, 330 - 90 * (1 - k), 36 - 30 * (1 - k) + Math.sin(bt * 3) * 4, Math.sin(bt * 2) * 8, 0.2 + 0.8 * E.out(clamp(bt / 0.5))) }
      burst(sk, 330, 60, t - 4, 30)
      cap?.setAttribute('opacity', String(seg(t, 4.6, 5.2)))
    } }
  },

  night: (s) => {
    const b = $(s, '.bw'), bf = $(s, '.joy-bf'), st = $$(s, '.st'), glow = $(s, '.mg')
    bf.classList.add('joy-bf-slow')
    return { dur: 0, rest: 3, frame: (t) => {
      place(b, 200 + 90 * Math.sin(t * 0.5), 150 + 28 * Math.sin(t), Math.cos(t * 0.5) * 8, 1.6)
      st.forEach((el, i) => el.setAttribute('opacity', (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.7))).toFixed(2)))
      glow.setAttribute('opacity', (0.3 + 0.1 * Math.sin(t * 1.2)).toFixed(2))
    } }
  },
}

export const ANIM_LABEL: Record<AnimKind, string> = {
  orbit: 'A butterfly flies a figure 8 around the Joy logo',
  land: 'A butterfly lands on the Joy logo',
  plant: 'A seed grows into a flower and a butterfly visits',
  gift: 'A gift box opens and a butterfly flies out',
  steps: 'A child hops from Plan to Pay to Child',
  night: 'A glowing butterfly drifts under the moon',
}

export function JoyAnim({ kind, caption, className, replayKey = 0, loop = true }: {
  kind: AnimKind
  caption?: string
  className?: string
  /** Change this number to play the animation again from the start. */
  replayKey?: number
  /** false = play once and hold the last moment (used inside dialogs). */
  loop?: boolean
}) {
  const html = useMemo(() => MARKUP[kind](caption), [kind, caption])
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const { frame, dur, rest } = INIT[kind](svg)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { frame(rest); return }
    let raf = 0, vis = true
    const t0 = performance.now()
    const io = new IntersectionObserver((es) => { vis = es[0]?.isIntersecting ?? true })
    io.observe(svg)
    const tick = (now: number) => {
      if (vis && !document.hidden) {
        let t = (now - t0) / 1000
        if (dur) t = loop ? t % dur : Math.min(t, dur)
        frame(t)
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [kind, caption, replayKey, loop])

  return (
    <svg
      ref={ref}
      viewBox="0 0 400 260"
      role="img"
      aria-label={ANIM_LABEL[kind]}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
