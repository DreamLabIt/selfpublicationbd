import Link from "next/link";
import BlogCard from "../ui/BlogCard";
import { ArrowRight } from "lucide-react";
import BlogSkeleton from "./BlogSkeleton";
import type { Blog } from "@/types";

export default function BlogSection({ blogs = [] }: { blogs?: Blog[] }) {
    if (!blogs || blogs.length === 0) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 lg:py-12 mb-12">
            <div className="flex flex-col flex-wrap w-full">
                <div className="flex items-center justify-between pb-6">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy">
                        Latest Articles
                    </h3>
                    <div className="text-brand-royal hover:text-brand-red text-xs sm:text-sm font-medium whitespace-nowrap transition-colors">
                        <Link
                            href="/blog"
                            className="flex items-center gap-1.5 "
                        >
                            All blogs <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
                        {blogs.map((blog: Blog) => (
                            <BlogCard key={String(blog.id ?? blog._id)} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <BlogSkeleton />
                )}
            </div>
        </section>
    );
}