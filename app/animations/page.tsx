import type { Metadata } from 'next'
import { AnimationGallery, AnimationHeader } from '@/components/joy/anim/gallery'

export const metadata: Metadata = {
  title: 'Animations',
  description: 'The animations used across Joy, where each one appears and how to see it.',
}

export default function AnimationsPage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14">
      <AnimationHeader />
      <AnimationGallery />
    </main>
  )
}
