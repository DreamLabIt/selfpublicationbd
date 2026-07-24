import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Register | Self Preparation BD",
    description: "Create your account - Join thousands of learners today.",
};

export default function RegisterPage() {
    return <RegisterForm />;
}