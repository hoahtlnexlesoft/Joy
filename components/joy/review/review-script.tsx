'use client'

import Script from 'next/script'

/** Review-only comment layer (same one as the REE site). Rendered only when NEXT_PUBLIC_JOY_REVIEW=1. */
export function ReviewScript() {
  const base = process.env.NEXT_PUBLIC_JOY_PREVIEW === '1' ? './review/' : '/review/'
  return (
    <>
      <Script src={`${base}config.js`} strategy="afterInteractive" />
      <Script src={`${base}review.js?v=5`} strategy="afterInteractive" />
    </>
  )
}
