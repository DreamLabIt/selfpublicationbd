"use client";

import Image from "next/image";
import Link from "next/link";
import { BACKEND_URL } from "@/utils/api";
import { BlogCardProps } from "@/types";

export default function BlogCard({ blog }: BlogCardProps) {
    const domainUrl = BACKEND_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "");
    const coverImageUrl = blog.cover_image?.startsWith("http")
        ? blog.cover_image
        : `${domainUrl}${blog.cover_image}`;
    const blogHref = blog.slug ? `/blog/${blog.slug}` : `/blog/${blog.id}`;

    return (
        <Link
            href={blogHref}
            className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-brand-light hover:shadow-soft hover:-translate-y-0.5 transition duration-200"
        >
            <div className="relative w-full aspect-video rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 shrink-0">
                {blog.cover_image ? (
                    <Image
                        src={coverImageUrl}
                        alt={blog.title || "Blog cover"}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            <div className="min-w-0 flex flex-col flex-1 justify-between">
                <div>
                    {blog.category && (
                        <div className="text-[10px] uppercase tracking-wider text-brand-red font-bold">
                            {blog.category}
                        </div>
                    )}

                    <h4 className="font-semibold text-sm sm:text-base text-brand-navy line-clamp-2 leading-tight mt-1">
                        {blog.title}
                    </h4>
                </div>

                <div className="text-xs text-brand-navy/55 mt-2 flex items-center gap-1.5">
                    <span>👁 {blog.views ?? 0}</span>
                    {blog.author && (
                        <>
                            <span>•</span>
                            <span className="truncate">{blog.author}</span>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
}