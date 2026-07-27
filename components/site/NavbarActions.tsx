"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, MouseEvent, ComponentType, ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import CartDrawer from "./CartDrawer";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import MenuIcon from "../icons/MenuIcon";

type SafeSheetProps = {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    children?: ReactNode;
};

type SafeSheetContentProps = {
    side?: "top" | "right" | "bottom" | "left";
    className?: string;
    children?: ReactNode;
};

const SafeSheet = Sheet as ComponentType<SafeSheetProps>;
const SafeSheetContent = SheetContent as ComponentType<SafeSheetContentProps>;

interface NavItem {
    to: string;
    label: string;
}

interface NavbarActionsProps {
    navItems: readonly NavItem[];
}

export default function NavbarActions({ navItems }: NavbarActionsProps) {
    const pathname = usePathname();
    const { count } = useCart();
    const { hasToken, user, loading, logout } = useAuth();
    const [open, setOpen] = useState<boolean>(false);
    const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        if (loggingOut) return;
        setLoggingOut(true);
        setUserMenuOpen(false);
        setOpen(false);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoggingOut(false);
        }
    };

    const isLinkActive = (to: string): boolean => {
        if (to === "/") return pathname === "/";
        return pathname.startsWith(to);
    };

    return (
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 w-full justify-end">
            <ul className="hidden lg:flex items-center gap-1 xl:gap-2 overflow-x-auto">
                {navItems.map((it) => {
                    const active = isLinkActive(it.to);
                    return (
                        <li key={it.to}>
                            <Link
                                href={it.to}
                                className={`inline-block px-3 xl:px-4 py-2.5 text-xs xl:text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${active
                                    ? "text-brand-royal border-[#D61F1F]"
                                    : "text-brand-navy/80 border-transparent hover:text-brand-royal hover:border-brand-royal/40"
                                    }`}
                            >
                                {it.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>

            <div className="flex items-center gap-1.5 sm:gap-2">
                {hasToken && loading && !user && (
                    <div className="hidden sm:block w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-200 animate-pulse border border-brand-light" />
                )}

                {hasToken && user && (
                    <div ref={dropdownRef} className="relative hidden sm:block">
                        <div className="rounded-xl border border-brand-light hover:bg-brand-light/40 text-brand-navy transition-colors bg-transparent">
                            <Button
                                onClick={() => setUserMenuOpen((v) => !v)}
                                className="flex items-center gap-2 rounded-xl p-1.5 sm:px-3 sm:py-2 h-auto"
                            >
                                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-[#0B1E8A] text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                                    {user.name?.charAt(0) || "U"}
                                </div>
                                <span className="hidden md:inline-block text-sm font-semibold text-brand-navy max-w-22.5 truncate">
                                    {user.name?.split(" ")[0]}
                                </span>
                            </Button>
                        </div>
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
                                    type="button"
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
                )}

                {!hasToken && (
                    <Link
                        href="/login"
                        className="hidden sm:inline-flex p-2 rounded-lg border border-brand-light hover:bg-brand-light/40 text-brand-navy transition-colors"
                    >
                        <UserIcon className="w-5 h-5" />
                    </Link>
                )}

                <div className="rounded-lg border border-brand-light hover:bg-brand-light/40 text-brand-navy transition-colors">
                    <CartDrawer>
                        <button className="relative p-2 flex items-center justify-center">
                            <ShoppingCartIcon className="w-5 h-5" />
                            {count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[#D61F1F] text-white text-[10px] font-bold rounded-full min-w-5 h-5 px-1 flex items-center justify-center border-2 border-white shadow-pop">
                                    {count}
                                </span>
                            )}
                        </button>
                    </CartDrawer>
                </div>

                <div className="lg:hidden">
                    <SafeSheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-brand-navy h-9 w-9 p-0">
                                <MenuIcon className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>

                        <SafeSheetContent side="right" className="w-72 font-bn flex flex-col justify-between h-full p-6">
                            <div className="flex flex-col gap-1 mt-6">
                                {hasToken && user && (
                                    <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-brand-light flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-[#0B1E8A] text-white flex items-center justify-center text-sm font-bold uppercase shrink-0">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-brand-navy truncate">
                                                {user.name}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {navItems.map((it) => {
                                    const active = isLinkActive(it.to);
                                    return (
                                        <Link
                                            key={it.to}
                                            href={it.to}
                                            onClick={() => setOpen(false)}
                                            className={`px-3 py-2.5 rounded-lg text-sm transition-colors ${active
                                                ? "bg-brand-light text-brand-royal font-semibold"
                                                : "text-brand-navy hover:bg-brand-light/40"
                                                }`}
                                        >
                                            {it.label}
                                        </Link>
                                    );
                                })}

                                {hasToken && (
                                    <Link
                                        href="/profile"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-brand-navy hover:bg-brand-light/40 transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                )}
                            </div>

                            <div className="pt-4 border-t border-brand-light">
                                {hasToken ? (
                                    <button
                                        type="button"
                                        onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                            e.stopPropagation();
                                            handleLogout();
                                        }}
                                        disabled={loggingOut}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-red-50 text-[#D61F1F] hover:bg-red-100 text-sm font-semibold transition-colors disabled:opacity-50"
                                    >
                                        <LogoutIcon className="w-4 h-4" />
                                        {loggingOut ? "Logging out…" : "Logout"}
                                    </button>
                                ) : (
                                    <Link
                                        href="/login"
                                        onClick={() => setOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-brand-royal text-white text-sm font-semibold hover:bg-brand-navy transition-colors"
                                    >
                                        <UserIcon className="w-4 h-4" />
                                        Login / Register
                                    </Link>
                                )}
                            </div>
                        </SafeSheetContent>
                    </SafeSheet>
                </div>
            </div>
        </div>
    );
}
