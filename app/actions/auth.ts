'use server';

import { cookies } from 'next/headers';
import { API_KEY, BACKEND_URL } from "@/utils/api";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import type { LoginPayload } from "@/types";
import { redirect } from 'next/navigation';

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


// REFRESH TOKEN ACTION 
export async function refreshTokenAction() {
    try {
        const cookieStore = await cookies();
        const allCookies = cookieStore.getAll();
        const cookieHeader = allCookies.map(c => `${c.name}=${c.value}`).join('; ');

        const response = await fetch(`${BACKEND_URL}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Cookie': cookieHeader,
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
        });

        const data = await response.json();

        if (!response.ok) {
            cookieStore.delete('accessToken');
            cookieStore.delete('refreshToken');
            return {
                success: false,
                message: data.message || "Failed to refresh token.",
            };
        }

        const setCookieHeaders = response.headers.getSetCookie?.() ||
            [response.headers.get('set-cookie')].filter(Boolean);

        await saveBackendCookies(setCookieHeaders);

        return {
            success: true,
            message: data.message || "Token refreshed successfully!",
        };
    } catch (error) {
        console.error("Refresh Token Action Error:", error);
        return {
            success: false,
            message: "Something went wrong on the server. Please try again.",
        };
    }
}

// LOGIN USER ACTION
export async function loginAction(payload: LoginPayload) {
    const requestUrl = `${BACKEND_URL}/api/v1/auth/login`;
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
            body: JSON.stringify({
                email: payload.email.trim().toLowerCase(),
                password: payload.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Invalid credentials.",
            };
        }
        const setCookieHeaders = response.headers.getSetCookie?.() ||
            [response.headers.get('set-cookie')].filter(Boolean);

        await saveBackendCookies(setCookieHeaders);

        const user = data?.data?.user || data?.user;
        const role = user?.role?.toLowerCase();

        let redirectUrl = "/profile";

        if (role === "admin") {
            redirectUrl = "/admin/dashboard";
        } else if (role === "customer" || role === "user") {
            redirectUrl = "/profile";
        }

        return {
            success: true,
            message: data.message || "Login successful!",
            redirectUrl,
            user,
            token: data?.data?.token || data?.token,
        };
    } catch (error) {
        console.error("Login Server Action Error:", error);
        return {
            success: false,
            message: "Something went wrong on the server.",
        };
    }
}

// LOGOUT
export async function logoutAction() {
    const cookieStore = await cookies();
    try {
        await fetchWithAuth('/api/v1/auth/logout', {
            method: 'POST',
        });
    } catch (error) {
        console.error("Logout Error:", error);
    } finally {
        cookieStore.delete('accessToken');
        cookieStore.delete('refreshToken');
    }
    redirect('/login');
}

//USER PROFILE
export async function getUserProfile() {
    try {
        const response = await fetchWithAuth('/api/v1/user/profile', {
            method: 'GET',
        });

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to fetch profile.",
            };
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return {
                success: false,
                message: "Invalid response structure from backend.",
            };
        }

        const data = await response.json();

        return {
            success: true,
            data: data?.data || data,
        };
    } catch {
        return {
            success: false,
            message: "Something went wrong on the server.",
        };
    }
}

// CHANGE PASSWORD ACTION
export async function changePasswordAction(payload: {
    email: string;
    newPassword: string;
    confirmPassword: string;
    otp: string;
}) {
    const requestUrl = `${BACKEND_URL}/api/v1/auth/reset-password`;

    try {
        const response = await fetch(requestUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY && { "x-api-key": API_KEY }),
            },
            body: JSON.stringify({
                email: payload.email.trim().toLowerCase(),
                newPassword: payload.newPassword,
                confirmPassword: payload.confirmPassword,
                code: payload.otp,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || data.error || "Failed to change password.",
            };
        }

        return {
            success: true,
            message: data.message || "Password changed successfully!",
        };
    } catch (error) {
        console.error("Change Password Action Error:", error);
        return {
            success: false,
            message: "Something went wrong on the server. Please try again.",
        };
    }
}

// REGISTER USER ACTION
export async function registerUser(payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
}) {
    const requestUrl = `${BACKEND_URL}/api/v1/auth/register`;
    try {
        const response = await fetch(requestUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
            body: JSON.stringify({
                name: payload.name.trim(),
                email: payload.email.trim().toLowerCase(),
                phone: payload.phone.trim(),
                password: payload.password,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Registration failed!',
            };
        }

        return {
            success: true,
            message: data.message || 'Account created successfully!',
            data: data.data,
        };
    } catch (error) {
        console.error("Register Server Action Error:", error);
        return {
            success: false,
            message: 'Something went wrong on the server.',
        };
    }
}

// FORGOT PASSWORD ACTION
export async function forgotPasswordAction(email: string) {
    const requestUrl = `${BACKEND_URL}/api/v1/auth/forgot-password`;
    try {
        const response = await fetch(requestUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY && { "x-api-key": API_KEY }),
            },
            body: JSON.stringify({ email: email.trim().toLowerCase() }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || data.error || "Failed to send OTP.",
            };
        }

        return {
            success: true,
            message: data.message || "OTP sent to your email successfully!",
        };
    } catch (error) {
        console.error("Forgot Password Action Error:", error);
        return {
            success: false,
            message: "Something went wrong on the server. Please try again.",
        };
    }
}

// VERIFY OTP ACTION
export async function verifyOtpAction(email: string, otp: string) {
    const requestUrl = `${BACKEND_URL}/api/v1/auth/verify-otp`;
    try {
        const response = await fetch(requestUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY && { "x-api-key": API_KEY }),
            },
            body: JSON.stringify({
                email: email.trim().toLowerCase(),
                code: otp,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || data.error || "Invalid OTP code.",
            };
        }

        return {
            success: true,
            resetToken: data?.resetToken || data?.data?.resetToken || "",
            message: data.message || "OTP verified successfully!",
        };
    } catch (error) {
        console.error("Verify OTP Action Error:", error);
        return {
            success: false,
            message: "Something went wrong on the server. Please try again.",
        };
    }
}
