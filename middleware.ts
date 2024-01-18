import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Let users access these routes even if not logged in
  publicRoutes: [
    "/",
    "/faq",
    "/newsletter",
    "/schedule",
    "/events/:id",
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadBlob",
  ],
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
    "/api/uploadBlob",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
