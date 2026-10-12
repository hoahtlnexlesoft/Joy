import Image from 'next/image'

// Eye positions (percent of the artwork) and the fur colour around each eye.
// Each eyelid is a small disc of fur colour that slides down and back up, so the animals blink.
const EYES = [
  { x: 64.78, y: 17.19, w: 2.61, c: '#c5def4', d: 0.00 },
  { x: 68.75, y: 18.36, w: 2.61, c: '#def2f8', d: 0.00 },
  { x: 79.04, y: 28.61, w: 2.77, c: '#f1cb79', d: 0.37 },
  { x: 83.2, y: 30.76, w: 2.77, c: '#fcdf83', d: 0.37 },
  { x: 16.93, y: 41.6, w: 2.46, c: '#f7d8cb', d: 0.74 },
  { x: 21.88, y: 37.89, w: 2.46, c: '#fef1e6', d: 0.74 },
  { x: 29.1, y: 35.35, w: 3.38, c: '#634b46', d: 1.11 },
  { x: 36.52, y: 32.62, w: 3.38, c: '#e6c6b7', d: 1.11 },
  { x: 44.92, y: 27.73, w: 3.53, c: '#4c3b3f', d: 1.48 },
  { x: 52.6, y: 31.74, w: 3.53, c: '#67493a', d: 1.48 },
  { x: 62.89, y: 42.58, w: 2.61, c: '#aeccf7', d: 1.85 },
  { x: 67.77, y: 44.04, w: 2.61, c: '#cbd9f6', d: 1.85 },
  { x: 85.87, y: 48.73, w: 3.69, c: '#d6afa1', d: 2.22 },
  { x: 90.95, y: 52.54, w: 3.69, c: '#e6bea5', d: 2.22 },
  { x: 11.26, y: 51.17, w: 2.3, c: '#59728b', d: 2.59 },
  { x: 46.68, y: 58.2, w: 3.53, c: '#f7bf86', d: 2.96 },
  { x: 53.84, y: 55.18, w: 3.53, c: '#fed396', d: 2.96 },
  { x: 27.6, y: 65.23, w: 3.38, c: '#b7b5cb', d: 3.33 },
  { x: 34.51, y: 61.52, w: 3.38, c: '#d4ccd8', d: 3.33 },
  { x: 60.22, y: 66.11, w: 2.61, c: '#fee07d', d: 3.70 },
  { x: 66.08, y: 64.65, w: 2.61, c: '#fded7f', d: 3.70 },
  { x: 73.7, y: 66.99, w: 3.38, c: '#fdb968', d: 4.07 },
  { x: 79.17, y: 67.09, w: 3.38, c: '#fdd286', d: 4.07 },
  { x: 87.04, y: 78.42, w: 2.46, c: '#f6c8b1', d: 0.24 },
  { x: 90.36, y: 79.59, w: 2.46, c: '#fcd7b9', d: 0.24 },
  { x: 13.93, y: 84.08, w: 2.77, c: '#f6d2c1', d: 0.61 },
]

export function BlinkingAnimals({ src, alt, className, priority }: { src: string; alt: string; className?: string; priority?: boolean }) {
  return (
    <div className="relative w-full">
      <Image src={src} alt={alt} width={1400} height={933} priority={priority} sizes="(min-width: 768px) 46vw, 94vw" className={className} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {EYES.map((e, i) => (
          <span
            key={i}
            className="joy-blink absolute block aspect-square rounded-full"
            style={{ left: `${e.x}%`, top: `${e.y}%`, width: `${e.w}%`, background: e.c, animationDelay: `${e.d}s` }}
          />
        ))}
      </div>
    </div>
  )
}
