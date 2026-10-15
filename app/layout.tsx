import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Caveat, Fredoka, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ContactBubble } from '@/components/joy/contact-bubble'

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
    <html lang="en" className={`${fredoka.variable} ${jakarta.variable} ${caveat.variable}`}>
      <body className="antialiased">
        {children}
        <ContactBubble />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
