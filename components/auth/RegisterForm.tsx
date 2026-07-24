"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import PasswordStrength from "./PasswordStrength";
import { registerUser } from "@/app/actions/auth";
import { RegisterFormData } from "@/types";

export default function RegisterForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, control, setValue, formState: { errors }, } = useForm<RegisterFormData>({
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            agreed: false,
        },
    });

    const passwordValue = useWatch({ control, name: "password", defaultValue: "" });
    const agreedValue = useWatch({ control, name: "agreed", defaultValue: false });
    const getPasswordStrength = (password: string) => {
        if (password.length >= 12) return 4;
        if (password.length >= 9) return 3;
        if (password.length >= 6) return 2;
        if (password.length > 0) return 1;
        return 0;
    };

    const onSubmit = async (data: RegisterFormData) => {
        setLoading(true);
        try {
            const res = await registerUser({
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
            });

            if (res.success) {
                toast.success(res.message || "Account created successfully! Please log in.", {
                    duration: 3000,
                });
                setTimeout(() => router.push("/login"), 1500);
            } else {
                toast.error(res.message || "Registration failed.");
            }
        } catch (error) {
            console.error("Registration Error Details:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-hero-grad flex items-center justify-center px-4 py-10 relative overflow-hidden">

            <div className="w-full max-w-md z-10">
                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold gradient-text-blue tracking-tight">
                        Create your account
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        Join thousands of learners today
                    </p>
                </div>

                <div className="glass rounded-3xl shadow-pop p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    {...register("name", {
                                        required: "Name is required",
                                        minLength: { value: 2, message: "Name must be at least 2 characters" }
                                    })}
                                    placeholder="Rahim Uddin"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email */}
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
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>
                            )}
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                                Phone number
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                                    <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <input
                                    type="tel"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        minLength: { value: 11, message: "Phone number must be at least 11 digits" }
                                    })}
                                    placeholder="017XXXXXXXX"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                                />
                            </div>
                            {errors.phone && (
                                <p className="text-xs text-red-500 mt-1 font-medium">{errors.phone.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                                Password
                            </label>
                            <PasswordInput
                                value={passwordValue || ""}
                                onChange={(e) => setValue("password", e.target.value, { shouldValidate: true })}
                            />
                            {/* Hidden Register input for Password validation */}
                            <input
                                type="hidden"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                    maxLength: { value: 15, message: "Password cannot exceed 15 characters" }
                                })}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>
                            )}
                            {passwordValue && <PasswordStrength strength={getPasswordStrength(passwordValue)} />}
                        </div>

                        {/* Terms */}
                        <div>
                            <div className="flex items-start gap-2.5">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    {...register("agreed", {
                                        required: "You must agree to the Terms of Service and Privacy Policy"
                                    })}
                                    className="w-4 h-4 mt-0.5 rounded border-[#D1DFF0] accent-[#0B1E8A] shrink-0 cursor-pointer"
                                />
                                <label htmlFor="terms" className="text-sm text-slate-600 font-medium select-none leading-snug cursor-pointer">
                                    I agree to the{" "}
                                    <Link href="/privacy-policy" className="text-[#0B1E8A] font-bold hover:text-[#D61F1F] transition-colors">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="#" className="text-[#0B1E8A] font-bold hover:text-[#D61F1F] transition-colors">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>
                            {errors.agreed && (
                                <p className="text-xs text-red-500 mt-1 font-medium">{errors.agreed.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !agreedValue}
                            className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeDasharray="60" strokeDashoffset="15" />
                                    </svg>
                                    Creating account…
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#E2EAF4]" />
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-[#E2EAF4]" />
                    </div>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#0B1E8A] font-bold hover:text-[#D61F1F] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}