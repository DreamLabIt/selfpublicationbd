'use server';

import { cookies } from 'next/headers';
import { API_KEY, BACKEND_URL } from "@/utils/api";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
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
        const refreshToken = cookieStore.get('refreshToken')?.value;
        if (refreshToken) {
            const refreshResponse = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(API_KEY && { 'x-api-key': API_KEY }),
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (refreshResponse.ok) {
                const updatedCookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');

                response = await fetch(`${BACKEND_URL}${endpoint}`, {
                    ...options,
                    headers: {
                        ...headers,
                        'Cookie': updatedCookieHeader,
                    },
                });
            } else {
                cookieStore.delete('accessToken');
                cookieStore.delete('refreshToken');
            }
        } else {
            cookieStore.delete('accessToken');
        }
    }
    return response;
}