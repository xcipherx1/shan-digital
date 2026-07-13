# Dialer Setup — Shan Digital

This guide brings the secure browser dialer at `/dialer` online. Follow the
steps **in order**. Every step is required for calls to work end to end.

The dialer adds a database, authentication and Twilio voice to the existing
marketing site. None of it affects the public marketing pages.

---

## 1. Database (Neon) + migrations

1. Create a Postgres database at [neon.tech](https://neon.tech) (or Vercel
   Postgres). Copy the **pooled** connection string.
2. Put it in `.env.local` as `DATABASE_URL=...`.
3. Apply the schema:
   ```bash
   npm install
   npx prisma migrate deploy   # applies prisma/migrations to your DB
   ```
   For local iteration you can use `npm run db:migrate` (creates new migrations).
4. Generate the client (also runs automatically on `npm install`):
   ```bash
   npm run db:generate
   ```

## 2. Twilio API Key + Secret

1. In the [Twilio Console](https://console.twilio.com) note your **Account SID**
   and **Auth Token** (Account → API keys & tokens).
2. Create a **Standard API Key** (Account → API keys & tokens → Create API key).
   Copy the **SID** and **Secret** (the secret is shown once).
3. Set:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_API_KEY_SID`
   - `TWILIO_API_KEY_SECRET`

## 3. TwiML App

1. Console → Voice → TwiML → **TwiML Apps** → Create.
2. Set the **Voice Request URL** to:
   ```
   https://<your-domain>/api/twilio/voice     (HTTP POST)
   ```
3. Save, copy the **TwiML App SID** → `TWILIO_TWIML_APP_SID`.
4. Buy / choose a **UK (+44) phone number** with Voice enabled and set it as
   `TWILIO_CALLER_ID` (E.164, e.g. `+441170000000`). This is the caller ID your
   prospects see.

## 4. UK Voice geo permissions

Console → Voice → Settings → **Geographic Permissions** → enable
**United Kingdom** for outbound dialing. Without this Twilio blocks the call.

## 5. Environment variables in Vercel

Add **all** of these for **Production and Preview** (Settings → Environment
Variables), then **redeploy**:

```
DATABASE_URL
AUTH_SECRET            # generate: npx auth secret
NEXTAUTH_URL           # https://<your-domain>
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_API_KEY_SID
TWILIO_API_KEY_SECRET
TWILIO_TWIML_APP_SID
TWILIO_CALLER_ID
PUBLIC_BASE_URL        # https://<your-domain>  (must match what Twilio calls)
ALLOWED_DIAL_PREFIXES  # +44
SEED_USERS_JSON        # optional, see step 7
```

> The existing marketing-site variables (`RESEND_API_KEY`,
> `LEAD_NOTIFICATION_EMAIL`, `NEXT_PUBLIC_SITE_URL`) remain unchanged.

## 6. ⚠️ Deployment Protection (critical)

Twilio's webhooks (`/api/twilio/voice`, `/status`, `/recording`) are called by
Twilio's servers, which **cannot log in**. If Vercel Deployment Protection is on,
Twilio receives a login page instead of your TwiML and **every call fails
silently**.

Do one of the following (Settings → Deployment Protection):
- **Disable** Vercel Authentication for the production deployment, **or**
- Add a **Protection Bypass for Automation** and confirm the webhook paths are
  reachable unauthenticated.

The webhooks are still secure: they validate Twilio's `X-Twilio-Signature`
on every request, so only genuinely-Twilio-signed calls are accepted.

## 7. Seed users (no public signup)

There is no signup. Create users by seeding.

Option A — env var (good for Vercel one-off `vercel env pull` + local run):
```bash
export SEED_USERS_JSON='[{"email":"agent@shandigitalmarketing.com","name":"Agent One","password":"a-strong-password","role":"admin"}]'
npm run db:seed
```

Option B — local file (gitignored):
```bash
# create prisma/seed-users.json:
# [{ "email": "...", "name": "...", "password": "...", "role": "agent" }]
npm run db:seed
```

Passwords are hashed with bcrypt (cost 12). Re-running the seed also resets a
user's lockout and reactivates them, so it doubles as a password reset.

## 8. End-to-end test checklist

- [ ] `https://<domain>/dialer` redirects to `/dialer/login` when logged out.
- [ ] Logging in with a seeded user lands on the dialer; a wrong password shows
      "Invalid email or password" and never says which field was wrong.
- [ ] After 5 wrong passwords the account is locked for 15 minutes.
- [ ] The dialer shows **Ready** and prompts for microphone permission.
- [ ] Dialing a valid `+44` mobile connects and you can talk both ways.
- [ ] The live timer runs; **Mute** and the in-call keypad (DTMF) work.
- [ ] Dialing a non-`+44` or premium (`+449…`) number is rejected.
- [ ] After hanging up, the disposition prompt saves an outcome + note.
- [ ] `/dialer/history` shows the call with correct status, duration and cost.
- [ ] With recording **on**, a playable recording appears (via the auth proxy).
- [ ] CSV export downloads and is scoped to your own calls.
- [ ] A second (non-admin) agent cannot see the first agent's calls.
- [ ] Hitting `/api/twilio/voice` directly (no Twilio signature) returns 403.

---

## Security summary (what protects each surface)

| Surface | Protection |
|---|---|
| `/dialer` pages & `/api/dialer/*`, `/api/twilio/token` | `middleware.ts` requires a valid JWT session (redirect / 401). Re-checked in each handler. |
| Login | bcrypt (cost 12), constant-time compare against a dummy hash for unknown users, generic error, 5/email + 20/IP per-15-min failure cap, 15-min lockout after 5 failures, every attempt audited in `LoginAttempt`. |
| Sessions | JWT, httpOnly secure cookies, 8-hour expiry. |
| Twilio webhooks (`voice`/`status`/`recording`) | `X-Twilio-Signature` validated against the raw body and exact public URL; 403 on failure. Excluded from auth middleware by design. |
| Outbound number abuse | Server-side E.164 + allowed-prefix + premium/service-prefix validation in the TwiML route; the browser is never trusted. |
| Call spend | Per-user `dailyCallLimit` enforced server-side before dialing. |
| Call outcomes | Written only from the signed Twilio status callback — the browser can never fabricate history. |
| Recordings | Only the `RecordingSid` is stored; audio is streamed through an authenticated proxy that checks ownership. The raw Twilio media URL is never exposed. |
| Secrets | `TWILIO_AUTH_TOKEN` and all keys stay server-side; only short-lived AccessTokens reach the browser. Client identity is `agent_<userId>`, never the email. |
| Transport / headers | `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin` globally; a CSP scoped to `/dialer` that permits only the Twilio SDK's HTTPS/WSS endpoints. |

## Design choices (where the brief left room)

- **`.env.example` was merged, not replaced** — the marketing site's Resend vars
  stay alongside the dialer vars so the existing lead form keeps working.
- **`User.recordingEnabled`** was added (the brief required a per-user recording
  flag but omitted it from the schema list). It defaults to on and is toggled in
  the dialer UI; the TwiML route reads it server-side.
- **CSP is scoped to `/dialer`** rather than global, to avoid regressing the
  animation-heavy marketing pages.
- **Daily limit uses the UTC day boundary.**
- **Auth failures are always generic** (including lockout/rate-limit) so login
  never reveals whether an email is registered.
- **Disposition PATCH accepts the Twilio CallSid or the DB id**, since the
  browser only knows the CallSid when a call ends.
- Prisma is pinned to the stable v6 line for a conventional `@prisma/client`
  import path.
