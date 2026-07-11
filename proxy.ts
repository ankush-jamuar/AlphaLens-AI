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
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|png|jpg|jpeg|webp|csv|docx|xlsx|pdf|zip|txt)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
