import { Trophy } from "lucide-react";
import { Metadata } from "next";
import WinnerCard from "@/components/ui/WinnerCard";
import { Winner } from "@/types";
import { getPublicWinnersAction } from "../actions/winner";

export const metadata: Metadata = {
    title: "Our Successful Achievers | Winners",
    description: "Those who succeeded by reading our books",
};

export default async function WinnersPage() {
    const res = await getPublicWinnersAction();
    const rawData = res?.data as unknown;
    const winnersList: Winner[] = Array.isArray(rawData)
        ? (rawData as Winner[])
        : rawData &&
            typeof rawData === "object" &&
            Array.isArray((rawData as { data?: unknown }).data)
            ? ((rawData as { data: Winner[] }).data)
            : [];

    return (
        <div>
            <section className="bg-hero-grad relative overflow-hidden py-16">
                <span className="math-symbol absolute left-[6%] top-[10%] pointer-events-none text-[150px] opacity-90">
                    ∫
                </span>
                <div className="relative mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
                    <Trophy className="text-brand-red mx-auto h-12 w-12" />
                    <h1 className="text-brand-navy mt-4 text-4xl font-bold sm:text-5xl">
                        Our Successful Achievers
                    </h1>
                    <p className="text-brand-navy/65 mx-auto mt-3 max-w-2xl">
                        Those who succeeded by reading our books
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
                {winnersList.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {winnersList.map((winner, idx) => {
                            const key = String(winner._id || winner.id || idx);
                            return <WinnerCard key={key} winner={winner} />;
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-500">
                        কোনো বিজয়ী তথ্য পাওয়া যায়নি।
                    </div>
                )}
            </section>
        </div>
    );
}