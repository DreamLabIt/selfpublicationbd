import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";
import { getUserProfile } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Login | Self Preparation BD",
    description: "Sign in to your account to continue.",
};

export default async function LoginPage() {
    const user = await getUserProfile();

    if (user && (user.data)) {
        redirect("/");
    }

    return <LoginForm />;
}