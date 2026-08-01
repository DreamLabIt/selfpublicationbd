"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { fetchWithAuth } from "@/lib/fetchWithAuth";
import { API_KEY, BACKEND_URL } from "@/utils/api";

export interface Blog {
    id?: string | number;
    _id?: string | number;
    title: string;
    slug: string;
    image?: string;
    cover_image?: string;
    description?: string;
    content?: string;
    category?: string;
    author?: string;
    views?: number;
    createdAt?: string;
    updatedAt?: string;
}

const ADMIN_BLOG_PATH = "/admin/blogs";
const PUBLIC_BLOG_PATH = "/blog";

// Cache Tags
const BLOGS_COLLECTION_TAG = "blogs";
const getSingleBlogSlugTag = (slug: string) => `blog:${slug}`;
const getSingleBlogIdTag = (id: string | number) => `blog:${id}`;

function clearBlogCache(slug?: string, blogId?: string | number) {
    try {
        revalidatePath(ADMIN_BLOG_PATH);
        revalidatePath(PUBLIC_BLOG_PATH);

        if (slug) {
            revalidatePath(`/blog/${slug}`);
            revalidateTag(getSingleBlogSlugTag(slug), "default");
        }

        if (blogId) {
            revalidateTag(getSingleBlogIdTag(blogId), "default");
        }
        revalidateTag(BLOGS_COLLECTION_TAG, "default");
    } catch (error) {
        console.error("Error clearing blog cache:", error);
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

        const normalizedBlogs = blogsData.map((b: Blog) => ({
            ...b,
            id: b.id || b._id,
        }));

        return {
            success: true,
            data: normalizedBlogs,
        };
    } catch {
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
            next: { tags: [BLOGS_COLLECTION_TAG] },
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
    } catch {
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
            next: { tags: [BLOGS_COLLECTION_TAG, getSingleBlogSlugTag(slug)] },
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
    } catch {
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
    } catch {
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

        const slug =
            (formData.get("slug") as string) ||
            result?.data?.slug ||
            result?.blog?.slug;

        clearBlogCache(slug, id);

        return { success: true, message: result.message || "Blog updated successfully" };
    } catch {
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

        clearBlogCache(undefined, id);
        return { success: true, message: result.message || "Blog deleted successfully" };
    } catch {
        return {
            success: false,
            message: "Server error occurred while deleting blog",
        };
    }
}