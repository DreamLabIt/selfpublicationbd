"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    forgotPassword as forgotPasswordService,
    loginUser,
    registerUser,
    resetPassword as resetPasswordService,
} from "@/services/auth.service";

import type {
    AuthResponse,
    ForgotPasswordPayload,
    LoginPayload,
    RegisterPayload,
    ResetPasswordPayload,
    User,
} from "@/types";

export default function useAuth() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    // Load current user
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const res = await fetch("/api/auth/me");

                if (!res.ok) {
                    setUser(null);
                    return;
                }

                const data = await res.json();
                setUser(data.user ?? data);
            } catch {
                setUser(null);
            }
        };

        getCurrentUser();
    }, []);

    const register = async (data: RegisterPayload) => {
        try {
            setLoading(true);
            return await registerUser(data);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data: LoginPayload) => {
        try {
            setLoading(true);

            const res: AuthResponse = await loginUser(data);

            // যদি login response-এ user থাকে
            if (res.user) {
                setUser(res.user);
            }

            router.push("/");
            router.refresh();

            return res;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);

            await fetch("/api/auth/logout", {
                method: "POST",
            });

            setUser(null);

            router.push("/login");
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (data: ForgotPasswordPayload) => {
        try {
            setLoading(true);
            return await forgotPasswordService(data);
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (
        token: string,
        data: ResetPasswordPayload
    ) => {
        try {
            setLoading(true);
            return await resetPasswordService(token, data);
        } finally {
            setLoading(false);
        }
    };

    return {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
    };
}