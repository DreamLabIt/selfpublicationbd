'use client';

import { useForm, useWatch } from "react-hook-form";
import { LogOut, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAccountAction } from "@/app/actions/profile";
import { useAuth } from "@/context/AuthContext";
import { DeleteAccountInput } from "@/types";

export function DangerTab() {
    const { logout } = useAuth();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<DeleteAccountInput>({
        defaultValues: {
            confirmText: "",
        },
    });

    const confirmText = useWatch({
        control,
        name: "confirmText",
    });

    const handleLogout = async () => {
        await logout();
    };

    const onSubmit = async () => {
        const res = await deleteAccountAction();

        if (res.success) {
            toast.success(res.message);
            await logout();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-bold text-[#08145A] mb-6">Danger Zone</h2>

            <div className="border border-[#E2EAF4] rounded-2xl p-5">
                <h3 className="font-semibold text-[#08145A] mb-1">Log out</h3>
                <p className="text-sm text-slate-500 mb-4">
                    You will be signed out of your account on this device.
                </p>
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border! border-[#0B1E8A]! text-[#0B1E8A]! text-sm font-bold hover:bg-[#0B1E8A]! hover:text-white! transition-all cursor-pointer"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="border border-[#D61F1F]/30 rounded-2xl p-5 bg-red-100/40!">
                <h3 className="font-semibold text-[#D61F1F]! mb-1">Delete Account</h3>
                <p className="text-sm text-slate-500 mb-4">
                    This is permanent and cannot be undone. All your data will be removed.
                </p>

                <div className="mb-3">
                    <input
                        type="text"
                        placeholder='Type "DELETE" to confirm'
                        {...register("confirmText", {
                            required: 'Type "DELETE" to confirm.',
                            validate: (value) =>
                                value === "DELETE" || 'You must type exactly "DELETE" to proceed.',
                        })}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#D1DFF0] text-sm font-medium text-[#08145A] focus:outline-none focus:ring-2 focus:ring-[#D61F1F]/30 focus:border-[#D61F1F] transition bg-white"
                    />
                    {errors.confirmText && (
                        <p className="text-xs text-[#D61F1F] mt-1 font-medium">{errors.confirmText.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || confirmText !== "DELETE"}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D61F1F]! text-white text-sm font-bold !hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                    {isSubmitting ? (
                        <span>Deleting…</span>
                    ) : (
                        <>
                            <Trash2 className="w-4 h-4" />
                            <span>Delete My Account</span>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}