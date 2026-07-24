"use client";

import Link from "next/link";
import { useEffect, useState, MouseEvent, ComponentType, ReactNode } from "react";
import { useCart } from "@/lib/cart";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import CartDrawer from "./CartDrawer";
import { Button } from "../ui/button";
import UserIcon from "../icons/UserIcon";
import LogoutIcon from "../icons/LogoutIcon";
import ShoppingCartIcon from "../icons/ShoppingCartIcon";
import MenuIcon from "../icons/MenuIcon";
import { getUserProfile, logoutAction } from "@/app/actions/auth";

export type User = {
    name?: string;
    email?: string;
};

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
    pathname: string;
}

export default function NavbarActions({ navItems, pathname }: NavbarActionsProps) {
    const { count } = useCart();
    const [user, setUser] = useState<User | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
    const [loggingOut, setLoggingOut] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const res = await getUserProfile();
                if (res && typeof res === "object") {
                    const userData = ("data" in res && res.data) ? (res.data as User) : (res as User);
                    setUser(userData);
                }
            } catch {
                setUser(null);
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        if (!userMenuOpen) return;
        const handler = () => setUserMenuOpen(false);
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
        setOpen(false);
        try {
            await logoutAction();
            setUser(null);
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
            ) : (
                <Link
                    href="/login"
                    className="p-2 rounded-lg border border-brand-light hover:bg-brand-light/40 text-brand-navy"
                >
                    <UserIcon className="w-5 h-5" />
                </Link>
            )}

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
                                        {it.label}
                                    </Link>
                                );
                            })}

                            {user && (
                                <button
                                    type="button"
                                    onClick={(e: MouseEvent<HTMLButtonElement>) => {
                                        e.stopPropagation();
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
    );
}