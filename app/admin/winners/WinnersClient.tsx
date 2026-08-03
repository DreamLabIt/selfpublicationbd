"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Winner,
    createWinnerAction,
    updateWinnerAction,
    deleteWinnerAction,
} from "@/app/actions/winner";
import { BACKEND_URL } from "@/utils/api";
import Image from "next/image";

interface WinnersClientProps {
    initialWinners: Winner[];
}

interface WinnerFormValues {
    name: string;
    designation: string;
    office: string;
    quote: string;
    social_url: string;
    order?: string | number;
}

const defaultValues: WinnerFormValues = {
    name: "",
    designation: "",
    office: "",
    quote: "",
    social_url: "",
    order: "",
};

export default function WinnersClient({ initialWinners = [] }: WinnersClientProps) {
    const router = useRouter();
    const [winnersList, setWinnersList] = useState<Winner[]>(initialWinners);
    const [open, setOpen] = useState<boolean>(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<WinnerFormValues>({
        defaultValues,
    });

    const resetFormAndStates = () => {
        reset(defaultValues);
        setEditId(null);
        setSelectedFile(null);
        setPreviewUrl("");
    };

    const openNew = () => {
        resetFormAndStates();
        setOpen(true);
    };

    const openEdit = (w: Winner) => {
        resetFormAndStates();
        const winnerId = String(w.id || w._id || "").trim();

        if (!winnerId) {
            toast.error("উইনার আইডি পাওয়া যায়নি!");
            return;
        }

        const rawOffice = w.office || "";
        const rawQuote = w.quote || "";
        const rawSocialUrl =
            typeof w.socialLinks === "string"
                ? w.socialLinks
                : w.socialLinks?.website || "";

        reset({
            name: w.name || "",
            designation: w.designation || "",
            office: rawOffice,
            quote: rawQuote,
            social_url: rawSocialUrl,
            order: w.order ? String(w.order) : "1",
        });

        if (w.image) {
            setPreviewUrl(w.image);
        }

        setEditId(winnerId);
        setOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const onSubmit = async (data: WinnerFormValues) => {
        const isEditing = Boolean(editId);
        if (!isEditing && !selectedFile) {
            toast.error("অনুগ্রহ করে একটি ছবি নির্বাচন করুন!");
            return;
        }

        try {
            let res;

            if (isEditing && editId) {
                if (selectedFile) {
                    const formData = new FormData();
                    formData.append("name", data.name);
                    formData.append("designation", data.designation);
                    formData.append("office", data.office || "");
                    if (data.quote) formData.append("quote", data.quote);

                    const finalOrder = data.order ? String(data.order) : "1";
                    formData.append("order", finalOrder);

                    if (data.social_url) {
                        formData.append("socialLinks", JSON.stringify({ website: data.social_url }));
                    }

                    formData.append("image", selectedFile);

                    res = await updateWinnerAction(editId, formData);
                }

                else {
                    const jsonPayload = {
                        name: data.name,
                        designation: data.designation,
                        office: data.office || "",
                        quote: data.quote || "",
                        order: Number(data.order || 1),
                        ...(data.social_url && {
                            socialLinks: { website: data.social_url },
                        }),
                    };

                    res = await updateWinnerAction(editId, jsonPayload);
                }
            } else {

                const formData = new FormData();
                formData.append("name", data.name);
                formData.append("designation", data.designation);
                formData.append("office", data.office || "");
                if (data.quote) formData.append("quote", data.quote);

                let finalOrder = data.order ? String(data.order) : "1";
                if (!data.order || isNaN(Number(data.order))) {
                    finalOrder = String(winnersList.length + 1);
                }
                formData.append("order", finalOrder);

                if (data.social_url) {
                    formData.append("socialLinks", JSON.stringify({ website: data.social_url }));
                }

                if (selectedFile) {
                    formData.append("image", selectedFile);
                }

                res = await createWinnerAction(formData);
            }

            if (res?.success) {
                toast.success(res.message || (isEditing ? "উইনার আপডেট হয়েছে" : "উইনার তৈরি হয়েছে"));

                if (res.data) {
                    const updatedWinner = { ...res.data, id: res.data.id || res.data._id };
                    if (isEditing && editId) {
                        setWinnersList((prev) =>
                            prev.map((item) => ((item.id || item._id) === editId ? updatedWinner : item))
                        );
                    } else {
                        setWinnersList((prev) => [updatedWinner, ...prev]);
                    }
                }

                setOpen(false);
                resetFormAndStates();
                router.refresh();
            } else {
                toast.error(res?.message || "অপারেশন ব্যর্থ হয়েছে");
            }
        } catch (err) {
            console.error(err);
            toast.error("একটিunexpected সমস্যা ঘটেছে");
        }
    };

    const handleDelete = async (id?: string) => {
        if (!id) return;

        toast("আপনি কি নিশ্চিত যে এই উইনারকে মুছে ফেলতে চান?", {
            action: {
                label: "ডিলিট করুন",
                onClick: async () => {
                    try {
                        const res = await deleteWinnerAction(id);
                        if (res?.success) {
                            setWinnersList((prev) => prev.filter((item) => (item.id || item._id) !== id));
                            toast.success(res.message || "উইনার মুছে ফেলা হয়েছে");
                            router.refresh();
                        } else {
                            toast.error(res?.message || "উইনার মুছে ফেলা সম্ভব হয়নি");
                        }
                    } catch {
                        toast.error("একটি অপ্রত্যাশিত সমস্যা ঘটেছে");
                    }
                },
            },
            cancel: {
                label: "বাতিল",
                onClick: () => toast.dismiss(),
            },
        });
    };

    const getFullImageUrl = (url?: string) => {
        if (!url) return "";
        if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("blob:")) {
            return url;
        }
        const cleanBackendUrl = (BACKEND_URL || "").replace(/\/+$/, "");
        const cleanUrl = url.replace(/^\/+/, "");
        return `${cleanBackendUrl}/${cleanUrl}`;
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Winners</h1>
                    <p className="text-sm text-gray-500">
                        উইনারদের তালিকা পরিচালনা করুন।
                    </p>
                </div>

                <button
                    onClick={openNew}
                    className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Add Winner
                </button>
            </div>

            {/* WINNERS LIST */}
            {winnersList.length === 0 ? (
                <div className="text-center py-12 border border-gray-300 rounded-2xl bg-gray-50 text-gray-500 text-sm">
                    কোনো উইনার পাওয়া যায়নি। নতুন উইনার যুক্ত করতে Add Winner বাটনে ক্লিক করুন।
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {winnersList.map((w) => {
                        const itemId = String(w.id || w._id || "");
                        return (
                            <div
                                key={itemId}
                                className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex items-center gap-3">
                                        {w.image ? (
                                            <div className="relative w-12 h-12 shrink-0">
                                                <Image
                                                    src={getFullImageUrl(w.image)}
                                                    alt={w.name}
                                                    fill
                                                    unoptimized
                                                    className="rounded-full object-cover border"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border shrink-0">
                                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                        )}

                                        <div className="overflow-hidden">
                                            <div className="font-bold text-gray-900 truncate">
                                                {w.name}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {w.designation} {w.office ? `• ${w.office}` : ""}
                                            </div>
                                        </div>
                                    </div>

                                    {w.quote && (
                                        <p className="text-xs mt-3 text-gray-600 italic line-clamp-3">
                                            {w.quote}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end gap-1 mt-4 pt-3 border-t">
                                    <button
                                        onClick={() => openEdit(w)}
                                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(itemId)}
                                        className="p-1.5 text-red-500 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL */}
            <Dialog
                open={open}
                onOpenChange={(val) => {
                    setOpen(val);
                    if (!val) resetFormAndStates();
                }}
            >
                <DialogContent className="max-w-lg w-[95vw] sm:w-full z-50 p-6 max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold">
                            {editId ? "Edit Winner" : "Add Winner"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
                        <div>
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                                Winner Image
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="text-xs text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
                            />

                            {previewUrl && (
                                <div className="mt-3 relative w-20 h-20 rounded-full border overflow-hidden">
                                    <Image
                                        src={getFullImageUrl(previewUrl)}
                                        alt="Preview"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* FORM INPUTS */}
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium block mb-1">Full Name *</label>
                                <input
                                    placeholder="Full Name"
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium block mb-1">Designation *</label>
                                <input
                                    placeholder="Designation"
                                    {...register("designation", { required: "Designation is required" })}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium block mb-1">Office / Department</label>
                                <input
                                    placeholder="Office / Department"
                                    {...register("office")}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium block mb-1">Order</label>
                                <input
                                    type="number"
                                    placeholder="Display Order"
                                    {...register("order")}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium block mb-1">Social URL</label>
                                <input
                                    placeholder="https://..."
                                    {...register("social_url")}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-medium block mb-1">Quote</label>
                                <textarea
                                    placeholder="Quote or message..."
                                    rows={3}
                                    {...register("quote")}
                                    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                                />
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-2 pt-2">
                            <div className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 border-gray-300 transition cursor-pointer">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        resetFormAndStates();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition  disabled:opacity-50 cursor-pointe">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isSubmitting ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}