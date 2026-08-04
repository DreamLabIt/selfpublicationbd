"use client"
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Trophy } from "lucide-react";
import { Winner } from "@/types";
import { BACKEND_URL } from "@/utils/api";
import "swiper/css";

interface WinnerSectionProps {
    winners: Winner[];
    t?: (key: string) => string;
}

export default function WinnerSection({ winners, t }: WinnerSectionProps) {
    if (!winners || winners.length === 0) {
        return (
            <div className="py-8 text-center text-gray-500">
                কোনো বিজয়ী তথ্য পাওয়া যায়নি।
            </div>
        );
    }

    const getImageUrl = (u?: string) => {
        if (!u) return "";
        if (
            u.startsWith("blob:") ||
            u.startsWith("http://") ||
            u.startsWith("https://")
        )
            return u;
        const baseUrl = BACKEND_URL;
        const cleanPath = u.replace(/^\//, "");
        if (cleanPath.startsWith("api/v1/")) {
            return `${baseUrl}/${cleanPath}`;
        }
        return `${baseUrl}/api/v1/${cleanPath}`;
    };

    const getSocialLink = (links: unknown): string | undefined => {
        if (!links) return undefined;
        if (typeof links === "string") return links;
        if (typeof links === "object" && !Array.isArray(links)) {
            const obj = links as Record<string, unknown>;
            return (
                (obj.facebook as string) ||
                (obj.url as string) ||
                (obj.link as string) ||
                (Object.values(obj)[0] as string)
            );
        }
        if (Array.isArray(links) && links.length > 0) {
            const first = links[0];
            if (typeof first === "string") return first;
            if (typeof first === "object" && first !== null) {
                return (first.url || first.link || Object.values(first)[0]) as string;
            }
        }
        return undefined;
    };

    return (
        <section className="bg-hero-grad relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8 lg:py-12 relative">
                <div className="mx-auto max-w-2xl text-center pb-4 md:pb-6 lg:mb-8">
                    <Trophy className="text-brand-red mx-auto h-10 w-10" />
                    <h2 className="text-brand-navy mt-3 text-xl font-bold sm:text-2xl md:text-3xl">
                        {t ? t("winners_title") : "Our Successful Achievers"}
                    </h2>
                    <p className="text-brand-navy/65 mt-2">
                        {t ? t("winners_sub") : "Those who succeeded by reading our books"}
                    </p>
                </div>

                <Swiper
                    modules={[Autoplay]}
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                    }}
                    loop={winners.length > 3}
                    spaceBetween={20}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                >
                    {winners.map((w, idx) => {
                        const legacySocial = (w as { social_url?: unknown }).social_url;
                        const socialUrl = getSocialLink(w.socialLinks ?? legacySocial);
                        const key = String(w._id || w.id || idx);
                        const legacyOffice = (w as { office?: string }).office;

                        return (
                            <SwiperSlide key={key}>
                                <div className="glass rounded-2xl p-6 h-full border border-gray-100 bg-white/50 backdrop-blur-sm">
                                    <div className="mt-5 flex w-full flex-row items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-gray-100">
                                                {w.image ? (
                                                    <Image
                                                        src={getImageUrl(w.image)}
                                                        alt={w.name || "Winner"}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-bold text-gray-500">
                                                        {w.name?.slice(0, 2).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>

                                            <div>
                                                <div className="font-semibold text-brand-navy">
                                                    {w.name}
                                                </div>
                                                <div className="text-xs text-brand-royal/80">
                                                    {w.designation}
                                                </div>
                                                <div className="text-[11px] text-brand-navy/55">
                                                    {w.department || legacyOffice}
                                                </div>
                                            </div>
                                        </div>

                                        {socialUrl && (
                                            <div>
                                                <Link
                                                    className="inline-block rounded-full p-1 transition-colors hover:bg-gray-100"
                                                    href={socialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <svg
                                                        className="h-6 w-6 text-[#1877F2]"
                                                        viewBox="0 0 36 36"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <circle cx="18" cy="18" r="18" fill="currentColor" />
                                                        <path
                                                            d="M23.5 18H20.25V28H16V18H14V14.5H16V12.25C16 10.3 17.2 8 20.5 8H23.5V11.25H21.5C20.6 11.25 20.25 11.65 20.25 12.5V14.5H23.75L23.5 18Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        </section>
    );
}