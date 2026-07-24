'use server';

import { fetchWithAuth } from "@/lib/fetchWithAuth";

export async function getUserProfile() {
    try {
        const response = await fetchWithAuth('/api/v1/auth/me', {
            method: 'GET',
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to fetch user data.",
            };
        }

        return {
            success: true,
            data: data?.data || data,
        };
    } catch (error) {
        console.error("getUserProfile Action Error:", error);
        return {
            success: false,
            message: "Something went wrong on the server.",
        };
    }
}