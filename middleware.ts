import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

interface CustomJWTPayload {
    role?: string;
    [key: string]: unknown;
}

export function middleware(request: NextRequest) {
    const token =
        request.cookies.get("accessToken")?.value ||
        request.cookies.get("token")?.value;

    const { pathname } = request.nextUrl;

    let userRole: string | null = null;

    if (token) {
        try {
            const decoded = decodeJwt(token) as CustomJWTPayload;
            userRole = decoded?.role?.toLowerCase() || null;
        } catch (error) {
            console.error("Token decoding error in middleware:", error);
            userRole = null;
        }
    }
    if (!token && (pathname.startsWith("/profile") || pathname.startsWith("/admin"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/", request.url));
    }
    if (pathname.startsWith("/admin")) {
        if (userRole !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/login",
        "/register",
        "/profile",
        "/profile/:path*",
        "/admin",
        "/admin/:path*",
    ],
};