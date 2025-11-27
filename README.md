<h1 style="text-align: center;">AaronCurtisYoga.com</h1>
<p style="text-align: center;">Fullstack Next.js App for Aaron Curtis Yoga</p>

## <a name="table">Table of Contents</a>

1. [Intro](#introduction)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Postgres Database](#postgres)
6. [Analytics & Tracking](#analytics)
7. [Testing](#testing)
8. [Contact](#contact)

## <a name="introduction">Introduction</a>

This app is designed to help current and future yoga students:

- Learn about Aaron Curtis
- Find weekly schedules
- Sign up for the newsletter
- Register for events (_work in progress_)

## <a name="quick-start">Quick Start</a>

### Environment Configuration

```bash
cp .env.example .env
```

> For complete environment variable documentation, see [Environment Variables Reference Guide](docs/ENVIRONMENT_VARIABLES.md)

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

## <a name="analytics">Analytics & Tracking</a>

This application includes comprehensive analytics and user behavior tracking powered by **Vercel Analytics** (free tier).

### **🔍 Viewing Analytics Data**

**Vercel Dashboard:**

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click **"Analytics"** in the left sidebar
4. View real-time data including:
   - Page views and unique visitors
   - Top pages and referrers
   - Geographic data
   - Custom events (see tracking details below)

**Analytics Tab Features:**

- **Overview**: Traffic summary, page views, unique visitors
- **Pages**: Most visited pages, bounce rates
- **Referrers**: Traffic sources (direct, social, search, etc.)
- **Events**: Custom click tracking and conversions
- **Audiences**: User behavior patterns

### **📊 What We Track**

**Comprehensive click tracking across all interactive elements:**

#### **Navigation & User Flow**

- Logo clicks (home navigation)
- Desktop/mobile navigation menu interactions
- User dropdown toggles and admin link clicks
- Authentication actions (sign in/out from various sources)
- Hamburger menu open/close (mobile)

#### **Event Interactions**

- Event signup button clicks with full event context:
  - Event ID, title, category
  - Free vs paid events
  - External vs internal registration
  - Source (mobile vs desktop card)
- Admin event management (edit/delete clicks)

#### **Search & Discovery**

- Search queries and terms
- Category filter selections
- Pagination (next/previous page navigation)
- Calendar subscription interactions (Google Calendar, iCal)

#### **Private Sessions (Key Conversions)**

- Session count adjustments (increment/decrement/presets)
- Session type selections
- Purchase button clicks
- "Sign in to purchase" conversions

#### **Social & External Links**

- Social media clicks (YouTube, Spotify, Instagram)
- Footer social link interactions
- Theme changes (light/dark/system)

### **🛠 Analytics Utilities**

**Created utility functions for enhanced tracking:**

**`/app/_lib/analytics.ts`** - Helper functions for:

- Conversion tracking with values
- E-commerce events
- Form completion tracking
- Error tracking
- Page engagement metrics

**Custom Hooks Created:**

**`/app/_hooks/usePageTracking.ts`** - Automatic page analytics:

- Page view tracking
- Time on page measurement
- Scroll depth tracking
- Session duration

**`/app/_hooks/useFormAnalytics.ts`** - Form behavior tracking:

- Form start/completion/abandonment
- Field interaction tracking
- Validation error tracking
- Form completion time

**`/app/_hooks/useABTest.ts`** - Simple A/B testing:

- Variant assignment based on user ID
- Conversion tracking per variant
- Weighted distribution support

**`/app/_components/ErrorBoundary.tsx`** - Error tracking:

- JavaScript error capture
- React error boundary tracking
- User-friendly error display

### **📈 Key Events to Monitor**

**High-Value Conversions:**

- `event_signup` - Event registrations
- `private_session_booking` - Private session purchases
- `calendar_subscription` - Calendar integrations
- `newsletter_signup` - Email subscriptions

**User Engagement:**

- `navigation` - Site navigation patterns
- `search` - Content discovery behavior
- `filtering` - Event filtering usage
- `social_media` - External link engagement

**Technical Insights:**

- `page_view` / `page_exit` - Traffic flow
- `error` - Application issues
- `form_completion` - Form performance

### **🔧 Implementation Notes**

- All tracking uses Vercel's free Analytics tier
- No personal data is collected (GDPR friendly)
- Click tracking includes contextual metadata
- Error tracking helps identify technical issues
- A/B testing setup for future optimization
- Analytics data helps optimize user experience and conversion funnels

### **💡 Analytics Best Practices**

1. **Monitor Weekly**: Check analytics weekly for trends
2. **Focus on Conversions**: Track event signups and private session bookings
3. **Optimize High-Traffic Pages**: Use page analytics to improve popular content
4. **Monitor Errors**: Address technical issues quickly
5. **Test Changes**: Use A/B testing hook for major UI changes

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
