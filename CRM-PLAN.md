# Shan Digital Marketing — Agency Dashboard
## Four-Step Build Plan · v3

> Companion to `CRM-MASTER.md`. Scope is agreed and the backend already exists,
> so **Step 1 is complete** and Step 3 is much smaller than originally planned.

---

## Step 0 — Housekeeping

| Task | Status |
|---|---|
| Version control | ✅ already a git repo, clean, synced to `xcipherx1/shan-digital` |
| Folder renamed | ✅ `portfolio-uzair` → `shan-digital` |
| Export `Lead` rows from Neon to CSV | ⬜ **before deleting the leads board** |
| Delete `/landing`, `/dialer`, old `/dashboard` | ⬜ after export |
| Decide hosting (Vercel Pro vs Cloudflare) | ⬜ not blocking |
| Archive the Vite folder | ⬜ optional tidy-up |

---

## ✅ Step 1 — Functionality and use cases · COMPLETE

Settled by your answers, recorded in `CRM-MASTER.md`:

| Decision | Outcome |
|---|---|
| Client portal | **Dropped.** Admin-only; client gets a screenshot |
| Invoices & contracts | Not built — you use Claude Design |
| VAT | None. Flat GBP |
| Retainer revenue | Type once, approve yes/no each month |
| Personal revenue | Standalone manual calculator, income **and** outgoings, 6 categories |
| The one connection | New paying client → agency revenue only |
| Phases | Fixed. New build 0–5, revamp 1–5 |
| Retainer log | One screen per day, all clients; silence is fine |
| Proposals | Tracked with status, one-click convert |
| Data | Starting empty |
| Where it's built | **This repo** — Neon, Prisma, Auth.js already wired |

---

## Step 2 — Design and UI · NEXT

**Goal:** the whole dashboard, clickable, running locally, before any database
work.

**Approach:** coded directly in React. The brand tokens (ink/lime/Syne) and GSAP
are already here, so the coded UI *is* the final front-end.

1. **Foundation** — dashboard surface tokens, card radius, phase colour map,
   Syne for page titles, reuse the existing dark palette
2. **Shell** — `/dashboard` layout, top pill nav, left icon rail, page header
   with inline KPI chips, ⌘K quick add
3. **Component kit** — KPI chip, stat card, radial progress, status pill, phase
   stepper, data table, filter chips, view toggles, chart wrappers, and a
   genuinely good **empty state** (you start with nothing, so it carries weight)
4. **Screens** — Overview · Revenue · Personal Revenue · Clients ·
   Client Profile · Progress (screenshot) · Retainer Log · Proposals · Settings
5. **Motion** — GSAP count-up, staggered cards, chart draw-in; reduced-motion
   respected (the `mm.revert()` pattern already used in this repo)
6. **Responsive** — 375 / 768 / 1280; tables become cards on a phone

Rendered from local placeholder state so it is fully clickable with nothing
persisted yet.

**Gate:** you click every screen on desktop and phone and approve look and flow.

---

## Step 3 — Functionality

Smaller than originally scoped, because auth and the database already exist.

1. **Prisma models** from master §6, migration against the existing Neon database
2. **Reuse Auth.js** — no new auth to build; existing hardened login stands
3. **Server actions / API routes** per module
4. **Modules in order:**
   Clients → Phases → Retainer Log → Revenue → Personal Revenue → Proposals →
   Progress view → Settings
5. **The money rules, enforced in code:**
   - retainer auto-draft each month, approve or skip
   - one-off builds with instalments
   - **a client payment can never write to personal revenue**
6. Progress view PNG export (`html-to-image`)
7. Delete `/landing`, `/dialer`, old `/dashboard`; drop `Call` and `Lead` models
8. Deploy

**Gate:** each module demoed as it lands.

---

## Step 4 — Testing and approval

**Money, checked by hand.** Enter a known month, reconcile to the penny. Then
the critical negative test: **add a paying client and prove nothing appeared in
Personal Revenue.** That separation is the whole point.

**Retainer flow.** Set a figure once, roll a month, confirm it drafts, approve
one, skip one, confirm charts follow.

**Phases.** New build shows 0–5, revamp 1–5, progress derives correctly, last
phase closes the project.

**Progress view.** Screenshot it and read it as a client would — nothing
internal, nothing financial, clean PNG export.

**Interface.** 375 / 768 / 1280 · keyboard · focus · contrast · reduced motion ·
**empty states on a brand-new install**, which is literally your day one.

**Regression.** Marketing site, service pages, audit form and SEO output
unchanged. Deleted routes return 404, nothing else broken.

**Your acceptance.** Run a real week through it. If it is not faster than what
you do now, it has failed regardless of the tests.

---

## Sequence

```
Step 0  Housekeeping   export leads · delete old routes    ← quick
Step 1  Think          ✅ complete
Step 2  Design         clickable UI, no database           ← next
Step 3  Build          Prisma + existing Auth.js
Step 4  Prove          money separation, usability
```

---

## Starting Step 2 now

Two things I will need from you along the way, neither blocking today:

1. **Your logo file**, if you want it on the progress screenshot
2. **Confirmation** before I delete `/landing`, `/dialer` and the old
   `/dashboard` — and the exported `Lead` CSV safely in hand first
