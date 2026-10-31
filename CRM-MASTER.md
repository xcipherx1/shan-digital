# Shan Digital Marketing — Agency Dashboard
## Master Specification · v3 (built into this Next.js project)

> A private admin dashboard for a Bristol Local SEO agency. Tracks money in,
> clients, project phases, retainer work and proposals — plus a separate
> personal money calculator that never mixes with agency figures.
>
> **Status:** scope agreed · infrastructure already in place · ready to build
> **Design reference:** Rapport (Code and Chill) — layout and interaction only
> **Last updated:** 1 November 2026

---

## 1. What this is

One screen to answer four questions without opening a spreadsheet:

1. **How much has the agency taken this month, and across the year?**
2. **How am I doing personally?** (separate, private, manual)
3. **Where is every client's project up to?**
4. **Who have I pitched, and who said yes?**

### Not building

| Not building | Because |
|---|---|
| Invoice generation | You make invoices in Claude Design |
| Contracts | Same |
| VAT handling | You bill flat figures |
| Client logins / portal | **Admin-only.** You screenshot the progress view and send it |
| Credentials vault | Deliberately excluded — liability |
| Sales pipeline kanban | A proposals list is enough at your volume |
| Ad spend ledger | Only *who opted in* matters |
| Seed/demo data | Starting from empty, by your instruction |

**Scale:** ~3 retainers. No pagination, no bulk tooling. Small and fast beats
scalable-and-fiddly.

---

## 2. Why this project and not the Vite one

This repo already has every piece of backend the dashboard needs:

| Need | Already here |
|---|---|
| Database | **Neon Postgres + Prisma 6.19** |
| Auth with roles | **Auth.js v5** + bcryptjs, `Role` enum (`admin` / `agent`) |
| Server routes | Next.js App Router API routes |
| Email | **Resend** |
| PDF | **jsPDF** |
| Animation | **GSAP + @gsap/react** — the same library Rapport uses |
| Icons | lucide-react |
| Hosting | Vercel, domain already attached |

Building here means **no Supabase, no new auth, no new database** — weeks of
groundwork already done. The Vite folder
(`E:\Vibe Coding Projects\shan-digital-marketing`) is now archived.

**Only two dependencies to add:** `recharts` (charts) and `date-fns` (dates).

---

## 3. The two money systems — kept apart on purpose

The core architectural rule of the app.

```
  AGENCY REVENUE                      PERSONAL REVENUE
  ──────────────                      ────────────────
  Client payments                     You type it in
  Auto-drafted retainers              Income + outgoings
  Charts by month / client / service  Charts by month / category
         │                                   ▲
         │                                   │
         └───────────  NO LINK  ─────────────┘

  The ONLY automatic connection in the app:
  add a client with what they paid  →  appears in Agency Revenue
                                    →  NEVER touches Personal Revenue
```

### 3.1 Agency Revenue

- **Per client, per month** — gives both the total and the per-client chart
- **Retainers auto-draft.** Set the monthly figure **once**. Each month the
  dashboard pre-fills it and asks one question: **received — yes or no?**
- **One-off builds** entered when they land, splittable into instalments
  (deposit / on launch), because that is how website builds are paid
- Flat GBP. No VAT, no tax logic

**Charts:** monthly revenue with 6M/12M toggle, breakdown by **client** or by
**service**, plus year-to-date total.

### 3.2 Personal Revenue — your private calculator

Entirely manual. Nothing flows in from the agency side. **Tracks income *and*
outgoings** (confirmed).

| Income | Outgoings |
|---|---|
| Agency draw | Rent |
| Freelance | Subscriptions |
| Other income | Savings |

Categories are editable. **Charts:** income vs outgoings per month, a net line,
and a category breakdown.

---

## 4. Services — the real model

### Bundle 1 · Website

| Phase | New build | Revamp |
|---|---|---|
| 0 · Domain & Hosting purchase | ✅ | — |
| 1 · Research | ✅ | ✅ |
| 2 · Content | ✅ | ✅ |
| 3 · Design | ✅ | ✅ |
| 4 · Imagery, Testing & Publishing | ✅ | ✅ |
| 5 · Google Business Profile Optimisation | ✅ | ✅ |

Phases are **fixed**; the only variable is which template. Progress % is derived
from completed phases — never typed.

### Bundle 2 · Monthly Retainer

1. **Site & GBP Management**
2. **Content & Blog**
3. **Off-Page Foundations**

### Add-on · Google Ads
Per-client opt-in flag plus the management fee. No spend tracking in v1.

---

## 5. Modules

### 5.1 Revenue
Monthly entry, retainer approve-or-skip, charts, year total, per-client and
per-service breakdowns.

### 5.2 Personal Revenue
Separate section. Manual entries, six categories, its own charts.

### 5.3 Clients — the Universal Client Profile

One template, every client. Business facts only:

```
Business name
NAP          name · address · phone        (the local-SEO essentials)
Website URL
Primary contact + email
Service opted   Website (new | revamp) · Retainer · Google Ads
Monthly figure  if on retainer
Project figure  if on a build
Status          Active · Paused · Finished
Start date
Notes           internal, free text
```

No segments, no health scores, no credentials. The profile opens to show
phases, retainer log, revenue history and proposals in one place.

### 5.4 Progress view (the screenshot)

A clean, branded page per client showing **only** what a client should see:

- Phases done / current / next, with a progress ring and "3 of 6 phases"
- For retainers: what was done this month, grouped by workstream
- No money, no internal notes, no other clients

Built to be screenshotted: comfortable fixed width, brand header, date stamp,
and a **Download as PNG** button.

### 5.5 Retainer Log

Your choice **(a) + (b)** together:

- **One screen for the whole day.** Open today once, tick work against each
  retainer client, pick the workstream, add a line, close the day
- **Silence is fine.** No entry means nothing happened. No backfill guilt
- Each entry: date · client · workstream · note · **"show on progress view"**
  toggle, so internal notes stay internal

### 5.6 Proposals

Business name · contact · service proposed · amount · date sent ·
status (`Sent` / `Accepted` / `Declined` / `No response`).
**Convert to client** in one click, carrying name and amount across.
Stats bar: sent this month, accepted, conversion rate.

### 5.7 Settings
Profile, service defaults, personal-revenue categories, data export.

---

## 6. Data model (Prisma, added to the existing schema)

```prisma
model Client {
  id            String   @id @default(cuid())
  businessName  String
  address       String?
  phone         String?
  website       String?
  contactName   String?
  contactEmail  String?
  serviceType   String   // website | retainer | both
  websiteVariant String? // new | revamp
  hasAds        Boolean  @default(false)
  monthlyFee    Decimal? @db.Decimal(10,2)
  projectFee    Decimal? @db.Decimal(10,2)
  status        String   @default("active")
  startDate     DateTime?
  notes         String?
  phases        Phase[]
  retainerLog   RetainerEntry[]
  revenue       RevenueEntry[]
}

model Phase          { id, clientId, number(0-5), name, status, completedAt }
model RetainerEntry  { id, clientId, date, workstream(1|2|3), note, clientVisible }
model RevenueEntry   { id, clientId, period(YYYY-MM), amount, kind, status, receivedOn, note }
model PersonalEntry  { id, date, direction(in|out), category, amount, note }
model Proposal       { id, businessName, contact, service, amount, sentOn, status, convertedClientId }
```

Existing `User`, `LoginAttempt` kept. `Call` and `Lead` removed with the dialer
and leads board (**export `Lead` rows first**).

**Derived, never stored:** progress %, monthly totals, year total, net personal
position.

---

## 7. Design — this project's brand

### Tokens already in `globals.css`

| Token | Value | Use |
|---|---|---|
| `--ink` / `--ink-2` / `--ink-3` | `#0a0b10` → `#181b27` | Surfaces, cards |
| `--lime` / `--lime-deep` | `#c9f73a` / `#a8d51e` | Primary accent, CTAs |
| `--font-display` | **Syne** | Page titles — matches Rapport's bold display headings |
| `--font-serif` | **Newsreader** | Italic accents |
| `--font-label` | **Space Grotesk** | Labels, KPI captions |
| `--font-sans` | system / SF | UI, tables |

A dark, lime-accented dashboard is a strong fit for this product and is already
your established brand.

### Take from Rapport (layout only — original code)

Top pill nav · slim left icon rail · large display title with **inline KPI
chips** · generously rounded cards · status pills · radial progress rings ·
view toggles (6M/12M, by client/by service) · figures that **count up** and
cards that **stagger in** — in **GSAP**, already installed, same as Rapport.

Phase colours map onto the existing palette (lime / teal / amber / red).

### Empty states matter more than usual
You start with **zero data**. Every screen gets a real empty state that says
what to add and gives you the button. No fake numbers, ever.

---

## 8. Routes

```
/                       marketing site        (existing, untouched)
/services/[slug]        service pages         (existing, keep — real SEO assets)
/dashboard              NEW agency dashboard  (replaces the leads board)
  /dashboard/revenue
  /dashboard/personal
  /dashboard/clients  ·  /dashboard/clients/[id]
  /dashboard/progress/[id]      the screenshot view
  /dashboard/retainer
  /dashboard/proposals
  /dashboard/settings
/dialer/login           reused as the single admin login
```

### Deleting
`/landing` · `/dialer` · the old `/dashboard` leads board · `Call` + `Lead`
models · Twilio routes and deps. **Export `Lead` rows to CSV first.**

---

## 9. Hosting note

**Vercel's Hobby plan is for non-commercial use**, and an internal agency tool
is commercial. Either move to Vercel **Pro** (~$20/mo) or host on **Cloudflare
Pages / Netlify**, whose free tiers permit commercial use. Not a blocker for
building.

---

## 10. Security

Single admin account, existing Auth.js setup, no public signup. The hardened
login already built (bcrypt cost 12, rate limiting, lockout, generic errors)
is reused as-is. Session already expires after 1 hour idle.

---

## 11. Done means

- [ ] Add a client using the one profile template
- [ ] Phases correct for both new-build and revamp
- [ ] Retainer figure typed once, approved monthly in one click
- [ ] Agency revenue charts by month, client and service
- [ ] Personal revenue charts separately, with no agency data in them
- [ ] **Adding a paying client lands in agency revenue and NOT personal**
- [ ] Log a day's retainer work across all clients from one screen
- [ ] Progress view looks right as a screenshot and exports to PNG
- [ ] Proposal converts to client in one click
- [ ] Honest empty states — it opens empty and still makes sense
- [ ] Works on a 375px phone
- [ ] Marketing site and service pages untouched
- [ ] `/landing`, `/dialer`, old `/dashboard` removed, `Lead` data exported
