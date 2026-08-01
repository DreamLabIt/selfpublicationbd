'use server';

import { revalidatePath, revalidateTag } from "next/cache";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_KEY, BACKEND_URL } from "@/utils/api";

export interface Banner {
    _id?: string;
    id?: string;
    image: string;
    url?: string;
    order: number;
    isActive?: boolean;
    is_active?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface CreateBannerDTO {
    image: string;
    url?: string;
    order: number;
    isActive: boolean;
}

export interface UpdateBannerDTO {
    image?: string;
    url?: string;
    order?: number;
    isActive?: boolean;
}

export interface ActionResult<T = Banner> {
    success: boolean;
    message: string;
    data?: T;
}

const ADMIN_BANNER_PATH = "/admin/hero-slider";
const PUBLIC_HOME_PATH = "/";
const BANNER_TAG = "banner";

function clearBannerCache() {
    try {
        revalidatePath(ADMIN_BANNER_PATH);
        revalidatePath(PUBLIC_HOME_PATH);
        revalidateTag(BANNER_TAG, "default");
    } catch {
        return {
            success: false,
            message: "Error clearing cache:",
        };
    }
}

// GET Public Banners
export async function getPublicBannersAction(): Promise<Banner[]> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/banner/public`, {
            method: "GET",
            next: { tags: [BANNER_TAG] },
            headers: {
                'Content-Type': 'application/json',
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
        });

        if (!res.ok) return [];

        const result = await res.json();
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        if (Array.isArray(result?.data?.banners)) return result.data.banners;
        if (Array.isArray(result?.result)) return result.result;

        return [];
    } catch {
        return [];
    }
}

// GET Admin Banners
export async function getAllBannersAdminAction(): Promise<Banner[]> {
    try {
        const res = await fetchWithAuth("/api/v1/banner", {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) return [];

        const result = await res.json();
        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        if (Array.isArray(result?.data?.banners)) return result.data.banners;
        if (Array.isArray(result?.result)) return result.result;

        return [];
    } catch {
        return [];
    }
}

// Create Banner 
export async function createBannerAction(data: FormData | CreateBannerDTO): Promise<ActionResult<Banner>> {
    try {
        const isFormData = data instanceof FormData;
        const res = await fetchWithAuth("/api/v1/banner", {
            method: "POST",
            ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }),
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
                message: result.message || "ব্যানার তৈরি করতে সমস্যা হয়েছে।",
            };
        }

        clearBannerCache();

        return {
            success: true,
            message: result.message || "ব্যানার সফলভাবে তৈরি হয়েছে!",
            data: result.data,
        };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

// Update Banner
export async function updateBannerAction(bannerId: string, data: FormData | UpdateBannerDTO): Promise<ActionResult<Banner>> {
    try {
        const isFormData = data instanceof FormData;
        const res = await fetchWithAuth(`/api/v1/banner/${bannerId}`, {
            method: "PUT",
            ...(isFormData ? {} : { headers: { 'Content-Type': 'application/json' } }),
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
                message: result.message || "ব্যানার আপডেট করতে সমস্যা হয়েছে।",
            };
        }

        clearBannerCache();

        return {
            success: true,
            message: result.message || "ব্যানার সফলভাবে আপডেট করা হয়েছে!",
            data: result.data,
        };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

// DELETE Banner
export async function deleteBannerAction(bannerId: string): Promise<ActionResult> {
    try {
        const res = await fetchWithAuth(`/api/v1/banner/${bannerId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
            return {
                success: false,
                message: result.message || "ব্যানার ডিলিট করা সম্ভব হয়নি।",
            };
        }

        clearBannerCache();

        return {
            success: true,
            message: result.message || "ব্যানার সফলভাবে ডিলিট করা হয়েছে।",
        };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}
