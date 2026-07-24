"use client";

import "swiper/css";
import "swiper/css/pagination";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { HeroSliderItem } from "@/types";
import { BACKEND_URL } from "@/utils/api";

export default function HeroSlider({ slides = [] }: { slides: HeroSliderItem[] }) {
  if (!slides || slides.length === 0) {
    return null;
  }

  const validSlides = slides.filter((item) => {
    return item.image && item.image.trim() !== "" && !item.image.includes("undefined");
  });

  if (validSlides.length === 0) {
    return null;
  }

  const sortedSlides = [...validSlides].sort((a, b) => a.order - b.order);
  const isLoopable = sortedSlides.length > 1;

  return (
    <div className="w-full flex justify-center py-2 pt-2">
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl shadow-soft">
          <Swiper
            modules={[Autoplay, Pagination]}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={
              isLoopable
                ? {
                  delay: 3000,
                  disableOnInteraction: false,
                }
                : false
            }
            loop={isLoopable}
            speed={800}
          >
            {sortedSlides.map((item, index) => {
              let slideImage = "";
              if (item.image.startsWith("http://") || item.image.startsWith("https://")) {
                slideImage = item.image;
              } else {
                const baseUrl = BACKEND_URL.endsWith("/") ? BACKEND_URL.slice(0, -1) : BACKEND_URL;
                const cleanImagePath = item.image.startsWith("/") ? item.image : `/${item.image}`;
                slideImage = `${baseUrl}${cleanImagePath}`;
              }

              return (
                <SwiperSlide key={`${item.id || index}`}>
                  <div className="relative w-full aspect-16/7 md:aspect-16/8 lg:aspect-16/6 bg-gray-100">
                    <Image
                      src={slideImage}
                      alt={"slider image"}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 1280px) 100vw, 1200px"
                      className="object-fill lg:object-cover"
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
