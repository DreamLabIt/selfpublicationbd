import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "ForgotPassword | Self Preparation BD",
    description: "Enter your email to receive a reset token",
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}