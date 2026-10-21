export type Gender = 'Boy' | 'Girl'
export type PlanType = 'Premium' | 'Special' | 'Premium Plus'
export type Channel = 'AYA' | 'Apple' | 'Google' | 'Offline'
export type Stage = 'Alpha' | 'Omega' | 'Crystal' | 'Rainbow'

export type Child = {
  id: string
  name: string
  dob: string
  gender: Gender
  needs: string[]
  element: string | null
  animal: string | null
  nature: string | null
  arch: string | null
  stage: Stage
  color: string
}
export type Plan = {
  id: string
  name: string
  type: PlanType
  label: string
  price: number
  start: Date
  end: Date
  children: string[]
  voucher?: string
  ref?: string
}
export type Payment = { date: Date; item: string; child: string; amount: number; channel: Channel; ref: string; status: string }
export type Avatar = { type: 'initials' } | { type: 'emoji'; value: string; bg: string } | { type: 'photo'; value: string }
export type Parent = { name: string; method: 'Apple' | 'Google' | 'Phone' | 'Email'; email: string; phone: string; avatar?: Avatar }
export type State = {
  parent: Parent
  settings: { notif: boolean; lang: string; childUpdates?: boolean; tips?: boolean; channel?: 'Telegram' | 'Email' }
  children: Child[]
  plans: Plan[]
  payments: Payment[]
  usedVouchers: string[]
}

export const DAY = 864e5
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * DAY)
const pad = (n: number) => String(n).padStart(2, '0')
export const fmt = (d: Date) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
export const fmtDate = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
export const fmtTime = (d: Date) => d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
export const money = (n: number) => '$' + n.toFixed(2)
export const initials = (n: string) => n.split(' ').filter(Boolean).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
export const firstName = (n: string) => n.split(' ')[0]

export const CATALOG = [
  { name: 'Discovery', type: 'Premium' as const, months: 1, price: 4.99, popular: false },
  { name: 'Adventure', type: 'Premium' as const, months: 3, price: 12.99, popular: true },
  { name: 'Guided Growth', type: 'Premium' as const, months: 12, price: 44.99, popular: false },
  { name: 'Mastery', type: 'Special' as const, months: 12, price: 59.99, popular: false },
]
export const BENEFITS: Record<string, string[]> = {
  Premium: ['All daily activities', 'Premium Joy Collection activities', 'Premium animals'],
  Special: ['Special Plan program: 12 programs in a year', 'Special Plan library', 'Premium Joy Collection activities'],
}
export const VOUCHERS: Record<string, { name: string; type: PlanType; days: number }> = {
  JOYTRIAL: { name: 'Trial Gift', type: 'Premium Plus', days: 10 },
  JOYGIFT10: { name: 'Trial Gift', type: 'Premium Plus', days: 10 },
}
export const COLORS = ['#ff8a2a', '#1fa9e8', '#58b800', '#8e5cf0', '#f0488a', '#e3a500']
export const NEEDS = ['Attention differences', 'Sensory sensitivity', 'Pattern thinking', 'Emotional intensity']
export const STAGES: [Stage, string][] = [['Alpha', '#7ccf4a'], ['Omega', '#f9c95c'], ['Crystal', '#e8332a'], ['Rainbow', '#22b8e8']]

export const ANIMAL_IMG: Record<string, string> = {
  Lion: 'lion', Dolphin: 'dolphin', Panda: 'panda', Hummingbird: 'hummingbird', Owl: 'owl', Bunny: 'bunny', Elephant: 'elephant', Whale: 'whale',
}

export function initialState(): State {
  const now = new Date()
  return {
    parent: { name: 'Bruce Smith', method: 'Apple', email: 'bruce@example.com', phone: '' },
    settings: { notif: true, lang: 'English', childUpdates: true, tips: false, channel: 'Telegram' },
    children: [
      { id: 'c1', name: 'Thomas', dob: '2021-05-14', gender: 'Boy', needs: ['Attention differences'], element: 'Flame', animal: 'Lion', nature: 'Dream Explorer', arch: 'Explorer', stage: 'Alpha', color: COLORS[0] },
      { id: 'c2', name: 'Sarah', dob: '2019-11-02', gender: 'Girl', needs: [], element: 'Stream', animal: 'Dolphin', nature: 'Kind Helper', arch: 'Helper', stage: 'Omega', color: COLORS[1] },
      { id: 'c3', name: 'Smith', dob: '2020-02-20', gender: 'Boy', needs: ['Sensory sensitivity'], element: 'Garden', animal: 'Panda', nature: 'Caring Nurturer', arch: 'Nurturer', stage: 'Crystal', color: COLORS[2] },
      { id: 'c4', name: 'Mia', dob: '2022-08-09', gender: 'Girl', needs: [], element: 'Sky', animal: 'Hummingbird', nature: 'Wise Seeker', arch: 'Seeker', stage: 'Alpha', color: COLORS[3] },
      { id: 'c5', name: 'Leo', dob: '2023-03-18', gender: 'Boy', needs: [], element: 'Stone', animal: 'Owl', nature: 'Gentle Helper', arch: 'Helper', stage: 'Alpha', color: COLORS[4] },
    ],
    plans: [
      { id: 'p1', name: 'Discovery', type: 'Premium', label: '1 month', price: 4.99, start: addDays(now, -27), end: addDays(now, 3), children: ['c1'] },
      { id: 'p2', name: 'Mastery', type: 'Special', label: '12 months', price: 59.99, start: addDays(now, -20), end: addDays(now, 345), children: [] },
      { id: 'p3', name: 'Adventure', type: 'Premium', label: '3 months', price: 12.99, start: addDays(now, -60), end: addDays(now, 31), children: ['c2'] },
      { id: 'p5', name: 'Guided Growth', type: 'Premium', label: '12 months', price: 44.99, start: addDays(now, -375), end: addDays(now, -10), children: ['c3'] },
      { id: 'p4', name: 'Trial Gift', type: 'Premium Plus', label: '10 days', price: 0, voucher: 'WELCOME10', start: addDays(now, -70), end: addDays(now, -60), children: ['c1', 'c2', 'c3', 'c4'] },
    ],
    payments: [
      { date: addDays(now, -20), item: 'Mastery, 12 months', child: 'Not assigned yet', amount: 59.99, channel: 'AYA', ref: 'JOY48210937', status: 'Paid' },
      { date: addDays(now, -27), item: 'Discovery, 1 month', child: 'Thomas', amount: 4.99, channel: 'Apple', ref: 'MT7Q2K9P1X', status: 'Paid' },
      { date: addDays(now, -60), item: 'Adventure, 3 months', child: 'Sarah', amount: 12.99, channel: 'Google', ref: 'GPA.3321-8841-2210', status: 'Paid' },
      { date: addDays(now, -375), item: 'Guided Growth, 12 months', child: 'Smith', amount: 44.99, channel: 'Offline', ref: 'OFF-2025-0142', status: 'Paid' },
      { date: addDays(now, -410), item: 'Discovery, 1 month', child: 'Mia', amount: 4.99, channel: 'Apple', ref: 'MT5B8R2D4Z', status: 'Paid' },
      { date: addDays(now, -440), item: 'Adventure, 3 months', child: 'Sarah', amount: 12.99, channel: 'Google', ref: 'GPA.3320-1127-9034', status: 'Paid' },
      { date: addDays(now, -470), item: 'Discovery, 1 month', child: 'Thomas', amount: 4.99, channel: 'AYA', ref: 'JOY48117722', status: 'Paid' },
    ],
    usedVouchers: ['WELCOME10'],
  }
}

export const daysLeft = (p: Plan) => Math.max(0, Math.ceil((p.end.getTime() - Date.now()) / DAY))
export const isExpired = (p: Plan) => p.end.getTime() <= Date.now()
export const isUpcoming = (p: Plan) => p.start.getTime() > Date.now()
export const ageOf = (dob: string) => {
  const d = new Date(dob), n = new Date()
  let a = n.getFullYear() - d.getFullYear()
  const m = n.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && n.getDate() < d.getDate())) a--
  return a
}
export type Unlock = 'Free' | 'Premium' | 'Special' | 'Premium Plus'
export function unlockOf(s: State, c: Child): Unlock {
  const act = s.plans.filter((p) => !isExpired(p) && !isUpcoming(p) && p.children.includes(c.id))
  const prem = act.some((p) => p.type === 'Premium' || p.type === 'Premium Plus')
  const spec = act.some((p) => p.type === 'Special' || p.type === 'Premium Plus')
  return prem && spec ? 'Premium Plus' : prem ? 'Premium' : spec ? 'Special' : 'Free'
}
export function endingSoon(s: State) {
  return s.plans.filter(
    (p) => !isExpired(p) && daysLeft(p) <= 3 && p.children.length && !s.plans.some((x) => x !== p && x.type === p.type && x.end > p.end && x.children.some((i) => p.children.includes(i))),
  )
}

/* ---------- sample activity history ---------- */
export const MOODS: [string, string][] = [['Happy', '😊'], ['Excited', '😁'], ['Calm', '😌'], ['Okay', '🙂'], ['Tired', '😑'], ['Worried', '😥'], ['Sad', '😟'], ['Grumpy', '😒'], ['Angry', '😠']]
export const ELS: [string, string, string][] = [['Water', '💧', '#5ccaff'], ['Sky', '☁️', '#a97ff0'], ['Earth', '⛰️', '#f9c95c'], ['Garden', '🌿', '#7ccf4a'], ['Fire', '🔥', '#ff9e50']]
export const TAGS: [string, string, string, string][] = [['Think', '💡', '#fbc23c', '#fff3d6'], ['Ground', '🌱', '#58b800', '#eaf7e1'], ['Action', '⚡', '#ff8a2a', '#ffeadf'], ['Create', '🎨', '#8e5cf0', '#efeaff'], ['Flow', '🌊', '#1fa9e8', '#e3f1ff'], ['Reset', '🍃', '#e7609e', '#ffe7ef']]
const ACT_NAMES: Record<string, string[]> = {
  Think: ['A, B, C Sun Book Forest', 'Counting Stars', 'Shape Detective'],
  Ground: ['Calm Breathing Garden', 'Tree Pose Friends', 'Roots and Toes'],
  Action: ['The Brave Little Dragon', 'Star Jumping Joy', 'Jump Over The Fence'],
  Create: ['Draw Your Feeling', 'Colour the Sky', 'Build a Rainbow'],
  Flow: ['Feather Float', 'River Stretch', 'Cloud Dance'],
  Reset: ['Love On A Rainy Day', 'Be Kind To Each Other', 'Sleepy Moon Breaths'],
}
const SECTIONS: [string, string, number][] = [['Morning Mindfulness', '☀️', 8], ['Afternoon Adventures', '🎒', 14], ['Evening Enchantment', '🌙', 19]]

export type FeelEntry = { mood: [string, string]; el: [string, string, string]; time: Date }
export type ActEntry = { name: string; tag: string; sec: string; secIc: string; time: Date }
export type DayData = { feel: FeelEntry[]; acts: ActEntry[] }

export const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
export const dayKey = (d: Date) => { const p = (n: number) => String(n).padStart(2, '0'); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` }
export const rangeDays = (n: number) => { const t = startOfDay(new Date()); return Array.from({ length: n }, (_, i) => dayKey(addDays(t, -i))) }
export const dayLabel = (k: string) => {
  const t = dayKey(startOfDay(new Date())), y = dayKey(addDays(startOfDay(new Date()), -1))
  return k === t ? 'Today' : k === y ? 'Yesterday' : new Date(k + 'T00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })
}

const cache: Record<string, Record<string, DayData>> = {}
export function childData(c: Child): Record<string, DayData> {
  if (cache[c.id]) return cache[c.id]
  let s = 0
  for (const ch of c.id + c.name) s = (s * 31 + ch.charCodeAt(0)) >>> 0
  const r = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
  const w = <T,>(arr: T[], bias: (i: number) => number): T => { const tot = arr.reduce((a, _, i) => a + bias(i), 0); let x = r() * tot; for (let i = 0; i < arr.length; i++) { x -= bias(i); if (x <= 0) return arr[i] } return arr[0] }
  const days: Record<string, DayData> = {}
  if (!c.element) return (cache[c.id] = days)
  const today = startOfDay(new Date()), now = new Date()
  const moodBias = (i: number) => [9, 4, 5, 5, 3, 2, 1.5, 1.2, 1][i], elBias = (i: number) => [8, 4, 4, 3, 2][i]
  for (let n = 0; n < 120; n++) {
    const d = addDays(today, -n), k = dayKey(d)
    const e: DayData = { feel: [], acts: [] }
    if (r() < 0.82) {
      const cnt = r() < 0.35 ? 2 : 1
      for (let j = 0; j < cnt; j++) e.feel.push({ mood: w(MOODS, moodBias), el: w(ELS, elBias), time: new Date(d.getTime() + (j ? 18 : 9) * 36e5 + Math.floor(r() * 50) * 6e4) })
    }
    SECTIONS.forEach(([sec, ic, hr]) => {
      if (r() < 0.62) {
        const t = TAGS[Math.floor(r() * TAGS.length)][0], names = ACT_NAMES[t]
        e.acts.push({ name: names[Math.floor(r() * names.length)], tag: t, sec, secIc: ic, time: new Date(d.getTime() + hr * 36e5 + Math.floor(r() * 55) * 6e4) })
      }
    })
    e.feel = e.feel.filter((x) => x.time <= now)
    e.acts = e.acts.filter((x) => x.time <= now)
    days[k] = e
  }
  return (cache[c.id] = days)
}
