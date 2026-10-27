'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { DEMO_PARENT, joyGo, joyLogin } from '@/lib/joy-session'
import { useCallback, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  Apple,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Heart,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  UserRound,
  X,
} from '@/components/joy/cute-icons'

 type LoginModalProps = {
  open: boolean
  onClose: () => void
  /** Which view opens first: the log in form or the "Try for free" sign-up flow. */
  mode?: 'login' | 'signup'
  /** Where to go after logging in (default: the Parent Portal). */
  next?: string
}

const referenceImageUrl =
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/6a5b1715-b8c8-4243-ae7f-41668b87b996-F3YPLmZFZ8ODUrvrSbdgQTPDGtjmWO.png'

export function LoginModal({ open, onClose, mode: initialMode = 'login', next = '/parent' }: LoginModalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode)
  useEffect(() => {
    if (open) setMode(initialMode)
  }, [open, initialMode])
  const [method, setMethod] = useState<'email' | 'phone'>('email')
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const dialogRef = useRef<HTMLElement>(null)
  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return

    const previousBodyOverflow = document.body.style.overflow
    const previousRootOverflow = document.documentElement.style.overflow
    const previousActiveElement = document.activeElement
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), a[href]'
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    firstFieldRef.current?.focus()

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousRootOverflow
      window.removeEventListener('keydown', closeOnEscape)
      if (previousActiveElement instanceof HTMLElement) previousActiveElement.focus()
    }
  }, [open, onClose])

  const submitDemoForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    joyLogin({ ...DEMO_PARENT, method: method === 'phone' ? 'Phone' : 'Email' })
    onClose()
    joyGo(router, next)
  }

  const showUnavailableMessage = (action: string) => {
    setNotice(`${action} isn't connected in this preview. Your details haven't been sent.`)
  }

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] grid place-items-center overflow-hidden overscroll-none bg-[#27253f]/45 p-3 backdrop-blur-sm sm:p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="joy-login-title"
        aria-describedby="joy-login-description"
        className="joy-login-dialog relative grid overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_100px_-30px_rgba(42, 34, 64, 0.4)] ring-1 ring-white/70"
      >
        <div className="joy-login-art relative hidden flex-col overflow-hidden bg-[linear-gradient(145deg,#fff0d8_0%,#fff3e7_37%,#ffe6ed_72%,#f8dcf5_100%)] md:flex">
          <Image
            src="/images/dreamy-cloud-friends.webp"
            alt="Two smiling children resting their chins in their hands on a peach cloud, with a pink heart, smiling star, and rainbow"
            width={1424}
            height={1105}
            priority
            style={{
              maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.28) 7%, #000 19%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.28) 7%, #000 19%)',
            }}
            className="pointer-events-none absolute bottom-[-3%] left-1/2 z-0 h-auto w-[106%] max-w-none -translate-x-1/2"
          />

          <div className="relative z-10 px-[clamp(1.5rem,3.7vw,3.25rem)] pt-[clamp(0.75rem,1.2vw,1rem)]">
            <div className="joy-logo-cloud relative mb-[clamp(0.75rem,1.5vw,1.25rem)] inline-flex h-[clamp(4.5rem,7vw,6rem)] w-[clamp(9rem,13vw,11rem)] items-center justify-center">
              <span className="absolute inset-x-[5%] bottom-[8%] h-[57%] rounded-full bg-white" aria-hidden="true" />
              <span className="absolute left-[17%] top-[20%] size-[42%] rounded-full bg-white" aria-hidden="true" />
              <span className="absolute left-[32%] top-0 size-[48%] rounded-full bg-white" aria-hidden="true" />
              <span className="absolute right-[13%] top-[17%] size-[43%] rounded-full bg-white" aria-hidden="true" />
              <Image src="/images/joy-logo.webp" alt="Joy" width={440} height={200} priority className="relative z-10 h-auto w-[clamp(7.5rem,11vw,9.75rem)]" />
            </div>

            <h1 className="whitespace-nowrap text-[clamp(1.8rem,3.35vw,3.1rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-[#30235f]">
              {mode === 'login' ? (
                <>Welcome <span className="bg-gradient-to-r from-[#ff765f] via-[#f0488a] to-[#8a45d6] bg-clip-text text-transparent">back!</span></>
              ) : (
                <>Try Joy <span className="bg-gradient-to-r from-[#ff765f] via-[#f0488a] to-[#8a45d6] bg-clip-text text-transparent">for free</span></>
              )}
              <Sparkles className="mb-[0.55em] ml-1 inline size-[0.45em] fill-[#f0488a] text-[#f0488a]" aria-hidden="true" />
            </h1>
            <p className="mt-2 max-w-[27rem] text-[clamp(0.9rem,1.45vw,1.15rem)] leading-[1.35] text-[#8984ad]">
              {mode === 'login' ? 'Log in to see how your children are doing today.' : 'One parent account for all your children.'}
            </p>

            <ul className="mt-2.5 flex flex-col gap-2 text-[clamp(0.85rem,1.35vw,1.05rem)] font-medium text-[#6b6380]">
              {(mode === 'login'
                ? ["Today's activities for each child", 'Feeling log and activity history', 'Plans for each child']
                : ['Daily activities picked for your child', 'A growth path that adapts as they grow', 'A feeling log you can follow']
              ).map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f8608f] to-[#f0488a] text-white shadow-[0_5px_12px_rgba(240, 72, 138, 0.2)]">
                    <Check className="size-4" strokeWidth={3} aria-hidden="true" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>


        </div>

        <div className="joy-login-form-panel relative flex min-h-0 flex-col overflow-hidden bg-white">
          <div className="pointer-events-none absolute -right-4 -top-5 size-32 rounded-full bg-[#f6f1fb] blur-2xl" aria-hidden="true" />
          <Star className="pointer-events-none absolute right-[7%] top-[13%] size-5 fill-[#ffe27a] text-[#ffe27a]" aria-hidden="true" />
          <Heart className="pointer-events-none absolute bottom-[6%] right-[6%] size-6 rotate-12 fill-[#ff9db8]/60 text-[#ff9db8]/60" aria-hidden="true" />

          <button
            type="button"
            onClick={onClose}
            aria-label={mode === 'signup' ? 'Close sign-up dialog' : 'Close login dialog'}
            className="joy-login-close absolute right-[4.5%] top-[3.5%] z-10 flex size-10 items-center justify-center rounded-full bg-[#ffffff] text-[#6b6380] shadow-sm ring-1 ring-[#f6f1fb] transition hover:bg-[#f6f1fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]"
          >
            <X className="size-5" aria-hidden="true" />
          </button>

          <div className="relative flex min-h-0 flex-1 flex-col px-[8.5%] pb-[4%] pt-[8.3%]">
            {mode === 'signup' ? (
              <SignupFlow onClose={onClose} next={next} onSwitchToLogin={() => setMode('login')} />
            ) : (
              <>
              <header className="mb-[4.2%] pr-12">
              <h2 id="joy-login-title" className="text-[clamp(1.5rem,2.8vw,1.875rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#30235f]">
                Log in <Sparkles className="mb-[0.55em] ml-1 inline size-[0.62em] fill-[#f8608f] text-[#f8608f]" aria-hidden="true" />
              </h2>
              <p id="joy-login-description" className="mt-2 max-w-[35rem] text-[clamp(0.875rem,1.15vw,1rem)] leading-snug text-[#8984ad]">
                Use the email or phone number linked to your parent account.
              </p>
            </header>

            <div className="mb-[4%] grid h-[clamp(2.75rem,4vw,3.25rem)] grid-cols-2 rounded-full bg-[#f6f1fb] p-1" role="tablist" aria-label="Choose how to log in">
              <button
                type="button"
                id="login-tab-email"
                role="tab"
                aria-selected={method === 'email'}
                aria-controls="login-panel"
                onClick={() => { setMethod('email'); setNotice('') }}
                className={`flex items-center justify-center gap-2 rounded-full text-sm font-bold transition ${method === 'email' ? 'bg-white text-[#f0488a] shadow-[0_2px_12px_rgba(240, 72, 138, 0.16)] ring-1 ring-[#f6bfd5]' : 'text-[#8984ad]'}`}
              >
                <Mail className="size-[1em]" strokeWidth={2.8} aria-hidden="true" /> Email
              </button>
              <button
                type="button"
                id="login-tab-phone"
                role="tab"
                aria-selected={method === 'phone'}
                aria-controls="login-panel"
                onClick={() => { setMethod('phone'); setNotice('') }}
                className={`flex items-center justify-center gap-2 rounded-full text-sm font-bold transition ${method === 'phone' ? 'bg-white text-[#f0488a] shadow-[0_2px_12px_rgba(240, 72, 138, 0.16)] ring-1 ring-[#f6bfd5]' : 'text-[#8984ad]'}`}
              >
                <Smartphone className="size-[1em]" strokeWidth={2.5} aria-hidden="true" /> Phone
              </button>
            </div>

            <form id="login-panel" role="tabpanel" aria-labelledby={`login-tab-${method}`} onSubmit={submitDemoForm} className="flex min-h-0 flex-col">
              <div className="mb-[4.2%]">
                <label htmlFor="joy-login-identity" className="mb-1.5 block text-sm font-bold text-[#30235f]">
                  {method === 'email' ? 'Email' : 'Phone number'} <span className="text-[#f27b85]" aria-hidden="true">*</span>
                </label>
                <div className="flex h-[clamp(2.75rem,4vw,3.25rem)] items-center gap-3 rounded-full border border-[#f6bfd5] bg-white px-4 transition focus-within:border-[#f8608f] focus-within:ring-4 focus-within:ring-[#f8608f]/10">
                  {method === 'email' ? <Mail className="size-4 shrink-0 text-[#aaa6c8]" aria-hidden="true" /> : <Smartphone className="size-4 shrink-0 text-[#aaa6c8]" aria-hidden="true" />}
                  <input
                    ref={firstFieldRef}
                    id="joy-login-identity"
                    name={method === 'email' ? 'email' : 'phone'}
                    type={method === 'email' ? 'email' : 'tel'}
                    autoComplete={method === 'email' ? 'email' : 'tel'}
                    inputMode={method === 'email' ? 'email' : 'tel'}
                    required
                    placeholder={method === 'email' ? 'you@example.com' : '+1 (555) 000-0000'}
                    aria-label={method === 'email' ? 'Email address' : 'Phone number'}
                    onChange={() => setNotice('')}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#30235f] outline-none placeholder:text-[#aaa6c8]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="joy-login-password" className="mb-1.5 block text-sm font-bold text-[#30235f]">
                  Password <span className="text-[#f27b85]" aria-hidden="true">*</span>
                </label>
                <div className="flex h-[clamp(2.75rem,4vw,3.25rem)] items-center gap-3 rounded-full border border-[#ede5f5] bg-white px-4 transition focus-within:border-[#aaa6c8] focus-within:ring-4 focus-within:ring-[#aaa6c8]/10">
                  <LockKeyhole className="size-4 shrink-0 text-[#aaa6c8]" aria-hidden="true" />
                  <input
                    id="joy-login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    minLength={6}
                    aria-label="Password"
                    onChange={() => setNotice('')}
                    className="min-w-0 flex-1 bg-transparent text-sm text-[#30235f] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    className="grid shrink-0 cursor-pointer place-items-center text-sm font-medium text-[#8984ad] hover:text-[#52428a] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]"
                  >
                    {showPassword ? <Eye className="size-[18px]" aria-hidden="true" /> : <EyeOff className="size-[18px]" aria-hidden="true" />}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => showUnavailableMessage('Password reset')}
                className="mt-2 self-end text-sm font-semibold text-[#f0488a] underline decoration-[#ff9db8] underline-offset-4 hover:text-[#d6336c] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]"
              >
                Forgot password?
              </button>

              <button type="submit" className="joy-login-submit mt-[4.2%] flex h-[clamp(2.875rem,4.2vw,3.25rem)] shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff9e50] via-[#f27b85] to-[#f0488a] text-sm font-bold text-white shadow-[0_12px_24px_rgba(248, 96, 143, 0.22)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f8608f]/30">
                Log in <ArrowRight className="size-5" strokeWidth={2.5} aria-hidden="true" />
              </button>

              <div className="my-[4.2%] flex shrink-0 items-center gap-4 text-sm text-[#8984ad]" aria-hidden="true">
                <span className="h-px flex-1 bg-[#ede5f5]" />or<span className="h-px flex-1 bg-[#ede5f5]" />
              </div>

              <button type="button" onClick={() => showUnavailableMessage('Google sign-in')} className="flex h-[clamp(2.75rem,3.8vw,3rem)] shrink-0 items-center justify-center gap-2.5 rounded-full border border-[#ede5f5] bg-white text-sm font-bold text-[#30235f] shadow-sm transition hover:bg-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]">
                <span className="bg-gradient-to-tr from-[#34a853] via-[#4285f4] to-[#ea4335] bg-clip-text text-[1.45em] font-black leading-none text-transparent" aria-hidden="true">G</span>
                Continue with Google
              </button>
              <button type="button" onClick={() => showUnavailableMessage('Apple sign-in')} className="mt-[2.1%] flex h-[clamp(2.75rem,3.8vw,3rem)] shrink-0 items-center justify-center gap-2.5 rounded-full border border-[#ede5f5] bg-white text-sm font-bold text-[#30235f] shadow-sm transition hover:bg-[#ffffff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]">
                <Apple className="size-[1.2em] fill-[#17151b] text-[#17151b]" aria-hidden="true" />
                Continue with Apple
              </button>

              <p className="mt-auto pt-[2%] text-center text-sm text-[#8984ad]">
                New to Joy?{' '}
                <button type="button" onClick={() => { setMode('signup'); setNotice('') }} className="font-bold text-[#f0488a] underline decoration-[#ff9db8] underline-offset-4 hover:text-[#d6336c]">
                  Try for free
                </button>
              </p>

              {notice ? (
                <p role="status" aria-live="polite" className="joy-login-notice absolute inset-x-[8.5%] bottom-[2%] flex items-start gap-2 rounded-xl border border-[#ffd0e2] bg-[#f6f1fb] px-3 py-2 text-xs leading-snug text-[#6a4560] shadow-sm">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#f0488a]" aria-hidden="true" />
                  <span>{notice}</span>
                </p>
              ) : null}
            </form>
              </>
            )}
          </div>
        </div>

        <style jsx>{`
          .joy-logo-cloud {
            filter: drop-shadow(0 10px 15px rgba(161, 104, 104, 0.12));
          }

          .joy-login-dialog {
            width: min(1424px, calc(100vw - 24px), calc((100dvh - 56px) * 1.338));
            aspect-ratio: 1424 / 1064;
            grid-template-columns: 47.2% minmax(0, 1fr);
            max-height: calc(100dvh - 56px);
          }

          @media (max-width: 767px) {
            .joy-login-dialog {
              display: block;
              width: min(520px, calc(100vw - 24px));
              height: min(720px, calc(100dvh - 40px));
              aspect-ratio: auto;
              border-radius: 26px;
            }

            .joy-login-form-panel {
              height: 100%;
            }

            .joy-login-form-panel > div:last-child {
              padding: 6% 7% 5%;
            }

            .joy-login-close {
              right: 5%;
              top: 3%;
              width: 40px;
              height: 40px;
            }
          }

          @media (max-height: 740px) and (min-width: 768px) {
            .joy-login-form-panel > div:last-child {
              padding-top: 4.6%;
              padding-bottom: 2%;
            }

            .joy-login-form-panel header {
              margin-bottom: 1.8%;
            }

            .joy-login-form-panel [role='tablist'] {
              margin-bottom: 2%;
            }

            .joy-login-form-panel form > div:first-child {
              margin-bottom: 1.8%;
            }

            .joy-login-submit {
              margin-top: 2.8%;
            }

            .joy-login-form-panel form > div[aria-hidden='true'] {
              margin-top: 1.7%;
              margin-bottom: 1.7%;
            }
          }

          @media (max-height: 700px) {
            .joy-login-form-panel form > button[ type='button' ]:not(.joy-login-close) {
              min-height: 36px;
            }

            .joy-login-form-panel header p {
              margin-top: 4px;
            }
          }

          @media (max-width: 390px) {
            .joy-login-form-panel > div:last-child {
              padding-right: 6%;
              padding-left: 6%;
            }
          }
        `}</style>
      </section>
    </div>
  , document.body)
}

const COUNTRY_CODES = ['+95', '+84', '+66', '+65', '+60', '+62', '+63', '+44', '+1']
const STEPS = ['Account', 'Verify', 'Ready'] as const

const fieldWrap =
  'flex h-11 items-center gap-3 rounded-full border border-[#ede5f5] bg-white px-4 transition focus-within:border-[#f8608f] focus-within:ring-4 focus-within:ring-[#f8608f]/10'
const inputCls = 'min-w-0 flex-1 bg-transparent text-sm text-[#30235f] outline-none placeholder:text-[#aaa6c8]'
const labelCls = 'mb-1.5 block text-sm font-bold text-[#30235f]'
const primaryBtn =
  'mt-2 flex h-12 shrink-0 items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#ff9e50] via-[#f27b85] to-[#f0488a] text-sm font-bold text-white shadow-[0_12px_24px_rgba(248, 96, 143, 0.22)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#f8608f]/30'

function PasswordField({ id, label, autoComplete, onChange }: { id: string; label: string; autoComplete: string; onChange: () => void }) {
  const [show, setShow] = useState(false)
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label} <span className="text-[#f27b85]" aria-hidden="true">*</span>
      </label>
      <div className={fieldWrap}>
        <LockKeyhole className="size-4 shrink-0 text-[#aaa6c8]" aria-hidden="true" />
        <input id={id} name={id} type={show ? 'text' : 'password'} autoComplete={autoComplete} required minLength={6} onChange={onChange} className={inputCls} />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-pressed={show}
          className="grid shrink-0 cursor-pointer place-items-center text-sm font-medium text-[#8984ad] hover:text-[#52428a] focus-visible:rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8608f]"
        >
          {show ? <Eye className="size-[18px]" aria-hidden="true" /> : <EyeOff className="size-[18px]" aria-hidden="true" />}
          <span className="sr-only">{show ? 'Hide password' : 'Show password'}</span>
        </button>
      </div>
    </div>
  )
}

function CodeBoxes({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const refs = useRef<(HTMLInputElement | null)[]>([])
  const focusAt = (i: number) => refs.current[Math.max(0, Math.min(5, i))]?.focus()
  const setAt = (i: number, digits: string) => {
    const chars = value.padEnd(6, ' ').split('')
    const incoming = digits.replace(/\D/g, '').slice(0, 6 - i)
    if (!incoming) { chars[i] = ' '; onChange(chars.join('').trimEnd().replace(/ /g, '')); return }
    incoming.split('').forEach((d, k) => { chars[i + k] = d })
    onChange(chars.join('').replace(/ /g, ''))
    focusAt(i + incoming.length)
  }
  return (
    <div role="group" aria-label="Verification code" className="flex justify-between gap-2">
      {Array.from({ length: 6 }, (_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el }}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          autoFocus={i === 0}
          maxLength={6}
          aria-label={`Digit ${i + 1}`}
          value={value[i] ?? ''}
          onChange={(e) => setAt(i, e.target.value)}
          onFocus={(e) => e.target.select()}
          onKeyDown={(e) => {
            if (e.key === 'Backspace' && !value[i]) { e.preventDefault(); focusAt(i - 1) }
            if (e.key === 'ArrowLeft') focusAt(i - 1)
            if (e.key === 'ArrowRight') focusAt(i + 1)
          }}
          className={`aspect-square min-w-0 flex-1 rounded-[10px] border bg-white text-center text-xl font-extrabold text-[#30235f] outline-none transition focus:border-[#f8608f] focus:ring-4 focus:ring-[#f8608f]/15 ${value[i] ? 'border-[#f6bfd5]' : 'border-[#ede5f5]'}`}
        />
      ))}
    </div>
  )
}

function SignupFlow({ onClose, onSwitchToLogin, next }: { onClose: () => void; onSwitchToLogin: () => void; next: string }) {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [method, setMethod] = useState<'phone' | 'email'>('phone')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [code, setCode] = useState('')

  const submitAccount = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    if (data.get('signup-password') !== data.get('signup-confirm')) {
      setError("Passwords don't match.")
      return
    }
    setName(String(data.get('signup-name') ?? '').trim())
    setError('')
    setStep(2)
  }

  const submitCode = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.length < 6) {
      setError('Enter the 6-digit code.')
      return
    }
    setError('')
    setStep(3)
  }

  const finish = () => {
    joyLogin({ name: name || DEMO_PARENT.name, method: method === 'phone' ? 'Phone' : 'Email' })
    onClose()
    joyGo(router, next)
  }

  const tab = (value: 'phone' | 'email', label: string, icon: ReactNode) => (
    <button
      type="button"
      role="tab"
      aria-selected={method === value}
      onClick={() => { setMethod(value); setError('') }}
      className={`flex items-center justify-center gap-2 rounded-full text-sm font-bold transition ${method === value ? 'bg-white text-[#f0488a] shadow-[0_2px_12px_rgba(240, 72, 138, 0.16)] ring-1 ring-[#f6bfd5]' : 'text-[#8984ad]'}`}
    >
      {icon} {label}
    </button>
  )

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ol className="mb-[3%] flex shrink-0 items-center gap-1.5 pr-14 text-sm font-semibold sm:gap-2" aria-label="Sign-up progress">
        {STEPS.map((label, i) => {
          const n = i + 1
          const active = step === n
          const done = step > n
          return (
            <li key={label} className="flex items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span className={`flex shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white shadow-[0_4px_10px_rgba(120, 90, 200, 0.22)] ${active ? 'size-9 ring-4 ring-[#e6d6ff]/70' : 'size-8'} ${n > step ? 'bg-[#f6f1fb] !text-[#aaa6c8] shadow-none' : i === 0 ? 'bg-gradient-to-br from-[#7b97ff] to-[#4a52e0]' : i === 1 ? 'bg-gradient-to-br from-[#8f72e6] to-[#8a45d6]' : 'bg-gradient-to-br from-[#ff9e50] to-[#f0488a]'}`}>
                {i === 0 ? <UserRound className="size-[18px]" strokeWidth={2.8} fillOpacity={1} aria-hidden="true" /> : i === 1 ? <ShieldCheck className="size-[18px]" strokeWidth={2.8} fillOpacity={0.25} aria-hidden="true" /> : n}
              </span>
              <span className={`${active ? 'font-bold text-[#30235f]' : `hidden sm:inline ${done ? 'text-[#52428a]' : 'text-[#aaa6c8]'}`}`}>{label}</span>
              {n < STEPS.length ? <ArrowRight className={`ml-1 size-4 shrink-0 transition-colors ${done ? 'text-[#f8608f]' : 'text-[#c9bfd6]'}`} strokeWidth={3} aria-hidden="true" /> : null}
            </li>
          )
        })}
      </ol>

      {step === 1 ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto pr-1">
          <header className="mb-[3%]">
            <h2 id="joy-login-title" className="text-[clamp(1.5rem,2.8vw,1.875rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#30235f]">
              Create your parent account <Sparkles className="mb-[0.55em] ml-1 inline size-[0.62em] fill-[#f8608f] text-[#f8608f]" aria-hidden="true" />
            </h2>
            <p id="joy-login-description" className="mt-2 text-[clamp(0.875rem,1.15vw,1rem)] leading-snug text-[#8984ad]">
              Try Joy for free. One account for all your children.
            </p>
          </header>

          <div className="mb-[3%] grid h-11 shrink-0 grid-cols-2 rounded-full bg-[#f6f1fb] p-1" role="tablist" aria-label="Choose how to sign up">
            {tab('phone', 'Phone', <Smartphone className="size-[1em]" strokeWidth={2.5} aria-hidden="true" />)}
            {tab('email', 'Email', <Mail className="size-[1em]" strokeWidth={2.8} aria-hidden="true" />)}
          </div>

          <form onSubmit={submitAccount} className="flex min-h-0 flex-col gap-[clamp(0.5rem,1.4vh,0.9rem)]">
            <div>
              <label htmlFor="signup-identity" className={labelCls}>
                {method === 'phone' ? 'Phone' : 'Email'} <span className="text-[#f27b85]" aria-hidden="true">*</span>
              </label>
              <div className={`${fieldWrap} border-[#f6bfd5]`}>
                {method === 'phone' ? (
                  <>
                    <select aria-label="Country code" defaultValue="+95" className="shrink-0 cursor-pointer bg-transparent pr-1 text-sm text-[#30235f] outline-none">
                      {COUNTRY_CODES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="h-6 w-px bg-[#ede5f5]" aria-hidden="true" />
                    <input id="signup-identity" name="signup-phone" type="tel" inputMode="tel" autoComplete="tel-national" required autoFocus placeholder="9 123 456 789" onChange={() => setError('')} className={inputCls} />
                  </>
                ) : (
                  <>
                    <Mail className="size-4 shrink-0 text-[#aaa6c8]" aria-hidden="true" />
                    <input id="signup-identity" name="signup-email" type="email" inputMode="email" autoComplete="email" required autoFocus placeholder="you@example.com" onChange={() => setError('')} className={inputCls} />
                  </>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="signup-name" className={labelCls}>
                Full name <span className="text-[#f27b85]" aria-hidden="true">*</span>
              </label>
              <div className={fieldWrap}>
                <input id="signup-name" name="signup-name" type="text" autoComplete="name" required onChange={() => setError('')} className={inputCls} />
              </div>
            </div>

            <PasswordField id="signup-password" label="Password" autoComplete="new-password" onChange={() => setError('')} />
            <PasswordField id="signup-confirm" label="Confirm password" autoComplete="new-password" onChange={() => setError('')} />

            {error ? <p role="alert" className="text-sm font-semibold text-[#d6336c]">{error}</p> : null}

            <p className="text-sm leading-snug text-[#8984ad]">
              {method === 'phone'
                ? "We'll send a verification code to the Telegram account linked to this phone number."
                : "We'll send a verification code to this email address."}
            </p>

            <button type="submit" className={primaryBtn}>
              Continue <ArrowRight className="size-5" strokeWidth={2.5} aria-hidden="true" />
            </button>

            <p className="pb-1 text-center text-sm text-[#8984ad]">
              Already have an account?{' '}
              <button type="button" onClick={onSwitchToLogin} className="font-bold text-[#f0488a] underline decoration-[#ff9db8] underline-offset-4 hover:text-[#d6336c]">
                Log in
              </button>
            </p>
          </form>
        </div>
      ) : null}

      {step === 2 ? (
        <form onSubmit={submitCode} className="flex min-h-0 flex-1 flex-col gap-5 pt-6 text-center md:pt-8">
          <header>
            <h2 id="joy-login-title" className="text-[clamp(1.5rem,2.8vw,1.875rem)] font-extrabold leading-[1.02] tracking-[-0.055em] text-[#30235f]">
              Verify your account
            </h2>
            <p id="joy-login-description" className="mt-2 text-[clamp(0.875rem,1.15vw,1rem)] leading-snug text-[#8984ad]">
              {method === 'phone' ? 'Enter the 6-digit code we sent to your Telegram.' : 'Enter the 6-digit code we sent to your email.'}
            </p>
          </header>
          <CodeBoxes value={code} onChange={(v) => { setCode(v); setError('') }} />
          {error ? <p role="alert" className="text-sm font-semibold text-[#d6336c]">{error}</p> : null}
          <p className="text-center text-sm text-[#8984ad]">This is a preview: any 6 digits will work.</p>
          <button type="submit" className={primaryBtn}>
            Verify <ArrowRight className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => { setStep(1); setError('') }} className="self-center text-sm font-semibold text-[#8984ad] hover:text-[#52428a]">
            Back
          </button>
        </form>
      ) : null}

      {step === 3 ? (
        <div className="relative flex min-h-0 flex-1 flex-col items-center gap-5 pt-6 text-center md:gap-6">
          <img src="/images/signup-check.webp" alt="" aria-hidden="true" className="h-24 w-auto drop-shadow-[0_10px_16px_rgba(248, 96, 143, 0.28)] md:h-28" />
          <header>
            <h2 id="joy-login-title" className="text-[clamp(1.75rem,3.4vw,2.25rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">
              <span className="bg-gradient-to-r from-[#5b3fc4] to-[#8a45d6] bg-clip-text text-transparent">You're </span>
              <span className="bg-gradient-to-r from-[#ff9e50] to-[#f27b85] bg-clip-text text-transparent">all </span>
              <span className="bg-gradient-to-r from-[#8a45d6] to-[#5b3fc4] bg-clip-text text-transparent">set!</span>
            </h2>
            <p id="joy-login-description" className="mx-auto mt-3 max-w-[19rem] text-[clamp(0.875rem,1.15vw,1rem)] leading-relaxed text-[#6b5f93]">
              Your parent account is ready. Add your children in the Parent Portal.
            </p>
          </header>
          <button type="button" onClick={finish} className={`${primaryBtn} mt-3 w-full !from-[#ff9e50] !via-[#ff765f] !to-[#8a45d6] shadow-[0_12px_24px_rgba(190, 100, 200, 0.28)]`}>
            Go to Parent Portal <ArrowRight className="size-5" strokeWidth={2.5} aria-hidden="true" />
          </button>
          <img src="/images/signup-butterfly.webp" alt="" aria-hidden="true" className="pointer-events-none mt-auto -mb-3 w-[62%] max-w-72 self-center object-contain drop-shadow-[0_10px_18px_rgba(142, 92, 240, 0.25)]" />
        </div>
      ) : null}
    </div>
  )
}

export function LoginTrigger({ children, className, mode }: { children: ReactNode; className: string; mode?: 'login' | 'signup' }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      <LoginModal open={open} onClose={close} mode={mode} />
    </>
  )
}
