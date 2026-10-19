import { NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require authentication (any logged-in user)
const PROTECTED_ROUTES = ["/dashboard"];

// Routes that require admin role
const ADMIN_ROUTES = ["/dashboard/admin"];

// Routes only for guests (redirect logged-in users away)
const GUEST_ONLY_ROUTES = ["/login", "/register"];

export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Get session cookie (lightweight — no DB call)
  const sessionCookie = getSessionCookie(request);
  const isLoggedIn = !!sessionCookie;

  // Redirect logged-in users away from auth pages
  if (GUEST_ONLY_ROUTES.some((r) => pathname.startsWith(r))) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard and its sub-routes
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For admin routes, verify role via the auth API
    // We pass the request headers through so the session is readable server-side
    if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
      try {
        const sessionRes = await fetch(
          new URL("/api/auth/get-session", request.url).toString(),
          {
            headers: {
              cookie: request.headers.get("cookie") || "",
            },
          }
        );
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          const role = sessionData?.user?.role;
          if (role !== "admin") {
            // Not an admin → redirect to user dashboard
            return NextResponse.redirect(new URL("/dashboard", request.url));
          }
        } else {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder assets
     * - api/auth (Better Auth endpoints must be publicly accessible)
     */
    "/((?!_next/static|_next/image|favicon.ico|assets/|api/auth).*)",
  ],
};
