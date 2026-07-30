"use server";

import { revalidatePath } from "next/cache";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_KEY, BACKEND_URL } from "@/utils/api";

export interface Blog {
    image(image: unknown): string | import("next/dist/shared/lib/get-img-props").StaticImport;
    id?: string | number;
    _id?: string | number;
    title: string;
    slug: string;
    excerpt?: string;
    content?: string;
    cover_image?: string;
    category?: string;
    createdAt?: string;
    updatedAt?: string;
}

const ADMIN_BLOG_PATH = "/admin/blogs";
const PUBLIC_BLOG_PATH = "/blog";

function clearBlogCache() {
    try {
        // Revalidate Pages
        revalidatePath(ADMIN_BLOG_PATH, "page");
        revalidatePath(PUBLIC_BLOG_PATH, "page");


    } catch (error) {
        console.error("Cache revalidation error:", error);
    }
}

// 1. GET ALL BLOGS (ADMIN)
export async function getAllBlogsAdminAction(): Promise<{
    success: boolean;
    data: Blog[];
    message?: string;
}> {
    try {
        const res = await fetchWithAuth("/api/v1/blog/admin", {
            method: "GET",
            cache: "no-store",
            next: { revalidate: 0 },
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: [],
                message: result.message || "Failed to fetch admin blogs",
            };
        }

        const blogsData =
            (Array.isArray(result) && result) ||
            (Array.isArray(result?.data) && result.data) ||
            (Array.isArray(result?.data?.blogs) && result.data.blogs) ||
            (Array.isArray(result?.blogs) && result.blogs) ||
            [];

        // Normalize _id to id so client receives stable identifiers
        const normalizedBlogs = blogsData.map((b: Blog) => ({
            ...b,
            id: b.id || b._id,
        }));

        return {
            success: true,
            data: normalizedBlogs,
        };
    } catch (error) {
        console.error("Error fetching admin blogs:", error);
        return {
            success: false,
            data: [],
            message: "Server error occurred while fetching blogs",
        };
    }
}

// 2. GET PUBLIC BLOGS
export async function getPublicBlogsAction(): Promise<{
    success: boolean;
    data: Blog[];
    message?: string;
}> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/blog/public`, {
            method: "GET",
            next: { revalidate: 0, tags: ["public-blogs"] },
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
                message: result.message || "Failed to fetch public blogs",
            };
        }

        const blogsData =
            (Array.isArray(result) && result) ||
            (Array.isArray(result?.data) && result.data) ||
            (Array.isArray(result?.data?.blogs) && result.data.blogs) ||
            (Array.isArray(result?.blogs) && result.blogs) ||
            [];

        return {
            success: true,
            data: blogsData,
        };
    } catch (error) {
        console.error("Error fetching public blogs:", error);
        return {
            success: false,
            data: [],
            message: "Server error occurred while fetching blogs",
        };
    }
}

// 3. GET SINGLE BLOG
export async function getBlogBySlugAction(slug: string): Promise<{
    success: boolean;
    data: Blog | null;
    message?: string;
}> {
    try {
        const res = await fetch(`${BACKEND_URL}/api/v1/blog/${slug}`, {
            method: "GET",
            cache: "no-store",
            headers: {
                "Content-Type": "application/json",
                ...(API_KEY && { "x-api-key": API_KEY }),
            },
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                data: null,
                message: result.message || "Failed to fetch blog details",
            };
        }

        const blog = result.data?.blog || result.data || result;

        return {
            success: true,
            data: blog || null,
        };
    } catch (error) {
        console.error("Error fetching blog details:", error);
        return {
            success: false,
            data: null,
            message: "Server error occurred while fetching blog details",
        };
    }
}

// 4. CREATE BLOG
export async function createBlogAction(formData: FormData): Promise<{
    success: boolean;
    message?: string;
}> {
    try {
        const res = await fetchWithAuth("/api/v1/blog/create", {
            method: "POST",
            body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: result.message || "Failed to create blog",
            };
        }

        clearBlogCache();
        return { success: true, message: result.message || "Blog created successfully" };
    } catch (error) {
        console.error("Error creating blog:", error);
        return {
            success: false,
            message: "Server error occurred while creating blog",
        };
    }
}

// 5. UPDATE BLOG
export async function updateBlogAction(
    id: string | number,
    formData: FormData
): Promise<{
    success: boolean;
    message?: string;
}> {
    if (!id || id === "undefined") {
        return { success: false, message: "Invalid Blog ID provided for update." };
    }

    try {
        const res = await fetchWithAuth(`/api/v1/blog/${id}`, {
            method: "PUT",
            body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: result.message || "Failed to update blog",
            };
        }

        clearBlogCache();
        return { success: true, message: result.message || "Blog updated successfully" };
    } catch (error) {
        console.error("Error updating blog:", error);
        return {
            success: false,
            message: "Server error occurred while updating blog",
        };
    }
}

// 6. DELETE BLOG
export async function deleteBlogAction(id: string | number): Promise<{
    success: boolean;
    message?: string;
}> {
    if (!id || id === "undefined") {
        return { success: false, message: "Invalid Blog ID provided for deletion." };
    }

    try {
        const res = await fetchWithAuth(`/api/v1/blog/${id}`, {
            method: "DELETE",
        });

        const result = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: result.message || "Failed to delete blog",
            };
        }

        clearBlogCache();
        return { success: true, message: result.message || "Blog deleted successfully" };
    } catch (error) {
        console.error("Error deleting blog:", error);
        return {
            success: false,
            message: "Server error occurred while deleting blog",
        };
    }
}