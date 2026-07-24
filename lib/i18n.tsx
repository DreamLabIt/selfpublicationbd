"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type TranslationKeys = typeof TR.bn;
type Language = "bn" | "en";

interface I18nContextType {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (key: keyof TranslationKeys) => string;
}

const TR = {
    bn: {
        nav_mcq: "MCQ বই",
        loading: "লোড হচ্ছে...",
        by: "লেখক",
        stock: "স্টক",
        available: "টি স্টকে আছে",
        ebook_tag: "ই-বুক",
        read_book: "বই পড়ুন",
        verifying: "যাচাই হচ্ছে...",
        fast_delivery: "ফাস্ট ডেলিভারি",
        cash_on_delivery: "ক্যাশ অন ডেলিভারি",
        white_print: "হোয়াইট প্রিন্ট",
        related_books: "সম্পর্কিত বই",
        sample_not_found: "এই বইটির স্যাম্পল পাওয়া যায়নি।",
        pay_read_ebook: "সম্পূর্ণ ই-বুক পড়তে পেমেন্ট করুন",
        order_full_book: "সম্পূর্ণ বইটি অর্ডার করুন",
        resubscribe: "পুনরায় সাবস্ক্রাইব করুন",
        subscribe_now: "সাবস্ক্রাইব করুন",
        out_of_stock: "স্টক নেই",
        view_cart: "কার্ট দেখুন",
        site_name: "সেল্ফ প্রিপারেশন",
        brand: "সেল্ফ প্রিপারেশন",
        tagline: "চাকরির প্রস্তুতির সবচেয়ে আধুনিক বইঘর",
        nav_home: "হোম",
        nav_written: "লিখিত বই",
        nav_jobsol: "জব সলিউশন",
        nav_ebook: "ই-বুক",
        nav_offline: "অফলাইন স্টোর",
        nav_blog: "ব্লগ",
        nav_winner: "বিজয়ীরা",
        nav_circular: "জব সার্কুলার",
        track_order: "অর্ডার ট্র্যাক করুন",
        admin: "Admin",
        cart: "কার্ট",
        checkout: "চেকআউট",
        add_to_cart: "কার্টে যোগ করুন",
        buy_now: "পড়ে দেখুন",
        read_sample: "কিছুটা পড়ুন",
        description: "বিবরণ",
        specification: "স্পেসিফিকেশন",
        featured: "লিখিত বই",
        winners_title: "আমাদের সফল শিক্ষার্থীরা",
        winners_sub: "যারা আমাদের বই পড়ে চাকরিতে সফল হয়েছেন",
        blog_title: "ব্লগ ও পরামর্শ",
        circular_title: "নিয়োগ বিজ্ঞপ্তি",
        apply_now: "এখনই আবেদন করুন",
        deadline: "শেষ তারিখ",
        vacancy: "পদ সংখ্যা",
        salary: "বেতন",
        location: "স্থান",
        newsletter_title: "নতুন বইয়ের নোটিফিকেশন পেতে সাবস্ক্রাইব করুন",
        newsletter_sub: "নতুন বই, অফার ও জব সার্কুলার সবার আগে আপনার ইমেইলে",
        subscribe: "সাবস্ক্রাইব",
        order_summary: "অর্ডার সারসংক্ষেপ",
        delivery_address: "ডেলিভারি ঠিকানা",
        select_division: "বিভাগ নির্বাচন করুন",
        select_zilla: "জেলা নির্বাচন করুন",
        full_name: "পূর্ণ নাম",
        phone: "ফোন নম্বর",
        email: "ইমেইল",
        address: "বিস্তারিত ঠিকানা",
        order_note: "অর্ডার সংক্রান্ত মন্তব্য (ঐচ্ছিক)",
        payment_method: "পেমেন্ট মাধ্যম",
        payment_cod: "ক্যাশ অন ডেলিভারি",
        payment_bank: "ব্যাংক ট্রান্সফার",
        confirm_order: "অর্ডার নিশ্চিত করুন",
        subtotal: "সাব টোটাল",
        delivery_fee: "ডেলিভারি ফি",
        total: "মোট",
        bank_txn: "ব্যাংক রেফারেন্স / লেনদেন আইডি",
        track_phone: "অর্ডার করার ফোন নম্বর",
        track_number: "অর্ডার নাম্বার (যেমন: SP251010ABCDEF)",
        track_btn: "ট্র্যাক করুন",
        empty_cart: "আপনার কার্ট খালি",
        explore_books: "বই দেখুন",
        all: "সব",
        select_library: "লাইব্রেরি (ঐচ্ছিক)",
        reviews: "রিভিউ",
        write_review: "রিভিউ লিখুন",
        rating: "রেটিং",
        comment: "মন্তব্য",
        submit_review: "জমা দিন",
        View_full_cart: "সম্পূর্ণ কার্ট দেখুন",
        already_in_cart: "এই বইটি ইতোমধ্যে কার্টে আছে",
        added_to_cart: "কার্টে যোগ করা হয়েছে",
    },
    en: {
        nav_mcq: "MCQ Books",
        site_name: "Self Preparation",
        loading: "Loading...",
        by: "By",
        stock: "Stock",
        available: "available",
        ebook_tag: "E-Book",
        read_book: "Read Book",
        verifying: "Verifying...",
        fast_delivery: "Fast Delivery",
        cash_on_delivery: "Cash on Delivery",
        white_print: "White Print",
        related_books: "Related Books",
        sample_not_found: "Sample not available for this book.",
        pay_read_ebook: "Pay to Read Full E-Book",
        order_full_book: "Order the Full Book",
        resubscribe: "Resubscribe",
        subscribe_now: "Subscribe",
        out_of_stock: "Out of Stock",
        view_cart: "View Cart",
        View_full_cart: "View full cart",
        already_in_cart: "This book is already in cart",
        added_to_cart: "Added to cart",
        brand: "Self Preparation",
        tagline: "The most modern bookhouse for job preparation",
        nav_home: "Home",
        nav_written: "Written Books",
        nav_jobsol: "Job Solution",
        nav_ebook: "E-Books",
        nav_offline: "Offline Store",
        nav_blog: "Blog",
        nav_winner: "Winners",
        nav_circular: "Job Circular",
        track_order: "Track Order",
        admin: "Admin",
        cart: "Cart",
        checkout: "Checkout",
        add_to_cart: "Add to Cart",
        buy_now: "Buy Now",
        read_sample: "Read Sample",
        description: "Description",
        specification: "Specification",
        featured: "Written Books",
        winners_title: "Our Successful Achievers",
        winners_sub: "Those who succeeded by reading our books",
        blog_title: "Blog & Insights",
        circular_title: "Job Circulars",
        apply_now: "Apply Now",
        deadline: "Deadline",
        vacancy: "Vacancy",
        salary: "Salary",
        location: "Location",
        newsletter_title: "Subscribe for new book notifications",
        newsletter_sub: "New books, offers & job circulars right in your inbox",
        subscribe: "Subscribe",
        order_summary: "Order Summary",
        delivery_address: "Delivery Address",
        select_division: "Select Division",
        select_zilla: "Select District",
        full_name: "Full Name",
        phone: "Phone",
        email: "Email",
        address: "Detailed Address",
        order_note: "Order Note (optional)",
        payment_method: "Payment Method",
        payment_cod: "Cash on Delivery",
        payment_bank: "Bank Transfer",
        confirm_order: "Confirm Order",
        subtotal: "Subtotal",
        delivery_fee: "Delivery Fee",
        total: "Total",
        bank_txn: "Bank Reference / Txn ID",
        track_phone: "Order Phone Number",
        track_number: "Order Number (e.g. SP251010ABCDEF)",
        track_btn: "Track",
        empty_cart: "Your cart is empty",
        explore_books: "Explore books",
        all: "All",
        select_library: "Library (optional)",
        reviews: "Reviews",
        write_review: "Write a review",
        rating: "Rating",
        comment: "Comment",
        submit_review: "Submit",
    },
};

const I18nCtx = createContext<I18nContextType | null>(null);

interface I18nProviderProps {
    children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
    const [lang, setLangState] = useState<Language>(() => "en");
    const setLang = (newLang: Language) => {
        setLangState(newLang);
    };

    useEffect(() => {
        document.documentElement.lang = lang;
    }, [lang]);

    const t = (k: keyof TranslationKeys): string => {
        return TR[lang]?.[k] ?? TR.bn[k] ?? k;
    };

    return (
        <I18nCtx.Provider value={{ lang, setLang, t }}>
            {children}
        </I18nCtx.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nCtx);
    if (!context) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}