"use client";

import Image from "next/image";
import Link from "next/link";
import { BACKEND_URL } from "@/utils/api";
import { BlogCardProps } from "@/types";
import { Eye } from "lucide-react";

export default function BlogCard({ blog }: BlogCardProps) {
    const getImageUrl = (imagePath?: string) => {
        if (!imagePath) return "";
        if (
            imagePath.startsWith("blob:") ||
            imagePath.startsWith("http://") ||
            imagePath.startsWith("https://")
        ) {
            return imagePath;
        }

        const baseUrl = BACKEND_URL ? BACKEND_URL.replace(/\/$/, "") : "";
        const cleanPath = imagePath.replace(/^\//, "");

        if (cleanPath.startsWith("api/v1/")) {
            return `${baseUrl}/${cleanPath}`;
        }

        return `${baseUrl}/api/v1/${cleanPath}`;
    };

    const rawImage = blog.image || (blog as { cover_image?: string }).cover_image;
    const imageUrl = getImageUrl(typeof rawImage === 'string' ? rawImage : undefined);
    const blogHref = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog.id || blog._id}`;

    return (
        <Link
            href={blogHref}
            className="flex flex-col gap-3  bg-white rounded-xl sm:rounded-2xl border border-brand-light hover:shadow-soft hover:-translate-y-0.5 transition duration-200"
        >
            <div className="relative w-full aspect-video rounded-t-xl overflow-hidden bg-gray-100 shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={blog.title || "Blog cover"}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400 font-medium">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-5 pb-3">
                <div className="text-[10px] tracking-wider font-bold text-brand-red uppercase">{blog.category}</div>
                <h3 className="font-bold text-brand-navy mt-2 line-clamp-2">{blog.title}</h3>
                <div className="text-sm text-brand-navy/65 mt-2 line-clamp-2">{blog.excerpt}</div>
                {/* Author & Views */}
                <div className="flex items-center gap-3 mt-4 text-xs text-brand-navy/55">
                    <span className="font-medium">{blog.author}</span>
                    <span className="inline-flex items-center gap-1"><Eye className="w-3 h-3" /> {blog.views || 0}</span>
                </div>
            </div>
        </Link>
    );
}