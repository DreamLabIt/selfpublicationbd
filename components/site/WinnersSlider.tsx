"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Winner } from "@/types";
import WinnerCard from "../ui/WinnerCard";
import "swiper/css";

interface WinnersSliderProps {
    winners: Winner[];
}

export default function WinnersSlider({ winners }: WinnersSliderProps) {
    return (
        <Swiper
            modules={[Autoplay]}
            autoplay={{
                delay: 3500,
                disableOnInteraction: false,
            }}
            loop={true}
            spaceBetween={20}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                },
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            }}
        >
            {winners?.map((w) => (
                <SwiperSlide key={w.id}>
                    <WinnerCard winner={w} />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}