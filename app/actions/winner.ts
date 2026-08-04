'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_KEY, BACKEND_URL } from "@/utils/api";

export interface SocialLinks {
    facebook?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
}

export interface Winner {
    _id?: string;
    id?: string;
    image: string;
    name: string;
    designation: string;
    office: string;
    quote?: string;
    socialLinks?: SocialLinks | string;
    order?: number;
    isActive?: boolean;
    is_active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateWinnerDTO {
    name: string;
    designation: string;
    office: string;
    quote?: string;
    socialLinks?: SocialLinks | string;
    order?: number;
    isActive?: boolean;
}

export interface UpdateWinnerDTO {
    name?: string;
    designation?: string;
    office?: string;
    quote?: string;
    socialLinks?: SocialLinks | string;
    order?: number;
    isActive?: boolean;
}

export interface ActionResult<T = Winner> {
    success: boolean;
    message: string;
    data?: T;
}

const ADMIN_WINNER_PATH = "/admin/winners";
const PUBLIC_HOME_PATH = "/";
const WINNERS_COLLECTION_TAG = "winners";
const getSingleWinnerTag = (id: string | number) => `winner:${id}`;

// Cache Revalidation 
function clearWinnerCache(winnerId?: string | number) {
    try {
        revalidatePath(ADMIN_WINNER_PATH);
        revalidatePath(PUBLIC_HOME_PATH);
        revalidateTag(WINNERS_COLLECTION_TAG, "default");

        if (winnerId) {
            revalidateTag(getSingleWinnerTag(winnerId), "default");
        }
    } catch (error) {
        console.error("Error clearing winner cache:", error);
    }
}

// Helper to normalize Winner ID
const normalizeWinner = (winner: Winner): Winner => ({
    ...winner,
    id: winner.id || winner._id,
});

// 1. GET Public Active Winners
export async function getPublicWinnersAction(): Promise<{
    success: boolean;
    data: Winner[];
    message?: string;
}> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/winner/public`, {
            method: "GET",
            next: { tags: [WINNERS_COLLECTION_TAG] },
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY && { "x-api-key": API_KEY }),
            },
        });

        const result = await res.json();
        if (!res.ok) {
            return {
                success: false,
                data: [],
                message: result.message || "Failed to fetch public winners",
            };
        }

        return {
            success: true,
            data: result?.data?.winners || result?.data || result || [],
        };
    } catch {
        return {
            success: false,
            data: [],
            message: "Server error occurred while fetching public winners",
        };
    }
}

// 2. GET All Admin Winners 
export async function getAllWinnersAdminAction(params?: {
    page?: number;
    limit?: number;
    name?: string;
    isActive?: boolean;
}): Promise<{
    success: boolean;
    data: Winner[];
    total?: number;
    message?: string;
}> {
    try {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append("page", params.page.toString());
        if (params?.limit) queryParams.append("limit", params.limit.toString());
        if (params?.name) queryParams.append("name", params.name);
        if (params?.isActive !== undefined) queryParams.append("isActive", String(params.isActive));

        const queryString = queryParams.toString();
        const endpoint = `/api/v1/winner${queryString ? `?${queryString}` : ""}`;

        const res = await fetchWithAuth(endpoint, {
            method: "GET",
            cache: "no-store",
        });

        const result = await res.json();
        if (!res.ok) {
            return {
                success: false,
                data: [],
                message: result.message || "Failed to fetch admin winners",
            };
        }

        const winnersData =
            (Array.isArray(result) && result) ||
            (Array.isArray(result?.data) && result.data) ||
            (Array.isArray(result?.data?.winners) && result.data.winners) ||
            (Array.isArray(result?.winners) && result.winners) ||
            [];

        const normalizedWinners = winnersData.map(normalizeWinner);

        return {
            success: true,
            data: normalizedWinners,
            total: result?.data?.total || normalizedWinners.length,
        };
    } catch {
        return {
            success: false,
            data: [],
            message: "Server error occurred while fetching admin winners",
        };
    }
}

// 3. GET Winner By ID
export async function getWinnerByIdAction(id: string | number): Promise<{
    success: boolean;
    data: Winner | null;
    message?: string;
}> {
    if (!id || id === "undefined") {
        return { success: false, data: null, message: "Invalid Winner ID provided." };
    }

    try {
        const res = await fetchWithAuth(`/api/v1/winner/${id}`, {
            method: "GET",
            cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: null,
                message: result.message || "Failed to fetch winner details",
            };
        }

        const winner = result.data?.winner || result.data || result;

        return {
            success: true,
            data: winner ? normalizeWinner(winner) : null,
        };
    } catch {
        return {
            success: false,
            data: null,
            message: "Server error occurred while fetching winner details",
        };
    }
}

// 4. CREATE Winner
export async function createWinnerAction(
    data: FormData | CreateWinnerDTO
): Promise<ActionResult<Winner>> {
    try {
        const isFormData = data instanceof FormData;

        const res = await fetchWithAuth("/api/v1/winner", {
            method: "POST",
            body: isFormData ? data : JSON.stringify(data),
        });

        const result = await res.json();

        if (res.status === 401) {
            return {
                success: false,
                message: "আপনার সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।",
            };
        }

        if (!res.ok || !result.success) {
            return {
                success: false,
                message: result.message || "উইনার তৈরি করতে সমস্যা হয়েছে।",
            };
        }

        clearWinnerCache();

        const rawWinnerData = result.data?.winner || result.data || result;

        return {
            success: true,
            message: result.message || "উইনার সফলভাবে তৈরি হয়েছে!",
            data: normalizeWinner(rawWinnerData),
        };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

// 5. UPDATE Winner Action
export async function updateWinnerAction(
    id: string | number,
    data: FormData | UpdateWinnerDTO
): Promise<ActionResult<Winner>> {

    if (!id || id === "undefined") {
        return { success: false, message: "Invalid Winner ID provided for update." };
    }

    try {
        const isFormData = data instanceof FormData;
        const headers: Record<string, string> = {};

        if (isFormData) {
            const entries: Record<string, unknown> = {};
            data.forEach((val, key) => {
                entries[key] = val instanceof File ? `File: ${val.name} (${val.size} bytes)` : val;
            });
        } else {
            headers["Content-Type"] = "application/json";
        }

        const res = await fetchWithAuth(`/api/v1/winner/${id}`, {
            method: "PUT",
            headers,
            body: isFormData ? data : JSON.stringify(data),
        });

        const result = await res.json();

        if (res.status === 401) {
            return {
                success: false,
                message: "আপনার সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।",
            };
        }

        if (!res.ok || !result.success) {
            return {
                success: false,
                message: result.message || "উইনার আপডেট করতে সমস্যা হয়েছে।",
            };
        }

        clearWinnerCache(id);

        const rawWinnerData = result.data?.winner || result.data || result;
        const normalizedData = normalizeWinner(rawWinnerData);

        return {
            success: true,
            message: result.message || "উইনার সফলভাবে আপডেট করা হয়েছে!",
            data: normalizedData,
        };
    } catch (error) {
        console.error("🔥 [ACTION CATCH ERROR] Exception caught in updateWinnerAction:", error);
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}
// 6. DELETE Winner
export async function deleteWinnerAction(id: string | number): Promise<ActionResult> {
    if (!id || id === "undefined") {
        return { success: false, message: "Invalid Winner ID provided for deletion." };
    }

    try {
        const res = await fetchWithAuth(`/api/v1/winner/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            return {
                success: false,
                message: result.message || "উইনার ডিলিট করা সম্ভব হয়নি।",
            };
        }

        clearWinnerCache(id);

        return {
            success: true,
            message: result.message || "উইনার সফলভাবে ডিলিট করা হয়েছে।",
        };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}
