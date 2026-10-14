import type { Child, Payment, Plan, State } from './data'

export type View = { name: 'children' } | { name: 'child'; id: string } | { name: 'plans' } | { name: 'profile'; sec: Section }
export type Section = 'account' | 'payments' | 'prefs' | 'security'
/** Snapshot of the buy-plan popup, so a review comment can reopen it at the same step. */
export type BuyRestore = { nonce?: number; step: number; sel: string[]; ref: string; bought: { id: string; name: string }[]; assign: Record<string, string | null> }

export type Dlg =
  | { k: 'child'; child?: Child }
  | { k: 'delChild'; child: Child }
  | { k: 'buy'; plan?: string; child?: string; restore?: BuyRestore }
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
