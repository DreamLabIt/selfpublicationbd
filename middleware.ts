import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token =
        request.cookies.get("accessToken")?.value ||
        request.cookies.get("token")?.value;

    const { pathname } = request.nextUrl;

    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/profile", "/profile/:path*", "/admin", "/admin/:path*"],
};