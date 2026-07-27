'use server';

import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { revalidatePath } from "next/cache";

export interface UpdateProfilePayload {
    name: string;
    phone?: string;
}

export interface ChangePasswordPayload {
    current_password?: string;
    new_password?: string;
}

export interface Subscription {
    id: string | number;
    book_id: string | number;
    book_title: string;
    book_cover?: string;
    plan_days: number;
    plan_price?: number;
    status: "pending" | "active" | "expired" | "rejected";
    start_date?: string;
    expire_date?: string;
    txn_id?: string;
    note?: string;
}

export async function updateProfileAction(data: UpdateProfilePayload) {
    try {
        const res = await fetchWithAuth("/api/v1/user/profile", {
            method: "PUT",
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: result.message || "প্রোফাইল আপডেট করতে সমস্যা হয়েছে।" };
        }

        revalidatePath("/profile");
        return { success: true, message: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!" };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

export async function changePasswordAction(data: ChangePasswordPayload) {
    try {
        const res = await fetchWithAuth("/api/v1/user/change-password", {
            method: "PUT",
            body: JSON.stringify(data),
        });

        const result = await res.json();
        if (!res.ok) {
            return { success: false, message: result.message || "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।" };
        }

        return { success: true, message: "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}

export async function getEbookSubscriptionsAction(): Promise<Subscription[]> {
    try {
        const res = await fetchWithAuth("/api/v1/user/profile/ebook-subscriptions", {
            method: "GET",
            next: { revalidate: 0 },
        });

        if (!res.ok) return [];
        const data = await res.json();
        return data || [];
    } catch {
        return [];
    }
}

export async function readEbookAction(bookId: string | number) {
    try {
        const res = await fetchWithAuth(`/api/v1/ebook/read/${bookId}`, {
            method: "GET",
            next: { revalidate: 0 },
        });

        const data = await res.json();
        if (!res.ok) {
            return { success: false, message: data.message || "ই-বুক লোড করা যায়নি" };
        }

        return { success: true, pdf_url: data.pdf_url };
    } catch {
        return { success: false, message: "সার্ভারে কোনো সমস্যা ঘটেছে" };
    }
}

export async function deleteAccountAction() {
    try {
        const res = await fetchWithAuth("/api/v1/user/profile", {
            method: "DELETE",
        });

        if (!res.ok) {
            return { success: false, message: "একাউন্ট ডিলিট করা সম্ভব হয়নি।" };
        }

        return { success: true, message: "একাউন্ট ডিলিট করা হয়েছে।" };
    } catch {
        return { success: false, message: "সার্ভারে সমস্যা হয়েছে।" };
    }
}