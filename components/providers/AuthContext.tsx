"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const API_KEY = process.env.NEXT_PUBLIC_API_KEY as string;

export type UserRole = "admin" | "customer";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<User>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
}

const AuthCtx = createContext<AuthContextType | null>(null);

// Role-based redirect destinations
const ROLE_HOME: Record<UserRole, string> = {
    admin: "/admin",
    customer: "/profile",
};

const getHeaders = () => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };
    if (API_KEY) {
        headers["x-api-key"] = API_KEY;
    }
    return headers;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const refresh = async () => {
        try {
            const res = await fetch(`${BACKEND_URL}/auth/me`, {
                method: "GET",
                headers: getHeaders(),
                credentials: "include",
            });

            if (!res.ok) {
                throw new Error("Unauthorized");
            }

            const data: User = await res.json();
            setUser(data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initAuth = async () => {
            try {
                const res = await fetch(`${BACKEND_URL}/auth/me`, {
                    method: "GET",
                    headers: getHeaders(),
                    credentials: "include",
                });

                if (!res.ok) throw new Error("Unauthorized");

                const data: User = await res.json();
                setUser(data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.message || "Login failed");
        }

        const data: User = await res.json();
        setUser(data);

        const destination = ROLE_HOME[data.role] ?? "/";
        router.push(destination);

        return data;
    };

    const logout = async () => {
        try {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
                headers: getHeaders(),
                credentials: "include",
            });
        } catch {
            // সাইলেন্ট ফেলোয়ার ক্যাচ
        }

        setUser(null);
        router.push("/login");
    };

    return (
        <AuthCtx.Provider value={{ user, loading, login, logout, refresh }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthCtx);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

interface ProtectedRouteProps {
    children: React.ReactNode;
    role?: UserRole;
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.replace(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            } else if (role && user.role !== role) {
                const redirectPath = ROLE_HOME[user.role] ?? "/";
                router.replace(redirectPath);
            }
        }
    }, [user, loading, role, router, pathname]);

    if (loading || !user || (role && user.role !== role)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                {/* আপনি চাইলে এখানে আপনার সুন্দর কোনো কাস্টম স্পিনার লোডার ব্যবহার করতে পারেন */}
                <span className="text-sm font-medium">Loading...</span>
            </div>
        );
    }

    return <>{children}</>;
}