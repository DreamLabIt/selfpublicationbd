import type { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Login | Self Preparation BD",
    description: "Sign in to your account to continue.",
};

export default function LoginPage() {
    return <LoginForm />;
}