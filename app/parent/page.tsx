import type { Metadata } from 'next'
import { SiteHeader } from '@/components/joy/site-header'
import { ParentPortal } from '@/components/joy/parent/portal'

export const metadata: Metadata = {
  title: 'Parent Portal',
  description: 'The Joy parent portal: your children, plans, payments and account settings in one place.',
}

export default function ParentPage() {
  return (
    <>
      <SiteHeader />
      <ParentPortal />
    </>
  )
}
