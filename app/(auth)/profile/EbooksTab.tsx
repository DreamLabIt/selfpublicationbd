'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BACKEND_URL } from "@/utils/api";
import { toast } from "sonner";
import { BookOpen, Clock, CheckCircle2, XCircle, AlertCircle, X } from "lucide-react";
import { readEbookAction, Subscription } from "@/app/actions/profile";

export function EbooksTab({ subscriptions }: { subscriptions: Subscription[] }) {
  const router = useRouter();
  const [pdfReaderUrl, setPdfReaderUrl] = useState<{ url: string; title: string } | null>(null);
  const [loadingReadId, setLoadingReadId] = useState<string | number | null>(null);

  const handleRead = async (sub: Subscription) => {
    setLoadingReadId(sub.book_id);
    const res = await readEbookAction(sub.book_id);
    setLoadingReadId(null);

    if (res.success && res.pdf_url) {
      const rawUrl = res.pdf_url;
      const fullUrl = rawUrl.startsWith("/") ? `${BACKEND_URL}${rawUrl}` : rawUrl;
      setPdfReaderUrl({ url: fullUrl, title: sub.book_title });
    } else {
      toast.error(res.message || "Failed to load e-book URL.");
    }
  };

  const statusConfig = {
    pending: { label: "Pending", icon: Clock, color: "text-amber-700 bg-amber-50 border-amber-200" },
    active: { label: "Active", icon: CheckCircle2, color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    expired: { label: "Expired", icon: AlertCircle, color: "text-slate-600 bg-slate-100 border-slate-200" },
    rejected: { label: "Rejected", icon: XCircle, color: "text-rose-700 bg-rose-50 border-rose-200" },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#08145A]">আমার ই-বুক সাবস্ক্রিপশন</h2>
        </div>
        <button
          onClick={() => router.push("/books/ebook")}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1E8A] hover:text-[#08145A] transition py-1 cursor-pointer"
        >
          <span>আরো ই-বুক দেখুন →</span>
        </button>
      </div>

      {subscriptions.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="font-semibold">এখনো কোনো ই-বুক সাবস্ক্রিপশন নেই</p>
          <p className="text-sm mt-1">
            ই-বুক কিনুন এবং যেকোনো জায়গা থেকে পড়ুন!
          </p>
          <button
            onClick={() => router.push("/books/ebook")}
            className="mt-4 btn-primary px-5 py-2.5 rounded-xl text-sm font-bold cursor-pointer"
          >
            ই-বুক দেখুন
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {subscriptions.map((sub) => {
            const cfg = statusConfig[sub.status] || statusConfig.pending;
            const Icon = cfg.icon;
            const isActive = sub.status === "active";

            return (
              <div
                key={sub.id}
                className="p-4 sm:p-5 rounded-2xl border border-[#E2EAF4] bg-white hover:border-[#D1DFF0] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#0B1E8A] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#08145A] text-sm sm:text-base leading-snug">{sub.book_title}</h3>
                    <div className="flex items-center gap-2.5 mt-1">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${cfg.color}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                      {sub.expire_date && (
                        <span className="text-xs text-slate-400 font-medium">
                          Expires: {new Date(sub.expire_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <button
                    onClick={() => handleRead(sub)}
                    disabled={loadingReadId === sub.book_id}
                    className="w-full sm:w-auto bg-[#0B1E8A] hover:bg-[#08145A] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm disabled:opacity-60 transition shrink-0 cursor-pointer"
                  >
                    {loadingReadId === sub.book_id ? "Opening..." : "পড়ুন"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Secure PDF Reader Modal */}
      {pdfReaderUrl && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-[#08145A] text-sm truncate">{pdfReaderUrl.title}</h3>
              <button
                onClick={() => setPdfReaderUrl(null)}
                className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden relative">
              {/* <SecurePdfViewer fileUrl={pdfReaderUrl.url} /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}