import { revalidateTag } from "next/cache";
import { REVALIDATE_SECRET } from "@/utils/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { secret, tags } = body;

        if (secret !== REVALIDATE_SECRET) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
            }, { status: 401 });
        }

        if (!Array.isArray(tags) || tags.length === 0) {
            return NextResponse.json({
                success: false,
                message: "tags must be a non-empty array",
            }, { status: 400, });
        }

        for (const tag of tags) {
            revalidateTag(tag, "default");
        }

        return NextResponse.json({
            success: true,
            message: "Tags revalidated successfully.",
            revalidated: tags,
            timestamp: new Date().toISOString(),
        });
    } catch {
        return NextResponse.json({
            success: false,
            message: "Internal Server Error",
        }, { status: 500, });
    }
}