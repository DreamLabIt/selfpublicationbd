'use server';

import { cookies } from 'next/headers';
import { API_KEY, BACKEND_URL } from "@/utils/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
    const customHeaders = (options.headers as Record<string, string>) || {};
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        ...(API_KEY && { 'x-api-key': API_KEY }),
        ...customHeaders,
    };
    let response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401 && !endpoint.includes('/auth/refresh-token')) {
        const refreshResponse = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
        });

        if (refreshResponse.ok) {
            const setCookieHeaders = refreshResponse.headers.getSetCookie?.() ||
                [refreshResponse.headers.get('set-cookie')].filter(Boolean);
            for (const cookieStr of setCookieHeaders) {
                if (!cookieStr) continue;
                const parts = cookieStr.split(';');
                const [nameValue] = parts;
                const eqIndex = nameValue.indexOf('=');
                if (eqIndex !== -1) {
                    const name = nameValue.substring(0, eqIndex).trim();
                    const value = nameValue.substring(eqIndex + 1).trim();

                    let maxAge: number | undefined;
                    for (const part of parts.slice(1)) {
                        const [key, val] = part.split('=').map(s => s.trim());
                        if (key.toLowerCase() === 'max-age' && val) {
                            maxAge = parseInt(val, 10);
                        }
                    }

                    if (name && value) {
                        cookieStore.set(name, value, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
                            ...(maxAge && !isNaN(maxAge) && { maxAge }),
                        });
                    }
                }
            }

            const updatedCookies = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
            response = await fetch(`${BACKEND_URL}${endpoint}`, {
                ...options,
                headers: {
                    ...headers,
                    'Cookie': updatedCookies,
                },
            });
        } else {
            console.error("Refresh token expired or invalid.");
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
        }
    }
    return response;
}