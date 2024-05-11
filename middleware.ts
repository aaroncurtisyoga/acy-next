import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export default clerkMiddleware();

// todo: is it possible to add protected routes for things nested in (admin)
//  path? like /admin/events/create but the /admin won't appear in the URl
//  because its using Next.js route groups
const isProtectedRoute = createRouteMatcher([
  "/account",
  "/dashboard",
  "/profile",
  "/settings",
  "/events/create",
  "/events/[id]/edit",
  "/events/orders",
]);
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
