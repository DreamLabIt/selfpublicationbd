"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BACKEND_URL } from "@/utils/api";
import { useCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { useAuth } from '@/context/AuthContext';

import Gallery from "./Gallery";
import BookCard from "@/components/site/BookCard";
import ShareButtons from "@/components/site/ShareButtons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Truck, ShieldCheck, RefreshCw, ShoppingCart, BookOpen, CreditCard, Clock, } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Book, BookDetailsProps, CartItem, EbookSubscription } from "@/types";

export default function BookDetails({
  initialBook,
  initialRelated,
}: BookDetailsProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { add, items } = useCart();
  const { t, lang } = useI18n();
  const [book] = useState<Book | null>((initialBook as Book) || null);
  const [related] = useState<Book[]>((initialRelated as Book[]) || []);
  const [qty, setQty] = useState<number>(1);
  const [showSample, setShowSample] = useState<boolean>(false);
  // const [showPayment, setShowPayment] = useState<boolean>(false);
  const [ebookStatus, setEbookStatus] = useState<string | null>(null);
  const [ebookReadUrl, setEbookReadUrl] = useState<string | null>(null);
  const stock = book?.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const handleDecrease = () => {
    if (qty > 1) {
      setQty((prev) => prev - 1);
    }
  };

  const handleIncrease = () => {
    if (isOutOfStock) {
      toast.error("বইটি স্টকে নেই");
      return;
    }

    if (qty < stock) {
      setQty((prev) => prev + 1);
    } else {
      toast.error("স্টকের অতিরিক্ত সংখ্যা যুক্ত করা সম্ভব নয়");
    }
  };

  useEffect(() => {
    if (!book || book.category !== "ebook" || !user) return;

    const token = (user && (user as { token?: string }).token) || "";

    fetch(`${BACKEND_URL}/profile/ebook-subscriptions`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((subs: EbookSubscription[]) => {
        const sub = subs.find((s) => String(s.book_id) === String(book.id));
        if (sub) {
          setEbookStatus(sub.status);
        }
      })
      .catch(() => { });
  }, [book, user]);

  if (!book) {
    return <div className="text-center py-20">Loading...</div>;
  }

  const isEbook = book.category === "ebook";
  const price = book.discount_price ?? book.price ?? 0;
  const hasDiscount = Boolean(
    book.discount_price && book.price && book.discount_price < book.price
  );

  const samplePdfFull = book.sample_pdf_url
    ? book.sample_pdf_url.startsWith("/")
      ? `${BACKEND_URL}${book.sample_pdf_url}`
      : book.sample_pdf_url
    : "";

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/book/${book.id}`
      : "";

  const alreadyInCart = items?.some(
    (item) => String((item as unknown as CartItem).book_id) === String(book.id)
  );

  return (
    <div className="bg-linear-to-b from-white to-brand-light/20">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12 grid md:grid-cols-2 gap-6 sm:gap-10">
        <Gallery
          cover={book.cover_image}
          images={book.gallery_images || []}
        />
        <div className="min-w-0">
          <div className="text-xs font-semibold text-brand-red uppercase">
            {book.category}
            {book.subject ? ` • ${book.subject}` : ""}
            {isEbook && (
              <span className="ml-2 bg-brand-royal/10 text-brand-royal px-2 py-0.5 rounded-full text-xs">
                📱 ই-বুক
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2">
            {lang === "en" && book.title_en ? book.title_en : book.title}
          </h1>

          <div className="text-brand-navy/65 mt-2">
            By{" "}
            <span className="font-semibold">
              {book.author || "Self Preparation"}
            </span>
          </div>

          <div className="mt-2 text-sm text-brand-navy/70">
            Stock: {stock > 0 ? `${stock} available` : "Out of stock"}
          </div>

          <div className="mt-4 sm:mt-6 flex items-end gap-3">
            <span className="text-3xl sm:text-4xl font-bold text-brand-royal">
              ৳{price}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-brand-navy/40 line-through">
                  ৳{book.price}
                </span>
                <span className="bg-brand-red/10 text-brand-red text-xs font-bold px-2 py-1 rounded-md">
                  {Math.round((1 - (book.discount_price! / book.price!)) * 100)}%
                  OFF
                </span>
              </>
            )}
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isEbook ? (
                ebookStatus === "active" ? (
                  <button
                    type="button"
                    onClick={() => router.push("/profile")}
                    className="btn-primary px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <BookOpen className="w-4 h-4 shrink-0" />
                    বই পড়ুন
                  </button>
                ) : ebookStatus === "pending" ? (
                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-xl px-4 py-2.5 text-yellow-700 text-sm font-semibold">
                    <Clock className="w-4 h-4 shrink-0" />
                    যাচাই হচ্ছে...
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (!user) {
                        router.push("/login");
                        return;
                      }
                      // setShowPayment(true);
                    }}
                    disabled={isOutOfStock}
                    className={`btn-primary px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <CreditCard className="w-4 h-4 shrink-0" />
                    {isOutOfStock
                      ? "Out of Stock"
                      : ebookStatus === "expired"
                        ? "পুনরায় সাবস্ক্রাইব করুন"
                        : "সাবস্ক্রাইব করুন"}
                  </button>
                )
              ) : (
                alreadyInCart ? (
                  <button
                    type="button"
                    onClick={() => router.push("/cart")}
                    className="btn-primary px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    Add to Cart
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      add(
                        {
                          ...book,
                          id: String(book.id),
                          category: book.category ?? "",
                          price: book.price ?? 0,
                        },
                        qty
                      )
                    }
                    disabled={isOutOfStock}
                    className={`btn-primary px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    {isOutOfStock ? "Out of Stock" : t("add_to_cart")}
                  </button>
                )
              )}

              {(book.sample_pdf_url || book.sample_pdf_text) && (
                <button
                  type="button"
                  onClick={() => setShowSample(true)}
                  className="btn-accent px-4 sm:px-6 py-2.5 sm:py-2.5 rounded-md flex items-center justify-center gap-2 text-sm sm:text-base"
                  data-testid="read-sample-btn"
                >
                  <BookOpen className="w-4 h-4 shrink-0" /> {t("read_sample")} →
                </button>
              )}

              <ShareButtons compact title={book.title} url={shareUrl} />
            </div>
          </div>

          {isEbook && !ebookStatus && (
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">
                📖 ই-বুক সাবস্ক্রিপশন কীভাবে কাজ করে?
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs text-blue-700">
                <li>আপনার পছন্দের প্ল্যান বেছে নিন</li>
                <li>bKash/Nagad এ পেমেন্ট করুন</li>
                <li>Transaction ID দিয়ে সাবমিট করুন</li>
                <li>অ্যাডমিন ভেরিফাই করলে ই-বুক পড়তে পারবেন</li>
              </ul>
            </div>
          )}

          {!isEbook && (
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 text-xs">
              <div className="p-2 sm:p-3 border border-gray-200 rounded-xl text-center">
                <Truck className="mx-auto mb-1 w-5 h-5 sm:w-4 sm:h-4" />
                ফাস্ট ডেলিভারি
              </div>
              <div className="p-2 sm:p-3 border border-gray-200 rounded-xl text-center">
                <ShieldCheck className="mx-auto mb-1 w-5 h-5 sm:w-4 sm:h-4" />
                ক্যাশ অন ডেলিভারি
              </div>
              <div className="p-2 sm:p-3 border border-gray-200 rounded-xl text-center">
                <RefreshCw className="mx-auto mb-1 w-5 h-5 sm:w-4 sm:h-4" />
                হোয়াইট প্রিন্ট
              </div>
            </div>
          )}

          <div className="mt-6 sm:mt-10">
            <Tabs defaultValue="description">
              <TabsList className="w-full sm:w-auto">
                <TabsTrigger value="description" className="flex-1 sm:flex-none">
                  {t("description")}
                </TabsTrigger>
                <TabsTrigger value="spec" className="flex-1 sm:flex-none">
                  {t("specification")}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4">
                <div
                  className="prose max-w-none prose-sm sm:prose-base wrap-break-word"
                  dangerouslySetInnerHTML={{
                    __html: book.description || "<p>বিবরণ পাওয়া যায়নি।</p>",
                  }}
                />
              </TabsContent>

              <TabsContent value="spec" className="mt-4">
                <div
                  className="prose max-w-none prose-sm sm:prose-base wrap-break-word"
                  dangerouslySetInnerHTML={{
                    __html: book.specification || "<p>স্পেসিফিকেশন পাওয়া যায়নি।</p>",
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-navy mb-4 sm:mb-6">
            সম্পর্কিত বই
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((b) => (
              <BookCard
                key={String(b.id)}
                book={{ ...b, id: String(b.id), stock: b.stock ?? 0 }}
              />
            ))}
          </div>
        </section>
      )}

      <Dialog open={showSample} onOpenChange={setShowSample}>
        <DialogContent className="max-w-3xl font-bn" data-testid="sample-dialog">
          <DialogHeader>
            <DialogTitle className="text-brand-navy text-2xl">
              📖 {t("read_sample")} • {book.title}
            </DialogTitle>
          </DialogHeader>
          {samplePdfFull ? (
            <div className="rounded-xl overflow-hidden border border-brand-light bg-white h-[65vh]">
              <iframe
                src={samplePdfFull}
                title="PDF Preview"
                className="w-full h-full"
              />
            </div>
          ) : (
            <div className="bg-linear-to-br from-brand-light/40 to-white rounded-xl p-6 max-h-[65vh] overflow-y-auto whitespace-pre-line text-brand-navy/85 leading-relaxed font-bn">
              {book.sample_pdf_text || "এই বইটির স্যাম্পল পাওয়া যায়নি।"}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!ebookReadUrl} onOpenChange={() => setEbookReadUrl(null)}>
        <DialogContent className="max-w-4xl font-bn">
          <DialogHeader>
            <DialogTitle className="text-brand-navy text-xl">
              📖 {book.title}
            </DialogTitle>
          </DialogHeader>
          <div className="rounded-xl overflow-hidden border border-brand-light bg-white h-[75vh]">
            <iframe
              src={ebookReadUrl || ""}
              title="E-Book"
              className="w-full h-full"
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* <EbookPaymentModal
        book={book}
        open={showPayment}
        onClose={() => setShowPayment(false)}
      /> */}
    </div>
  );
}