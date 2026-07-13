# Build Prompt: Secure Twilio Browser Dialer for shan-digital.vercel.app

Copy everything below the line into Fable 5.

---

You are building a production grade, secure, browser based calling dialer as a new protected section of an existing Next.js website deployed on Vercel (`https://shan-digital.vercel.app/`, brand: Shan Digital Marketing, Bristol UK, dark editorial aesthetic). The existing site is a marketing site with no backend, no database and no authentication. You are adding all three.

Deliver the complete, working implementation in one pass. Do not produce a plan, a partial scaffold, or placeholder TODOs. Every file must be complete and runnable.

## Objective

A logged in agent (pre registered by the admin, no public signup) opens `/dialer`, dials a UK phone number from the browser, talks over WebRTC with the UK Twilio number as caller ID, and every call is automatically written to a call history table with status, duration, cost and optional recording.

## Hard requirements

### 1. Stack and constraints
- Next.js App Router, TypeScript, deployed on Vercel.
- Database: PostgreSQL via Neon (or Vercel Postgres). Use Prisma as the ORM with a migration and a seed script.
- Auth: Auth.js (NextAuth v5) Credentials provider, JWT session strategy, httpOnly secure cookies.
- Twilio: `twilio` (server) and `@twilio/voice-sdk` (browser).
- All Twilio API routes must declare `export const runtime = "nodejs"` and `export const dynamic = "force-dynamic"`. The Twilio Node SDK does not work on the Edge runtime.
- Styling must match the existing site: dark background, high contrast, generous whitespace, tight tracking, serif italic accents used sparingly, subtle borders. Do not introduce a new design language.

### 2. Authentication (must be genuinely secure, not decorative)
- No signup route, no public registration, no password reset self service. Users exist only because an admin seeded them.
- Passwords stored as bcrypt hashes (cost factor 12). Never store or log plaintext.
- Credentials provider verifies email plus password against the `User` table using `bcrypt.compare`. Always run the compare against a dummy hash when the user is not found, so login timing does not leak which emails exist.
- Generic error message on failure ("Invalid email or password"). Never reveal which field was wrong.
- Rate limit the login endpoint: max 5 attempts per email per 15 minutes and max 20 per IP per 15 minutes. Lock the account for 15 minutes after 5 consecutive failures and record `failedAttempts` and `lockedUntil` on the user row.
- `middleware.ts` protects `/dialer` and every `/api/dialer/*` and `/api/twilio/token` route. Unauthenticated requests redirect to `/dialer/login` or return 401 for API routes.
- Twilio webhook routes (`/api/twilio/voice`, `/api/twilio/status`, `/api/twilio/recording`) must be excluded from the auth middleware, because Twilio cannot log in. They are secured by signature validation instead (see below).
- Set security headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a Content Security Policy that allows the Twilio SDK and its WSS media endpoints.
- Sessions expire after 8 hours. Add a `role` field (`agent` or `admin`) on the user for future use.

### 3. Database schema (Prisma)

```
User        id, email (unique), name, passwordHash, role, isActive,
            dailyCallLimit (default 200), failedAttempts, lockedUntil,
            createdAt, updatedAt

Call        id, callSid (unique), parentCallSid, userId (FK -> User),
            direction, fromNumber, toNumber, status, startedAt, endedAt,
            durationSeconds, priceUsd, recordingUrl, recordingSid,
            disposition, notes, createdAt, updatedAt
            @@index([userId, createdAt])

LoginAttempt id, email, ip, success, createdAt   (for rate limiting + audit)
```

Provide `prisma/seed.ts` that reads a JSON array of `{ email, name, password }` from an env var or a local file and upserts hashed users. Document how to run it.

### 4. Twilio voice implementation

**Token endpoint** `POST /api/twilio/token`
- Requires a valid session. Returns 401 otherwise.
- Mints a `twilio.jwt.AccessToken` using `TWILIO_ACCOUNT_SID`, `TWILIO_API_KEY_SID`, `TWILIO_API_KEY_SECRET`.
- `identity` must be a stable, non guessable string derived from the user id (for example `agent_<userId>`), never the email.
- Grant: `VoiceGrant({ outgoingApplicationSid: TWILIO_TWIML_APP_SID, incomingAllow: false })`.
- TTL 3600 seconds. The client refreshes the token 5 minutes before expiry.
- Never send `TWILIO_AUTH_TOKEN` to the browser under any circumstance.

**TwiML endpoint** `POST /api/twilio/voice`
- Validate `X-Twilio-Signature` with `twilio.validateRequest` against the raw form body and the exact public URL. Reject with 403 on failure. This is mandatory: without it, anyone who discovers the URL can bill calls to your account.
- Read the `To` parameter passed from the client and the `From` identity.
- Validate `To` server side: must be valid E.164, must start with `+44`, must not be a premium rate or service prefix (`+449`, `+4487`, `+4470`). Reject anything else with a `<Reject/>` or a spoken error. Keep the allowed country list in an env var so it can be widened later.
- Look up the user by identity, confirm `isActive`, and confirm they are under `dailyCallLimit` for today. Reject if not.
- Return TwiML:
  `<Response><Dial callerId="{TWILIO_CALLER_ID}" answerOnBridge="true" timeout="30" record="record-from-answer-dual" recordingStatusCallback="/api/twilio/recording" action="/api/twilio/status" ><Number statusCallback="/api/twilio/status" statusCallbackEvent="initiated ringing answered completed" statusCallbackMethod="POST">{To}</Number></Dial></Response>`
- Make recording a per user boolean flag, defaulting to on, and expose it in the UI, because UK call recording requires you to inform the other party.
- Create the `Call` row here in `initiated` state so history exists even if the call fails.

**Status callback** `POST /api/twilio/status`
- Signature validated. Upserts the `Call` row by `CallSid` / `ParentCallSid`: status, duration, timestamps, price. This is the single source of truth for call history. The browser is never trusted to report outcomes.

**Recording callback** `POST /api/twilio/recording`
- Signature validated. Stores `RecordingSid`. Do not store the raw public Twilio media URL; serve recordings through an authenticated proxy route `/api/dialer/recordings/[sid]` that checks the session, checks the call belongs to that user (or the user is admin), then streams the audio from Twilio using server side credentials.

### 5. The dialer UI (`/dialer`)
- Client component that initialises `Device` from `@twilio/voice-sdk` with the fetched token, `codecPreferences: ["opus", "pcmu"]`.
- Explicitly request microphone permission and show a clear error state if denied or if the browser is not on HTTPS.
- Elements: number input with live E.164 formatting and a `+44` default, a full DTMF keypad (clickable and keyboard bindable), Call button, Hangup button, Mute toggle, keypad send during call, live call timer, and a device status pill (Ready / Connecting / On call / Offline / Error).
- Handle every Device and Call event: `registered`, `error`, `tokenWillExpire` (refresh silently), `disconnect`, `cancel`, `accept`, `reject`.
- After a call ends, prompt for a disposition (Interested, Callback, Not interested, No answer, Voicemail, Wrong number) plus a free text note, and PATCH it to `/api/dialer/calls/[id]`.
- Warn before page unload while a call is active.
- Fully responsive; usable on a phone.

### 6. Call history (`/dialer/history`)
- Server component reading from Postgres, paginated (25 per page).
- Columns: date/time, number called, status, duration, cost, disposition, recording playback, notes.
- Filters: date range, status, disposition, search by number.
- CSV export endpoint, session gated, scoped to that user's calls (admins can export all).
- A user can only ever see their own calls unless `role === "admin"`.
- Top of page: today's call count, total talk time, and remaining daily allowance.

### 7. Environment variables
Produce a `.env.example` containing exactly:
```
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_API_KEY_SID=
TWILIO_API_KEY_SECRET=
TWILIO_TWIML_APP_SID=
TWILIO_CALLER_ID=
PUBLIC_BASE_URL=
ALLOWED_DIAL_PREFIXES=+44
SEED_USERS_JSON=
```

## Deliverables
1. Every file, complete, in full, with correct paths.
2. `prisma/schema.prisma` and `prisma/seed.ts`.
3. A `SETUP.md` containing, in order:
   - Creating the Neon database and running migrations.
   - Creating the Twilio API Key and Secret in the Console.
   - Creating the TwiML App and pointing its Voice Request URL at `https://<domain>/api/twilio/voice`.
   - Enabling Voice geo permissions for the United Kingdom.
   - Setting every env var in Vercel for Production and Preview.
   - **Disabling Vercel Deployment Protection, or adding a Protection Bypass for Automation, otherwise Twilio's webhooks receive a login page instead of your TwiML and every call fails silently.**
   - Seeding users.
   - An end to end test checklist.
4. A short security summary listing what protects each attack surface.

## Explicit non goals
No public signup. No storing card details. No inbound call handling in v1. No AI features.

## Quality bar
Assume this handles real client calls and real money. Handle errors, validate every input server side, and never leak a secret to the client bundle. If any requirement is ambiguous, choose the more secure option and note the choice in `SETUP.md`.
