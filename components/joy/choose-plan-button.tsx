'use client'

import { useCallback, useState } from 'react'
import { useJoySession } from '@/lib/joy-session'
import { LoginModal } from '@/components/joy/login-modal'
import { JoyButton, joyButtonClass } from '@/components/joy/ui'

/** "Choose plan": signed-in parents go to their plans; everyone else gets the Login / Sign up modal. */
export function ChoosePlanButton({ variant, className }: { variant: 'primary' | 'dark'; className?: string }) {
  const session = useJoySession()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  if (session) {
    return (
      <JoyButton href="/parent#plans" variant={variant} className={className}>
        Choose plan
      </JoyButton>
    )
  }
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={joyButtonClass(variant, className)} aria-haspopup="dialog">
        Choose plan
      </button>
      <LoginModal open={open} onClose={close} />
    </>
  )
}
