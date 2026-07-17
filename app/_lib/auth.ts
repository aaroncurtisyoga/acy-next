import { auth } from "@clerk/nextjs/server";

/**
 * Guard for admin-only server actions.
 *
 * Standardized on `sessionClaims.metadata.role` to match proxy.ts (the
 * middleware that already gates every /admin route) and to skip the extra
 * network round-trip that currentUser() would add. Throws on failure so
 * callers can let handleError() surface it.
 *
 * Route handlers that must return a Response should use assertAdminRequest()
 * from `@/app/_lib/api-auth` instead of catching this throw.
 */
export async function requireAdmin(): Promise<string> {
  const { userId, sessionClaims } = await auth();
  if (!userId) throw new Error("Unauthorized");
  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Unauthorized: admin role required");
  }
  return userId;
}
