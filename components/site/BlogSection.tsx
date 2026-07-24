import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fetchData } from "@/lib/query";
import BlogCard from "../ui/BlogCard";
import { Blog } from "@/types";

export default async function BlogSection() {
    const blogs = await fetchData<Blog[]>({
        endpoint: "blogs",
        revalidate: 600,
        tags: ["blogs"],
    });

    if (!blogs || blogs.length === 0) {
        return null;
    }

    const recentBlogs = blogs.slice(0, 4);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 lg:py-12">
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between pb-4 md:pb-6 lg:mb-8">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy">
                        Blog & Insights
                    </h3>
                    <Link
                        href="/blog"
                        className="text-brand-royal hover:text-brand-red font-medium text-sm"
                    >
                        <span className="hover:text-red-500 hidden sm:inline-flex items-center gap-1">
                            All blog <ArrowRight className="w-4 h-4" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
                    {recentBlogs.map((b) => (
                        <BlogCard key={b.id} blog={b} />
                    ))}
                </div>
            </div>
        </section>
    );
}