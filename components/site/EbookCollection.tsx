import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import BookCard from "@/components/site/BookCard";
import { fetchData } from "@/lib/query";
import { Book } from "@/types";

export default async function EbookCollection() {
    const ebooksRes = await fetchData<Book[]>({
        endpoint: "books?category=ebook&featured=true",
        revalidate: 600,
        tags: ["ebooks"],
    });

    const ebooks = [...(ebooksRes || [])]
        .sort((a, b) => Number(a.order || 0) - Number(b.order || 0))
        .slice(0, 4);

    if (!ebooks || ebooks.length === 0) {
        return null;
    }

    return (
        <section className="bg-linear-to-br from-[#08145A] via-[#0B1E8A] to-[#08145A] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 lg:py-12 relative">
                <div className="flex items-end justify-between pb-4 md:pb-6 lg:mb-8 flex-wrap gap-3">
                    <div>
                        <div className="text-xs font-medium tracking-wider text-[#AFC4D6] inline-flex items-center gap-2 uppercase">
                            <FileText className="w-3.5 h-3.5" /> DIGITAL E-BOOKS
                        </div>
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mt-1">
                            E-Books Collection
                        </h2>
                    </div>
                    <Link
                        href="/books/ebook"
                        className="text-brand-royal hover:text-brand-red font-medium text-sm"
                    >
                        <span className="hover:text-red-500 hidden sm:inline-flex items-center gap-1">
                            All books <ArrowRight className="w-4 h-4" />
                        </span>
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
                    {ebooks.map((book) => (
                        <BookCard key={book.id} book={{ ...book, stock: book.stock ?? 0 }} />
                    ))}
                </div>
            </div>
        </section>
    );
}