'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  Activity,
  ArrowLeft,
  Bird,
  ArrowRight,
  Baby,
  BookOpenCheck,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  CreditCard,
  Flower2,
  Heart,
  House,
  LockKeyhole,
  PawPrint,
  Plus,
  Sparkles,
  UsersRound,
  Waves,
} from '@/components/joy/cute-icons'

type Child = {
  id: string
  name: string
  age: string
  grade: string
  nature: string
  animal: string
  stage: string
  progress: number
  tint: string
}

type Section = 'children' | 'plans' | 'profile'
type ChildTab = 'overview' | 'feeling' | 'activities'

const children: Child[] = [
  { id: 'thomas', name: 'Thomas', age: '5 years old', grade: 'Alpha stage', nature: 'Dream Explorer', animal: 'Lion', stage: 'Alpha', progress: 62, tint: 'bg-[#ffe3d1] text-[#de743e]' },
  { id: 'sarah', name: 'Sarah', age: '6 years old', grade: 'Omega stage', nature: 'Kind Helper', animal: 'Dolphin', stage: 'Omega', progress: 78, tint: 'bg-[#e5e0ff] text-[#7c68ce]' },
  { id: 'mia', name: 'Mia', age: '4 years old', grade: 'Alpha stage', nature: 'Wise Seeker', animal: 'Hummingbird', stage: 'Alpha', progress: 44, tint: 'bg-[#dff5e8] text-[#42956c]' },
]

const familyActivities = [
  { name: 'Morning breathing', detail: 'Today · 8:42 AM', tag: 'Mindfulness', tint: 'bg-[#fff0dc] text-[#b9803f]', icon: Flower2 },
  { name: 'The curious little lion', detail: 'Yesterday · 4:15 PM', tag: 'Explore', tint: 'bg-[#eeeaff] text-[#8272ce]', icon: Sparkles },
  { name: 'How are you feeling?', detail: 'Yesterday · 8:31 AM', tag: 'Feeling check-in', tint: 'bg-[#ffe9ef] text-[#d8658a]', icon: Heart },
]

function AnimalMark({ animal, className }: { animal: string; className?: string }) {
  const Icon = animal === 'Dolphin' ? Waves : animal === 'Hummingbird' ? Bird : PawPrint
  return <Icon className={className} strokeWidth={1.8} aria-hidden="true" />
}

const sideItems: { id: Section; label: string; icon: typeof UsersRound }[] = [
  { id: 'children', label: 'My children', icon: UsersRound },
  { id: 'plans', label: 'Family plans', icon: CreditCard },
  { id: 'profile', label: 'My profile', icon: CircleUserRound },
]

export function ParentDashboard() {
  const [section, setSection] = useState<Section>('children')
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [childTab, setChildTab] = useState<ChildTab>('overview')

  const goTo = (next: Section) => {
    setSelectedChild(null)
    setSection(next)
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] px-4 pb-16 pt-8 md:px-6 md:pt-12">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside className="flex flex-col gap-6">
          <div className="hidden rounded-[1.75rem] bg-white p-5 shadow-[0_15px_50px_-35px_rgba(62,45,94,0.28)] ring-1 ring-[#eee7eb] lg:block">
            <div className="flex items-center gap-3">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#ffe3eb] text-[#e95d91]"><CircleUserRound className="size-6" aria-hidden="true" /></span>
              <div>
                <p className="font-display text-lg font-semibold text-[#30254f]">Bruce Smith</p>
                <p className="text-xs text-[#8b849c]">Parent account</p>
              </div>
            </div>
            <nav aria-label="Parent portal" className="mt-6 flex flex-col gap-1">
              {sideItems.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => goTo(id)} aria-current={section === id ? 'page' : undefined} className={`flex min-h-12 items-center gap-3 rounded-2xl px-3 text-left text-sm font-semibold transition ${section === id ? 'bg-[#fff0f4] text-[#dd4e82]' : 'text-[#77718d] hover:bg-[#faf7fb] hover:text-[#352d5f]'}`}>
                  <Icon className="size-5" aria-hidden="true" />{label}<ChevronRight className={`ml-auto size-4 transition ${section === id ? 'opacity-100' : 'opacity-0'}`} aria-hidden="true" />
                </button>
              ))}
            </nav>
            <div className="mt-6 rounded-2xl bg-[#fff5e6] p-4">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-white text-[#da9e49]"><Sparkles className="size-4" aria-hidden="true" /></span>
              <p className="mt-3 text-sm font-bold text-[#5a4937]">A little help goes a long way</p>
              <p className="mt-1 text-xs leading-relaxed text-[#81735e]">Explore the Joy guide to learn how every activity supports your child.</p>
              <Link href="/how-it-works" className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#b87634] hover:underline">Read the guide <ArrowRight className="size-3" aria-hidden="true" /></Link>
            </div>
          </div>
          <nav aria-label="Parent portal" className="grid grid-cols-3 gap-2 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-[#eee7eb] lg:hidden">
            {sideItems.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => goTo(id)} aria-current={section === id ? 'page' : undefined} className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-xs font-semibold ${section === id ? 'bg-[#fff0f4] text-[#dd4e82]' : 'text-[#77718d]'}`}>
                <Icon className="size-4" aria-hidden="true" />{id === 'plans' ? 'Plans' : label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0">
          {selectedChild ? (
            <ChildProfile child={selectedChild} tab={childTab} onTabChange={setChildTab} onBack={() => setSelectedChild(null)} />
          ) : section === 'children' ? (
            <ChildrenOverview onSelect={setSelectedChild} />
          ) : section === 'plans' ? (
            <PlansOverview />
          ) : (
            <ProfileOverview />
          )}
        </div>
      </div>
    </main>
  )
}

function PreviewNote() {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#f3dba9] bg-[#fff9e9] px-4 py-3 text-sm text-[#826e48]" role="note">
      <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#bf9850]" aria-hidden="true" />
      <p>This is a sample family dashboard. Sign-in and saved account data are not connected in this preview.</p>
    </div>
  )
}

function ChildrenOverview({ onSelect }: { onSelect: (child: Child) => void }) {
  return (
    <div className="flex flex-col gap-7">
      <PreviewNote />
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#fff0f2] p-6 sm:p-8 lg:p-9" aria-labelledby="parent-welcome-title">
        <div className="relative z-10 max-w-lg">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.13em] text-[#cc6683]"><Sparkles className="size-3.5" aria-hidden="true" /> Your family space</p>
          <h1 id="parent-welcome-title" className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight text-[#322654] sm:text-5xl">Welcome back, <span className="text-[#e65d91]">Bruce!</span></h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#736b8a] sm:text-base">Small steps make a big difference. Here&apos;s a little look at how your children are growing.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#your-children" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#ed6695] px-5 text-sm font-bold text-white shadow-md shadow-[#ed6695]/20 transition hover:-translate-y-0.5 hover:bg-[#dc4e83]">Meet your children <ArrowRight className="size-4" aria-hidden="true" /></a>
            <Link href="/how-it-works" className="inline-flex min-h-11 items-center justify-center rounded-full bg-white/80 px-5 text-sm font-semibold text-[#655d7e] transition hover:bg-white">Explore Joy</Link>
          </div>
        </div>
        <div className="pointer-events-none absolute -right-4 -bottom-14 hidden w-[48%] max-w-[390px] md:block lg:-right-1 lg:bottom-[-5.5rem]">
          <Image src="/images/hero-kids.webp" alt="Two cheerful children sitting on a soft cloud" width={840} height={680} priority className="h-auto w-full drop-shadow-[0_20px_30px_rgba(166,99,116,0.15)]" />
        </div>
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-white/45 blur-3xl" aria-hidden="true" />
      </section>

      <section id="your-children" aria-labelledby="children-title">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[#8b829d]">Your little explorers</p>
            <h2 id="children-title" className="mt-1 font-display text-2xl font-semibold tracking-tight text-[#322654] sm:text-3xl">My children <span className="text-base font-medium text-[#9a93a8]">(3)</span></h2>
          </div>
          <button type="button" disabled title="Adding profiles is unavailable in this sample preview" className="inline-flex min-h-10 cursor-not-allowed items-center gap-2 rounded-full border border-[#eadfea] bg-white px-4 text-sm font-semibold text-[#655d7e] opacity-65"><Plus className="size-4" aria-hidden="true" /> Add a child</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => (
            <article key={child.id} className="group overflow-hidden rounded-[1.7rem] bg-white shadow-[0_15px_45px_-35px_rgba(62,45,94,0.35)] ring-1 ring-[#eee7eb] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_-32px_rgba(62,45,94,0.3)]">
              <div className={`relative flex h-28 items-center justify-center ${child.tint.split(' ')[0]}`}>
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/75 px-2.5 py-1 text-[11px] font-semibold text-[#746c87]"><Sparkles className="size-3" aria-hidden="true" /> {child.stage}</span>
                <span className={`flex size-[4.5rem] items-center justify-center rounded-full border-4 border-white/75 bg-white/70 shadow-sm ${child.tint}`}><AnimalMark animal={child.animal} className="size-8" /></span>
                <div className="absolute -bottom-2 left-5 size-5 rounded-full bg-white/60" aria-hidden="true" />
                <div className="absolute -bottom-4 right-10 size-8 rounded-full bg-white/45" aria-hidden="true" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div><h3 className="font-display text-xl font-semibold text-[#342a55]">{child.name}</h3><p className="mt-1 text-sm text-[#89829a]">{child.age}</p></div>
                  <span className="rounded-full bg-[#f3efff] px-3 py-1 text-xs font-semibold text-[#7769bd]">Free plan</span>
                </div>
                <div className="mt-5 flex items-center justify-between text-xs text-[#8a8298]"><span>Growth journey</span><span className="font-bold text-[#655d7e]">{child.progress}%</span></div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#f2eff5]"><div className="h-full rounded-full bg-gradient-to-r from-[#ffb45e] via-[#f77e9f] to-[#a89aec]" style={{ width: `${child.progress}%` }} /></div>
                <p className="mt-4 text-xs text-[#77718c]">{child.nature} · {child.animal} friend</p>
                <button type="button" onClick={() => onSelect(child)} className="mt-5 flex min-h-10 w-full items-center justify-between rounded-full bg-[#faf7fb] px-4 text-sm font-semibold text-[#675d83] transition group-hover:bg-[#fff0f4] group-hover:text-[#d94f83]">
                  Open profile <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]" aria-label="Family activity and weekly progress">
        <div className="rounded-[1.7rem] bg-white p-5 shadow-sm ring-1 ring-[#eee7eb] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-semibold text-[#8b829d]">A glimpse into their days</p><h2 className="mt-1 font-display text-xl font-semibold text-[#342a55]">Recent activities</h2></div>
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#f2efff] text-[#8070c8]"><Activity className="size-5" aria-hidden="true" /></span>
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {familyActivities.map(({ name, detail, tag, tint, icon: Icon }) => (
              <li key={name} className="flex items-center gap-3 rounded-2xl bg-[#fcfafc] p-3">
                <span className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl ${tint}`}><Icon className="size-5" aria-hidden="true" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold text-[#48405f]">{name}</span><span className="mt-0.5 block text-xs text-[#9690a5]">{detail}</span></span>
                <span className="hidden rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-[#8a8298] sm:inline-flex">{tag}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-[1.7rem] bg-[#eaf7f0] p-6">
          <div className="relative z-10">
            <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/80 text-[#52a67a]"><CalendarDays className="size-5" aria-hidden="true" /></span>
            <p className="mt-5 text-sm font-semibold text-[#658c76]">A week of little wins</p>
            <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-[#315d48]">Look how far they&apos;ve come.</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#688674]">Every activity is a chance to discover something new about themselves.</p>
            <Link href="/how-it-works#development" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#44835e] hover:underline">How growth works <ArrowRight className="size-4" aria-hidden="true" /></Link>
          </div>
          <div className="absolute -bottom-12 -right-10 size-44 rounded-full bg-[#d2efdc]" aria-hidden="true" />
          <div className="absolute -bottom-4 right-6 size-20 rounded-full bg-[#d8f0e2]" aria-hidden="true" />
        </div>
      </section>
    </div>
  )
}

function ChildProfile({ child, tab, onTabChange, onBack }: { child: Child; tab: ChildTab; onTabChange: (tab: ChildTab) => void; onBack: () => void }) {
  const tabs: { id: ChildTab; label: string; icon: typeof House }[] = [
    { id: 'overview', label: 'Overview', icon: House },
    { id: 'feeling', label: 'Feeling log', icon: Heart },
    { id: 'activities', label: 'Activities', icon: BookOpenCheck },
  ]
  return (
    <div className="flex flex-col gap-6">
      <button type="button" onClick={onBack} className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#756d89] hover:text-[#d94f83]"><ArrowLeft className="size-4" aria-hidden="true" /> All children</button>
      <PreviewNote />
      <section className="flex flex-wrap items-center gap-5 rounded-[1.8rem] bg-white p-6 shadow-sm ring-1 ring-[#eee7eb] sm:p-8">
        <span className={`flex size-20 items-center justify-center rounded-[1.65rem] ${child.tint}`}><AnimalMark animal={child.animal} className="size-9" /></span>
        <div className="min-w-[160px] flex-1"><p className="text-sm font-semibold text-[#9088a0]">{child.grade}</p><h1 className="mt-1 font-display text-3xl font-semibold text-[#342a55]">{child.name}&apos;s journey</h1><p className="mt-1 text-sm text-[#89829a]">{child.age} · {child.nature}</p></div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#f1f8ee] px-4 py-2 text-sm font-semibold text-[#568550]"><Sparkles className="size-4" aria-hidden="true" /> {child.animal} friend</span>
      </section>
      <div className="flex gap-2 overflow-x-auto rounded-2xl bg-white p-2 ring-1 ring-[#eee7eb]" role="tablist" aria-label={`${child.name}'s profile`}>
        {tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => onTabChange(id)} className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${tab === id ? 'bg-[#fff0f4] text-[#d94f83]' : 'text-[#77718d] hover:bg-[#faf7fb]'}`}><Icon className="size-4" aria-hidden="true" />{label}</button>)}
      </div>
      {tab === 'overview' ? <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[1.6rem] bg-white p-6 ring-1 ring-[#eee7eb]"><span className="inline-flex size-11 items-center justify-center rounded-2xl bg-[#fff2dc] text-[#c59046]"><Sparkles className="size-5" aria-hidden="true" /></span><h2 className="mt-4 font-display text-xl font-semibold text-[#342a55]">A nature all their own</h2><p className="mt-2 text-sm text-[#827b93]">{child.nature} · Growing through the {child.stage} stage.</p><Link href="/how-it-works#child-nature" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#d94f83]">Explore child nature <ArrowRight className="size-4" aria-hidden="true" /></Link></section>
        <section className="rounded-[1.6rem] bg-[#f1efff] p-6"><span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white text-[#8170cc]"><Activity className="size-5" aria-hidden="true" /></span><h2 className="mt-4 font-display text-xl font-semibold text-[#342a55]">Growth journey</h2><p className="mt-2 text-sm text-[#77708e]">{child.progress}% of the way through this stage.</p><div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-gradient-to-r from-[#a899ed] to-[#ed82ad]" style={{ width: `${child.progress}%` }} /></div></section>
      </div> : tab === 'feeling' ? <section className="rounded-[1.6rem] bg-white p-6 ring-1 ring-[#eee7eb]"><h2 className="font-display text-xl font-semibold text-[#342a55]">Feeling log</h2><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#827b93]">In a connected family account, this is where you can explore your child&apos;s check-ins over time. This preview doesn&apos;t contain real child data.</p><div className="mt-6 flex items-center gap-3 rounded-2xl bg-[#fff7ee] p-4"><Heart className="size-5 text-[#e77896]" aria-hidden="true" /><span className="text-sm font-medium text-[#746b86]">No real check-ins are available in preview mode.</span></div></section> : <section className="rounded-[1.6rem] bg-white p-6 ring-1 ring-[#eee7eb]"><h2 className="font-display text-xl font-semibold text-[#342a55]">Recent activities</h2><ul className="mt-4 flex flex-col gap-3">{familyActivities.map(({ name, detail, icon: Icon, tint }) => <li key={name} className="flex items-center gap-3 rounded-2xl bg-[#fcfafc] p-3"><span className={`inline-flex size-10 items-center justify-center rounded-xl ${tint}`}><Icon className="size-5" aria-hidden="true" /></span><span><span className="block text-sm font-semibold text-[#48405f]">{name}</span><span className="text-xs text-[#9690a5]">{detail}</span></span></li>)}</ul></section>}
    </div>
  )
}

function PlansOverview() {
  const plans = [
    { name: 'Discovery', term: '1 month', price: '$4.99', tint: 'bg-[#fff1e5]', status: 'Available to explore' },
    { name: 'Adventure', term: '3 months', price: '$12.99', tint: 'bg-[#e7f6ed]', status: 'Popular with families' },
    { name: 'Guided Growth', term: '12 months', price: '$44.99', tint: 'bg-[#ffeaf1]', status: 'A year of discovery' },
  ]
  return <div className="flex flex-col gap-6"><PreviewNote /><div><p className="text-sm font-semibold text-[#8b829d]">Options for your family</p><h1 className="mt-1 font-display text-3xl font-semibold text-[#322654]">Family plans</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-[#827b93]">Explore sample plans from the wireframe. They&apos;re for display only; checkout isn&apos;t enabled.</p></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{plans.map((plan) => <article key={plan.name} className={`rounded-[1.6rem] ${plan.tint} p-6`}><span className="inline-flex size-11 items-center justify-center rounded-2xl bg-white/80 text-[#8b74be]"><CreditCard className="size-5" aria-hidden="true" /></span><p className="mt-5 text-sm font-semibold text-[#89829a]">{plan.status}</p><h2 className="mt-1 font-display text-2xl font-semibold text-[#342a55]">{plan.name}</h2><p className="mt-2 text-sm text-[#827b93]">{plan.term} · one child</p><p className="mt-5 font-display text-3xl font-semibold text-[#342a55]">{plan.price}</p><Link href="/pricing#plans" className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-bold text-[#625a7c] transition hover:text-[#d94f83]">Compare plans <ArrowRight className="size-4" aria-hidden="true" /></Link></article>)}</div></div>
}

function ProfileOverview() {
  return <div className="flex flex-col gap-6"><PreviewNote /><section className="overflow-hidden rounded-[1.8rem] bg-white shadow-sm ring-1 ring-[#eee7eb]"><div className="relative flex min-h-44 items-end overflow-hidden bg-gradient-to-r from-[#fbe7ef] via-[#f4edff] to-[#e6f6ed] p-6 sm:p-8"><div className="absolute -right-1 top-[-4.5rem] w-48 opacity-70 sm:w-64"><Image src="/images/mom-child-illustration.webp" alt="A soft family illustration" width={500} height={500} className="h-auto w-full" /></div><div className="relative z-10"><p className="text-sm font-semibold text-[#8b829d]">Parent account</p><h1 className="mt-1 font-display text-3xl font-semibold text-[#322654]">My profile</h1></div></div><div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8"><div className="rounded-2xl bg-[#fcfafc] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#9a92a6]">Name</p><p className="mt-2 font-semibold text-[#48405f]">Bruce Smith</p></div><div className="rounded-2xl bg-[#fcfafc] p-4"><p className="text-xs font-semibold uppercase tracking-wide text-[#9a92a6]">Account status</p><p className="mt-2 font-semibold text-[#48405f]">Sample profile · not signed in</p></div></div><div className="mx-6 mb-6 flex items-start gap-3 rounded-2xl bg-[#f4f0ff] p-4 text-sm text-[#716792] sm:mx-8 sm:mb-8"><Check className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><p>This preview is read-only. Personal details and security settings aren&apos;t connected.</p></div></section></div>
}

export function ParentPageFooter() {
  return <footer className="border-t border-[#efe5ed] bg-white/70 px-4 py-6 text-center text-sm text-[#90899d]"><Link href="/" className="font-semibold text-[#675e82] hover:text-[#dc4e82]">Back to Joy</Link><span className="mx-3" aria-hidden="true">·</span><Link href="/how-it-works" className="hover:text-[#dc4e82]">Parent guide</Link><span className="mx-3" aria-hidden="true">·</span><Link href="/pricing" className="hover:text-[#dc4e82]">Plans & pricing</Link></footer>
}

export function ParentPortalHeader() {
  return (
    <div className="mx-auto flex max-w-6xl items-center justify-between px-5 pb-2 pt-6 md:px-6">
      <div className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-[#fff0f4] text-[#dc4e82]"><Baby className="size-5" aria-hidden="true" /></span>
        <span><span className="block font-display text-lg font-semibold leading-tight text-[#342a55]">Parent Portal</span><span className="text-xs text-[#90899d]">A small window into their world</span></span>
      </div>
      <Link href="/how-it-works" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-semibold text-[#6f6785] ring-1 ring-[#eee7eb] transition hover:text-[#d94f83]">
        <BookOpenCheck className="size-4" aria-hidden="true" /><span className="hidden sm:inline">Help center</span><span className="sm:hidden">Help</span>
      </Link>
    </div>
  )
}
