const APPLE_PATH =
  'M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66ZM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28Z'

function Badge({ store }: { store: 'apple' | 'google' }) {
  const apple = store === 'apple'
  return (
    <a
      href={apple ? 'https://apps.apple.com' : 'https://play.google.com/store'}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex h-11 items-center gap-2.5 rounded-full py-1 pl-1 pr-4 ring-2 transition hover:-translate-y-0.5 hover:scale-[1.03] ${
        apple
          ? 'bg-gradient-to-r from-[#d9efff] to-[#e8e2ff] text-[#3d4fa0] ring-white shadow-[0_6px_16px_-6px_rgba(99,102,241,0.55)]'
          : 'bg-gradient-to-r from-[#d9f6e6] to-[#fff1c9] text-[#1f7a4d] ring-white shadow-[0_6px_16px_-6px_rgba(34,160,100,0.55)]'
      }`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white shadow-[inset_0_-2px_0_rgba(0,0,0,0.05)]">
        {apple ? (
          <svg viewBox="0 0 24 24" className="size-5 fill-[#5b6cf0]" aria-hidden="true">
            <path d={APPLE_PATH} />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <path d="M3.6 2.2 13.3 12l-9.7 9.8c-.2-.2-.3-.6-.3-1V3.2c0-.4.1-.8.3-1Z" fill="#34a853" />
            <path d="m16.9 8.4-3.6 3.6-9.7-9.8c.3-.3.8-.3 1.3 0l12 6.2Z" fill="#4285f4" />
            <path d="M16.9 15.6 4.9 21.8c-.5.3-1 .3-1.3 0l9.7-9.8 3.6 3.6Z" fill="#ea4335" />
            <path d="m20.6 13-3.7 2.6-3.6-3.6 3.6-3.6 3.7 2.6c.9.6.9 1.4 0 2Z" fill="#fbbc04" />
          </svg>
        )}
      </span>
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-wide opacity-70">{apple ? 'Download on the' : 'Get it on'}</span>
        <span className="mt-0.5 whitespace-nowrap text-[15px] font-bold">{apple ? 'App Store' : 'Google Play'}</span>
      </span>
    </a>
  )
}

function DashArrow() {
  return (
    <span className="flex shrink-0 items-center justify-center rotate-90 sm:rotate-0" aria-hidden="true">
      <svg viewBox="0 0 40 16" className="h-3.5 w-7 text-[#f59ac0]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 8h26" strokeDasharray="1 5" />
        <path d="m27 3 8 5-8 5" />
      </svg>
    </span>
  )
}

/** Shown after a successful payment: how to activate the Joy app on the child's device. */
export function AppActivationGuide() {
  const steps = [
    { emoji: '📲', tint: 'from-[#e3f2ff] to-[#f4faff] ring-[#c9e3fb]', title: 'Download the app', body: "Install it on your child's device." },
    { emoji: '🧒', tint: 'from-[#ffeedd] to-[#fff8f0] ring-[#ffd9b8]', title: 'Switch to Child view', body: <>Tap <b>Play</b> on the Home screen.</> },
    { emoji: '🔗', tint: 'from-[#efe7ff] to-[#f9f5ff] ring-[#d9c9fb]', title: 'Link parent account', body: <><b>My profile</b> › <b>Link Parent Account</b>.</> },
  ]
  return (
    <section aria-label="Activate the Joy app" className="relative mb-5 overflow-hidden rounded-3xl bg-gradient-to-br from-[#fff6fa] via-[#fffaf2] to-[#f6f1ff] px-3 py-4 ring-1 ring-[#ffe3ee] sm:px-4">
      <span className="pointer-events-none absolute left-4 top-3 text-lg opacity-60" aria-hidden="true">✨</span>
      <span className="pointer-events-none absolute right-4 top-3 text-lg opacity-60" aria-hidden="true">🌈</span>
      <p className="mb-3 text-center font-display text-sm font-extrabold">Activate the Joy app in 3 easy steps</p>
      <ol className="flex flex-col items-stretch gap-1 sm:flex-row sm:gap-2">
        {steps.map((s, i) => (
          <li key={s.title} className="contents">
            <div className="flex flex-1 items-center gap-3 rounded-3xl bg-white/90 p-3 shadow-[0_8px_20px_-14px_rgba(214,74,140,0.5)] ring-1 ring-white sm:flex-col sm:gap-2 sm:px-2.5 sm:py-3 sm:text-center">
              <span className={`relative grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br text-2xl ring-2 ${s.tint}`} aria-hidden="true">
                {s.emoji}
              </span>
              <div className="min-w-0">
                <span className="mb-1 inline-block rounded-full bg-[#ffe9d9] px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-[#e4631f]">Step {i + 1}</span>
                <b className="block text-sm leading-tight">{s.title}</b>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">{s.body}</p>
              </div>
            </div>
            {i < steps.length - 1 && <DashArrow />}
          </li>
        ))}
      </ol>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        <Badge store="apple" />
        <Badge store="google" />
      </div>
    </section>
  )
}
