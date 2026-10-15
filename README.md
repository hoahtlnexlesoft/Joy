# Joy web

Marketing site and **Parent Portal** for Joy (a daily-play app that helps children grow).
Built with Next.js (App Router), React 19, TypeScript and Tailwind CSS v4.

> **This is a front-end prototype.** There is no backend: login, children, plans,
> payments and the AYA Pay checkout are all simulated in the browser. See
> [What is mocked](#what-is-mocked) before wiring real services.

## Getting started

Requirements: Node.js 20+ and pnpm.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck    # tsc --noEmit (must stay clean)
pnpm build && pnpm start
```

> Next.js 16 has breaking changes compared with older versions. If something
> behaves unexpectedly, read the matching guide in `node_modules/next/dist/docs/`.

Fonts (Caveat, Fredoka, Plus Jakarta Sans) are loaded with `next/font/google`,
so the first build needs internet access.

## Routes

| Route | File | What it is |
| --- | --- | --- |
| `/` | `app/page.tsx` | Landing page |
| `/how-it-works` | `app/how-it-works/page.tsx` | Guide: elements, animals, development stages |
| `/pricing` | `app/pricing/page.tsx` | Plans and pricing |
| `/parent` | `app/parent/page.tsx` | Parent Portal (children, plans, payments, profile) |

## Project structure

```
app/                      Routes, root layout (fonts, metadata), global styles + design tokens
components/
  ui/                     shadcn/ui primitives (button)
  joy/
    landing/              Landing page sections
    guide/                "How it works" page sections
    parent/               Parent Portal
      portal.tsx            shell, navigation, dialog host
      plans.tsx             plan cards, buy flow (select -> assign -> pay -> done), voucher, assign
      app-guide.tsx         "Activate the Joy app" steps shown after payment
      dialogs.tsx           child form, QR dialogs, avatar picker ...
      insights.tsx          child insight charts
      profile.tsx           profile / settings
      data.ts, types.ts     demo data and shared types
      ui.tsx                portal-only UI kit (Modal, Field, Btn ...)
    site-header.tsx, site-footer.tsx, login-modal.tsx ...   shared site chrome
lib/                      utils (cn) and the demo login session
public/                   images, video, icons
```

Styling is Tailwind utility classes; colours, radii and fonts are defined as
tokens in `app/globals.css`.

## What is mocked

| Area | Today | Replace with |
| --- | --- | --- |
| Login (`components/joy/login-modal.tsx`, `lib/joy-session.ts`) | Any method signs in a demo parent; session stored in `localStorage` | Real auth (Apple / Google / phone / email) |
| Parent data (`components/joy/parent/data.ts`) | Seeded demo children, plans, payments; changes live in memory only | API + database |
| Payment (`parent/plans.tsx`, `parent/dialogs.tsx`) | AYA Pay flow is simulated, the QR code is decorative | AYA Pay integration |
| App Store / Google Play buttons (`parent/app-guide.tsx`) | Point to `apps.apple.com` / `play.google.com/store` | Real store listing URLs |
| Vouchers | Validated against a local list (`VOUCHERS` in `parent/plans.tsx`) | Server-side validation |

## Deployment

Deployed on Vercel from the `main` branch. No environment variables are required
for the site itself.
