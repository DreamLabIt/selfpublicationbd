"use client";

import { useState } from "react";
import {
    Users,
    UserCheck,
    Calendar,
    TrendingUp,
    RefreshCw,
    FileText
} from "lucide-react";
import { toast } from "sonner";
import { getVisitorAnalyticsAction, VisitorData } from "@/app/actions/visitor";

interface Props {
    initialData: VisitorData | null;
    errorMessage?: string;
}

export default function VisitorAnalytics({ initialData, errorMessage }: Props) {
    const [data, setData] = useState<VisitorData | null>(initialData);
    const [loading, setLoading] = useState(false);

    const handleRefresh = async () => {
        setLoading(true);
        const res = await getVisitorAnalyticsAction();
        if (res.success && res.data) {
            setData(res.data);
            toast.success("Visitor data updated!");
        } else {
            toast.error(res.message || "Failed to refresh data");
        }
        setLoading(false);
    };

    const timeframeCards = [
        { label: "Today", key: "today" as const, color: "border-blue-500 text-blue-600 bg-blue-50" },
        { label: "Last 7 Days", key: "last7Days" as const, color: "border-indigo-500 text-indigo-600 bg-indigo-50" },
        { label: "Last 30 Days", key: "last30Days" as const, color: "border-purple-500 text-purple-600 bg-purple-50" },
        { label: "Last 3 Months", key: "last3Months" as const, color: "border-emerald-500 text-emerald-600 bg-emerald-50" },
        { label: "Last 6 Months", key: "last6Months" as const, color: "border-amber-500 text-amber-600 bg-amber-50" },
        { label: "Last 1 Year", key: "last1Year" as const, color: "border-rose-500 text-rose-600 bg-rose-50" },
    ];

    return (
        <div className="p-2 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Visitor Analytics</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Overview of overall traffic and unique site visitors
                    </p>
                </div>

                <div className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition disabled:opacity-50 cursor-pointer">
                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 "
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Data
                    </button>
                </div>
            </div>

            {errorMessage && !data && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm">
                    {errorMessage}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {timeframeCards.map((item) => {
                    const metrics = data?.[item.key] || { totalVisitors: 0, uniqueVisitors: 0 };

                    return (
                        <div
                            key={item.key}
                            className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${item.color}`}>
                                    {item.label}
                                </span>
                                <Calendar className="w-4 h-4 text-gray-400" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                                        <Users className="w-3.5 h-3.5" />
                                        Total
                                    </div>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {metrics.totalVisitors.toLocaleString()}
                                    </p>
                                </div>

                                <div className="space-y-1 border-l pl-4 border-gray-100">
                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                                        <UserCheck className="w-3.5 h-3.5 text-green-600" />
                                        Unique
                                    </div>
                                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                        {metrics.uniqueVisitors.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-gray-600" />
                        <h2 className="font-semibold text-gray-800">Top Visited Pages</h2>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Page Path</th>
                                <th className="px-6 py-3 text-right">Views / Visitors</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {!data?.topPages || data.topPages.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-8 text-center text-gray-400">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <FileText className="w-8 h-8 stroke-1" />
                                            <span>No page view data available yet</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                data.topPages.map((page, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 font-mono text-xs text-gray-800">
                                            {page.path || page.url || "/"}
                                        </td>
                                        <td className="px-6 py-4 text-right font-semibold text-gray-900">
                                            {(page.views || page.count || 0).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}