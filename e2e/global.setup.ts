import { clerkSetup } from "@clerk/testing/playwright";

async function globalSetup() {
  // Only run Clerk setup if credentials are available
  // Smoke tests in CI don't need auth - they test the public homepage
  if (process.env.CLERK_PUBLISHABLE_KEY) {
    await clerkSetup();
  }
}

export default globalSetup;
