import type { Metadata } from "next";
import RegisterForm from "@/components/auth/RegisterForm";
import { getUserProfile } from "@/app/actions/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Register | Self Preparation BD",
    description: "Create your account - Join thousands of learners today.",
};

export default async function RegisterPage() {
    const user = await getUserProfile();

    if (user && (user.data)) {
        redirect("/");
    }

    return <RegisterForm />;
}