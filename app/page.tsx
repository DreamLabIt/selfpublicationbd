import { Suspense } from "react";
import HeroSlider from "@/components/site/HeroSlider";
import HeroSliderSkeleton from "@/components/site/HeroSliderSkeleton";
import BlogSection from "@/components/site/BlogSection";
import BlogSkeleton from "@/components/site/BlogSkeleton";
import WinnerSection from "@/components/site/WinnerSection";
import WinnerSkeleton from "@/components/site/WinnerSkeleton";
import type { HeroSliderItem, Blog, Winner } from "@/types";
import { getPublicBannersAction } from "./actions/banner";
import { getPublicBlogsAction } from "./actions/blog";
import { getPublicWinnersAction } from "./actions/winner";

export default async function Home() {
  const [slidesRes, blogsRes, winnersRes] = await Promise.all([
    getPublicBannersAction(),
    getPublicBlogsAction(),
    getPublicWinnersAction(),
  ]);

  const slides: HeroSliderItem[] = Array.isArray(slidesRes)
    ? (slidesRes as unknown[]).map((s) => {
      const src = (s as Record<string, unknown>) || {};
      return {
        id: Number(src.id ?? 0),
        image: String(src.image ?? ""),
        order: Number(src.order ?? 0),
        // spread any other fields present
        ...(src as Record<string, unknown>),
      } as HeroSliderItem;
    })
    : [];

  const rawData = winnersRes?.data as unknown;
  const winnersList: Winner[] = Array.isArray(rawData)
    ? (rawData as Winner[])
    : rawData &&
      typeof rawData === "object" &&
      Array.isArray((rawData as { data?: unknown }).data)
      ? ((rawData as { data: Winner[] }).data)
      : [];

  const blogs: Blog[] = (
    Array.isArray(blogsRes) ? blogsRes : blogsRes?.data || []
  ) as Blog[];

  return (
    <main className="min-h-screen space-y-8 pb-12">
      {/* Hero Banner Section */}
      <Suspense fallback={<HeroSliderSkeleton />}>
        {slides.length > 0 ? (
          <HeroSlider slides={slides} />
        ) : (
          <HeroSliderSkeleton />
        )}
      </Suspense>

      {/* Winners Swiper Section */}
      <Suspense fallback={<WinnerSkeleton />}>
        {winnersList.length > 0 ? (
          <WinnerSection winners={winnersList} />
        ) : (
          <WinnerSkeleton />
        )}
      </Suspense>

      {/* Blog Section */}
      <Suspense fallback={<BlogSkeleton />}>
        {blogs.length > 0 ? (
          <BlogSection blogs={blogs} />
        ) : (
          <BlogSkeleton />
        )}
      </Suspense>
    </main>
  );
}