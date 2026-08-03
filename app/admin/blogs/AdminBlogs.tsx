"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { createBlogAction, updateBlogAction, deleteBlogAction, } from "@/app/actions/blog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon, Loader2 } from "lucide-react";
import { BACKEND_URL } from "@/utils/api";
import { useRouter } from "next/navigation";

import { Dialog, DialogContent, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import Image from "next/image";
import RichEditor from "@/components/admin/RichEditor/RichEditor";
import { Blog, BlogFormValues } from "@/types";

interface AdminBlogsClientProps {
    initialBlogs: Blog[];
    errorMessage?: string;
}

const defaultValues: BlogFormValues = {
    title: "",
    slug: "",
    excerpt: "",
    description: "",
    file: null,
};

const makeSlug = (title: string) => {
    const slug = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/gi, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

    if (slug.length > 0) {
        return slug;
    }

    return `blog-${crypto.randomUUID().slice(0, 8)}`;
};
export default function AdminBlogs({ initialBlogs = [] }: AdminBlogsClientProps) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | number | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const router = useRouter();
    const slugEdited = useRef<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
        formState: { isSubmitting },
    } = useForm<BlogFormValues>({
        defaultValues,
    });

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (slugEdited.current) return;
        const generatedSlug = makeSlug(e.target.value);
        setValue("slug", generatedSlug, { shouldValidate: true });
    };

    const handleSlugChange = () => {
        slugEdited.current = true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (previewUrl && previewUrl.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);
        }
    };

    const resetFormAndStates = () => {
        reset(defaultValues);
        setEditId(null);
        setExistingImageUrl("");
        if (previewUrl && previewUrl.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl("");
        setSelectedFile(null);
        slugEdited.current = false;
    };

    const openNew = () => {
        resetFormAndStates();
        setOpen(true);
    };

    const openEdit = (blog: Blog) => {
        resetFormAndStates();

        setEditId(blog._id || blog.id || null);
        setExistingImageUrl(blog.cover_image || blog.image || "");

        let rawSlug = blog.slug || "";
        if (rawSlug.startsWith("blog-")) {
            rawSlug = rawSlug.replace(/^blog-/, "");
        }

        reset({
            title: blog.title || "",
            slug: rawSlug || makeSlug(blog.title || ""),
            description: blog.description || "",
            file: null,
        });

        slugEdited.current = true;
        setOpen(true);
    };
    const deleteBlog = async (id: string | number) => {
        toast("আপনি কি নিশ্চিত যে এই ব্লগটি ডিলিট করতে চান?", {
            action: {
                label: "ডিলিট করুন",
                onClick: async () => {
                    const res = await deleteBlogAction(id);
                    if (res.success) {
                        toast.success(res.message || "ব্লগটি সফলভাবে ডিলিট হয়েছে!");
                        router.refresh();
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
    const onSubmit = async (data: BlogFormValues) => {
        try {
            const formData = new FormData();

            const rawSlug = data.slug?.trim() || data.title?.trim() || "";
            let finalSlug = makeSlug(rawSlug);

            if (!finalSlug) {
                // eslint-disable-next-line react-hooks/purity
                finalSlug = `blog-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
            }

            formData.append("title", data.title);
            formData.append("slug", finalSlug);
            formData.append("author", "Self Preparation");
            formData.append("category", "general");
            formData.append("views", "0");
            formData.append("description", data.description || "");

            if (selectedFile) {
                formData.append("image", selectedFile);
            }

            let res;
            if (editId) {
                res = await updateBlogAction(editId, formData);
            } else {
                res = await createBlogAction(formData);
            }

            if (res?.success) {
                toast.success(res.message || (editId ? "ব্লগ আপডেট হয়েছে" : "ব্লগ তৈরি হয়েছে"));
                setOpen(false);
                resetFormAndStates();
                router.refresh();
            } else {
                toast.error(res?.message || "অপারেশন ব্যর্থ হয়েছে: " + res?.message);
            }
        } catch (error) {
            console.error("Submit error:", error);
            toast.error("কিছু একটা সমস্যা হয়েছে!");
        }
    };
    const submitHandler = (e: React.FormEvent) => {
        void handleSubmit(onSubmit)(e as React.BaseSyntheticEvent);
    };

    const fullUrl = (u?: string) => {
        if (!u) return "";
        if (u.startsWith("blob:") || u.startsWith("http://") || u.startsWith("https://")) return u;

        const baseUrl = BACKEND_URL;
        const cleanPath = u.replace(/^\//, "");

        if (cleanPath.startsWith("api/v1/")) {
            return `${baseUrl}/${cleanPath}`;
        }

        return `${baseUrl}/api/v1/${cleanPath}`;
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blogs</h1>

                <div className="text-sm bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition cursor-pointer">
                    <button
                        onClick={openNew}
                        className="flex items-center gap-2 "
                    >
                        <Plus className="w-4 h-4" />
                        Add Blog
                    </button>
                </div>
            </div>

            {initialBlogs.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500">
                    <p className="text-lg font-medium">No blogs found</p>
                    <p className="text-sm mt-1">Click Add Blog to create your first blog post.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {initialBlogs.map((blog) => {
                        const imageUrl = blog.image || blog.cover_image;
                        const blogId = blog._id || blog.id || "";
                        return (
                            <div
                                key={blogId}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    {/* IMAGE */}
                                    {imageUrl ? (
                                        <div className="relative w-full h-40 sm:h-52">
                                            <Image
                                                src={fullUrl(imageUrl)}
                                                alt={blog.title}
                                                fill
                                                unoptimized
                                                className="object-cover"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full h-40 sm:h-52 bg-gray-100 flex items-center justify-center">
                                            <ImageIcon className="w-10 h-10 text-gray-400" />
                                        </div>
                                    )}

                                    {/* CONTENT */}
                                    <div className="p-5">
                                        <h2 className="font-bold text-lg line-clamp-2">{blog.title}</h2>
                                    </div>
                                </div>

                                {/* ACTIONS */}
                                <div className="p-5 pt-0 flex justify-end gap-2">
                                    <button
                                        onClick={() => openEdit(blog)}
                                        className="p-2 rounded hover:bg-gray-100 cursor-pointer"
                                    >
                                        <Edit className="w-4 h-4 text-gray-600" />
                                    </button>

                                    <button
                                        onClick={() => deleteBlog(blogId)}
                                        className="p-2 rounded text-red-500 hover:bg-red-50 cursor-pointer"
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
                <DialogContent className="max-w-2xl w-[95vw] sm:w-full z-50 max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editId ? "Edit Blog" : "Add Blog"}</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={submitHandler} className="space-y-4 pt-2">
                        <div>
                            <label className="text-sm font-medium block mb-1">Upload Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm file:mr-2 file:rounded file:bg-gray-200 file:px-3 file:py-1 file:text-black file:cursor-pointer file:border-0 hover:file:bg-gray-300 mb-3"
                            />

                            {(previewUrl || existingImageUrl) && (
                                <div className="relative w-full h-40 sm:h-52 rounded border border-gray-200 overflow-hidden">
                                    <Image
                                        src={fullUrl(previewUrl || existingImageUrl)}
                                        alt="Blog Image"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Title</label>
                            <input
                                type="text"
                                placeholder="Blog Title"
                                {...register("title", {
                                    required: "Title is required",
                                })}
                                onChange={handleTitleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-medium block mb-1">Slug</label>
                            <input
                                type="text"
                                placeholder="slug-url-path"
                                {...register("slug", {
                                    required: "Slug is required",
                                })}
                                onChange={handleSlugChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Description</label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <RichEditor
                                        value={field.value || ""}
                                        onChange={(v) => field.onChange(v)}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <div className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 cursor-pointer border-gray-300">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpen(false);
                                        resetFormAndStates();
                                    }}
                                    className=""
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="bg-black text-white px-5 py-2 rounded-lg text-sm hover:bg-gray-800 transition  cursor-pointer disabled:opacity-50">
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