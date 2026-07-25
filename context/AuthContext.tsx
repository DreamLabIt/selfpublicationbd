"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { getUserProfile, logoutAction } from "@/app/actions/auth";

export type User = {
    name?: string;
    email?: string;
    [key: string]: unknown;
};

interface AuthContextType {
    hasToken: boolean;
    user: User | null;
    loading: boolean;
    logout: () => Promise<void>;
    refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    hasToken: false,
    user: null,
    loading: true,
    logout: async () => { },
    refetchUser: async () => { },
});

export function AuthProvider({
    children,
    initialHasToken,
}: {
    children: ReactNode;
    initialHasToken: boolean;
}) {
    const [hasToken, setHasToken] = useState<boolean>(initialHasToken);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(initialHasToken);

    useEffect(() => {
        setHasToken(initialHasToken);
    }, [initialHasToken]);

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getUserProfile();
            if (res && res.success && res.data) {
                setUser(res.data as User);
                setHasToken(true);
            } else {
                setUser(null);
                setHasToken(false);
            }
        } catch {
            setUser(null);
            setHasToken(false);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!hasToken) {
            setUser(null);
            setLoading(false);
            return;
        }

        const timeoutId = globalThis.setTimeout(() => {
            void fetchUser();
        }, 0);

        return () => {
            globalThis.clearTimeout(timeoutId);
        };
    }, [hasToken, fetchUser]);

    const logout = async () => {
        try {
            await logoutAction();
            setUser(null);
            setHasToken(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                hasToken,
                user,
                loading,
                logout,
                refetchUser: fetchUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);