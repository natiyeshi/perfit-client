import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Get token from cookies
  const { pathname } = req.nextUrl;

  // Redirect '/' to '/dashboard' if logged in, or '/sign-in' if not
  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? "/dashboard" : "/sign-in", req.url));
  }

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  // Prevent authenticated users from accessing '/sign-in' and '/sign-up'
  if (token && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // Allow request to proceed
}

// Apply middleware to relevant routes
export const config = {
  matcher: ["/", "/dashboard/:path*", "/sign-in", "/sign-up"],
};
