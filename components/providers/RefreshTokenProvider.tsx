'use client';

import { refreshTokenAction } from '@/app/actions/auth';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function RefreshTokenProvider({ children }: { children: React.ReactNode }) {
    const { hasToken, refetchUser, logout } = useAuth();

    useEffect(() => {
        if (!hasToken) return;

        const THREE_MINUTES = 3 * 60 * 1000;

        const interval = setInterval(async () => {
            try {
                const res = await refreshTokenAction();

                if (res.success) {
                    await refetchUser();
                } else {
                    console.warn("Auto token refresh failed:", res.message);
                    await logout();
                }
            } catch (err) {
                console.error("Error during auto-refreshing token:", err);
            }
        }, THREE_MINUTES);

        return () => clearInterval(interval);
    }, [hasToken, refetchUser, logout]);

    return <>{children}</>;
}