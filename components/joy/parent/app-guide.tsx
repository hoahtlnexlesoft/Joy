const APPLE_PATH =
  'M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.78-3.32-1.8-1.41-.14-2.76.83-3.48.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.27-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.34 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.4-.92-2.42-3.66ZM14.1 5.84c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28Z'

function Badge({ store }: { store: 'apple' | 'google' }) {
  const apple = store === 'apple'
  return (
    <a
      href={apple ? 'https://apps.apple.com' : 'https://play.google.com/store'}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#111] px-3 text-white ring-1 ring-black/40 transition hover:-translate-y-0.5"
    >
      {apple ? (
        <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden="true">
          <path d={APPLE_PATH} />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
          <path d="M3.6 2.2 13.3 12l-9.7 9.8c-.2-.2-.3-.6-.3-1V3.2c0-.4.1-.8.3-1Z" fill="#34a853" />
          <path d="m16.9 8.4-3.6 3.6-9.7-9.8c.3-.3.8-.3 1.3 0l12 6.2Z" fill="#4285f4" />
          <path d="M16.9 15.6 4.9 21.8c-.5.3-1 .3-1.3 0l9.7-9.8 3.6 3.6Z" fill="#ea4335" />
          <path d="m20.6 13-3.7 2.6-3.6-3.6 3.6-3.6 3.7 2.6c.9.6.9 1.4 0 2Z" fill="#fbbc04" />
        </svg>
      )}
      <span className="flex flex-col leading-none">
        <span className="whitespace-nowrap text-[9px] uppercase tracking-wide opacity-75">{apple ? 'Download on the' : 'Get it on'}</span>
        <span className="mt-0.5 whitespace-nowrap text-[15px] font-semibold">{apple ? 'App Store' : 'Google Play'}</span>
      </span>
    </a>
  )
}

/** Shown after a successful payment: how to activate the Joy app on the child's device. */
export function AppActivationGuide() {
  const steps = [
    { emoji: '📲', tint: 'bg-[#e8f4ff] ring-[#cfe6fb]', title: 'Download the app', body: "Install it on your child's device." },
    { emoji: '🧒', tint: 'bg-[#fff0e3] ring-[#ffdcbf]', title: 'Switch to Child view', body: <>Tap <b>Play</b> on the Home screen.</> },
    { emoji: '🔗', tint: 'bg-[#f1ebff] ring-[#dccdfb]', title: 'Link parent account', body: <><b>My profile</b> › <b>Link Parent Account</b>.</> },
  ]
  return (
    <section aria-label="Activate the Joy app" className="mb-5">
      <p className="mb-2.5 text-center text-sm font-bold">Activate the Joy app in 3 easy steps</p>
      <ol className="grid gap-2 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s.title} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-border sm:flex-col sm:gap-1.5 sm:text-center">
            <span className={`relative grid size-11 shrink-0 place-items-center rounded-2xl text-xl ring-1 ${s.tint}`} aria-hidden="true">
              {s.emoji}
              <span className="absolute -left-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-[#ff7a3d] text-[11px] font-bold text-white ring-2 ring-white">{i + 1}</span>
            </span>
            <div className="min-w-0">
              <b className="block text-[13px] leading-tight">{s.title}</b>
              <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{s.body}</p>
            </div>
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
