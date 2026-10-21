import { useId } from 'react'

/** Filled, cute chat bubble: solid white bubble, gradient heart, soft gloss and sparkles. For use on the Joy gradient. */
export function ChatHeartIcon({ className }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 28 28" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-h`} x1="9" y1="9" x2="19" y2="19" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9e50" />
          <stop offset="1" stopColor="#f0488a" />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="14" y1="2" x2="14" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffe6ee" />
        </linearGradient>
      </defs>
      <path
        d="M14 2.5c6.9 0 12 4.4 12 10.4 0 6-5.1 10.4-12 10.4-1.3 0-2.5-.15-3.6-.45-1.1.95-3.1 2.1-5.6 2.1-.5 0-.8-.5-.5-.9.9-1.1 1.4-2.3 1.5-3.5C3.7 18.7 2 16 2 12.900 2 6.900 7.100 2.500 14 2.500Z"
        fill={`url(#${id}-b)`}
      />
      <ellipse cx="9.500" cy="6.800" rx="4.200" ry="1.900" transform="rotate(-24 9.500 6.800)" fill="#fff" opacity="0.7" />
      <path
        d="M14 18.200c-.3 0-.6-.1-.8-.3-2.300-1.900-4.200-3.500-4.200-5.600 0-1.500 1.100-2.600 2.500-2.600.9 0 1.800.5 2.500 1.400.7-.9 1.600-1.400 2.500-1.400 1.400 0 2.500 1.100 2.500 2.600 0 2.100-1.900 3.700-4.200 5.600-.2.200-.5.300-.8.300Z"
        fill={`url(#${id}-h)`}
      />
      <path d="M23.500 1.200v3M22 2.700h3" stroke="#ffe27a" strokeWidth="1.400" strokeLinecap="round" />
    </svg>
  )
}
