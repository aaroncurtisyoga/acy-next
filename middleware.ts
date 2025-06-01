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
]);

export default clerkMiddleware(async (auth, req) => {
  // Get the authentication object by awaiting it
  const authObject = await auth();

  // If user is signed in and tries to access welcome page, redirect to select-package
  if (isPublicRoute(req) && req.nextUrl.pathname === "/private-sessions/welcome" && authObject.userId) {
    const url = req.nextUrl.clone();
    url.pathname = "/private-sessions/select-package";
    return NextResponse.redirect(url);
  }

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
      url.pathname = "/private-sessions/welcome";
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
