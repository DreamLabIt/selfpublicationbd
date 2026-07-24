import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { BACKEND_URL, API_KEY } from "@/utils/api";

export type UserRole = "admin" | "customer";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
}

const ROLE_HOME: Record<UserRole, string> = {
    admin: "/admin",
    customer: "/profile",
};

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY ? { "x-api-key": API_KEY } : {}),
                Cookie: cookieStore.toString(),
            },
            cache: "no-store",
        });

        if (!response.ok) return null;

        const data = await response.json();
        return data.user || data;
    } catch {
        return null;
    }
}

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
        return { error: "ইমেইল এবং পাসওয়ার্ড আবশ্যক।" };
    }

    try {
        const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY ? { "x-api-key": API_KEY } : {}),
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            return { error: data.message || "লগইন ব্যর্থ হয়েছে" };
        }

        // যদি backend token cookie set করে, এখানে প্রয়োজনে handle করবে

        const destination = ROLE_HOME[data.role as UserRole] ?? "/";
        redirect(destination);
    } catch (err) {
        if (err instanceof Error && err.message.includes("NEXT_REDIRECT")) {
            throw err;
        }

        return { error: "সার্ভারে সমস্যা হয়েছে। আবার চেষ্টা করুন।" };
    }
}

export async function logoutAction() {
    const cookieStore = await cookies();

    try {
        await fetch(`${BACKEND_URL}/api/auth/logout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY ? { "x-api-key": API_KEY } : {}),
                Cookie: cookieStore.toString(),
            },
        });

        cookieStore.delete("token");
    } catch (error) {
        console.error("Logout error:", error);
    } finally {
        redirect("/login");
    }
}