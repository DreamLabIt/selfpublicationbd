"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {

    Mail,
    Phone,
    MapPin,
    Truck,
    ShieldCheck,
    RefreshCw,
    LucideIcon
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

import { BACKEND_URL, API_KEY } from "@/utils/api";
import WhatsappIcon from "../icons/WhatsappIcon";

interface TrustItem {
    icon: LucideIcon | string;
    title: string;
    sub: string;
}

const trust: TrustItem[] = [
    { icon: Truck, title: "ফাস্ট ডেলিভারি", sub: "সারা দেশে ২৪-৭২ ঘণ্টায়" },
    { icon: ShieldCheck, title: "ক্যাশ অন ডেলিভারি", sub: "বই হাতে পেয়ে টাকা" },
    { icon: RefreshCw, title: "অরজিনাল প্রিন্ট", sub: "সাদা কাগজে ছাপা" },
    { icon: "/binding.png", title: "স্টং বাইন্ডিং", sub: "মজবুত সেলাই বাঁধাই" },
];

export default function Footer() {
    const { t, lang } = useI18n();
    const [email, setEmail] = useState<string>("");
    const [busy, setBusy] = useState<boolean>(false);

    const subscribe = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setBusy(true);
        try {
            const response = await fetch(`${BACKEND_URL}/newsletter/subscribe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": API_KEY,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error(lang === "bn" ? "কিছু একটা ভুল হয়েছে!" : "Something went wrong!");
            }

            toast.success(lang === "bn" ? "সাবস্ক্রিপশন সফল!" : "Subscribed!");
            setEmail("");
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : (lang === "bn" ? "কিছু একটা ভুল হয়েছে!" : "Something went wrong!");

            toast.error(errorMessage);
        } finally {
            setBusy(false);
        }
    };

    return (
        <footer>
            <div className="bg-white border-y border-brand-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
                    {trust.map((tr, i) => {
                        const Icon = tr.icon;
                        return (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-brand-light/50 grid place-items-center text-brand-royal shrink-0">
                                    {typeof Icon === "string" ? (
                                        <Image
                                            src={Icon}
                                            alt={tr.title}
                                            width={24}
                                            height={24}
                                            className="w-6 h-6 object-contain"
                                        />
                                    ) : (
                                        <Icon className="w-6 h-6" />
                                    )}
                                </div>
                                <div>
                                    <div className="font-semibold text-brand-navy text-sm">{tr.title}</div>
                                    <div className="text-xs text-brand-navy/55">{tr.sub}</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-hero-grad relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 gap-8 relative">
                    <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-brand-navy">
                            {t("newsletter_title")}
                        </h3>
                        <p className="mt-2 text-brand-navy/70">
                            {t("newsletter_sub")}
                        </p>
                    </div>
                    <form
                        onSubmit={subscribe}
                        className="flex flex-col md:flex-row flex-wrap md:items-center gap-3 self-end"
                        data-testid="newsletter-form"
                    >
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            required
                            placeholder={lang === "bn" ? "আপনার ইমেইল লিখুন" : "Enter your email"}
                            className="flex-1 px-5 py-3 rounded-md border border-brand-light bg-white/90 text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-royal/30"
                            data-testid="newsletter-email-input"
                        />
                        <button
                            disabled={busy}
                            type="submit"
                            className="btn-primary px-6 py-3 rounded-md font-semibold disabled:opacity-60"
                            data-testid="newsletter-submit"
                        >
                            {t("subscribe")}
                        </button>
                    </form>
                </div>
            </div>

            <div className="bg-brand-navy text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-2 lg:grid-cols-5 gap-10">

                    <div className="flex flex-col flex-wrap lg:col-span-2">
                        <Link className="flex items-center gap-2 mb-4 w-fit" href="/">
                            <Image
                                src="/self-publication-footer-logo.svg"
                                alt="self-publication"
                                width={200}
                                height={38}
                            />
                        </Link>
                        <p className="text-sm text-white/55 mt-3 leading-relaxed">
                            সরকারি চাকরি (১১–২০তম গ্রেড) প্রস্তুতির বিশ্বস্ত প্রকাশনী ও সেরা সমাধান
                        </p>
                        <div className="flex gap-3 mt-5">
                            <Link
                                href="https://www.facebook.com/groups/2481158872195147"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition"
                            >
                                <WhatsappIcon className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://youtube.com/@selfpreparation3609?si=A4VKdOXh4ntZLrfE"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition"
                            >
                                <WhatsappIcon className="w-4 h-4" />
                            </Link>
                            <Link
                                href="https://whatsapp.com/channel/0029VaIvJe05q08hj44HwL34"
                                target="_blank"
                                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-red transition"
                            >
                                <WhatsappIcon className="text-lg w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">
                            {lang === "bn" ? "দরকারী মেনু" : "Useful Menu"}
                        </h4>
                        <ul className="space-y-2 text-sm text-white/75">
                            <li><Link href="/books/written" className="hover:text-white">{t("nav_written")}</Link></li>
                            <li><Link href="/books/mcq" className="hover:text-white">{t("nav_mcq")}</Link></li>
                            <li><Link href="/books/ebook" className="hover:text-white">{t("nav_ebook")}</Link></li>
                            <li><Link href="/offline-store" className="hover:text-white">{t("nav_offline")}</Link></li>
                            <li><Link href="/blog" className="hover:text-white">{t("nav_blog")}</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">
                            {lang === "bn" ? "গুরুত্বপূর্ণ লিঙ্ক" : "Important Link"}
                        </h4>
                        <ul className="space-y-2 text-sm text-white/75">
                            <li><Link href="/track" className="hover:text-white">{t("track_order")}</Link></li>
                            <li><Link href="/job-circulars" className="hover:text-white">{t("nav_circular")}</Link></li>
                            <li><Link href="/winners" className="hover:text-white">{t("nav_winner")}</Link></li>
                            <li><Link href="http://selftestbd.com/" target="_blank" className="hover:text-white">Self Test</Link></li>
                            <li><Link href="https://selftyping.com/" target="_blank" className="hover:text-white">Self Typing</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">
                            {lang === "bn" ? "যোগাযোগ" : "Contact"}
                        </h4>
                        <ul className="space-y-2.5 text-sm text-white/75">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                                Dhaka, Bangladesh
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                +8801558997668
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                info@selfpublicationbd.com
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pb-20 lg:pb-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-row flex-wrap justify-between items-center gap-3 text-xs text-white/55">
                        <div>
                            © {new Date().getFullYear()} Self Preparation • All rights reserved. Development by{" "}
                            <Link href="https://dreamlabit.com" target="_blank">
                                <strong>Dreamlabit</strong>
                            </Link>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="opacity-60">পেমেন্ট:</span>
                            <span className="px-2 py-1 rounded bg-white/10 font-semibold">COD</span>
                            <span className="px-2 py-1 rounded bg-white/10 font-semibold">Bank</span>
                            <span className="px-2 py-1 rounded bg-white/10 font-semibold">bKash (soon)</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}