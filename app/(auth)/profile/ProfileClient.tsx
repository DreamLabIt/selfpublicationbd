'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/utils/api";
import { toast } from "sonner";
import {
  User as UserIcon,
  Lock,
  Trash2,
  Save,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  LucideIcon,
} from "lucide-react";
import {
  updateProfileAction,
  changePasswordAction,
  readEbookAction,
  deleteAccountAction,
  Subscription,
} from "@/app/actions/profile";
import { useAuth } from "@/context/AuthContext";

interface UserType {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

interface ProfileClientTabsProps {
  user: UserType;
  subscriptions: Subscription[];
}

interface TabItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { id: "info", label: "Profile Info", icon: UserIcon },
  { id: "ebooks", label: "আমার ই-বুক", icon: BookOpen },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "danger", label: "Danger Zone", icon: Trash2 },
];

export default function ProfileClient({ user, subscriptions }: ProfileClientTabsProps) {
  const [tab, setTab] = useState<string>("ebooks");

  return (
    <>
      <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-2xl overflow-x-auto">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`shrink-0 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-white text-[#0B1E8A] shadow-sm" : "text-slate-500 hover:text-[#0B1E8A]"
              }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-[#E2EAF4] p-6 sm:p-8">
        {tab === "info" && <InfoTab user={user} />}
        {tab === "ebooks" && <EbooksTab subscriptions={subscriptions} />}
        {tab === "password" && <PasswordTab />}
        {tab === "danger" && <DangerTab />}
      </div>
    </>
  );
}

function InfoTab({ user }: { user: UserType }) {
  const { refetchUser } = useAuth();
  const [form, setForm] = useState({ name: user.name || "", phone: user.phone || "" });
  const [saving, setSaving] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("নাম খালি রাখা যাবে না।");
      return;
    }
    setSaving(true);

    const res = await updateProfileAction({ name: form.name.trim(), phone: form.phone.trim() });
    setSaving(false);

    if (res.success) {
      toast.success(res.message);
      await refetchUser();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-bold text-[#08145A] mb-1">ব্যক্তিগত তথ্য</h2>

      <div>
        <label className="block text-sm font-semibold text-[#08145A] mb-1.5">ইমেইল এড্রেস</label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-3 rounded-xl border border-[#D1DFF0] bg-slate-50 text-slate-400 text-sm font-medium cursor-not-allowed"
        />
        <p className="text-xs text-slate-400 mt-1">ইমেইল পরিবর্তন করা যাবে না।</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#08145A] mb-1.5">পূর্ণ নাম</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-[#D1DFF0] bg-white text-[#08145A] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#08145A] mb-1.5">ফোন নম্বর</label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="+880 1XXXXXXXXX"
          className="w-full px-4 py-3 rounded-xl border border-[#D1DFF0] bg-white text-[#08145A] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-[#0B1E8A] text-white py-3 rounded-xl font-bold text-sm tracking-wide disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {saving ? "সংরক্ষণ হচ্ছে..." : <><Save className="w-4 h-4" /> পরিবর্তন সংরক্ষণ করুন</>}
      </button>
    </form>
  );
}

function EbooksTab({ subscriptions }: { subscriptions: Subscription[] }) {
  const router = useRouter();
  const [readingSub, setReadingSub] = useState<{ pdf_url: string; book_title: string } | null>(null);
  const [loadingRead, setLoadingRead] = useState<string | number | null>(null);

  const handleRead = async (sub: Subscription) => {
    setLoadingRead(sub.book_id);
    const res = await readEbookAction(sub.book_id);
    setLoadingRead(null);

    if (res.success && res.pdf_url) {
      const rawUrl = res.pdf_url;
      const fullUrl = rawUrl.startsWith("/") ? `${BACKEND_URL}${rawUrl}` : rawUrl;
      setReadingSub({ pdf_url: fullUrl, book_title: sub.book_title });
    } else {
      toast.error(res.message || "ই-বুক পড়ার লিংক পাওয়া যায়নি");
    }
  };

  const statusConfig = {
    pending: { label: "যাচাই হচ্ছে", icon: Clock, color: "text-yellow-600 bg-yellow-50 border-yellow-200" },
    active: { label: "সক্রিয়", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
    expired: { label: "মেয়াদ শেষ", icon: AlertCircle, color: "text-slate-500 bg-slate-50 border-slate-200" },
    rejected: { label: "প্রত্যাখ্যাত", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#08145A]">আমার ই-বুক সাবস্ক্রিপশন</h2>
        <button onClick={() => router.push("/books/ebook")} className="text-xs font-semibold text-[#0B1E8A] hover:underline">
          আরো ই-বুক দেখুন →
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-semibold">এখনো কোনো ই-বুক সাবস্ক্রিপশন নেই</p>
          <button onClick={() => router.push("/books/ebook")} className="mt-4 bg-[#0B1E8A] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
            ই-বুক দেখুন
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((sub) => {
            const cfg = statusConfig[sub.status] || statusConfig.pending;
            const Icon = cfg.icon;
            const isActive = sub.status === "active";

            return (
              <div key={sub.id} className="p-4 rounded-2xl border border-slate-100 flex items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${cfg.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{cfg.label}</span>
                  </div>
                  <h3 className="font-bold text-[#08145A] text-sm">{sub.book_title}</h3>
                </div>

                {isActive && (
                  <button
                    onClick={() => handleRead(sub)}
                    disabled={loadingRead === sub.book_id}
                    className="bg-[#0B1E8A] text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
                  >
                    {loadingRead === sub.book_id ? "পড়া হচ্ছে..." : "পড়ুন"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ current_password: "", new_password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await changePasswordAction(form);
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      setForm({ current_password: "", new_password: "" });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold text-[#08145A]">পাসওয়ার্ড পরিবর্তন</h2>
      <div>
        <label className="block text-sm font-semibold text-[#08145A] mb-1">বর্তমান পাসওয়ার্ড</label>
        <input
          type="password"
          value={form.current_password}
          onChange={(e) => setForm({ ...form, current_password: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#08145A] mb-1">নতুন পাসওয়ার্ড</label>
        <input
          type="password"
          value={form.new_password}
          onChange={(e) => setForm({ ...form, new_password: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border text-sm"
        />
      </div>
      <button type="submit" disabled={loading} className="w-full bg-[#0B1E8A] text-white py-3 rounded-xl font-bold text-sm">
        {loading ? "পাসওয়ার্ড পরিবর্তন হচ্ছে..." : "পাসওয়ার্ড আপডেট করুন"}
      </button>
    </form>
  );
}

function DangerTab() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm("আপনি কি নিশ্চিত যে একাউন্ট মুছে ফেলতে চান?")) return;
    setLoading(true);
    const res = await deleteAccountAction();
    setLoading(false);

    if (res.success) {
      toast.success(res.message);
      await logout();
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-red-600">Danger Zone</h2>
      <p className="text-sm text-slate-500">একাউন্ট মুছে ফেললে আপনার সমস্ত সাবস্ক্রিপশন ও ডেটা স্থায়ীভাবে মুছে যাবে।</p>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm disabled:opacity-50"
      >
        {loading ? "একাউন্ট মোছা হচ্ছে..." : "একাউন্ট চিরতরে মুছে ফেলুন"}
      </button>
    </div>
  );
}