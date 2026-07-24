"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { forgotPasswordAction, verifyOtpAction, changePasswordAction } from "@/app/actions/auth";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    async function handleSendOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter a valid email address!");
            return;
        }
        setLoading(true);
        try {
            const res = await forgotPasswordAction(email);
            if (!res?.success) {
                toast.error(res?.message || "Failed to send OTP code.");
                return;
            }
            toast.success(res.message || "OTP code sent to your email!");
            setStep(2);
        } catch {
            toast.error("Something went wrong while sending OTP.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!otp.trim() || otp.trim().length !== 6) {
            toast.error("Please enter a valid 6-digit OTP code!");
            return;
        }

        setLoading(true);
        try {
            const res = await verifyOtpAction(email, otp);

            if (!res?.success) {
                toast.error(res?.message || "Invalid OTP! Please try again.");
                return;
            }

            toast.success(res.message || "OTP verified successfully!");
            setStep(3);
        } catch {
            toast.error("An error occurred during OTP verification.");
        } finally {
            setLoading(false);
        }
    }

    async function handleChangePassword(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        setLoading(true);
        try {
            const res = await changePasswordAction({
                email,
                newPassword,
                confirmPassword,
                otp,
            });

            if (!res?.success) {
                toast.error(res?.message || "Failed to update password.");
                return;
            }

            toast.success("Password updated successfully!");
            router.push("/login");
        } catch {
            toast.error("Something went wrong while updating password.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-hero-grad flex items-center justify-center px-4 py-10 relative overflow-hidden">
            <div className="w-full max-w-md z-10">

                <div className="text-center mb-8">
                    <h1 className="font-display text-3xl font-bold gradient-text-blue tracking-tight">
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Verify OTP"}
                        {step === 3 && "Reset Password"}
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        {step === 1 && "Enter your email to receive a reset OTP code"}
                        {step === 2 && `Enter the OTP code sent to ${email}`}
                        {step === 3 && "Set your new password"}
                    </p>
                </div>

                <div className="glass rounded-3xl shadow-pop p-8">

                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
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
                                        required
                                        disabled={loading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? "Sending OTP..." : "Send Reset Token"}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#08145A] mb-1.5 text-center">
                                    6-Digit OTP Code
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        disabled={loading}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="123456"
                                        className="w-full py-3 px-4 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-300 text-center text-xl font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? "Verifying OTP..." : "Verify OTP"}
                            </button>

                            <button
                                type="button"
                                disabled={loading}
                                onClick={() => setStep(1)}
                                className="w-full text-xs text-slate-500 font-semibold hover:text-[#0B1E8A] transition-colors text-center block"
                            >
                                ← Change Email Address
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                                    New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        required
                                        disabled={loading}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition disabled:opacity-50"
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
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400 pointer-events-none">
                                        <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" />
                                            <path d="M7 11V7a5 5 0 0110 0v4" strokeLinecap="round" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPass ? "text" : "password"}
                                        required
                                        disabled={loading}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn-primary py-3.5 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? "Updating Password..." : "Change Password"}
                            </button>
                        </form>
                    )}


                    <div className="flex items-center gap-3 my-5">
                        <div className="flex-1 h-px bg-[#E2EAF4]" />
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest">or</span>
                        <div className="flex-1 h-px bg-[#E2EAF4]" />
                    </div>

                    <p className="text-center text-sm text-slate-500 font-medium">
                        Remembered your password?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="text-[#0B1E8A] font-bold hover:text-[#D61F1F] transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Sign In
                        </button>
                    </p>

                </div>
            </div>
        </div>
    );
}
