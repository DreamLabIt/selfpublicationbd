'use client';

import { useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { BACKEND_URL } from "@/utils/api";

import {
    createBannerAction,
    updateBannerAction,
    deleteBannerAction,
    uploadBannerImageAction,
    Banner,
} from "@/app/actions/banner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface BannerPayload {
    image: string;
    order: number;
    is_active: boolean;
}

const emptyBanner: BannerPayload = {
    image: "",
    order: 1,
    is_active: true,
};

interface Props {
    initialSliders: Banner[];
}

export default function HeroSliderClient({ initialSliders }: Props) {
    const [sliders, setSliders] = useState<Banner[]>(initialSliders);
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        getValues,
        formState: { errors },
        control,
    } = useForm<BannerPayload>({
        defaultValues: emptyBanner,
    });

    const watchImage = useWatch({ control, name: "image" });

    const openNew = () => {
        setEditId(null);
        reset(emptyBanner);
        setOpen(true);
    };

    const openEdit = (item: Banner) => {
        const id = item._id || item.id || null;
        if (!id) {
            toast.error("ব্যানার আইডি পাওয়া যায়নি!");
            return;
        }

        const activeStatus =
            typeof item.is_active === "boolean"
                ? item.is_active
                : typeof item.isActive === "boolean"
                    ? item.isActive
                    : true;

        setEditId(id);
        reset({
            image: item.image || "",
            order: item.order && item.order > 0 ? item.order : 1,
            is_active: activeStatus,
        });
        setOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        const currentOrderNum = Number(getValues("order"));
        const validOrder = !isNaN(currentOrderNum) && currentOrderNum > 0 ? currentOrderNum : 1;

        formData.append("order", String(validOrder));
        formData.append("isActive", "true");

        try {
            setUploading(true);
            const res = await uploadBannerImageAction(formData);

            if (res.success && res.data?.url) {
                const uploadedUrl = res.data.url;

                setValue("image", uploadedUrl, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });

                toast.success(res.message || "ছবি সফলভাবে আপলোড হয়েছে!");
            } else {
                toast.error(res.message || "ছবি আপলোড করতে ব্যর্থ হয়েছে!");
            }
        } catch (error) {
            console.error("Client Upload Exception:", error);
            toast.error("আপলোড করার সময় সমস্যা হয়েছে!");
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = async (data: BannerPayload) => {
        setBusy(true);

        const parsedOrder = typeof data.order === "number" && !isNaN(data.order) && data.order > 0 ? data.order : 1;

        const payload = {
            image: data.image,
            order: parsedOrder,
            isActive: Boolean(data.is_active),
        };

        try {
            if (editId) {
                const res = await updateBannerAction(editId, payload);
                if (res.success) {
                    toast.success(res.message);
                    setSliders((prev) =>
                        prev.map((item) => {
                            const currentId = item._id || item.id;
                            if (currentId === editId) {
                                return {
                                    ...item,
                                    ...payload,
                                    is_active: payload.isActive,
                                };
                            }
                            return item;
                        })
                    );
                    setOpen(false);
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await createBannerAction(payload);
                if (res.success) {
                    toast.success(res.message);
                    if (res.data) {
                        setSliders((prev) => [...prev, res.data!]);
                    }
                    setOpen(false);
                } else {
                    toast.error(res.message);
                }
            }
        } finally {
            setBusy(false);
        }
    };

    const handleDelete = (id: string) => {
        toast("আপনি কি নিশ্চিত যে এই স্লাইডারটি ডিলিট করতে চান?", {
            action: {
                label: "ডিলিট করুন",
                onClick: async () => {
                    const res = await deleteBannerAction(id);
                    if (res.success) {
                        toast.success(res.message || "স্লাইডারটি সফলভাবে ডিলিট হয়েছে!");
                        setSliders((prev) =>
                            prev.filter((item) => (item._id || item.id) !== id)
                        );
                    } else {
                        toast.error(res.message || "ডিলিট করতে ব্যর্থ হয়েছে!");
                    }
                },
            },
            cancel: {
                label: "বাতিল",
                onClick: () => toast.dismiss(),
            },
        });
    };

    const fullUrl = (u?: string) => {
        if (!u) return "";
        if (u.startsWith("http://") || u.startsWith("https://")) return u;

        const baseUrl = (BACKEND_URL);
        const cleanPath = u.replace(/^\//, "");

        if (cleanPath.startsWith("api/v1/")) {
            return `${baseUrl}/${cleanPath}`;
        }

        return `${baseUrl}/api/v1/${cleanPath}`;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">Hero Sliders</h1>
                    <p className="text-xs sm:text-sm text-gray-500">
                        Manage homepage banner sliders
                    </p>
                </div>

                <div className="bg-black text-white px-3 sm:px-4 py-2 rounded-lg">
                    <button
                        onClick={openNew}
                        className="flex items-center gap-2 text-sm"
                    >
                        <Plus className="w-4 h-4" />
                        Add Slider
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border overflow-x-auto border-gray-300">
                <table className="w-full text-sm min-w-125">
                    <thead className="bg-gray-50 text-left">
                        <tr>
                            <th className="px-4 py-3">Image</th>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {sliders.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="text-center py-6 text-gray-500">
                                    No sliders found.
                                </td>
                            </tr>
                        ) : (
                            sliders.map((s) => {
                                const currentId = s._id || s.id || "";
                                const isActive =
                                    typeof s.is_active === "boolean"
                                        ? s.is_active
                                        : s.isActive;

                                return (
                                    <tr key={currentId} className="border-t border-gray-300">
                                        <td className="px-4 py-3">
                                            {s.image ? (
                                                <Image
                                                    src={fullUrl(s.image)}
                                                    alt="Banner"
                                                    width={80}
                                                    height={48}
                                                    unoptimized
                                                    className="w-16 sm:w-20 h-10 sm:h-12 object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-16 sm:w-20 h-10 sm:h-12 bg-gray-100 flex items-center justify-center rounded">
                                                    <ImageIcon className="w-4 h-4 text-gray-400" />
                                                </div>
                                            )}
                                        </td>

                                        <td className="px-4 py-3">{s.order}</td>

                                        <td className="px-4 py-3 text-xs sm:text-sm">
                                            {isActive ? (
                                                <span className="text-green-600 font-medium">Active</span>
                                            ) : (
                                                <span className="text-gray-400">Inactive</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <button
                                                onClick={() => openEdit(s)}
                                                className="mr-2 p-1 hover:bg-gray-100 rounded cursor-pointer"
                                            >
                                                <Edit className="w-4 h-4 text-gray-600" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(currentId)}
                                                className="p-1 hover:bg-red-50 rounded text-red-500 cursor-pointer"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-lg w-[95vw] sm:w-full z-50">
                    <DialogHeader>
                        <DialogTitle>
                            {editId ? "Edit Slider" : "Add Slider"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
                        <div>
                            <label className="text-xs font-medium block mb-2">
                                Upload Image
                            </label>

                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                    className="block w-full text-sm file:mr-2 file:rounded file:bg-gray-200 file:px-1 file:text-black file:cursor-pointer file:border hover:file:bg-gray-30"
                                />

                                {uploading && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                                    </span>
                                )}
                            </div>

                            {watchImage && (
                                <Image
                                    src={fullUrl(watchImage)}
                                    alt="Preview"
                                    width={800}
                                    height={320}
                                    unoptimized
                                    className="w-full h-32 sm:h-40 object-cover rounded mt-2 border"
                                />
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">
                                Image URL
                            </label>
                            <input
                                {...register("image")}
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            {errors.image && (
                                <p className="text-xs text-red-500 mt-1">{errors.image.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">
                                Order
                            </label>
                            <input
                                type="number"
                                min="1"
                                {...register("order", {
                                    required: "Order is required",
                                    min: { value: 1, message: "Order must be greater than 0" },
                                    setValueAs: (v) => (v === "" || isNaN(Number(v)) ? 1 : Number(v))
                                })}
                                className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            />
                            {errors.order && (
                                <p className="text-xs text-red-500 mt-1">{errors.order.message}</p>
                            )}
                        </div>

                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input
                                type="checkbox"
                                {...register("is_active")}
                            />
                            Active
                        </label>

                        <div className="flex justify-end gap-2 pt-2">
                            <div className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 cursor-pointer border-gray-300">
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="bg-black text-white px-4 py-2 rounded-lg text-sm">
                                <button
                                    type="submit"
                                    disabled={busy || uploading}
                                    className="flex items-center gap-2"
                                >
                                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {busy ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}