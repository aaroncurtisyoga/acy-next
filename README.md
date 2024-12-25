<h1 style="text-align: center;">AaronCurtisYoga.com</h1>
<p style="text-align: center;">Fullstack Next.js App for Aaron Curtis Yoga</p>

## <a name="table">Table of Contents</a>

1. [Introduction](#introduction)
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

NEXT_PUBLIC_SERVER_URL
```

### Common Scripts
- `npm run dev` to start the development server
- `npm build` for production build
- `npm run lint` to run ESLint
- `npm run lint:fix` to fix linting errors


## <a name="tech-stack">Tech Stack</a>

- **Next.js** ([docs](https://nextjs.org/)) (_TypeScript_)
- **NextUI** ([docs](https://nextui.org/))
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
