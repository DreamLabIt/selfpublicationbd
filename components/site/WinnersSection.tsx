import { Trophy } from "lucide-react";
import { fetchData } from "@/lib/query";
import WinnersSlider from "./WinnersSlider";
import { Winner } from "@/types";

export default async function WinnersSection() {
    const winners = await fetchData<Winner[]>({
        endpoint: "winners",
        revalidate: 600,
        tags: ["winners"],
    });

    if (!winners || winners.length === 0) {
        return null;
    }

    return (
        <section className="bg-hero-grad relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 lg:py-12 relative">
                <div className="text-center max-w-2xl mx-auto pb-4 md:pb-6 lg:mb-8">
                    <Trophy className="w-10 h-10 mx-auto text-brand-red" />
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy mt-3">
                        Our Successful Achievers
                    </h2>
                    <p className="text-brand-navy/65 mt-2">
                        Those who succeeded by reading our books

                    </p>
                </div>

                <WinnersSlider winners={winners} />
            </div>
        </section>
    );
}