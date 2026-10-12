import type { Child, Payment, Plan, State } from './data'

export type View = { name: 'children' } | { name: 'child'; id: string } | { name: 'plans' } | { name: 'profile'; sec: Section }
export type Section = 'account' | 'payments' | 'prefs' | 'security'
export type Dlg =
  | { k: 'child'; child?: Child }
  | { k: 'delChild'; child: Child }
  | { k: 'buy'; plan?: string; child?: string }
  | { k: 'assign'; plan: Plan }
  | { k: 'assignTo'; child: Child }
  | { k: 'redeem' }
  | { k: 'qr' }
  | { k: 'invoice'; pay: Payment }
  | { k: 'pw' }
  | { k: 'delAcc' }
  | { k: 'avatar' }

export type App = {
  s: State
  setS: (fn: (s: State) => State) => void
  toast: (m: string) => void
  open: (d: Dlg | null) => void
  go: (v: View) => void
  newId: (p: string) => string
  logout: () => void
}
