# Environment Variables Reference Guide

This document provides comprehensive documentation for all environment variables used in the AaronCurtisYoga application.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Required Variables](#required-variables)
3. [Optional Variables](#optional-variables)
4. [Security Best Practices](#security-best-practices)

---

## Quick Start

### Initial Setup

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Configure the required variables listed below in the `.env` file

---

## Required Variables

These variables **must** be configured for the application to function properly.

### Vercel Blob Storage

| Variable                | Description                            | Source                                                          |
| ----------------------- | -------------------------------------- | --------------------------------------------------------------- |
| `BLOB_READ_WRITE_TOKEN` | Token for Vercel Blob Storage (images) | [Vercel Dashboard](https://vercel.com/docs/storage/vercel-blob) |

### Authentication (Clerk)

| Variable                              | Description                           | Source                                                 |
| ------------------------------------- | ------------------------------------- | ------------------------------------------------------ |
| `CLERK_SECRET_KEY`                    | Clerk secret key for server-side auth | [Clerk Dashboard](https://dashboard.clerk.com)         |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`   | Clerk publishable key for client-side | [Clerk Dashboard](https://dashboard.clerk.com)         |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL`       | Sign in page URL                      | Default: `/sign-in`                                    |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL`       | Sign up page URL                      | Default: `/sign-up`                                    |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Redirect after sign in                | Default: `/`                                           |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Redirect after sign up                | Default: `/`                                           |
| `WEBHOOK_SECRET`                      | Clerk webhook secret for user sync    | [Clerk Webhooks](https://dashboard.clerk.com/webhooks) |

### Database

| Variable      | Description               | Source                                         |
| ------------- | ------------------------- | ---------------------------------------------- |
| `MONGODB_URI` | MongoDB connection string | [MongoDB Atlas](https://www.mongodb.com/atlas) |

### Email Marketing (Mailchimp)

| Variable                | Description                        | Source                                                |
| ----------------------- | ---------------------------------- | ----------------------------------------------------- |
| `MAILCHIMP_API_KEY`     | Mailchimp API key                  | [Mailchimp Account](https://mailchimp.com/developer/) |
| `MAILCHIMP_AUDIENCE_ID` | Mailchimp audience/list ID         | Mailchimp Audience Settings                           |
| `MAILCHIMP_API_SERVER`  | Mailchimp API server (e.g., `us1`) | From API key suffix                                   |

### Payments (Stripe)

| Variable                             | Description                   | Source                                                   |
| ------------------------------------ | ----------------------------- | -------------------------------------------------------- |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key        | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_SECRET_KEY`                  | Stripe secret key             | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET`              | Stripe webhook signing secret | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) |

### Application Configuration

| Variable                 | Description          | Example                       |
| ------------------------ | -------------------- | ----------------------------- |
| `NEXT_PUBLIC_SERVER_URL` | Application base URL | `https://aaroncurtisyoga.com` |

---

## Optional Variables

### Cron Jobs

| Variable      | Description                                 | Usage                    |
| ------------- | ------------------------------------------- | ------------------------ |
| `CRON_SECRET` | Secret for authenticating cron job requests | Used by Vercel cron jobs |

### Web Scraping (Browserless)

| Variable                | Description                               | Source                                                                  |
| ----------------------- | ----------------------------------------- | ----------------------------------------------------------------------- |
| `BROWSERLESS_API_TOKEN` | Browserless.io API token for web scraping | [Browserless.io](https://account.browserless.io/signup/email?plan=free) |

> **Note**: Sign up for a free Browserless account (1,000 pages/month free). This is required for the class scraping functionality.

### ZoomShift Integration

| Variable             | Description                | Usage                            |
| -------------------- | -------------------------- | -------------------------------- |
| `ZOOMSHIFT_EMAIL`    | ZoomShift account email    | Required for DCBP class scraping |
| `ZOOMSHIFT_PASSWORD` | ZoomShift account password | Required for DCBP class scraping |

---

## Security Best Practices

### Production Environment

1. **Never** commit `.env` or `.env.local` files to version control
2. **Always** use strong, randomly generated secrets
3. **Store** production secrets in secure secret management systems (e.g., Vercel environment variables)
4. **Restrict** access to production environment variables
5. **Rotate** secrets regularly:
   - Change webhook secrets periodically
   - Update API keys on a schedule
   - Monitor for unauthorized access

### Development Environment

1. **Use** separate credentials from production
2. **Keep** development secrets in `.env` (git-ignored)
3. **Document** any new environment variables in this file
4. **Test** with proper environment configuration

---

## Adding New Environment Variables

When adding new environment variables to the application:

1. Add the variable to `.env.example` with a placeholder
2. Document it in this file under the appropriate section
3. Update the README's setup instructions if it's required for basic installation
4. Consider security implications
5. Test with the variable both set and unset

---

<div align="center">
  <sub>For more information, see the main <a href="../README.md">README</a></sub>
</div>
