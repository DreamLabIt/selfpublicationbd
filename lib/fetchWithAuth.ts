'use server';

import { cookies } from 'next/headers';
import { API_KEY, BACKEND_URL } from "@/utils/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        ...(API_KEY && { 'x-api-key': API_KEY }),
        ...((options.headers as Record<string, string>) || {}),
    };

    let response = await fetch(`${BACKEND_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        console.log("AccessToken expired. Auto-refreshing via Server...");
        const refreshResponse = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
        });

        if (refreshResponse.ok) {
            const setCookieHeader = refreshResponse.headers.get('set-cookie');
            if (setCookieHeader) {
                const cookiesArray = setCookieHeader.split(',');
                for (const cookieStr of cookiesArray) {
                    const [nameValue] = cookieStr.split(';');
                    const [name, value] = nameValue.trim().split('=');
                    if (name && value) {
                        cookieStore.set(name, value, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            path: '/',
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