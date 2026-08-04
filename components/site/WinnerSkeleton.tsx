
import { Trophy } from "lucide-react";

export default function WinnerSkeleton() {
    return (
        <section className="bg-hero-grad relative overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-8 lg:px-8 lg:py-12 relative">
                <div className="mx-auto max-w-2xl text-center pb-4 md:pb-6 lg:mb-8">
                    <Trophy className="text-gray-300 mx-auto h-10 w-10 animate-pulse" />
                    <div className="mx-auto mt-3 h-7 w-48 rounded-md bg-gray-200 animate-pulse sm:h-8 sm:w-64" />
                    <div className="mx-auto mt-2 h-4 w-64 rounded-md bg-gray-200 animate-pulse sm:w-80" />
                </div>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <div
                            key={item}
                            className="glass rounded-2xl border border-gray-100 bg-white/50 p-6 backdrop-blur-sm animate-pulse"
                        >
                            <div className="mt-5 flex w-full flex-row items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-16 w-16 shrink-0 rounded-full bg-gray-200" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-28 rounded bg-gray-200" />
                                        <div className="h-3 w-20 rounded bg-gray-200" />
                                        <div className="h-2.5 w-24 rounded bg-gray-200" />
                                    </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-gray-200 shrink-0" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}