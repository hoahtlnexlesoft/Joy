export function GuideDecorations() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[72px] bottom-0 z-0 overflow-visible">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/triskele.webp" alt="" className="absolute -right-16 top-[10rem] size-44 rotate-12 opacity-25 md:right-[4%] md:top-[14rem] md:size-60" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/triskele.webp" alt="" className="absolute -left-14 top-[52rem] size-40 -rotate-12 opacity-20 md:left-[3%] md:top-[56rem] md:size-56" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/triskele.webp" alt="" className="absolute -right-12 top-[96rem] size-40 rotate-45 opacity-20 md:right-[6%] md:top-[100rem] md:size-52" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/triskele.webp" alt="" className="absolute -left-10 top-[140rem] size-36 rotate-6 opacity-20 md:left-[8%] md:top-[146rem] md:size-48" />
      <svg className="absolute -right-5 top-[25rem] h-32 w-28 opacity-60 md:right-[7%] md:top-[27rem] md:h-40 md:w-36" viewBox="0 0 144 160" fill="none">
        <path d="M20 116c24-35 22-67 47-76 18-6 29 7 23 19-5 11-21 8-19-2m7 67c17-17 25-36 28-56" stroke="#ff9db8" strokeWidth="5" strokeLinecap="round" />
        <path d="M108 36c0-10 13-12 16-3 8-5 17 4 11 11 7 7 0 17-9 15-4 9-17 7-18-3-10-1-12-14-3-18Z" fill="#ffe27a" stroke="#dba85c" strokeWidth="2" />
        <circle cx="117" cy="46" r="4" fill="#f6f1fb" />
        <path d="m31 39 3 8 8 3-8 3-3 8-3-8-8-3 8-3 3-8Z" fill="#8b78f0" />
        <circle cx="47" cy="133" r="3" fill="#79bf8b" />
        <circle cx="59" cy="140" r="2" fill="#79bf8b" />
      </svg>

      <svg className="absolute -right-9 top-[34rem] h-36 w-32 rotate-12 opacity-80 md:right-[3%] md:top-[38rem] md:h-44 md:w-40" viewBox="0 0 160 180" fill="none">
        <path d="M75 166c7-26-34-42-38-70-3-20 26-6 43 8 15 12 33 25 37 6 3-15-10-34-2-47 6-10 17-3 25 5" stroke="#79bf8b" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
        <path d="m118 25 4-13m13 18 12-7m-17 23 13 5" stroke="#fbc23c" strokeWidth="5" strokeLinecap="round" />
      </svg>

      <svg className="absolute -left-7 top-[76rem] size-28 opacity-70 md:left-8 md:top-[82rem] md:size-32" viewBox="0 0 128 128" fill="none">
        <path d="M63 109c1-20 3-33 6-44" stroke="#79bf8b" strokeWidth="5" strokeLinecap="round" />
        <path d="M66 78c-17 2-25-6-26-19 13 0 23 6 26 19Zm4-14c2-16 11-23 24-20-2 13-10 20-24 20Z" fill="#94cea0" stroke="#5fae6e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M63 31c0-12 16-15 20-4 10-6 21 5 14 14 8 8 0 22-11 19-5 11-21 8-22-4-12-1-15-17-4-22Z" fill="#f7a7ae" stroke="#f27b85" strokeWidth="3" />
        <circle cx="77" cy="39" r="8" fill="#f9c95c" />
      </svg>

      <svg className="absolute -right-6 top-[112rem] size-28 opacity-70 md:right-10 md:top-[126rem] md:size-32" viewBox="0 0 128 128" fill="none">
        <path d="m63 11 8 25 25 8-25 8-8 25-8-25-25-8 25-8 8-25Z" fill="#f9c95c" />
        <path d="m101 75 4 12 12 4-12 4-4 12-4-12-12-4 12-4 4-12Z" fill="#f7a7ae" />
        <circle cx="28" cy="94" r="4" fill="#79bf8b" />
        <circle cx="39" cy="108" r="2.5" fill="#79bf8b" />
      </svg>
    </div>
  )
}
