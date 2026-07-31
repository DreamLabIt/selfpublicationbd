'use server';

import { revalidatePath } from "next/cache";
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

function clearBannerCache() {
    try {
        revalidatePath(ADMIN_BANNER_PATH);
        revalidatePath(PUBLIC_HOME_PATH);
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
            next: { revalidate: 0, tags: ["public-banners"] },
            headers: {
                'Content-Type': 'application/json',
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
        });

        if (!res.ok) {
            return [];
        }

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
            next: { revalidate: 0 },
        });

        if (!res.ok) {
            return [];
        }

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
export async function createBannerAction(data: CreateBannerDTO): Promise<ActionResult<Banner>> {
    try {
        const res = await fetchWithAuth("/api/v1/banner", {
            method: "POST",
            body: JSON.stringify(data),
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
export async function updateBannerAction(bannerId: string, data: UpdateBannerDTO): Promise<ActionResult<Banner>> {
    try {
        const res = await fetchWithAuth(`/api/v1/banner/${bannerId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        const result = await res.json();

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

// Upload Banner Image
export async function uploadBannerImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
    try {
        const res = await fetchWithAuth("/api/v1/banner", {
            method: "POST",
            body: formData,
        });

        const result = await res.json().catch(() => ({}));

        if (!res.ok) {
            return {
                success: false,
                message: result.message || result.error || "Image upload failed"
            };
        }

        const imageUrl =
            result.data?.url ||
            result.url ||
            result.data?.image ||
            result.image ||
            result.data?.path ||
            result.path;

        if (!imageUrl) {
            return {
                success: false,
                message: "Image URL missing in server response"
            };
        }

        clearBannerCache();

        return {
            success: true,
            message: "Uploaded successfully",
            data: { url: imageUrl },
        };

    } catch {
        return { success: false, message: "Server error during upload" };
    }
}