141 lines (104 sloc)  6.31 KB
   
<h1 style="text-align: center;">AaronCurtisYoga.com</h1>
<p style="text-align: center;">Fullstack Next.js App for Aaron Curtis Yoga </p>

## <a name="table">Table of Contents</a>

1. [Intro](#introduction)
2. [Quick Start](#quick-start)
3. [Tech Stack](#tech-stack)
4. [Features](#features)
5. [Get in touch](#contact)


## <a name="introduction">Intro</a>

This app is set up to help current and future yoga students: 
Learn about me, Find my weekly schedule, sign up to my newsletter, and register for events (_work in progress_)


## <a name="quick-start">Quick Start</a>

Before getting started, create a .env in the root of your project and

**Set Up Environment Variables**

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

My app is built with [Next.js](https://nextjs.org/). The common scripts are:
- `npm run dev` to start dev server
- `npm build` for prod build
- `npm run lint` to run eslint
- `npm run lint:fix` to try & fix lint errors


## <a name="tech-stack">Tech Stack</a>

- Next.js (_TypeScript_)
- NextUI ([docs](https://nextui.org/))
- React Hook Form docs ([docs](https://react-hook-form.com/))
- Vercel Postgres ([docs](https://vercel.com/docs/databases/postgres))
- Vercel Blob Storage ([docs](https://vercel.com/docs/storage))

    **_3rd Party Api's_**
- Clerk ([docs](https://docs.clerk.dev/))
- Stripe ([docs](https://stripe.com/docs))
- Mailchimp Marketing API ([docs](https://mailchimp.com/developer/marketing/))
## <a name="features">Features</a>

1. **Newsletter:** People can sign up to the Newsletter & stay up-to-date w/ upcoming events
2. **️Authentication:** Role Based Access Control (RBAC) with Clerk

3. **Events:** Admins can create, read, update, and delete events. End users can view events.
4. **🛠️ - Search & Filter:** Users can search and filter events
5. **🛠️ - Checkout and Pay:** Users can pay for events using Stripe


## <a name="contact">Get in touch</a>
* IG  [aaroncurtisyoga](https://www.instagram.com/aaroncurtisyoga/)
* ✉️ aaroncurtisyoga@gmail.com

