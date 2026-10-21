'use client'

import { Children, useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from '@/components/joy/cute-icons'
import { cn } from '@/lib/utils'

/**
 * Plan list that stays a plain grid for up to 4 plans, and becomes a
 * horizontal scroll-snap row with prev/next arrows for 5 or more.
 * Children are the plan cards (`<li>` for a list, anything for a div).
 */
const GRID = 'grid sm:grid-cols-2 lg:grid-cols-4'
const MAX_GRID = 4

const SIZES = {
  // gap-5 (1.25rem): 2 per view at sm, 4 per view at lg
  md: {
    gap: 'gap-5 items-start',
    item:
      '[&>*]:shrink-0 [&>*]:basis-[82%] sm:[&>*]:basis-[calc((100%-1.25rem)/2)] lg:[&>*]:basis-[calc((100%-3.75rem)/4)]',
    pad: 'pt-8 -mt-8',
  },
  // gap-3 (0.75rem), used inside the Buy dialog
  sm: {
    gap: 'gap-3 items-stretch',
    item:
      '[&>*]:shrink-0 [&>*]:basis-[82%] sm:[&>*]:basis-[calc((100%-0.75rem)/2)] lg:[&>*]:basis-[calc((100%-2.25rem)/4)]',
    pad: 'pt-4 -mt-4',
  },
} as const

export function PlanCarousel({
  children,
  as: Tag = 'div',
  size = 'md',
  className,
  label = 'Plans',
  prevLabel = 'Previous plans',
  nextLabel = 'Next plans',
  hint,
}: {
  children: React.ReactNode
  as?: 'div' | 'ul'
  size?: keyof typeof SIZES
  className?: string
  label?: string
  prevLabel?: string
  nextLabel?: string
  /** Small caption under the row, shown only when it scrolls */
  hint?: string
}) {
  const count = Children.count(children)
  const s = SIZES[size]
  const ref = useRef<HTMLElement | null>(null)
  const [st, setSt] = useState({ prev: false, next: false })

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    setSt({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [measure, count])

  if (count <= MAX_GRID) {
    return (
      <Tag className={cn(GRID, size === 'md' ? 'items-start gap-5' : 'gap-3', className)} role={Tag === 'ul' ? 'list' : undefined}>
        {children}
      </Tag>
    )
  }

  const go = (dir: 1 | -1) => {
    const el = ref.current
    if (!el) return
    const first = el.firstElementChild as HTMLElement | null
    const step = first ? first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0') : el.clientWidth
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  const arrow = 'absolute top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-white text-foreground shadow-lg ring-1 ring-border transition hover:scale-105 disabled:pointer-events-none disabled:opacity-0'

  return (
    <div className={cn('relative w-0 min-w-full', className)}>
      <Tag
        ref={ref as never}
        tabIndex={0}
        role={Tag === 'ul' ? 'list' : 'region'}
        aria-label={label}
        onScroll={measure}
        className={cn(
          'flex snap-x snap-mandatory overflow-x-auto scroll-smooth scroll-px-2 px-2 pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:snap-start',
          s.gap,
          s.item,
          s.pad,
        )}
      >
        {children}
      </Tag>
      <button type="button" aria-label={prevLabel} disabled={!st.prev} onClick={() => go(-1)} className={cn(arrow, '-left-3 lg:-left-5')}>
        <ChevronLeft className="size-5" aria-hidden="true" />
      </button>
      <button type="button" aria-label={nextLabel} disabled={!st.next} onClick={() => go(1)} className={cn(arrow, '-right-3 lg:-right-5')}>
        <ChevronRight className="size-5" aria-hidden="true" />
      </button>
      {hint ? <p className="-mt-3 text-center text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
