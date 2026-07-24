import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import NavbarActions from "./NavbarActions";
import WhatsappIcon from "../icons/WhatsappIcon";
import PackageIcon from "../icons/PackageIcon";

const navItems = [
    { to: "/", label: "Home" },
    { to: "/books/written", label: "Written Books" },
    { to: "/books/mcq", label: "MCQ Books" },
    { to: "/books/ebook", label: "eBooks" },
    { to: "/blog", label: "Blog" },
    { to: "/winners", label: "Winners" },
    { to: "/offline-store", label: "Offline Store" },
] as const;

export default async function Navbar() {
    const headerList = await headers();
    const pathname = headerList.get("x-pathname") || "/";

    return (
        <>
            <div className="bg-[#08145A] text-white text-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/80 hover:text-white">
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
                            className="inline-flex items-center gap-1"
                        >
                            <PackageIcon className="w-3.5 h-3.5" />
                            Track Order
                        </Link>
                    </div>
                </div>
            </div>

            <div className="sticky top-0 z-50 bg-white border-b border-brand-light transition-all duration-300">
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
                            const active = it.to === "/" ? pathname === "/" : pathname.startsWith(it.to);
                            return (
                                <li key={it.to}>
                                    <Link
                                        href={it.to}
                                        className={`inline-block px-4 py-3 text-sm font-medium transition-colors border-b-2 ${active
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

                    <NavbarActions
                        navItems={navItems}
                        pathname={pathname}
                    />
                </div>
            </div>
        </>
    );
}
