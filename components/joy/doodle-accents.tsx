import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const shapes = {
  heart: (
    <path
      d="M32 54s-20-12.5-20-27A11 11 0 0 1 32 20a11 11 0 0 1 20 7c0 14.5-20 27-20 27Z"
      fill="#f6bfd5"
      stroke="#ff7fa5"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="m32 10 6.5 13.5L53 25.5 42.5 36l2.5 15L32 44l-13 7 2.5-15L11 25.5l14.5-2Z"
      fill="#ffe27a"
      stroke="#f5b73b"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  cloud: (
    <path
      d="M18 46a10 10 0 0 1 1-20 13 13 0 0 1 25-3 10 10 0 0 1 3 20 6 6 0 0 1-3 3Z"
      fill="#fff"
      stroke="#ffd0a8"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  flower: (
    <g stroke="#cfb8ff" strokeWidth="2.5">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="32" cy="19" rx="8" ry="11" fill="#e6d6ff" transform={`rotate(${deg} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="6" fill="#ffe27a" stroke="#f5b73b" />
    </g>
  ),
  sparkle: (
    <path
      d="M32 8c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18Z"
      fill="#ffd0a8"
      stroke="#f49678"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  rainbow: (
    <g fill="none" strokeLinecap="round">
      <path d="M6 44a26 26 0 0 1 52 0" stroke="#ff9db8" strokeWidth="5" />
      <path d="M12 44a20 20 0 0 1 40 0" stroke="#ffd08a" strokeWidth="5" />
      <path d="M18 44a14 14 0 0 1 28 0" stroke="#bfe5bd" strokeWidth="5" />
      <path d="M24 44a8 8 0 0 1 16 0" stroke="#c4e0ff" strokeWidth="5" />
      <g fill="#fff" stroke="#ffd0a8" strokeWidth="2">
        <path d="M2 50a5 5 0 0 1 5-6 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9H6a4 4 0 0 1-4-4Z" />
        <path d="M46 50a5 5 0 0 1 5-6 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9H50a4 4 0 0 1-4-4Z" />
      </g>
    </g>
  ),
  dogPaw: (
    <g fill="#ffd0a8" stroke="#c98f5e" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M32 30c-8 0-16 9-16 17 0 6 5 8 9 7 3-1 4.5-2 7-2s4 1 7 2c4 1 9-1 9-7 0-8-8-17-16-17Z" />
      <ellipse cx="13" cy="28" rx="5.5" ry="7.5" transform="rotate(-25 13 28)" />
      <ellipse cx="24" cy="16" rx="5.5" ry="8" transform="rotate(-8 24 16)" />
      <ellipse cx="40" cy="16" rx="5.5" ry="8" transform="rotate(8 40 16)" />
      <ellipse cx="51" cy="28" rx="5.5" ry="7.5" transform="rotate(25 51 28)" />
    </g>
  ),
  catPaw: (
    <g fill="#ffd0e2" stroke="#ff7fa5" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M20 44c0-7 6-12 12-12s12 5 12 12c0 5-4 8-8 7-1.5-.5-2.5-1.5-4-1.5s-2.5 1-4 1.5c-4 1-8-2-8-7Z" />
      <circle cx="16" cy="31" r="5" />
      <circle cx="25" cy="21" r="5" />
      <circle cx="39" cy="21" r="5" />
      <circle cx="48" cy="31" r="5" />
    </g>
  ),
  moon: (
    <path
      d="M42 10a22 22 0 1 0 12 30A18 18 0 0 1 42 10Z"
      fill="#f6dfae"
      stroke="#f9c95c"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  bone: (
    <path
      d="M18 22a6 6 0 1 1 8-6l12 12a6 6 0 1 1 6 8 6 6 0 1 1-8 6L24 30a6 6 0 1 1-6-8Z"
      fill="#f7f0e7"
      stroke="#d8b48c"
      strokeWidth="2.5"
      strokeLinejoin="round"
      transform="translate(2 4)"
    />
  ),
  fish: (
    <g stroke="#7fb5e6" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M8 32c8-12 26-14 38 0-12 14-30 12-38 0Z" fill="#d6f0ff" />
      <path d="M46 32l10-9v18Z" fill="#d6f0ff" />
      <circle cx="18" cy="30" r="2" fill="#7fb5e6" stroke="none" />
    </g>
  ),
  dots: (
    <g>
      <circle cx="16" cy="18" r="6" fill="#ffd0a8" />
      <circle cx="44" cy="14" r="4" fill="#e2f6ec" />
      <circle cx="30" cy="36" r="7" fill="#e6d6ff" />
      <circle cx="50" cy="44" r="5" fill="#f6bfd5" />
      <circle cx="14" cy="50" r="4" fill="#c4e0ff" />
    </g>
  ),
} satisfies Record<string, ReactNode>

type Accent = {
  shape: keyof typeof shapes
  className: string
  duration?: number
  delay?: number
}

// A few quiet accents along the page (kept few and still so they don't compete with the content)
const accents: Accent[] = [
  { shape: 'heart', className: 'top-[26%] left-[2%] size-14 -rotate-12' },
  { shape: 'sparkle', className: 'top-[30%] right-[1.5%] size-10' },
  { shape: 'flower', className: 'top-[52%] right-[5%] size-12' },
  { shape: 'moon', className: 'top-[72%] right-[5.5%] size-12 -rotate-12' },
]

export function DoodleAccents() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block" aria-hidden="true">
      {accents.map(({ shape, className }, index) => (
        <svg
          key={`${shape}-${index}`}
          viewBox="0 0 64 64"
          className={cn('absolute opacity-70 drop-shadow-sm', className)}
        >
          {shapes[shape]}
        </svg>
      ))}
    </div>
  )
}
