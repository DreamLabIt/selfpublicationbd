"use client";

import { useI18n } from "@/lib/i18n";
import { MapPin, Phone } from "lucide-react";
import { API_KEY, BACKEND_URL } from "@/utils/api";
import { useState, ChangeEvent, useCallback, useEffect } from "react";
import { LibraryStore, FilterState, ClientProps } from "@/types";

export default function OfflineStoreClient({
    initialLibraries,
    bangladeshData,
}: ClientProps): React.JSX.Element {
    const { lang, t } = useI18n();
    const [libraries, setLibraries] = useState<LibraryStore[]>(initialLibraries);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isMounted, setIsMounted] = useState<boolean>(false);
    const [filters, setFilters] = useState<FilterState>({
        q: "",
        division: "",
        zilla: "",
    });

    const setF = <K extends keyof FilterState>(
        k: K,
        v: FilterState[K]
    ): void => {
        setFilters((prev) => {
            const updated = { ...prev, [k]: v };
            if (k === "division") {
                updated.zilla = "";
            }
            return updated;
        });
        setIsMounted(true);
    };

    const loadLibraries = useCallback(async (): Promise<void> => {
        setIsLoading(true);
        const params = new URLSearchParams();

        if (filters.q) params.append("q", filters.q);
        if (filters.division) params.append("division", filters.division);
        if (filters.zilla) params.append("zilla", filters.zilla);
        if (API_KEY) params.append("apiKey", API_KEY);

        try {
            const response = await fetch(
                `${BACKEND_URL}/api/libraries?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": API_KEY || "",
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch stores data");

            const resData = await response.json();
            setLibraries(resData.data || resData || []);
        } catch (error) {
            console.error("Client fetch error:", error);
            setLibraries([]);
        } finally {
            setIsLoading(false);
        }
    }, [filters.q, filters.division, filters.zilla]);

    useEffect(() => {
        if (isMounted) {
            const id = setTimeout(() => {
                loadLibraries();
            }, 0);

            return () => clearTimeout(id);
        }
    }, [loadLibraries, isMounted]);

    const zillaOptions = filters.division
        ? bangladeshData[filters.division]
        : [];

    return (
        <div>
            <section className="bg-hero-grad py-16">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-4xl font-bold text-brand-navy">
                        {lang !== "bn"
                            ? "আমাদের বইগুলো যেখান থেকে পাবেন"
                            : "Find Our Books at Nearest Stores"}
                    </h1>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid md:grid-cols-3 gap-3">
                    <select
                        value={filters.division}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setF("division", e.target.value as FilterState["division"])
                        }
                        className="border border-gray-300 p-2.5 rounded-lg text-black/80 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal"
                    >
                        <option value="">
                            {lang === "bn" ? "বিভাগ নির্বাচন করুন" : "Select Division"}
                        </option>
                        {Object.keys(bangladeshData).map((div) => (
                            <option key={div} value={div}>
                                {div}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.zilla}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                            setF("zilla", e.target.value)
                        }
                        className="border border-gray-300 p-2.5 rounded-lg text-black/80 bg-white focus:outline-none focus:ring-2 focus:ring-brand-royal"
                        disabled={!filters.division}
                    >
                        <option value="">
                            {filters.division
                                ? lang === "bn"
                                    ? "জেলা নির্বাচন করুন"
                                    : "Select Zilla"
                                : lang === "bn"
                                    ? "প্রথমে বিভাগ নির্বাচন করুন"
                                    : "Select Division first"}
                        </option>

                        {zillaOptions?.map((z) => (
                            <option key={z} value={z}>
                                {z}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 py-8">
                {isLoading ? (
                    <div className="text-center py-10 text-gray-500 font-medium">
                        {t("loading")}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-5">
                        {libraries.length > 0 ? (
                            libraries.map((s) => (
                                <div
                                    key={s.id}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 text-black shadow-soft hover:shadow-pop transition-all duration-300"
                                >
                                    <div className="font-bold text-xl text-brand-navy">
                                        {s.name}
                                    </div>

                                    <div className="text-xs text-gray-500 font-medium mt-1">
                                        {s.division} • {s.zilla}
                                    </div>

                                    <div className="mt-4 text-sm space-y-2.5">
                                        <div className="flex gap-2 items-start text-gray-700">
                                            <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-royal" />
                                            <span>{s.address}</span>
                                        </div>

                                        <div className="flex gap-2 items-center text-gray-700">
                                            <Phone className="w-4 h-4 shrink-0 text-brand-royal" />
                                            <span>{s.phone}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-2 text-center py-12 text-gray-500 font-medium">
                                {lang === "bn"
                                    ? "কোনো লাইব্রেরি পাওয়া যায়নি"
                                    : "No stores found"}
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}