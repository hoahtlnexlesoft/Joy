import Link from 'next/link'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'ghost' | 'dark'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-joy text-white shadow-[0_10px_30px_-10px_rgba(248, 96, 143, 0.6)] hover:shadow-[0_14px_36px_-10px_rgba(248, 96, 143, 0.75)] hover:-translate-y-0.5',
  ghost:
    'bg-white/80 text-foreground ring-1 ring-border backdrop-blur hover:bg-white hover:ring-foreground/20',
  dark: 'bg-foreground text-background hover:bg-foreground/90',
}

export function joyButtonClass(variant: Variant = 'primary', className?: string) {
  return cn(
    'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    variants[variant],
    className,
  )
}

export function JoyButton({
  href,
  variant = 'primary',
  className,
  children,
}: {
  href: string
  variant?: Variant
  className?: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variants[variant],
        className,
      )}
    >
      {children}
    </Link>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground ring-1 ring-border',
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-gradient-joy" aria-hidden="true" />
      {children}
    </span>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = 'center',
  id,
}: {
  eyebrow?: string
  title: string
  accent?: string
  description?: string
  align?: 'center' | 'left'
  id?: string
}) {
  return (
    <div className={cn('flex flex-col gap-4', align === 'center' ? 'mx-auto max-w-2xl items-center text-center' : 'max-w-xl items-start')}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 id={id} className="text-4xl font-medium leading-[1.05] tracking-tight md:text-5xl">
        {title} {accent ? <em className="text-gradient-joy font-medium">{accent}</em> : null}
      </h2>
      {description ? <p className="text-pretty text-lg leading-relaxed text-muted-foreground">{description}</p> : null}
    </div>
  )
}
