import { Suspense } from "react";
import HeroSlider from "@/components/site/HeroSlider";
import type { HeroSliderItem } from "@/types";
import { getPublicBannersAction } from "./actions/banner";
import HeroSliderSkeleton from "@/components/site/HeroSliderSkeleton";

export default async function Home() {
  const slides = (await getPublicBannersAction()) as unknown as HeroSliderItem[];

  return (
    <main className="min-h-screen">
      <Suspense fallback={<HeroSliderSkeleton />}>
        {slides && slides.length > 0 ? (
          <HeroSlider slides={slides} />
        ) : (
          <HeroSliderSkeleton />
        )}
      </Suspense>
    </main>
  );
}