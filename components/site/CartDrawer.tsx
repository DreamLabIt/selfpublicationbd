"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from "@/components/ui/sheet";
import { Trash2, Plus, Minus, ShoppingCart, ShoppingBag } from "lucide-react";

interface CartItem {
    book_id: string;
    cover_image: string;
    title: string;
    price: number;
    quantity: number;
}

// কার্ট হুকের রিটার্ন টাইপ
interface UseCartReturn {
    items: CartItem[];
    remove: (id: string) => void;
    update: (id: string, quantity: number) => void;
    subtotal: number;
    count: number;
}

interface CartDrawerProps {
    children: React.ReactNode;
}

export default function CartDrawer({ children }: CartDrawerProps) {
    const { items, remove, update, subtotal, count } = useCart() as UseCartReturn;
    const { t, lang } = useI18n();
    const router = useRouter();

    // ১. স্লাইডার ওপেন/ক্লোজ স্টেট ডিফাইন করা হলো
    const [open, setOpen] = useState<boolean>(false);

    const handleNavigation = (path: string) => {
        setOpen(false);
        router.push(path);
    };

    return (
        // ২. 'side' প্রপটি এখন মূল <Sheet>-এ পাস করা হচ্ছে এবং স্টেটগুলো সঠিকভাবে ম্যাপড
        <Sheet isOpen={open} onClose={() => setOpen(false)} side="right">
            <SheetTrigger asChild>{children}</SheetTrigger>

            {/* ৩. <SheetContent>-থেকে 'side' সরিয়ে শুধু স্টাইলিং প্রপস রাখা হয়েছে */}
            <SheetContent className="w-full sm:max-w-md p-0 font-bn flex flex-col" data-testid="cart-drawer">
                <SheetHeader className="p-5 border-b border-brand-light bg-brand-light/30">
                    <SheetTitle className="text-brand-navy flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" /> {t("cart")} ({count})
                    </SheetTitle>
                    <SheetDescription className="sr-only">Your shopping cart</SheetDescription>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 grid place-items-center text-center p-6">
                        <div>
                            <ShoppingCart className="w-12 h-12 mx-auto text-brand-royal/30" />
                            <p className="mt-3 text-brand-navy/60">{t("empty_cart")}</p>
                            <button
                                onClick={() => handleNavigation("/books/written")}
                                className="btn-primary mt-5 px-5 py-2.5 rounded-lg font-medium"
                                data-testid="drawer-explore"
                            >
                                {t("explore_books")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-y-auto p-5 space-y-3">
                            {items.map((it) => (
                                <div key={it.book_id} className="flex gap-3 p-2.5 bg-white border border-brand-light rounded-xl">
                                    <div className="w-14 h-16 relative shrink-0 overflow-hidden rounded-md">
                                        <Image
                                            src={it.cover_image}
                                            alt={it.title}
                                            fill
                                            sizes="56px"
                                            className="object-cover"
                                            priority={false}
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-brand-navy line-clamp-2 leading-tight">{it.title}</div>
                                        <div className="text-xs text-brand-royal mt-1 font-semibold">৳{it.price}</div>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center border border-brand-light rounded-md">
                                                <button
                                                    onClick={() => {
                                                        if (it.quantity > 1) {
                                                            update(it.book_id, it.quantity - 1);
                                                        } else {
                                                            remove(it.book_id);
                                                        }
                                                    }}
                                                    className="px-2 py-0.5 hover:bg-brand-light/40"
                                                    data-testid={`drawer-minus-${it.book_id}`}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="px-2 text-xs">{it.quantity}</span>
                                                <button
                                                    onClick={() => update(it.book_id, it.quantity + 1)}
                                                    className="px-2 py-0.5 hover:bg-brand-light/40"
                                                    data-testid={`drawer-plus-${it.book_id}`}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => remove(it.book_id)}
                                                className="text-brand-red hover:bg-brand-red/10 p-1 rounded"
                                                data-testid={`drawer-remove-${it.book_id}`}
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-brand-light p-5 bg-white space-y-3">
                            <div className="flex justify-between font-bold text-brand-royal">
                                <span>{t("subtotal")}</span>
                                <span>৳{subtotal}</span>
                            </div>
                            <div className="text-[11px] text-brand-navy/50 -mt-2">
                                {lang === "bn" ? "ডেলিভারি ফি চেকআউটে যোগ হবে" : "Delivery fee added at checkout"}
                            </div>

                            <button
                                onClick={() => handleNavigation("/checkout")}
                                className="btn-primary w-full py-3 rounded-xl font-semibold text-center block"
                                data-testid="drawer-checkout"
                            >
                                {t("checkout")} →
                            </button>

                            <Link
                                href="/cart"
                                onClick={() => setOpen(false)}
                                className="w-full py-2 text-sm text-brand-royal hover:text-brand-red block text-center"
                                data-testid="drawer-view-cart"
                            >
                                {t("View_full_cart")}
                            </Link>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}