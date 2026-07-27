'use client';

import { useForm } from "react-hook-form";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { updateProfileAction } from "@/app/actions/profile";
import { useAuth } from "@/context/AuthContext";
import { UserType, ProfileFormInputs } from "@/types";

export function InfoTab({ user }: { user: UserType }) {
    const { refetchUser } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ProfileFormInputs>({
        values: {
            name: user.name || "",
            phone: user.phone || "",
        },
    });

    const onSubmit = async (data: ProfileFormInputs) => {
        const res = await updateProfileAction({
            name: data.name.trim(),
            phone: data.phone.trim(),
        });

        if (res.success) {
            toast.success(res.message);
            await refetchUser();
        } else {
            toast.error(res.message);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <h2 className="text-lg font-bold text-[#08145A] mb-1">Personal Information</h2>

            <div>
                <label className="block text-sm font-semibold text-[#08145A] mb-1.5">Email address</label>
                <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-3 rounded-xl border border-[#D1DFF0] bg-slate-50 text-slate-400 text-sm font-medium cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
            </div>

            <div>
                <label className="block text-sm font-semibold text-[#08145A] mb-1.5">Full Name</label>
                <input
                    type="text"
                    placeholder="Your full name"
                    {...register("name", {
                        required: "Full Name cannot be empty.",
                        validate: (value) => !!value.trim() || "Full Name cannot be empty.",
                    })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                />
                {errors.name && (
                    <p className="text-xs text-red-500 mt-1 font-medium">{errors.name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-[#08145A] mb-1.5">Phone Number</label>
                <input
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    {...register("phone")}
                    className="w-full px-4 py-3 rounded-xl border border-[#D1DFF0] bg-white/80 text-[#08145A] placeholder-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0B1E8A]/30 focus:border-[#0B1E8A] transition"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 rounded-xl font-bold text-sm tracking-wide shadow-soft disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
                {isSubmitting ? (
                    "Saving changes..."
                ) : (
                    <>
                        <Save className="w-4 h-4" />
                        <span>Save Changes</span>
                    </>
                )}
            </button>
        </form>
    );
}
