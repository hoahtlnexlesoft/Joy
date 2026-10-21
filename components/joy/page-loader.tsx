import Image from 'next/image'
import { FlyingButterfly, JoyAnim, type AnimKind } from '@/components/joy/anim/joy-anim'

const STARS = [
  { x: -14, y: -6, s: 18, d: 0 },
  { x: 104, y: 4, s: 14, d: 0.5 },
  { x: 92, y: 88, s: 20, d: 1 },
  { x: -8, y: 84, s: 12, d: 1.5 },
]
const BUBBLES = [
  { l: 6, s: 38, d: 0, t: 9, c: '#ffd0a8' },
  { l: 16, s: 22, d: 2.2, t: 7, c: '#d9c7ff' },
  { l: 27, s: 54, d: 1, t: 11, c: '#ffd0e2' },
  { l: 38, s: 26, d: 3.4, t: 8, c: '#cfeedd' },
  { l: 49, s: 44, d: 0.6, t: 10, c: '#ffe9a8' },
  { l: 61, s: 24, d: 2.8, t: 7.5, c: '#d6f0ff' },
  { l: 72, s: 58, d: 1.6, t: 12, c: '#d9c7ff' },
  { l: 83, s: 30, d: 3, t: 8.5, c: '#ffd0a8' },
  { l: 92, s: 42, d: 0.3, t: 10.5, c: '#ffd0e2' },
]

/**
 * Full-page loading screen.
 *  - kind "classic" (default): small Joy logo, two butterflies circling it and a rainbow progress bar.
 *    Used whenever you move between pages.
 *  - kind "night": moon, stars and a glowing butterfly. Used only on the very first load.
 *  - kinds "orbit" and "land": spare butterfly animations (shown on /animations).
 */
export function PageLoader({ label = 'Joy is getting ready', kind = 'classic' }: { label?: string; kind?: 'classic' | Extract<AnimKind, 'orbit' | 'land' | 'night'> }) {
  const night = kind === 'night'
  const classic = kind === 'classic'
  return (
    <div role="status" aria-live="polite" className="joy-load fixed inset-0 z-[100] overflow-hidden bg-background">
      <div
        aria-hidden="true"
        className={night
          ? 'absolute inset-0 bg-[linear-gradient(170deg,#2a2550,#4b3f86_70%,#6a4f9c)]'
          : 'absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,#ffeadf_0,transparent_50%),radial-gradient(circle_at_85%_85%,#efe6ff_0,transparent_50%),radial-gradient(circle_at_80%_10%,#e2f6ec_0,transparent_35%)]'}
      />
      {!night && (
        <div aria-hidden="true" className="absolute inset-0">
          {BUBBLES.map((b, i) => (
            <span
              key={i}
              className="joy-load-bubble absolute -bottom-24 block rounded-full"
              style={{ left: `${b.l}%`, width: b.s, height: b.s, animationDuration: `${b.t}s`, animationDelay: `${b.d}s`, background: `radial-gradient(circle at 30% 28%, #fff 0 14%, ${b.c} 15% 70%, ${b.c}aa 100%)` }}
            />
          ))}
        </div>
      )}

      <div className="absolute inset-0 grid place-items-center px-4">
        {classic ? (
          <div className="flex flex-col items-center gap-8 text-center">
            <div className="relative h-36 w-64 sm:h-40 sm:w-72">
              <div className="joy-load-ring absolute left-1/2 top-1/2 size-0">
                <span className="joy-load-orbit absolute block w-10" style={{ ['--r' as string]: '7.25rem' }}>
                  <span className="joy-load-keep block"><FlyingButterfly className="h-auto w-full overflow-visible" /></span>
                </span>
              </div>
              <div className="joy-load-ring joy-load-ring-rev absolute left-1/2 top-1/2 size-0">
                <span className="joy-load-orbit absolute block w-8" style={{ ['--r' as string]: '5.75rem' }}>
                  <span className="joy-load-keep block"><FlyingButterfly seed={2} className="h-auto w-full overflow-visible [filter:hue-rotate(-70deg)_saturate(1.2)]" /></span>
                </span>
              </div>
              <div className="absolute inset-0 grid place-items-center">
                <div className="relative">
                  <Image src="/images/joy-logo.webp" alt="Joy" width={260} height={119} priority className="joy-load-logo relative h-auto w-32 sm:w-40" />
                  {STARS.map((s, i) => (
                    <svg key={i} aria-hidden="true" viewBox="0 0 24 24" className="joy-load-star absolute" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, animationDelay: `${s.d}s` }}>
                      <path d="M12 1.5 14.6 9.4 22.5 12 14.6 14.6 12 22.5 9.4 14.6 1.5 12 9.4 9.4Z" fill={['#ffb15c', '#c9a7ff', '#ff8fb3', '#7fd1a8'][i]} />
                    </svg>
                  ))}
                  <span aria-hidden="true" className="joy-load-shadow absolute inset-x-6 -bottom-5 h-4 rounded-full bg-[#2a2240]/10 blur-md" />
                </div>
              </div>
            </div>
            <div className="flex w-56 flex-col items-center gap-3 sm:w-64">
              <div aria-hidden="true" className="relative h-3.5 w-full overflow-hidden rounded-full bg-white/80 shadow-inner ring-1 ring-[#efe4d7]">
                <span className="joy-load-fill absolute inset-y-0 left-0 block rounded-full bg-[linear-gradient(90deg,#ffb15c,#ff8fb3,#c9a7ff,#7fd1a8)]">
                  <span className="joy-load-shine absolute inset-0 block rounded-full" />
                </span>
              </div>
              <p className="font-display text-base text-[#6b6380]">
                {label}
                <span aria-hidden="true" className="joy-load-ell"><i>.</i><i>.</i><i>.</i></span>
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <JoyAnim kind={kind} className="h-auto w-[min(94vw,40rem)]" />
            <p className={`font-display text-base ${night ? 'text-[#efe9ff]' : 'text-[#6b6380]'}`}>
              {label}
              <span aria-hidden="true" className="joy-load-ell"><i>.</i><i>.</i><i>.</i></span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
