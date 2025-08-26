import { z } from "zod";

const envSchema = z.object({
  // Database
  POSTGRES_DATABASE: z.string().min(1),
  POSTGRES_HOST: z.string().min(1),
  POSTGRES_PASSWORD: z.string().min(1),
  POSTGRES_PRISMA_URL: z.string().min(1),
  POSTGRES_URL: z.string().min(1),
  POSTGRES_URL_NON_POOLING: z.string().min(1),
  POSTGRES_URL_NO_SSL: z.string().min(1),
  POSTGRES_USER: z.string().min(1),

  // Clerk Authentication
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SIGNING_SECRET: z.string().min(1),

  // Google Maps (optional)
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
  NEXT_PUBLIC_GOOGLE_MAPS_ID: z.string().optional(),

  // Mailchimp (optional)
  MAILCHIMP_API_KEY: z.string().optional(),
  MAILCHIMP_SERVER_PREFIX: z.string().optional(),
  MAILCHIMP_AUDIENCE_ID: z.string().optional(),

  // Vercel Blob (optional)
  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  // URLs
  NEXT_PUBLIC_SERVER_URL: z.string().optional(),

  // Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join(".")).join(", ");
      throw new Error(
        `Missing or invalid environment variables: ${missingVars}\n` +
          `Please check your .env file and ensure all required variables are set.`,
      );
    }
    throw error;
  }
}

export const env = validateEnv();
