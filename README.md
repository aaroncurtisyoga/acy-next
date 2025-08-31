<h1 style="text-align: center;">AaronCurtisYoga.com</h1>
<p style="text-align: center;">Fullstack Next.js App for Aaron Curtis Yoga</p>

## <a name="table">Table of Contents</a>

1. [Intro](#introduction)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Postgres Database](#postgres)
6. [Testing](#testing)
7. [Contact](#contact)

## <a name="introduction">Introduction</a>

This app is designed to help current and future yoga students:

- Learn about Aaron Curtis
- Find weekly schedules
- Sign up for the newsletter
- Register for events (_work in progress_)

## <a name="quick-start">Quick Start</a>

Before getting started, create a `.env` file in the root of your project and set up the environment variables:

```env
[//]: # (Vercel Blob Storage for Images)
BLOB_READ_WRITE_TOKEN=

CLERK_SECRET_KEY=

MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=
MAILCHIMP_API_SERVER=

MONGODB_URI=

NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

[//]: # (For Clerk)
WEBHOOK_SECRET=

[//]: # (For Stripe) https://dashboard.stripe.com/apikeys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

NEXT_PUBLIC_SERVER_URL=

[//]: # (For Cron Jobs)
CRON_SECRET=

[//]: # (For Browserless - Required for web scraping)
BROWSERLESS_API_TOKEN=

[//]: # (For ZoomShift - Required for DCBP class scraping)
ZOOMSHIFT_EMAIL=your-zoomshift-email@example.com
ZOOMSHIFT_PASSWORD=your-zoomshift-password
```

### Common Scripts

- `npm run dev` to start the development server
- `npm run build` for production build
- `npm run lint` to run ESLint
- `npm run lint:fix` to fix linting errors

### Web Scraping & Event Sync

The application automatically syncs yoga classes from **two sources**:

1. **Bright Bear Yoga** - Aaron's public class schedule
2. **DC Bouldering Project** - Aaron's teaching schedule via ZoomShift

**Architecture:**

- **All Environments**: Exclusively uses Browserless.io cloud browser service for consistent and reliable web scraping
- **Required Token**: The `BROWSERLESS_API_TOKEN` environment variable must be set for the application to function

**Setup:**

1. Sign up for free Browserless account at https://account.browserless.io/signup/email?plan=free (1,000 pages/month free)
2. Add `BROWSERLESS_API_TOKEN` to your environment variables (both local `.env` and Vercel)
3. The crawler will fail with an error if this token is not present - this is by design to ensure consistent behavior

**Testing the Crawlers:**

**Test individual crawlers (no database update):**

1. **Bright Bear only:** `curl http://localhost:3000/api/test-sync/simple`
   - Returns scraped Bright Bear classes as JSON without saving to database

2. **DCBP only:** `curl http://localhost:3000/api/test-sync/dcbp`
   - Returns scraped DCBP classes from ZoomShift as JSON without saving to database
   - Requires `ZOOMSHIFT_EMAIL` and `ZOOMSHIFT_PASSWORD` environment variables

3. **Both crawlers:** `curl http://localhost:3000/api/test-sync/both`
   - Tests both Bright Bear and DCBP crawlers simultaneously
   - Returns results from both sources with success/failure status for each

**Test full sync with database:**

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/api/test-sync`
   - Or use curl: `curl http://localhost:3000/api/test-sync`
   - This scrapes classes AND saves them to the database

**Manual sync to database (POST):**

1. Start the development server: `npm run dev`
2. Make a POST request: `curl -X POST http://localhost:3000/api/dev-sync`
3. Check `http://localhost:3000` to see the updated events

**Test browser connection (Browserless):**

1. Start the development server: `npm run dev`
2. Navigate to: `http://localhost:3000/api/test-sync/playwright-debug`
   - Tests whether Browserless connection is working correctly
   - Will fail if `BROWSERLESS_API_TOKEN` is not set (this is intentional)

**Automated Sync:**

- A Vercel cron job runs daily at 8:00 AM UTC to sync events from **both sources** automatically
- Configured in `vercel.json` at path `/api/cron/sync-events` with 120s timeout for both crawlers
- To test the cron endpoint locally:
  ```bash
  curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/sync-events
  ```
  Note: Replace `YOUR_CRON_SECRET` with the value from your `.env` file

**Vercel Pro Optimization:**

- Function timeout set to 180 seconds for combined sync operations (includes retries)
- Crawlers optimized for Vercel Pro limits (300s max duration)
- **Rate limit protection**: 3 retries with exponential backoff (5s, 10s, 20s delays)
- **Sequential execution**: Cron jobs run crawlers one at a time to avoid concurrent connection limits
- **Fallback handling**: If one crawler fails, the other continues independently
- Browserless.io ensures consistent browser environment across all deployments

## <a name="tech-stack">Tech Stack</a>

- **Next.js** ([docs](https://nextjs.org/)) (_TypeScript_)
- **HeroUI** ([docs](https://www.heroui.com/))
- **React Hook Form** ([docs](https://react-hook-form.com/))
- **Vercel Postgres** ([docs](https://vercel.com/docs/databases/postgres))
- **Vercel Blob Storage** ([docs](https://vercel.com/docs/storage))

  **_Third-Party APIs_**

- **Clerk** ([docs](https://docs.clerk.dev/))
- **Stripe** ([docs](https://stripe.com/docs))
- **Mailchimp Marketing API** ([docs](https://mailchimp.com/developer/marketing/))

## <a name="features">Features</a>

1. **Newsletter:** Stay up-to-date with upcoming events by signing up for the newsletter.
2. **Authentication:** Role-Based Access Control (RBAC) powered by Clerk.
3. **Events Management:** Admins can create, read, update, and delete events. End users can view events.
4. **Search & Filter:** Users can search and filter events.
5. **Checkout and Payment:** Secure payments powered by Stripe.

## <a name="postgres">Postgres Database</a>

You can use Prisma Studio to view and manage your Vercel Postgres database schema and data. Depending on the environment, use one of the following commands:

- **Local Development Database**:

  ```bash
  npx prisma studio
  ```

  Opens Prisma Studio using your local `.env` configuration, connecting to your development database.

- **Production Database**:
  ```bash
  dotenv -e .env.production -- npx prisma studio
  ```
  Opens Prisma Studio using the `.env.production` file, connecting to your production database.

> **Tip**: Ensure each environment file has the correct `DATABASE_URL` for seamless connections.

## <a name="testing">Testing</a>

This application uses [Playwright](https://playwright.dev/) for end-to-end testing.

- **Run Tests Locally**:
  To execute all tests from the terminal, use the following command:

  ```bash
  npx playwright test
  ```

  > **Note**: The development server must be running prior to executing this command.

- **Automated Testing**:
  A GitHub Action is set up to automatically run these tests whenever the application is deployed to both development and production environments.

- **IDE Recommendation**:
  Regardless of your preferred IDE, it is recommended to leverage the [Playwright Test extension for Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright). This extension provides a comprehensive set of tools for efficiently running and monitoring tests.

## <a name="contact">Contact</a>

- **Instagram:** [@aaroncurtisyoga](https://www.instagram.com/aaroncurtisyoga/)
- **Email:** aaroncurtisyoga@gmail.com
