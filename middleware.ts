import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAuthenticatedRoute = createRouteMatcher([
  "/account",
  "/admin/(.*)",
  "/profile",
  "/settings",
  "/private-sessions/select-package(.*)",
  "/private-sessions/checkout(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);

const isPublicRoute = createRouteMatcher([
  "/",
  "/private-sessions",
  "/private-sessions/welcome(.*)",
  "/private-sessions/sign-in(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // Get the authentication object by awaiting it
  const authObject = await auth();

  // Restrict admin routes to users that are signed in and have the admin role
  if (isAdminRoute(req)) {
    if (authObject.sessionClaims?.metadata?.role !== "admin") {
      const url = req.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  // Restrict authenticated routes to users that are signed in
  // Only apply authentication check if it's not a public route
  if (isAuthenticatedRoute(req) && !isPublicRoute(req)) {
    if (!authObject.userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/private-sessions/sign-in";
      // Preserve the original URL to redirect back after sign-in
      url.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
