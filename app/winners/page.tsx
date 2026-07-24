import { Trophy } from "lucide-react";
import { Metadata } from "next";
import { API_KEY, BACKEND_URL } from "@/utils/api";
import WinnerCard from "@/components/ui/WinnerCard";
import { Winner } from "@/types";

export const metadata: Metadata = {
    title: "Our Successful Achievers | Winners",
    description: "Those who succeeded by reading our books",
};

async function getWinners(): Promise<Winner[]> {
    try {
        const baseUrl = BACKEND_URL?.replace(/\/$/, "");
        const endpoint = baseUrl?.endsWith("/api")
            ? `${baseUrl}/winners`
            : `${baseUrl}/api/winners`;
        const res = await fetch(endpoint, {
            method: "GET",
            headers: {
                "x-api-key": API_KEY || "",
                "Content-Type": "application/json",
            },
            next: { revalidate: 60, tags: ["winners"] },
        });

        if (!res.ok) {
            console.error(`Fetch failed with status: ${res.status}`);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Failed to fetch winners:", error);
        return [];
    }
}

export default async function WinnersPage() {
    const items = await getWinners();

    return (
        <div>
            <section className="bg-hero-grad py-16 relative overflow-hidden">
                <span className="math-symbol text-[150px] left-[6%] top-[10%] absolute opacity-90 pointer-events-none">
                    ∫
                </span>
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                    <Trophy className="w-12 h-12 mx-auto text-brand-red" />
                    <h1 className="text-4xl sm:text-5xl font-bold text-brand-navy mt-4">
                        Our Successful Achievers
                    </h1>
                    <p className="text-brand-navy/65 mt-3 max-w-2xl mx-auto">
                        Those who succeeded by reading our books

                    </p>
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                {items && items.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((w) => (
                            <WinnerCard key={w.id} winner={w} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        কোনো বিজয়ী তথ্য পাওয়া যায়নি।
                    </div>
                )}
            </section>
        </div>
    );
}