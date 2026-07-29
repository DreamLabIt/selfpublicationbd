import { Metadata } from "next";
import { getAllBannersAdminAction } from "@/app/actions/banner";
import type { Banner } from "@/app/actions/banner";
import HeroSliderClient from "./HeroSliderClient";

export const metadata: Metadata = {
    title: "Admin - Hero Slider",
};

export const dynamic = "force-dynamic";

export default async function AdminHeroSliderPage() {
    const sliders: Banner[] = await getAllBannersAdminAction();
    return (
        <div className="p-4 sm:p-6">
            <HeroSliderClient initialSliders={sliders} />
        </div>
    );
}