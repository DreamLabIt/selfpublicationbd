"use server";

import { fetchWithAuth } from "@/lib/fetchWithAuth";

export interface VisitorMetrics {
    totalVisitors: number;
    uniqueVisitors: number;
}

export interface TopPage {
    path?: string;
    url?: string;
    views?: number;
    count?: number;
}

export interface VisitorData {
    today: VisitorMetrics;
    last7Days: VisitorMetrics;
    last30Days: VisitorMetrics;
    last3Months: VisitorMetrics;
    last6Months: VisitorMetrics;
    last1Year: VisitorMetrics;
    topPages: TopPage[];
}

export async function getVisitorAnalyticsAction(): Promise<{
    success: boolean;
    data: VisitorData | null;
    message?: string;
}> {
    try {
        const res = await fetchWithAuth("/api/v1/visitor", {
            method: "GET",
            cache: "no-store",
        });

        const result = await res.json();
        console.log("Fetching visitor analytics:", result);

        if (!res.ok || !result.success) {
            return {
                success: false,
                data: null,
                message: result.message || "Failed to fetch visitor analytics",
            };
        }

        return {
            success: true,
            data: result.data,
            message: result.message,
        };
    } catch (error) {
        console.error("Error fetching visitor analytics:", error);
        return {
            success: false,
            data: null,
            message: "Server error occurred while fetching visitor analytics",
        };
    }
}