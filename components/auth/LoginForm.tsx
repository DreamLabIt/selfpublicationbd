"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { LoginPayload, LoginFormInputs } from "@/types";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
    const router = useRouter();
    const { refetchUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormInputs>({
        defaultValues: {
            email: "",
            password: "",
            remember: false,
        },
        mode: "onTouched",
    });

    useEffect(() => {
        const savedData = localStorage.getItem("remembered_user");
        if (savedData) {
            try {
                const { email, expiry } = JSON.parse(savedData);
                const now = new Date().getTime();

                if (now < expiry) {
                    setValue("email", email);
                    setValue("remember", true);
                } else {
                    localStorage.removeItem("remembered_user");
                }
            } catch (err) {
                console.error("Failed to parse remembered_user", err);
            }
        }
    }, [setValue]);

    const onSubmit = async (data: LoginFormInputs) => {
        setLoading(true);
        try {
            const formattedEmail = data.email.trim().toLowerCase();
            const payload: LoginPayload = {
                email: formattedEmail,
                password: data.password,
            };

            const res = await loginAction(payload);

            if (res?.success) {
                if (data.remember) {
                    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
                    const expiry = new Date().getTime() + thirtyDaysInMs;

                    localStorage.setItem(
                        "remembered_user",
                        JSON.stringify({ email: formattedEmail, expiry })
                    );
                } else {
                    localStorage.removeItem("remembered_user");
                }

                toast.success(res.message || "Login successful!");

                await refetchUser();

                const destination = res.redirectUrl || "/profile";
                setTimeout(() => {
                    router.push(destination);
                    router.refresh();
                }, 500);
            } else {
                toast.error(res?.message || "Invalid credentials.");
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Something went wrong.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hero-grad flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold gradient-text-blue tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Sign in to your account to continue
                    </p>
                </div>

                <div className="glass rounded-3xl shadow-pop p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <div>
                            <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 8l9 6 9-6M3 8v10a2 2 0 002 2h14a2 2 0 002-2V8M3 8a2 2 0 012-2h14a2 2 0 012 2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    {...register("email", {
                                        required: "Email address is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Please enter a valid email address",
                                        },
                                    })}
                                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 transition ${errors.email
                                        ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                        : "border-[#D1DFF0] focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A]"
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 font-medium mt-1">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1.5">
                                <label className="block text-sm font-semibold text-[#08145A]">
                                    Password
                                </label>
                                <Link href="/forgot-password" className="text-xs text-[#0B1E8A] hover:text-[#D61F1F] font-semibold transition-colors">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="11" width="18" height="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters",
                                        },
                                    })}
                                    className={`w-full pl-10 pr-11 py-3 rounded-xl border bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 transition ${errors.password
                                        ? "border-red-500 focus:ring-red-200 focus:border-red-500"
                                        : "border-[#D1DFF0] focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A]"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-[#0B1E8A] transition-colors"
                                >
                                    {showPass ? (
                                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    ) : (
                                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 font-medium mt-1">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                {...register("remember")}
                                className="w-4 h-4 rounded border-[#D1DFF0] accent-[#0B1E8A] cursor-pointer"
                            />
                            <label htmlFor="remember" className="text-sm text-slate-600 font-medium select-none cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" />
                                    </svg>
                                    Signing in…
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#E2EAF4]" />
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-[#E2EAF4]" />
                    </div>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-[#0B1E8A] font-bold hover:text-[#D61F1F] transition-colors">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

