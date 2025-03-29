import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAuthenticatedRoute = createRouteMatcher([
  "/account",
  "/admin/(.*)",
  "/profile",
  "/settings",
]);

const isAdminRoute = createRouteMatcher(["/admin/(.*)"]);

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
  if (isAuthenticatedRoute(req)) {
    if (!authObject.userId) {
      const url = req.nextUrl.clone();
      url.pathname = "/sign-in";
      url.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
