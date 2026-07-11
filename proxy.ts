import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Protect dashboard and settings paths
const isProtectedRoute = createRouteMatcher([
  "/analyze(.*)",
  "/dashboard(.*)",
  "/portfolio(.*)",
  "/watchlist(.*)",
  "/reports(.*)",
  "/compare(.*)",
  "/chat(.*)",
  "/settings(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObj = await auth();
    authObj.protect();
  }
});

export const config = {
  matcher: [
    "/analyze(.*)",
    "/dashboard(.*)",
    "/portfolio(.*)",
    "/watchlist(.*)",
    "/reports(.*)",
    "/compare(.*)",
    "/chat(.*)",
    "/settings(.*)",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/(api|trpc)(.*)",
  ],
};
