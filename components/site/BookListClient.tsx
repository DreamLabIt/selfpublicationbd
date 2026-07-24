"use client";

import BookCard, { Book } from "@/components/site/BookCard";
import { useI18n } from "@/lib/i18n";

interface BookListClientProps {
    category: string;
    books: Book[];
    q: string;
}

const TITLES: Record<string, { bn: string; en: string }> = {
    written: { bn: "লিখিত বই", en: "Written Books" },
    mcq: { bn: "MCQ বই", en: "MCQ Books" },
    "job-solution": { bn: "জব সলিউশন", en: "Job Solution" },
    ebook: { bn: "ই-বুক", en: "E-Books" },
    all: { bn: "সকল বই", en: "All Books" },
};

export default function BookListClient({ category, books, q }: BookListClientProps) {
    const { lang } = useI18n();

    const title =
        TITLES[category]?.[lang as "bn" | "en"] ||
        TITLES.all[lang as "bn" | "en"];

    return (
        <div >
            <section className="bg-hero-grad relative overflow-hidden ">
                <span className="math-symbol text-[120px] left-[5%] top-[38%] ">
                    π
                </span>
                <span className="math-symbol text-[140px] right-[10%] bottom-[15%]">
                    √
                </span>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
                    <div className="text-xs font-semibold tracking-wider text-brand-red">
                        CATEGORY
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-brand-navy mt-2">
                        {title}
                    </h1>

                    {q && (
                        <div className="text-brand-navy/60 mt-2">
                            {lang === "bn" ? "অনুসন্ধান" : "Search"}: &quot;{q}&quot;
                        </div>
                    )}
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {books.length === 0 ? (
                    <div
                        className="text-center py-20 text-brand-navy/60"
                        data-testid="empty-list"
                    >
                        {lang === "bn"
                            ? "কোন বই পাওয়া যায়নি"
                            : "No books found"}
                    </div>
                ) : (
                    <div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
                        data-testid="book-list"
                    >
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}