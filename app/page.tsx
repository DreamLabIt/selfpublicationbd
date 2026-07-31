import { Suspense } from "react";
import HeroSlider from "@/components/site/HeroSlider";
import HeroSliderSkeleton from "@/components/site/HeroSliderSkeleton";
import type { HeroSliderItem, } from "@/types";
import { getPublicBannersAction } from "./actions/banner";
import BlogSection from "@/components/site/BlogSection";
import { getPublicBlogsAction } from "./actions/blog";

import type { Blog } from "@/types";
import BlogSkeleton from "@/components/site/BlogSkeleton";
export default async function Home() {
  const [slidesRes, blogsRes] = await Promise.all([
    getPublicBannersAction(),
    getPublicBlogsAction(),
  ]);

  const slides = (slidesRes || []) as unknown as HeroSliderItem[];
  const blogs: Blog[] = (
    Array.isArray(blogsRes) ? blogsRes : blogsRes?.data || []
  ) as Blog[];
  return (
    <main className="min-h-screen pb-12">
      <Suspense fallback={<HeroSliderSkeleton />}>
        {slides && slides.length > 0 ? (
          <HeroSlider slides={slides} />
        ) : (
          <HeroSliderSkeleton />
        )}
      </Suspense>

      <Suspense fallback={<BlogSkeleton />}>
        {blogs && blogs.length > 0 ? (
          <BlogSection blogs={blogs} />
        ) : (
          <BlogSkeleton />
        )}
      </Suspense>
    </main>
  );
}