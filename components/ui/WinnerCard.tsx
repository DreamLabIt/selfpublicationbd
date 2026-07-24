"use client";

import Image from "next/image";
import Link from "next/link";
import { BACKEND_URL } from "@/utils/api";
import { WinnerCardProps } from "@/types";

export default function WinnerCard({ winner }: WinnerCardProps) {
    const domainUrl = BACKEND_URL?.replace(/\/api\/?$/, "").replace(/\/$/, "");

    const imageUrl = winner.image?.startsWith("http")
        ? winner.image
        : `${domainUrl}${winner.image}`;

    return (
        <div className="glass rounded-2xl p-6 h-full border border-gray-100 shadow-sm bg-white/50 backdrop-blur-sm">
            <div className="mt-5 flex flex-row items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-100">
                        {winner.image ? (
                            <Image
                                src={imageUrl}
                                alt={winner.name || "Winner"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">
                                {winner.name?.slice(0, 2).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-semibold text-brand-navy">{winner.name}</div>
                        <div className="text-xs text-brand-royal/80">
                            {winner.designation}
                        </div>
                        <div className="text-[11px] text-brand-navy/55">
                            {winner.department}
                        </div>
                    </div>
                </div>
                {winner.social_url && (
                    <div>
                        <Link
                            className="rounded-full inline-block p-1 hover:bg-gray-100 transition-colors"
                            href={winner.social_url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                className="w-7 h-7 text-[#1877F2]"
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
    );
}