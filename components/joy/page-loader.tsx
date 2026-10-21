import Image from 'next/image'

/** Cute full-page loading screen: bouncing logo, fluttering butterfly, pastel dots. */
export function PageLoader({ label = 'Joy is getting ready…' }: { label?: string }) {
  const dots = ['#ff7a45', '#c9a7ff', '#ffd08a']
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] grid place-items-center bg-[radial-gradient(circle_at_30%_20%,#ffeadf_0,transparent_55%),radial-gradient(circle_at_75%_80%,#f4eeff_0,transparent_55%)] bg-background px-4"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <div className="relative">
          <span aria-hidden="true" className="joy-load-glow absolute inset-x-4 -bottom-3 h-4 rounded-full bg-[#2a2240]/10 blur-md" />
          <Image src="/images/joy-logo.webp" alt="Joy" width={220} height={101} priority className="joy-load-bounce relative h-auto w-44 sm:w-56" />
          <Image
            src="/images/butterfly-purple.webp"
            alt=""
            aria-hidden="true"
            width={56}
            height={42}
            priority
            className="joy-load-fly absolute -right-10 -top-6 h-auto w-12 sm:w-14"
          />
        </div>
        <div className="flex items-center gap-2" aria-hidden="true">
          {dots.map((c, i) => (
            <span key={c} className="joy-load-dot block size-3 rounded-full" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
        <p className="font-display text-base text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}
