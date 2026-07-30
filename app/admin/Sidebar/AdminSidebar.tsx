'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CircleDollarSign,
  BookOpen,
  Tags,
  ShoppingBag,
  Briefcase,
  Trophy,
  Newspaper,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Library,
  Menu,
  LucideIcon,
  Eye,
} from "lucide-react";

interface NavLinkItem {
  to: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
}

const links: NavLinkItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/hero-slider", label: "Hero Slider", icon: BookOpen },
  { to: "/admin/books", label: "Books", icon: BookOpen },
  { to: "/admin/categories", label: "Categories", icon: Tags },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { to: "/admin/visitor", label: "Visitors", icon: Eye },
  { to: "/admin/payments", label: "Payments", icon: CircleDollarSign },
  { to: "/admin/libraries", label: "Libraries", icon: Library },
  { to: "/admin/job-circulars", label: "Job Circulars", icon: Briefcase },
  { to: "/admin/winners", label: "Winners", icon: Trophy },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/newsletter", label: "Newsletter", icon: Mail },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  onLogout: () => Promise<void>;
  userDisplayName: string;
}

export default function AdminSidebar({ onLogout, userDisplayName }: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`admin-side w-64 shrink-0 flex flex-col fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:static md:flex ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          }`}
      >
        <div className="p-5 flex items-center gap-2 border-b border-white/10">
          <div className="w-9 h-9 rounded-lg bg-white text-brand-navy grid place-items-center font-bold">
            SP
          </div>
          <div className="text-sm font-bold text-white">Self Preparation</div>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
          {links.map((l) => {
            const Icon = l.icon;
            const isActive = l.exact
              ? pathname === l.to
              : pathname.startsWith(l.to);

            return (
              <Link
                key={l.to}
                href={l.to}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition ${isActive
                  ? "bg-white/15 border-l-4 border-brand-red font-semibold text-white"
                  : "text-white/75 hover:text-white hover:bg-white/10"
                  }`}
                data-testid={`admin-nav-${l.label.toLowerCase().replace(" ", "-")}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{l.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/10 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 text-xs text-white/65 hover:text-white px-3 py-2"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Storefront
          </Link>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 text-sm text-white/85 hover:text-white px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer"
            data-testid="admin-logout"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <header className="bg-white border-b border-brand-light px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 md:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-brand-navy p-1 -ml-1 cursor-pointer"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs text-brand-navy/55">Welcome back,</div>
            <div className="font-bold text-brand-navy">{userDisplayName}</div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="text-sm text-brand-red font-medium cursor-pointer"
        >
          Logout
        </button>
      </header>
    </>
  );
}