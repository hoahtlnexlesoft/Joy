import { useId } from 'react'

/** Soft, rounded take on the Telegram paper plane: blue bubble, white plane, tiny sparkle. */
export function TelegramIcon({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#38A8EE" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="11" fill={`url(#${id}-g)`} />
      <ellipse cx="8.2" cy="5.6" rx="4.2" ry="2.1" transform="rotate(-28 8.2 5.6)" fill="#fff" opacity="0.28" />
      <g transform="translate(5.6 6) scale(0.56)" fill="#fff" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
      </g>
      <path d="m16.2 7.6-4.6 4.6" stroke="#38A8EE" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M18 5.4v2M17 6.4h2" stroke="#fff" strokeWidth="1" strokeLinecap="round" opacity="0.9" />
    </svg>
  )
}
