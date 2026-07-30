'use server';

import { cookies } from 'next/headers';
import { API_KEY, BACKEND_URL } from "@/utils/api";

async function saveBackendCookies(setCookieHeaders: (string | null)[]) {
    if (!setCookieHeaders || setCookieHeaders.length === 0) return;
    const cookieStore = await cookies();

    for (const cookieStr of setCookieHeaders) {
        if (!cookieStr) continue;
        const parts = cookieStr.split(';');
        const [nameValue] = parts;
        const eqIndex = nameValue.indexOf('=');

        if (eqIndex !== -1) {
            const name = nameValue.substring(0, eqIndex).trim();
            const value = nameValue.substring(eqIndex + 1).trim();
            let maxAge: number | undefined;
            let expires: Date | undefined;

            for (const part of parts.slice(1)) {
                const [key, ...valParts] = part.split('=').map(s => s.trim());
                const val = valParts.join('=');
                if (key.toLowerCase() === 'max-age' && val) {
                    maxAge = parseInt(val, 10);
                } else if (key.toLowerCase() === 'expires' && val) {
                    expires = new Date(val);
                }
            }

            if (name && value) {
                cookieStore.set(name, value, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    path: '/',
                    sameSite: 'lax',
                    ...(maxAge && !isNaN(maxAge) ? { maxAge } : expires ? { expires } : {}),
                });
            }
        }
    }
}

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value || cookieStore.get('token')?.value;
    const cookieHeader = cookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
    const customHeaders = (options.headers as Record<string, string>) || {};
    const isFormData = options.body instanceof FormData;
    const headers: Record<string, string> = {
        'Cookie': cookieHeader,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
        ...customHeaders,
    };
    console.log(cookieHeader)
    if (!isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    } else if (isFormData) {
        delete headers['Content-Type'];
    }

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
                ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
            },
        });

        if (refreshResponse.ok) {
            const setCookieHeaders = refreshResponse.headers.getSetCookie?.() ||
                [refreshResponse.headers.get('set-cookie')].filter(Boolean) as string[];

            await saveBackendCookies(setCookieHeaders);
            let newAccessToken = '';
            for (const header of setCookieHeaders) {
                if (header && header.includes('accessToken=')) {
                    const match = header.match(/accessToken=([^;]+)/);
                    if (match) newAccessToken = match[1];
                }
            }

            const updatedCookieStore = await cookies();
            const updatedCookieHeader = updatedCookieStore.getAll().map(c => `${c.name}=${c.value}`).join('; ');
            const retryHeaders: Record<string, string> = {
                ...headers,
                'Cookie': updatedCookieHeader,
                'Authorization': `Bearer ${newAccessToken || updatedCookieStore.get('accessToken')?.value || token}`,
            };

            if (isFormData) {
                delete retryHeaders['Content-Type'];
            }

            response = await fetch(`${BACKEND_URL}${endpoint}`, {
                ...options,
                headers: retryHeaders,
            });
        } else {
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
        }
    }

    return response;
}
