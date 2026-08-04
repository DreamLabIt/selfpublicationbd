"use client";

import Image from "next/image";
import Link from "next/link";
import { BACKEND_URL } from "@/utils/api";
import { WinnerCardProps } from "@/types";

export default function WinnerCard({ winner }: WinnerCardProps) {
    const imageUrl = (u?: string) => {
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

    const socialLink = getSocialLink(winner.socialLinks);

    return (
        <div className="glass rounded-2xl border border-gray-100 bg-white/50 p-6 shadow-sm backdrop-blur-sm h-full">
            <div className="mt-5 flex w-full flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-gray-100">
                        {winner.image ? (
                            <Image
                                src={imageUrl(winner.image)}
                                alt={winner.name || "Winner"}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gray-200 text-xs font-bold text-gray-500">
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
                            {typeof winner.department === "string"
                                ? winner.department
                                : typeof winner.office === "string"
                                ? winner.office
                                : undefined}
                        </div>
                    </div>
                </div>

                {socialLink && (
                    <div>
                        <Link
                            className="inline-block rounded-full p-1 transition-colors hover:bg-gray-100"
                            href={socialLink}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <svg
                                className="h-7 w-7 text-[#1877F2]"
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