import { SiteHeader } from '@/components/joy/site-header'
import { SiteFooter, TryJoyCta } from '@/components/joy/site-footer'
import { Hero } from '@/components/joy/landing/hero'
import { Features } from '@/components/joy/landing/features'
import { FeelingLog } from '@/components/joy/landing/feeling-log'
import { HowSteps } from '@/components/joy/landing/how-steps'
import { ScrollReveal } from '@/components/joy/scroll-reveal'
import { MobileDownloadBar } from '@/components/joy/download-cta'
import { DoodleAccents } from '@/components/joy/doodle-accents'

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="relative">
        <DoodleAccents />
        <Hero />
        <Features />
        <FeelingLog />
        <HowSteps />
        <TryJoyCta />
      </main>
      <SiteFooter />
      <MobileDownloadBar />
      <ScrollReveal />
    </>
  )
}
