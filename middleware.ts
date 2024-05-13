import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAuthenticatedRoute = createRouteMatcher([
  "/account",
  "/dashboard",
  "/profile",
  "/settings",
  "/events/create",
  "/events/[id]/edit",
  "/events/orders",
]);

const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);

export default clerkMiddleware((auth, req) => {
  // Restrict admin routes to users with specific permissions
  if (isAdminRoute(req)) {
    auth().protect((has) => {
      return has({ permission: "org:sys_memberships:manage" });
    });
  }
  // Restrict organization routes to users that are signed in
  if (isAuthenticatedRoute(req)) auth().protect();
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
