"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, MouseEvent, ComponentType } from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";
import { Button } from "../ui/button";
import WhatsappIcon from "../icons/WhatsappIcon";
import PackageIcon from "../icons/PackageIcon";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import MenuIcon from "../icons/MenuIcon";
import useAuth from "@/hooks/useAuth";

const navItems = [
    { to: "/", key: "nav_home" },
    { to: "/books/written", key: "nav_written" },
    { to: "/books/mcq", key: "nav_mcq" },
    { to: "/books/ebook", key: "nav_ebook" },
    { to: "/blog", key: "nav_blog" },
    { to: "/winners", key: "nav_winner" },
    { to: "/offline-store", key: "nav_offline" },
] as const;


type SafeSheetProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: React.ReactNode;
};

type SafeSheetContentProps = {
    side?: "top" | "right" | "bottom" | "left";
    className?: string;
    children?: React.ReactNode;
};

const SafeSheet = Sheet as ComponentType<SafeSheetProps>;
const SafeSheetContent = SheetContent as ComponentType<SafeSheetContentProps>;

export default function Navbar() {
    const { t } = useI18n();
    const { count } = useCart();
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [open, setOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 80);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = () => {
            setUserMenuOpen(false);
        };
        const timer = setTimeout(() => {
            document.addEventListener("click", handler);
        }, 0);
        return () => {
            clearTimeout(timer);
            document.removeEventListener("click", handler);
        };
    }, [userMenuOpen]);

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        setUserMenuOpen(false);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    const isLinkActive = (to: string): boolean => {
        if (to === "/") {
            return pathname === "/";
        }
        return pathname.startsWith(to);
    };

    return (
        <>
            <div className="bg-[#08145A] text-white text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2  text-white/80 hover:text-white">
                        <Link
                            href="https://wa.me/8801558997668"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2"
                        >
                            <WhatsappIcon className="w-4.5 h-4.5" />

                            <span>+8801558997668</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3 hover:text-[#AFC4D6]">
                        <Link
                            href="/track"
                            className=" inline-flex items-center gap-1"
                        >
                            <PackageIcon className="w-3.5 h-3.5" />
                            {t("track_order")}
                        </Link>
                    </div>
                </div>
            </div>

            <div
                className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md backdrop-blur bg-white/95" : "bg-white"}`}
            >
                <div className="border-b border-brand-light">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between w-full gap-4">
                        <Link href="/" className="flex items-center gap-2 group shrink-0">
                            <Image
                                src="/logo.png"
                                alt="logo"
                                width={225}
                                height={38}
                                priority
                            />
                        </Link>

                        <ul className="hidden lg:flex items-center gap-1 overflow-x-auto">
                            {navItems.map((it) => {
                                const active = isLinkActive(it.to);
                                return (
                                    <li key={it.to}>
                                        <Link
                                            href={it.to}
                                            className={`inline-block px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active
                                                ? "text-brand-royal border-[#D61F1F]"
                                                : "text-brand-navy/80 border-transparent hover:text-brand-royal hover:border-brand-royal/40"
                                                }`}
                                        >
                                            {t(it.key)}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        <div className="flex items-center gap-2">
                            {user ? (
                                <div
                                    className="relative"
                                    onClick={(e: MouseEvent) => e.stopPropagation()}
                                >
                                    <Button
                                        onClick={() => setUserMenuOpen((v) => !v)}
                                        className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-brand-light hover:bg-brand-light/40 text-brand-navy transition-colors bg-transparent"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-[#0B1E8A] text-white flex items-center justify-center text-xs font-bold uppercase">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                        <span className="text-sm font-semibold text-brand-navy max-w-22.5 truncate">
                                            {user.name?.split(" ")[0]}
                                        </span>
                                    </Button>

                                    {userMenuOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-brand-light py-1.5 z-50">
                                            <div className="px-4 py-2 border-b border-brand-light mb-1">
                                                <p className="text-xs font-bold text-brand-navy truncate">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-400 truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                href="/profile"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-brand-navy hover:bg-brand-light/50 transition-colors"
                                            >
                                                <UserIcon className="w-4 h-4" />
                                                My Profile
                                            </Link>
                                            <button
                                                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    handleLogout();
                                                }}
                                                disabled={loggingOut}
                                                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-[#D61F1F] hover:bg-red-50 transition-colors disabled:opacity-50"
                                            >
                                                <LogoutIcon className="w-4 h-4" />
                                                {loggingOut ? "Logging out…" : "Logout"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    href="/login"
                                    className="p-2 rounded-lg border border-brand-light hover:bg-brand-light/40 text-brand-navy"
                                >
                                    <UserIcon className="w-5 h-5" />
                                </Link>
                            )}

                            {/* Cart Drawer */}
                            <CartDrawer>
                                <button className="relative p-2 rounded-lg border border-brand-light hover:bg-brand-light/40 text-brand-navy">
                                    <ShoppingCartIcon className="w-5 h-5" />
                                    {count > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 bg-[#D61F1F] text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-white shadow-pop">
                                            {count}
                                        </span>
                                    )}
                                </button>
                            </CartDrawer>

                            <div className="lg:hidden">
                                <SafeSheet open={open} onOpenChange={setOpen}>
                                    <SheetTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-brand-navy">
                                            <MenuIcon className="w-6 h-6" />
                                        </Button>
                                    </SheetTrigger>

                                    <SafeSheetContent side="right" className="w-72 font-bn">
                                        <div className="flex flex-col gap-1 mt-8">
                                            {navItems.map((it) => {
                                                const active = isLinkActive(it.to);
                                                return (
                                                    <Link
                                                        key={it.to}
                                                        href={it.to}
                                                        onClick={() => setOpen(false)}
                                                        className={`px-3 py-2 rounded-lg transition-colors ${active
                                                            ? "bg-brand-light text-brand-royal font-semibold"
                                                            : "text-brand-navy hover:bg-brand-light/40"
                                                            }`}
                                                    >
                                                        {t(it.key)}
                                                    </Link>
                                                );
                                            })}

                                            {/* Mobile Log out button */}
                                            {user && (
                                                <button
                                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                                        e.stopPropagation();
                                                        setOpen(false);
                                                        handleLogout();
                                                    }}
                                                    disabled={loggingOut}
                                                    className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg text-[#D61F1F] hover:bg-red-50 text-sm font-medium disabled:opacity-50"
                                                >
                                                    <LogoutIcon className="w-4 h-4" />
                                                    {loggingOut ? "Logging out…" : "Logout"}
                                                </button>
                                            )}
                                        </div>
                                    </SafeSheetContent>
                                </SafeSheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}