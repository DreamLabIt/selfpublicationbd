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

// GET Public Banners
export async function getPublicBannersAction(): Promise<Banner[]> {
    try {
        console.log("🔍 [getPublicBannersAction] Requesting public banners from:", `${BACKEND_URL}/api/v1/banner/public`);

        const res = await fetch(`${BACKEND_URL}/api/v1/banner/public`, {
            method: "GET",
            next: { revalidate: 60 },
            headers: {
                'Content-Type': 'application/json',
                ...(API_KEY && { 'x-api-key': API_KEY }),
            },
        });

        console.log("📡 [getPublicBannersAction] Response Status:", res.status);

        if (!res.ok) {
            console.error("❌ [getPublicBannersAction] Request failed with status:", res.status);
            return [];
        }

        const result = await res.json();
        console.log("📦 [getPublicBannersAction] Result Data:", result);

        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        if (Array.isArray(result?.data?.banners)) return result.data.banners;
        if (Array.isArray(result?.result)) return result.result;

        return [];
    } catch (error) {
        console.error("💥 [getPublicBannersAction] Exception:", error);
        return [];
    }
}

// GET Admin Banners
export async function getAllBannersAdminAction(): Promise<Banner[]> {
    try {
        console.log("🔍 [getAllBannersAdminAction] Requesting admin banners...");

        const res = await fetchWithAuth("/api/v1/banner", {
            method: "GET",
            next: { revalidate: 0 },
        });

        console.log("📡 [getAllBannersAdminAction] Response Status:", res.status);

        if (!res.ok) {
            console.error("❌ [getAllBannersAdminAction] Failed to fetch. Status:", res.status);
            return [];
        }

        const result = await res.json();
        console.log("📦 [getAllBannersAdminAction] Result Data:", result);

        if (Array.isArray(result)) return result;
        if (Array.isArray(result?.data)) return result.data;
        if (Array.isArray(result?.data?.banners)) return result.data.banners;
        if (Array.isArray(result?.result)) return result.result;

        return [];
    } catch (error) {
        console.error("💥 [getAllBannersAdminAction] Exception:", error);
        return [];
    }
}

// Create Banner
export async function createBannerAction(data: CreateBannerDTO): Promise<ActionResult<Banner>> {
    try {
        console.log("➕ [createBannerAction] Sending Payload:", data);

        const res = await fetchWithAuth("/api/v1/banner", {
            method: "POST",
            body: JSON.stringify(data),
        });

        console.log("📡 [createBannerAction] Response Status:", res.status);

        const result = await res.json();
        console.log("📦 [createBannerAction] Backend Result:", result);

        if (res.status === 401) {
            console.warn("⚠️ [createBannerAction] Session expired (401)");
            return {
                success: false,
                message: "আপনার সেশন শেষ হয়ে গেছে। অনুগ্রহ করে আবার লগইন করুন।",
            };
        }

        if (!res.ok || !result.success) {
            console.error("❌ [createBannerAction] Failed:", result.message);
            return {
                success: false,
                message: result.message || "ব্যানার তৈরি করতে সমস্যা হয়েছে।",
            };
        }

        // সফল হলে Next.js সার্ভার ক্যাশ ক্লিয়ার করা
        revalidatePath(ADMIN_BANNER_PATH);
        console.log("🔄 [createBannerAction] Cache revalidated for path:", ADMIN_BANNER_PATH);

        return {
            success: true,
            message: result.message || "ব্যানার সফলভাবে তৈরি হয়েছে!",
            data: result.data,
        };
    } catch (error) {
        console.error("💥 [createBannerAction] Exception:", error);
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

// Update Banner
export async function updateBannerAction(bannerId: string, data: UpdateBannerDTO): Promise<ActionResult<Banner>> {
    try {
        console.log(`✏️ [updateBannerAction] Updating Banner ID: ${bannerId} with Payload:`, data);

        const res = await fetchWithAuth(`/api/v1/banner/${bannerId}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        console.log("📡 [updateBannerAction] Response Status:", res.status);

        const result = await res.json();
        console.log("📦 [updateBannerAction] Backend Result:", result);

        if (!res.ok || !result.success) {
            console.error("❌ [updateBannerAction] Failed:", result.message);
            return {
                success: false,
                message: result.message || "ব্যানার আপডেট করতে সমস্যা হয়েছে।",
            };
        }

        // সফল হলে Next.js সার্ভার ক্যাশ ক্লিয়ার করা
        revalidatePath(ADMIN_BANNER_PATH);
        console.log("🔄 [updateBannerAction] Cache revalidated for path:", ADMIN_BANNER_PATH);

        return {
            success: true,
            message: result.message || "ব্যানার সফলভাবে আপডেট করা হয়েছে!",
            data: result.data,
        };
    } catch (error) {
        console.error("💥 [updateBannerAction] Exception:", error);
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

// DELETE Banner
export async function deleteBannerAction(bannerId: string): Promise<ActionResult> {
    try {
        console.log(`🗑️ [deleteBannerAction] Deleting Banner ID: ${bannerId}`);

        const res = await fetchWithAuth(`/api/v1/banner/${bannerId}`, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("📡 [deleteBannerAction] Response Status:", res.status);

        const result = await res.json();
        console.log("📦 [deleteBannerAction] Backend Result:", result);

        if (!res.ok || !result.success) {
            console.error("❌ [deleteBannerAction] Failed:", result.message);
            return {
                success: false,
                message: result.message || "ব্যানার ডিলিট করা সম্ভব হয়নি।",
            };
        }

        // সফল হলে Next.js সার্ভার ক্যাশ ক্লিয়ার করা
        revalidatePath(ADMIN_BANNER_PATH);
        console.log("🔄 [deleteBannerAction] Cache revalidated for path:", ADMIN_BANNER_PATH);

        return {
            success: true,
            message: result.message || "ব্যানার সফলভাবে ডিলিট করা হয়েছে।",
        };
    } catch (error) {
        console.error("💥 [deleteBannerAction] Exception:", error);
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

// Upload Banner Image
export async function uploadBannerImageAction(formData: FormData): Promise<ActionResult<{ url: string }>> {
    try {
        console.log("📤 [uploadBannerImageAction] Uploading image...");

        const res = await fetchWithAuth("/api/v1/banner", {
            method: "POST",
            body: formData,
        });

        console.log("📡 [uploadBannerImageAction] Response Status:", res.status);

        const result = await res.json().catch(() => ({}));
        console.log("📦 [uploadBannerImageAction] Backend Result:", result);

        if (!res.ok) {
            console.error("❌ [uploadBannerImageAction] Failed status:", res.status, result);
            return {
                success: false,
                message: result.message || result.error || "Image upload failed"
            };
        }

        // ব্যাকএন্ডের সম্ভাব্য বিভিন্ন রেসপন্স কি (Key) হ্যান্ডলিং
        const imageUrl =
            result.data?.url ||
            result.url ||
            result.data?.image ||
            result.image ||
            result.data?.path ||
            result.path;

        console.log("🖼️ [uploadBannerImageAction] Resolved Image URL:", imageUrl);

        if (!imageUrl) {
            console.warn("⚠️ [uploadBannerImageAction] Image URL Missing in response!");
            return {
                success: false,
                message: "Image URL missing in server response"
            };
        }

        return {
            success: true,
            message: "Uploaded successfully",
            data: { url: imageUrl },
        };

    } catch (error) {
        console.error("💥 [uploadBannerImageAction] Exception:", error);
        return { success: false, message: "Server error during upload" };
    }
}