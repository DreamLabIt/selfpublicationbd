"use client";

import Image from "next/image";
import Link from "next/link";
import { BACKEND_URL } from "@/utils/api";
import { BlogCardProps } from "@/types";

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
            className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-light hover:shadow-soft hover:-translate-y-0.5 transition duration-200"
        >
            <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={blog.title || "Blog cover"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        unoptimized
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400 font-medium">
                        No Image
                    </div>
                )}
            </div>

            <div className="min-w-0">
                {/* <div className="text-[10px] uppercase tracking-wider text-brand-red font-bold">
                    {blog.category}
                </div> */}

                <h4 className="font-semibold text-sm sm:text-base text-brand-navy line-clamp-2 leading-tight mt-1">
                    {blog.title}
                </h4>

                {/* <div className="text-xs text-brand-navy/55 mt-2">
                    👁 {blog.views} • {blog.author}
                </div> */}
            </div>
        </Link>
    );
}