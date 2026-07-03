# acy-next — Aaron Curtis Yoga

Fullstack yoga instructor website. Event management, class registration, private session booking, automated external event syncing, Google Calendar integration, Stripe payments.

## Stack

- **Next.js 16** + React 19 + TypeScript (`strict: false`, `noUnusedLocals: true`)
- **shadcn/ui** (Radix primitives in `components/ui`) + Tailwind CSS 4 + Framer Motion
- **Prisma 6** + Vercel Postgres (pooled: `POSTGRES_PRISMA_URL`, direct: `POSTGRES_URL_NON_POOLING`)
- **Clerk** for auth (RBAC — admin role in session claims metadata)
- **Stripe** for payments (events + private sessions)
- **Google Calendar** via service account (not OAuth)
- **Google Maps** for locations
- **Resend** for newsletter (signups + broadcasts, managed from `/admin/newsletter`)
- **Playwright** + Browserless.io for web scraping (event sync)
- **Vercel Blob** for file uploads
- Deploy: **Vercel** with cron jobs

## Commands

```bash
npm run dev              # Next.js dev (Turbopack)
npm run build            # Production build
npx prisma migrate dev   # Run migrations
npx prisma studio        # DB GUI
npx prisma generate      # Regenerate client
npx tsc --noEmit         # Type-check
npx playwright test      # E2E tests
```

## Key Conventions & Gotchas

### Prisma 6 (NOT Prisma 7)

- Uses `url` and `directUrl` in `prisma/schema.prisma` — this is correct for Prisma 6
- Client singleton in `app/_lib/prisma.ts` — `export default prisma` (default export, not named)
- **Serialize before sending to client**: Prisma objects have Symbol properties that break React serialization. Use `serialize()` from `app/_lib/utils/serialize.ts` (JSON round-trip)

### Next.js 16 — `proxy.ts`

- Route protection via `proxy.ts` (not `middleware.ts`) using Clerk's `clerkMiddleware`
- Admin routes check `sessionClaims.metadata.role === "admin"`
- Protected routes: `/account`, `/admin/*`, `/profile`, `/settings`

### All dates are America/New_York

- `formatDateTime()` in `app/_lib/utils/index.ts` forces `timeZone: "America/New_York"` everywhere
- Event form uses `@internationalized/date` for timezone-aware ZonedDateTime handling
- Stored as UTC DateTime in Postgres, displayed in ET

### shadcn/ui (not HeroUI — migrated)

- Import from `@/components/ui/*` (button, card, dialog, table, input, etc.)
- Google-inspired primary blue `#0842a0` (`--primary` in `app/globals.css`)
- Fonts: Roboto Flex (sans) + Merriweather (serif)

### Newsletter (Resend)

- Signup form adds contacts to the Resend segment (`RESEND_SEGMENT_ID`)
- Compose/schedule/send from `/admin/newsletter` — drafts live in the `Newsletter` Prisma model, delivery via Resend Broadcast API (scheduling handled by Resend, no cron)
- Unsubscribes handled by Resend via `{{{RESEND_UNSUBSCRIBE_URL}}}` in the email template (`app/_lib/email/newsletter-template.ts`)
- One-time Mailchimp import: `npx tsx scripts/import-subscribers.ts <export.csv>`

### Event Sync Architecture

- Two external sources: **Bright Bear Yoga** (Momence platform) + **DC Bouldering Project** (ZoomShift)
- Scraped via Playwright on Browserless.io cloud (needs `BROWSERLESS_API_TOKEN` in ALL envs)
- Duplicate prevention: `@@unique([sourceType, sourceId])` constraint
- Cron runs daily at 8 AM UTC (`/api/cron/sync-events`, 180s timeout)
- Events deactivated when no longer found externally
- Google Calendar sync happens automatically during event CRUD (non-blocking)

### Payments

- PaymentIntent created in `/api/create-payment-intent`
- Order created from Stripe webhook confirmation (not client-side) — `/api/webhooks/stripe`
- Two order types: `EVENT` and `PRIVATE_SESSION`

### User Sync

- Clerk webhook (`/api/webhooks/clerk`) creates/updates/deletes User records in Prisma
- Database User ID stored back in Clerk `publicMetadata.userId`
- Verified via Svix

## Project Structure

```
app/
├── (auth)/                    # Sign-in/sign-up pages (Clerk)
├── (root)/                    # Public-facing pages
│   ├── _components/           # Page-level shared components (Header, Footer, EventCard, etc.)
│   ├── events/                # Event detail pages
│   ├── private-sessions/      # Multi-step booking wizard
│   ├── account/               # User account
│   └── page.tsx               # Home page
├── admin/                     # Admin dashboard (RBAC protected)
│   ├── events/                # Event CRUD with EventForm
│   ├── users/                 # User management
│   ├── categories/            # Category management
│   └── sync/                  # Sync status dashboard
├── api/
│   ├── webhooks/{clerk,stripe} # Webhook handlers
│   ├── cron/sync-events/       # Daily cron (8 AM UTC)
│   ├── admin/sync/             # Manual sync endpoints
│   ├── create-payment-intent/  # Stripe
│   └── upload-blob/            # Vercel Blob
├── _lib/
│   ├── actions/               # Server actions (event, user, category, order, newsletter, blob, google)
│   ├── crawlers/              # Bright Bear + DCBP scrapers
│   ├── services/              # Sync orchestration, DB ops, location/category resolution
│   ├── types/                 # TypeScript types
│   ├── utils/                 # Helpers (formatDateTime, serialize, pagination, query builders)
│   ├── prisma.ts              # Prisma singleton
│   ├── google-calendar.ts     # Google Calendar service account API
│   └── schema.ts              # Zod form schemas
├── _hooks/                    # Analytics hooks (page tracking, form, A/B)
├── providers.tsx              # All context providers
└── globals.css
```

## Database Schema

6 models in `prisma/schema.prisma`:

- **Event** — title, dates, price, isFree, isHostedExternally, category, location, sourceType/sourceId (sync), googleEventId
- **User** — clerkId (unique), email, name, photo
- **Order** — stripeId, totalAmount, type (EVENT/PRIVATE_SESSION), buyer → User, event → Event
- **EventUser** — join table (userId + eventId composite PK)
- **Location** — name, formattedAddress, lat/lng, placeId (Google Places)
- **Category** — name (unique)

Key constraint: `@@unique([sourceType, sourceId])` on Event prevents duplicate synced events.

## Key Files

| File                                      | Purpose                                                      |
| ----------------------------------------- | ------------------------------------------------------------ |
| `app/_lib/prisma.ts`                      | Prisma client singleton (default export)                     |
| `proxy.ts`                                | Clerk middleware — route protection + admin RBAC             |
| `app/_lib/actions/event.actions.ts`       | Event CRUD server actions                                    |
| `app/_lib/crawlers/`                      | Web scrapers for Bright Bear + DCBP                          |
| `app/_lib/services/event-sync-service.ts` | Orchestrates sync pipeline                                   |
| `app/_lib/utils/index.ts`                 | formatDateTime (ET timezone), handleError, URL query helpers |
| `app/_lib/utils/serialize.ts`             | Prisma → plain object serializer                             |
| `app/_lib/google-calendar.ts`             | Google Calendar API (service account)                        |
| `app/_lib/schema.ts`                      | Zod validation schemas for forms                             |
| `app/admin/events/_components/EventForm/` | Complex event creation/edit form                             |
| `app/(root)/private-sessions/`            | Multi-step private session booking wizard                    |
| `vercel.json`                             | Cron schedules + function timeouts                           |

## Env Vars

Documented in `.env.example`. Key groups:

- **Database**: `POSTGRES_PRISMA_URL` (pooled), `POSTGRES_URL_NON_POOLING` (direct/migrations)
- **Auth**: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `CLERK_WEBHOOK_SECRET`
- **Payments**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SIGNING_SECRET`
- **Maps**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`, `NEXT_PUBLIC_GOOGLE_MAPS_ID`
- **Calendar**: `GOOGLE_SERVICE_ACCOUNT_EMAIL`, `GOOGLE_PRIVATE_KEY_BASE64`, `GOOGLE_CALENDAR_ID`
- **Scraping**: `BROWSERLESS_API_TOKEN` (required in all envs), `ZOOMSHIFT_EMAIL`, `ZOOMSHIFT_PASSWORD`
- **Email**: `RESEND_API_KEY`, `RESEND_SEGMENT_ID`, `RESEND_FROM_EMAIL`
- **Storage**: `BLOB_READ_WRITE_TOKEN`
- **Cron**: `CRON_SECRET`
