import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const shapes = {
  heart: (
    <path
      d="M32 54s-20-12.5-20-27A11 11 0 0 1 32 20a11 11 0 0 1 20 7c0 14.5-20 27-20 27Z"
      fill="#ffb3cf"
      stroke="#f27aa6"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  star: (
    <path
      d="m32 10 6.5 13.5L53 25.5 42.5 36l2.5 15L32 44l-13 7 2.5-15L11 25.5l14.5-2Z"
      fill="#ffe08a"
      stroke="#f5b83d"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  cloud: (
    <path
      d="M18 46a10 10 0 0 1 1-20 13 13 0 0 1 25-3 10 10 0 0 1 3 20 6 6 0 0 1-3 3Z"
      fill="#fff"
      stroke="#f7c6a8"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  flower: (
    <g stroke="#c9a7f0" strokeWidth="2.5">
      {[0, 72, 144, 216, 288].map((deg) => (
        <ellipse key={deg} cx="32" cy="19" rx="8" ry="11" fill="#e6d6ff" transform={`rotate(${deg} 32 32)`} />
      ))}
      <circle cx="32" cy="32" r="6" fill="#ffe08a" stroke="#f5b83d" />
    </g>
  ),
  sparkle: (
    <path
      d="M32 8c2 12 6 16 18 18-12 2-16 6-18 18-2-12-6-16-18-18 12-2 16-6 18-18Z"
      fill="#ffd0a8"
      stroke="#f59a6b"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  rainbow: (
    <g fill="none" strokeLinecap="round">
      <path d="M6 44a26 26 0 0 1 52 0" stroke="#ffa3b8" strokeWidth="5" />
      <path d="M12 44a20 20 0 0 1 40 0" stroke="#ffd08a" strokeWidth="5" />
      <path d="M18 44a14 14 0 0 1 28 0" stroke="#a8e6b8" strokeWidth="5" />
      <path d="M24 44a8 8 0 0 1 16 0" stroke="#a9d3ff" strokeWidth="5" />
      <g fill="#fff" stroke="#f7c6a8" strokeWidth="2">
        <path d="M2 50a5 5 0 0 1 5-6 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9H6a4 4 0 0 1-4-4Z" />
        <path d="M46 50a5 5 0 0 1 5-6 6 6 0 0 1 11 1 4.5 4.5 0 0 1 0 9H50a4 4 0 0 1-4-4Z" />
      </g>
    </g>
  ),
  dogPaw: (
    <g fill="#f3d2b3" stroke="#c98f5e" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M32 30c-8 0-16 9-16 17 0 6 5 8 9 7 3-1 4.5-2 7-2s4 1 7 2c4 1 9-1 9-7 0-8-8-17-16-17Z" />
      <ellipse cx="13" cy="28" rx="5.5" ry="7.5" transform="rotate(-25 13 28)" />
      <ellipse cx="24" cy="16" rx="5.5" ry="8" transform="rotate(-8 24 16)" />
      <ellipse cx="40" cy="16" rx="5.5" ry="8" transform="rotate(8 40 16)" />
      <ellipse cx="51" cy="28" rx="5.5" ry="7.5" transform="rotate(25 51 28)" />
    </g>
  ),
  catPaw: (
    <g fill="#ffc9db" stroke="#e98bab" strokeWidth="2.5" strokeLinejoin="round">
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
      fill="#fff1b8"
      stroke="#f5c84d"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  bone: (
    <path
      d="M18 22a6 6 0 1 1 8-6l12 12a6 6 0 1 1 6 8 6 6 0 1 1-8 6L24 30a6 6 0 1 1-6-8Z"
      fill="#fff7ec"
      stroke="#d8b48c"
      strokeWidth="2.5"
      strokeLinejoin="round"
      transform="translate(2 4)"
    />
  ),
  fish: (
    <g stroke="#7fb5e6" strokeWidth="2.5" strokeLinejoin="round">
      <path d="M8 32c8-12 26-14 38 0-12 14-30 12-38 0Z" fill="#cde6ff" />
      <path d="M46 32l10-9v18Z" fill="#cde6ff" />
      <circle cx="18" cy="30" r="2" fill="#7fb5e6" stroke="none" />
    </g>
  ),
  dots: (
    <g>
      <circle cx="16" cy="18" r="6" fill="#ffd0a8" />
      <circle cx="44" cy="14" r="4" fill="#c9e8d4" />
      <circle cx="30" cy="36" r="7" fill="#e6d6ff" />
      <circle cx="50" cy="44" r="5" fill="#ffb3cf" />
      <circle cx="14" cy="50" r="4" fill="#a9d3ff" />
    </g>
  ),
} satisfies Record<string, ReactNode>

type Accent = {
  shape: keyof typeof shapes
  className: string
  duration?: number
  delay?: number
}

const accents: Accent[] = [
  { shape: 'rainbow', className: 'top-[6%] left-[1.5%] size-24 -rotate-6', duration: 7 },
  { shape: 'catPaw', className: 'top-[9%] right-[2%] size-16 rotate-12', delay: 1 },
  { shape: 'star', className: 'top-[15%] left-[6%] size-12 rotate-12', delay: 2 },
  { shape: 'dogPaw', className: 'top-[19%] right-[6%] size-20 -rotate-12', duration: 8 },
  { shape: 'heart', className: 'top-[26%] left-[2%] size-16 -rotate-12', delay: 0.5 },
  { shape: 'sparkle', className: 'top-[30%] right-[1.5%] size-12', delay: 1.5 },
  { shape: 'fish', className: 'top-[36%] left-[5%] size-16 rotate-6', duration: 7 },
  { shape: 'rainbow', className: 'top-[41%] right-[3%] size-24 rotate-6', delay: 2.5 },
  { shape: 'catPaw', className: 'top-[47%] left-[1.5%] size-14 -rotate-[20deg]', delay: 1 },
  { shape: 'flower', className: 'top-[52%] right-[6%] size-14', duration: 8 },
  { shape: 'bone', className: 'top-[57%] left-[5.5%] size-16 rotate-12', delay: 2 },
  { shape: 'cloud', className: 'top-[62%] right-[1.5%] size-20', duration: 9 },
  { shape: 'dogPaw', className: 'top-[67%] left-[2%] size-16 rotate-[20deg]', delay: 0.5 },
  { shape: 'moon', className: 'top-[72%] right-[5.5%] size-14 -rotate-12', delay: 3 },
  { shape: 'dots', className: 'top-[77%] left-[6%] size-16', duration: 7 },
  { shape: 'catPaw', className: 'top-[81%] right-[2%] size-16 rotate-[30deg]', delay: 1.5 },
  { shape: 'rainbow', className: 'top-[86%] left-[1.5%] size-20 rotate-3', delay: 2 },
  { shape: 'heart', className: 'top-[90%] right-[6%] size-12 rotate-12', delay: 0.8 },
  { shape: 'dogPaw', className: 'top-[94%] left-[6%] size-14 -rotate-6', duration: 8 },
  { shape: 'star', className: 'top-[96%] right-[2.5%] size-12 -rotate-12', delay: 2.2 },
]

export function DoodleAccents() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block" aria-hidden="true">
      {accents.map(({ shape, className, duration = 6, delay = 0 }, index) => (
        <svg
          key={`${shape}-${index}`}
          viewBox="0 0 64 64"
          className={cn('absolute opacity-80 drop-shadow-sm motion-safe:animate-[float-soft_6s_ease-in-out_infinite]', className)}
          style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` } as CSSProperties}
        >
          {shapes[shape]}
        </svg>
      ))}
    </div>
  )
}
