import type { Blog } from "@/types";
import BlogSkeleton from "@/components/site/BlogSkeleton";
import BlogCard from "./BlogCard";

export default function BlogSection({ blogs = [] }: { blogs?: Blog[] }) {
    if (!blogs || blogs.length === 0) {
        return null;
    }

    return (
        <section >
            <div className="bg-hero-grad py-10 sm:py-14">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-xs font-bold tracking-wider text-brand-red">INSIGHTS</div>
                    <h1 className="text-3xl sm:text-5xl font-bold text-brand-navy mt-2 leading-tight">Blog & Insights</h1>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">

                {blogs && blogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog: Blog) => (
                            <BlogCard key={String(blog.id ?? blog._id ?? blog.slug)} blog={blog} />
                        ))}
                    </div>
                ) : (
                    <BlogSkeleton />
                )}
            </div>
        </section>
    );
}