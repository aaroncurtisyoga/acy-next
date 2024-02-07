import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Let users access these routes even if not logged in
  publicRoutes: [
    "/",
    "/dashboard",
    "/faq",
    "/newsletter",
    "/schedule",
    "/events",
    "/events/:id",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/api/upload-blob",
  ],
  ignoredRoutes: [
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/api/upload-blob",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
