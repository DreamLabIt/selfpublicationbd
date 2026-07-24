import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BookCard from "@/components/site/BookCard";
import { fetchData } from "@/lib/query";
import { Book } from "@/types";

export default async function McqCollection() {
    const mcqBooksRes = await fetchData<Book[]>({
        endpoint: "books?category=mcq&featured=true",
        revalidate: 600,
        tags: ["mcq-books"],
    });

    const mcqBooks = [...(mcqBooksRes || [])].sort(
        (a, b) => ((a.order as number) || 0) - ((b.order as number) || 0)
    );

    if (!mcqBooks || mcqBooks.length === 0) {
        return null;
    }

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 lg:py-12">
            <div className="flex items-end justify-between pb-4 md:pb-6 lg:mb-8">
                <div>
                    <div className="text-xs font-medium tracking-wider text-brand-red uppercase">
                        MCQ Preparation
                    </div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy mt-1">
                        MCQ Books
                    </h2>
                </div>
                <Link
                    href="/books/mcq"
                    className="text-brand-royal hover:text-brand-red font-medium text-sm"
                >
                    <span className="hover:text-red-500 hidden sm:inline-flex items-center gap-1">
                        All books <ArrowRight className="w-4 h-4" />
                    </span>
                </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 md:gap-5">
                {mcqBooks.map((book) => (
                    <BookCard key={book.id} book={{ ...book, stock: book.stock ?? 0 }} />
                ))}
            </div>
        </section>
    );
}