'use client';

import React, { useState } from "react";
import { User, Lock, Trash2, BookOpen, LucideIcon } from "lucide-react";
import { Subscription } from "@/app/actions/profile";
import { InfoTab } from "./InfoTab";
import { EbooksTab } from "./EbooksTab";
import { PasswordTab } from "./PasswordTab";
import { DangerTab } from "./DangerTab";
import { UserType } from "@/types";

interface ProfileClientProps {
  user: UserType;
  subscriptions: Subscription[];
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}
const TABS: TabItem[] = [
  { id: "info", label: "Profile Info", icon: User },
  { id: "ebooks", label: "আমার ই-বুক", icon: BookOpen },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "danger", label: "Danger Zone", icon: Trash2 },
];

export default function ProfileClient({ user, subscriptions }: ProfileClientProps) {
  const [tab, setTab] = useState<string>("info");
  return (
    <div className="max-w-3xl mx-auto py-6 w-full space-y-6">
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl overflow-x-auto scrollbar-none border border-slate-200/60">
        {TABS.map(({ id, label, icon: Icon }) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 min-w-30 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                ? "bg-white text-[#0B1E8A] shadow-sm font-bold"
                : "text-slate-500 hover:text-[#0B1E8A]"
                }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAF4] p-6 sm:p-8">
        {tab === "info" && <InfoTab user={user} />}
        {tab === "ebooks" && <EbooksTab subscriptions={subscriptions} />}
        {tab === "password" && <PasswordTab />}
        {tab === "danger" && <DangerTab />}
      </div>
    </div>
  );
}

