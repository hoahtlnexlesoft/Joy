'use client'

import { useCallback, useState } from 'react'
import { useJoySession } from '@/lib/joy-session'
import { LoginModal } from '@/components/joy/login-modal'
import { JoyButton, joyButtonClass } from '@/components/joy/ui'

/** "Choose plan": signed-in parents go straight to the Choose a plan dialog; everyone else logs in first, then lands there. */

export function ChoosePlanButton({ variant, className, plan }: { variant: 'primary' | 'dark'; className?: string; plan?: string }) {
  const session = useJoySession()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const next = plan ? `/parent#buy-${encodeURIComponent(plan)}` : '/parent#buy'

  if (session) {
    return (
      <JoyButton href={next} variant={variant} className={className}>
        Choose plan
      </JoyButton>
    )
  }
  return (
    <>
      <button type="button" onClick={(e) => { if (!e.defaultPrevented) setOpen(true) }} className={joyButtonClass(variant, className)} aria-haspopup="dialog">
        Choose plan
      </button>
      <LoginModal open={open} onClose={close} next={next} />
    </>
  )
}
