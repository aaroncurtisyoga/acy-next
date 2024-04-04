import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Let users access these routes even if not logged in
  publicRoutes: [
    "/",
    "/account",
    "/api/get-blobs",
    "/api/upload-blob",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
    "/dashboard",
    "/events",
    "/events/:id",
    "/orders",
  ],
  ignoredRoutes: [
    "/api/get-blobs",
    "/api/upload-blob",
    "/api/webhooks/clerk",
    "/api/webhooks/stripe",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
