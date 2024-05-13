import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
    if (auth().sessionClaims?.metadata.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.rewrite(url);
    }
  }
  // Restrict organization routes to users that are signed in
  if (isAuthenticatedRoute(req)) auth().protect();

  return NextResponse.next();
});
export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
