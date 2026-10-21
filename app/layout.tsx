import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Caveat, Fredoka, Noto_Sans, Noto_Sans_Myanmar, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { BootLoader } from '@/components/joy/boot-loader'
import { ContactBubble } from '@/components/joy/contact-bubble'
import { LangHtmlSync } from '@/components/joy/lang-switch'
import { ReviewScript } from '@/components/joy/review/review-script'
import { DeviceSwitcher } from '@/components/joy/review/device-switcher'

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-caveat',
  display: 'swap',
})

const fredoka = Fredoka({
  subsets: ['latin'],
  variable: '--font-fredoka',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-noto',
  display: 'swap',
})

const myanmar = Noto_Sans_Myanmar({
  subsets: ['myanmar'],
  variable: '--font-myanmar',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Joy — Joyful daily play that helps your child grow',
    template: '%s · Joy',
  },
  description:
    "Joy learns your child's nature, maps a path for them to grow, and picks fun activities for every day. You see how they feel and what they learn.",
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#fffaf4',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${jakarta.variable} ${caveat.variable} ${myanmar.variable} ${notoSans.variable}`}>
      <body className="antialiased">
        <style href="joy-boot" precedence="high">{'html:not([data-joy-ready]):not([data-joy-booted]){background:linear-gradient(170deg,#2a2550,#4b3f86 70%,#6a4f9c) fixed}.joy-boot{position:fixed;inset:0;z-index:2147483000;background:linear-gradient(170deg,#2a2550,#4b3f86 70%,#6a4f9c)}'}</style>
        {process.env.NEXT_PUBLIC_JOY_PREVIEW === '1' && <script dangerouslySetInnerHTML={{ __html: "try{if(sessionStorage.getItem('joy-booted'))document.documentElement.setAttribute('data-joy-booted','1')}catch(e){}" }} />}
        <BootLoader />
        <noscript><style>{'.joy-boot{display:none!important}html{background:none!important}'}</style></noscript>
        {children}
        <LangHtmlSync />
        <ContactBubble />
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NEXT_PUBLIC_JOY_REVIEW === '1' && process.env.NEXT_PUBLIC_JOY_PREVIEW !== '1' && <ReviewScript />}
        {process.env.NEXT_PUBLIC_JOY_REVIEW === '1' && process.env.NEXT_PUBLIC_JOY_PREVIEW !== '1' && <DeviceSwitcher />}
      </body>
    </html>
  )
}
