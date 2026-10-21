import { JoyAnim, type AnimKind } from '@/components/joy/anim/joy-anim'

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
 *  - kind "orbit" (default): a butterfly flies a figure 8 around the logo. Used between pages.
 *  - kind "land": the butterfly lands on the logo. Used while the Parent Portal opens.
 *  - kind "night": moon, stars and a glowing butterfly. Used on the very first load.
 */
export function PageLoader({ label = 'Joy is getting ready', kind = 'orbit' }: { label?: string; kind?: Extract<AnimKind, 'orbit' | 'land' | 'night'> }) {
  const night = kind === 'night'
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
        <div className="flex flex-col items-center gap-2 text-center">
          <JoyAnim kind={kind} className="h-auto w-[min(94vw,40rem)]" />
          <p className={`font-display text-base ${night ? 'text-[#efe9ff]' : 'text-[#6b6380]'}`}>
            {label}
            <span aria-hidden="true" className="joy-load-ell">
              <i>.</i><i>.</i><i>.</i>
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
