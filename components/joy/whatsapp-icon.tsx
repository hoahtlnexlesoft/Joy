import { useId } from 'react'

/** Soft, rounded take on WhatsApp: green chat bubble with a white handset and a little heart. */
export function WhatsAppIcon({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-g`} x1="4" y1="2" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ee7a0" />
          <stop offset="1" stopColor="#37c677" />
        </linearGradient>
      </defs>
      <path d="M12 1.2a10.8 10.8 0 1 1-5.3 20.2l-4.3 1.2 1.3-4A10.8 10.8 0 0 1 12 1.2z" fill={`url(#${id}-g)`} />
      <ellipse cx="8.4" cy="5.4" rx="4" ry="2" transform="rotate(-28 8.4 5.4)" fill="#fff" opacity="0.28" />
      <g transform="translate(6.1 6.1) scale(0.49)" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </g>
      <path transform="translate(-1 1.1) scale(.95)" d="M18.3 4.2c.5-.7 1.6-.5 1.6.4 0 .7-1.1 1.4-1.6 1.8-.5-.4-1.6-1.1-1.6-1.8 0-.9 1.1-1.1 1.6-.4z" fill="#fff" />
    </svg>
  )
}
