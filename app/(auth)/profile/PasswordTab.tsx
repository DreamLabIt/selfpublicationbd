'use client';

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { changePasswordAction } from "@/app/actions/profile";
import { PasswordFormInputs } from "@/types";

export function PasswordTab() {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PasswordFormInputs>({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    const oldPassword = useWatch<PasswordFormInputs>({
        control,
        name: "oldPassword",
        defaultValue: "",
    });
    const newPassword = useWatch<PasswordFormInputs>({
        control,
        name: "newPassword",
        defaultValue: "",
    });

    const onSubmit = async (data: PasswordFormInputs) => {
        const res = await changePasswordAction({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        });

        if (res.success) {
            toast.success(res.message);
            reset();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <h2 className="text-lg font-bold text-[#08145A] mb-1">Change Password</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            type={showCurrent ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("oldPassword", {
                                required: "Current Password is required.",
                            })}
                            className="w-full pl-4 pr-11 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrent(!showCurrent)}
                            className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-[#0B1E8A] transition-colors cursor-pointer"
                        >
                            {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.oldPassword && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.oldPassword.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showNew ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("newPassword", {
                                required: "New Password is required.",
                                minLength: {
                                    value: 6,
                                    message: "New password must be at least 6 characters long.",
                                },
                                validate: (value) =>
                                    value !== oldPassword || "New password and Old password cannot be the same.",
                            })}
                            className="w-full pl-4 pr-11 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNew(!showNew)}
                            className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-[#0B1E8A] transition-colors cursor-pointer"
                        >
                            {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.newPassword && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.newPassword.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-[#08145A] mb-1.5">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="••••••••"
                            {...register("confirmPassword", {
                                required: "Confirm Password is required.",
                                validate: (value) =>
                                    value === newPassword || "New password and Confirm password do not match!",
                            })}
                            className="w-full pl-4 pr-11 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-3.5 flex items-center text-slate-400 hover:text-[#0B1E8A] transition-colors cursor-pointer"
                        >
                            {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 font-medium">{errors.confirmPassword.message}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
                <Lock className="w-4 h-4" />
                <span>{isSubmitting ? "Updating Password..." : "Update Password"}</span>
            </button>
        </form>
    );
}
