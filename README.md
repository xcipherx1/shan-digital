# Shan Digital Marketing — Landing Page

Modern, animation-rich landing page for **Shan Digital Marketing**, a Bristol-based agency building complete growth systems for SMEs and industries: Local SEO, UI/UX & Branding, SaaS Development, and Website Design & Development.

Built with **Next.js (App Router) + TypeScript + Tailwind CSS v4 + GSAP + Three.js (React Three Fiber)**, with a dual lead magnet (free Local SEO audit + strategy call booking) powered by the **Resend** API.

## Tech Stack

| Layer | Tools |
|---|---|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, custom design tokens |
| Animation | GSAP 3 + ScrollTrigger (`@gsap/react`) |
| 3D | Three.js via `@react-three/fiber` (particle terrain hero) |
| Email | Resend (lead notifications + visitor confirmations) |
| Validation | Zod (shared client/server schemas) |
| Icons | Lucide React |

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` (gitignored) and set:

| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Shan Digital <leads@yourdomain.com>`. Use `onboarding@resend.dev` for testing. |
| `LEAD_NOTIFICATION_EMAIL` | Inbox that receives new lead alerts |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL (used for SEO metadata) |

Without Resend keys the site still runs — the lead form returns a friendly "email us directly" fallback.

## Project Structure

```
src/
├── app/
│   ├── api/lead/route.ts     # Resend-powered lead endpoint (audit + call)
│   ├── layout.tsx            # Fonts, SEO metadata, JSON-LD schema
│   ├── page.tsx              # Landing page assembly
│   └── globals.css           # Design tokens + utilities
├── components/
│   ├── sections/             # Navbar, Hero, Services, Process, LeadMagnet…
│   ├── three/                # React Three Fiber scenes
│   └── ui/                   # Reusable primitives (MagneticButton…)
├── config/
│   └── site.ts               # ALL site content — copy, stats, contact info
└── lib/
    ├── gsap.ts               # GSAP + ScrollTrigger registration
    ├── email.ts              # Branded HTML email templates
    └── validation.ts         # Zod schemas shared client/server
```

**Editing content:** everything — services, testimonials, FAQs, stats, contact details — lives in [`src/config/site.ts`](src/config/site.ts). This is intentional: the upcoming Client Management Dashboard will replace this static config with API-served data without touching components.

## Scalability Notes (Dashboard-Ready)

- All page content flows through `src/config/site.ts` → swap for a data layer later.
- The `/api` directory is ready for additional routes (auth, clients, reports).
- Zod schemas in `src/lib/validation.ts` are shared by client and server — extend the same pattern for dashboard models.
- Add a route group like `src/app/(dashboard)/…` alongside the landing page without any restructuring.

## Accessibility & Performance

- `prefers-reduced-motion` disables the WebGL scene, GSAP scroll animations and marquees.
- Semantic landmarks, visible focus rings, labelled forms, WCAG AA contrast.
- Three.js canvas is lazy-loaded client-side only with capped device pixel ratio.

## Deploying to Vercel

1. Push this repo to GitHub (env files are gitignored — only `.env.example` is committed).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the environment variables from `.env.example` in Project Settings → Environment Variables.
4. Deploy — no extra configuration needed.

## License

All rights reserved © Shan Digital Marketing.
