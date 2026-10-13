import type { ReactNode } from 'react'

/**
 * Filled, rounded glyphs for the feature showcase badges: tinted via --ic-main, details in white.
 */
type P = { className?: string }
const Svg = ({ className, children }: P & { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    {children}
  </svg>
)

/** Child Nature: a happy sprout. */
export const SproutIcon = ({ className }: P) => (
  <Svg className={className}>
    <path d="M12 22v-9" stroke="var(--ic-main,#fff)" strokeWidth="2.600" strokeLinecap="round" />
    <path d="M11.600 14.200C5.500 15 1.600 11.400 1.500 4.800c6.200-.5 10.300 2.700 10.100 9.400Z" fill="var(--ic-main,#fff)" />
    <path d="M12.400 11.600C12 5.200 15.600 1.600 22.500 2c.3 6.600-3.600 10.300-10.100 9.600Z" fill="var(--ic-main,#fff)" opacity=".93" />
    <path d="M5.600 8.200c2.200.8 4 2.400 5.200 4.800M18.800 5.600c-2 1.400-3.600 3.200-4.600 5.400" stroke="var(--ic-accent,#fff)" strokeWidth="1.500" strokeLinecap="round" fill="none" />
  </Svg>
)

/** Growth Path: rising steps topped with a star. */
export const StepsIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="2.500" y="15" width="5.500" height="6.500" rx="1.800" fill="var(--ic-main,#fff)" opacity=".85" />
    <rect x="9.200" y="10.500" width="5.500" height="11" rx="1.800" fill="var(--ic-main,#fff)" opacity=".93" />
    <rect x="15.900" y="6" width="5.500" height="15.500" rx="1.800" fill="var(--ic-main,#fff)" />
    <path d="m18.650 .4 1.050 2.200 2.400.3-1.750 1.650.45 2.400-2.150-1.200-2.150 1.200.45-2.400L15.200 2.900l2.400-.3Z" fill="#FFE066" />
  </Svg>
)

/** Daily Activities: calendar with a sun-heart. */
export const DayIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="3" y="4.500" width="18" height="17" rx="4.500" fill="var(--ic-main,#fff)" />
    <path d="M3 10.500h18" stroke="var(--ic-accent,#fff)" strokeWidth="1.400" opacity=".35" />
    <rect x="7" y="2" width="2.600" height="5" rx="1.300" fill="var(--ic-main,#fff)" />
    <rect x="14.400" y="2" width="2.600" height="5" rx="1.300" fill="var(--ic-main,#fff)" />
    <rect x="7.300" y="2.600" width="2" height="2.600" rx="1" fill="var(--ic-accent,#fff)" opacity=".55" />
    <rect x="14.700" y="2.600" width="2" height="2.600" rx="1" fill="var(--ic-accent,#fff)" opacity=".55" />
    <path d="M12 19.100c-.3 0-.5-.1-.7-.3-2-1.600-3.500-2.900-3.500-4.700 0-1.200.9-2.100 2.100-2.100.8 0 1.600.4 2.100 1.200.5-.8 1.300-1.200 2.100-1.200 1.200 0 2.100.9 2.100 2.100 0 1.800-1.500 3.100-3.500 4.700-.2.200-.4.300-.7.300Z" fill="var(--ic-accent,#fff)" />
  </Svg>
)

/** Joy Collection: three leaning books with a sparkle. */
export const BooksIcon = ({ className }: P) => (
  <Svg className={className}>
    <rect x="2.800" y="5" width="5.200" height="16" rx="1.800" fill="var(--ic-main,#fff)" />
    <rect x="9.300" y="3" width="5.200" height="18" rx="1.800" fill="var(--ic-main,#fff)" opacity=".93" />
    <rect x="3.700" y="8" width="3.400" height="1.500" rx=".75" fill="var(--ic-accent,#fff)" opacity=".6" />
    <rect x="10.200" y="6.500" width="3.400" height="1.500" rx=".75" fill="var(--ic-accent,#fff)" opacity=".6" />
    <rect x="16" y="6.500" width="5.200" height="15" rx="1.800" fill="var(--ic-main,#fff)" opacity=".85" transform="rotate(14 18.600 14)" />
    <path d="M20.500 .8v3M19 2.300h3" stroke="#FFE066" strokeWidth="1.700" strokeLinecap="round" />
  </Svg>
)

/** Feeling Log: smiley with blush. */
export const SmileyIcon = ({ className }: P) => (
  <Svg className={className}>
    <circle cx="12" cy="12" r="10" fill="var(--ic-main,#fff)" />
    <ellipse cx="8.800" cy="10.200" rx="1.250" ry="1.600" fill="var(--ic-accent,#fff)" />
    <ellipse cx="15.200" cy="10.200" rx="1.250" ry="1.600" fill="var(--ic-accent,#fff)" />
    <path d="M8.600 14c.9 1.700 2.100 2.500 3.400 2.500s2.500-.8 3.400-2.500" stroke="var(--ic-accent,#fff)" strokeWidth="1.800" strokeLinecap="round" fill="none" />
    <ellipse cx="6.300" cy="13.600" rx="1.700" ry="1.100" fill="#fff" opacity=".45" />
    <ellipse cx="17.700" cy="13.600" rx="1.700" ry="1.100" fill="#fff" opacity=".45" />
  </Svg>
)
