import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/account",
    "/api/get-blobs",
    "/api/upload-blob",
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
