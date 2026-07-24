"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, CreditCard, BookOpen, Clock } from "lucide-react";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { BACKEND_URL } from "@/utils/api";
import Image from "next/image";
import useAuth from "@/hooks/useAuth";



export interface Book {
    id: string;
    title: string;
    title_en?: string;
    category: string;
    price: number;
    discount_price?: number;
    stock: number;
    cover_image?: string;
    [key: string]: unknown;
}

interface BookCardProps {
    book: Book;
    ebookStatus?: string | null;
}

export default function BookCard({ book, ebookStatus = null }: BookCardProps) {
    const { add, items } = useCart();
    const { t, lang } = useI18n();
    const { user } = useAuth();
    const router = useRouter();
    const isEbook = book.category === "ebook";
    const alreadyInCart = items?.some(
        (item: { id?: string | number; book_id?: string | number }) =>
            item.book_id === book.id || item.id === book.id
    );
    const price = book.discount_price ?? book.price;
    const hasDiscount =
        !isEbook && book.discount_price && book.discount_price < book.price;
    const fullUrl = (u?: string) => {
        if (!u) return "";
        if (u.startsWith("http://") || u.startsWith("https://")) return u;
        return u.startsWith("/") ? `${BACKEND_URL}${u}` : `${BACKEND_URL}/${u}`;
    };
    //   const [showPayment, setShowPayment] = useState<boolean>(false);

    return (
        <div
            className="book-card relative bg-white rounded-2xl overflow-hidden border border-brand-light/60 shadow-soft flex flex-col"
            data-testid="book-card"
        >
            <Link href={`/book/${book.id}`} className="block">
                <div className="aspect-3/4 relative w-full bg-linear-to-br from-[#DCE7F1] to-[#AFC4D6]/40 overflow-hidden">
                    {book.cover_image ? (
                        <div className="relative w-full h-full p-1 lg:p-2">
                            <div className="relative w-full h-full rounded-xl overflow-hidden">
                                <Image
                                    src={fullUrl(book.cover_image)}
                                    alt={book.title || "Book Cover"}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                                    className="object-cover"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-brand-navy/50">
                            No Cover
                        </div>
                    )}

                    {!isEbook && hasDiscount && book.stock > 0 && (
                        <div className="absolute top-3 left-3 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-md">
                            {Math.round((1 - book.discount_price! / book.price) * 100)}% OFF
                        </div>
                    )}

                    {book.stock <= 0 && (
                        <div className="absolute top-3 right-3 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-md">
                            Out of Stock
                        </div>
                    )}

                    {book.stock > 0 && (
                        <div className="absolute top-3 right-3 bg-brand-red text-white text-[10px] font-bold px-2 py-1 rounded-md">
                            In Stock
                        </div>
                    )}
                </div>
            </Link>

            <div className="p-2 md:p-4 flex flex-col flex-1">
                <Link href={`/book/${book.id}`} className="block flex-1">
                    <h3 className="text-sm md:text-base font-semibold text-brand-navy text-center md:text-start">
                        {lang === "en" && book.title_en ? book.title_en : book.title}
                    </h3>
                </Link>

                <div className="mt-2 md:mt-4 flex flex-col md:flex-row items-center md:items-end justify-between">
                    {!isEbook && (
                        <div>
                            <span className="text-sm md:text-lg font-bold text-brand-royal">
                                ৳{price}
                            </span>
                            {hasDiscount && (
                                <span className="ml-2 text-xs text-brand-navy/40 line-through">
                                    ৳{book.price}
                                </span>
                            )}
                        </div>
                    )}

                    {isEbook && book.stock <= 0 ? (
                        <div className="bg-brand-light/40 text-brand-navy/50 text-xs font-semibold px-3 py-2 rounded-lg mt-1.5 md:mt-0">
                            Out of Stock
                        </div>
                    ) : isEbook ? (
                        ebookStatus === "active" ? (
                            <Link
                                href="/profile"
                                className="btn-primary text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 mt-1.5 md:mt-0"
                            >
                                <BookOpen className="w-3.5 h-3.5" />
                                বই পড়ুন
                            </Link>
                        ) : ebookStatus === "pending" ? (
                            <div className="flex items-center gap-1.5 bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 text-yellow-700 text-xs font-semibold mt-1.5 md:mt-0">
                                <Clock className="w-3.5 h-3.5 shrink-0" />
                                যাচাই হচ্ছে...
                            </div>
                        ) : (
                            <button
                                onClick={() => {
                                    if (!user) {
                                        router.push("/login");
                                        return;
                                    }
                                    //   setShowPayment(true);
                                }}
                                className="btn-primary text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 mt-1.5 md:mt-0"
                            >
                                <CreditCard className="w-3.5 h-3.5" />
                                {ebookStatus === "expired"
                                    ? t("resubscribe")
                                    : t("subscribe_now")}
                            </button>
                        )
                    ) : book.stock <= 0 ? (
                        <div className="bg-brand-light/40 text-brand-navy/50 text-xs font-semibold px-3 py-2 rounded-lg mt-1.5 md:mt-0">
                            {t("out_of_stock")}
                        </div>
                    ) : alreadyInCart ? (
                        <button
                            onClick={() => router.push("/cart")}
                            className="btn-primary text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 mt-1.5 md:mt-0"
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {t("view_cart")}
                        </button>
                    ) : (
                        <button
                            onClick={() => add(book)}
                            className="btn-primary text-xs font-semibold px-3 py-2 rounded-lg inline-flex items-center gap-1.5 mt-1.5 md:mt-0"
                            data-testid={`add-to-cart-${book.id}`}
                        >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {t("add_to_cart")}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}