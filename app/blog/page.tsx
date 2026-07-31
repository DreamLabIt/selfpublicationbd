import { Suspense } from "react";
import type { Blog } from "@/types";
import { getPublicBlogsAction } from "../actions/blog";
import BlogSkeleton from "@/components/site/BlogSkeleton";
import BlogSection from "./BlogSection";
export default async function Home() {
  const [blogsRes] = await Promise.all([
    getPublicBlogsAction(),
  ]);

  const blogs: Blog[] = (
    Array.isArray(blogsRes) ? blogsRes : blogsRes?.data || []
  ) as Blog[];
  return (
    <main className="pb-12">
      <Suspense fallback={<BlogSkeleton />}>
        {blogs && blogs.length > 0 ? (
          <BlogSection blogs={blogs} />
        ) : (<BlogSkeleton></BlogSkeleton>)}
      </Suspense>
    </main>
  );
}