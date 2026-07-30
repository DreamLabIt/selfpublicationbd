"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
    createBlogAction,
    updateBlogAction,
    deleteBlogAction,
} from "@/app/actions/blog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { BACKEND_URL } from "@/utils/api";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface AdminBlogsClientProps {
    initialBlogs: Blog[];
    errorMessage?: string;
}

interface BlogFormValues {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    file: FileList | null;
}

const defaultValues: BlogFormValues = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    file: null,
};

interface Blog {
    _id: string;
    id: string;
    image: string;
    title: string;
    slug: string;
    description: string;
    order: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

// Helper function to generate slug from title
const generateSlug = (text: string) => {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export default function AdminBlogs({
    initialBlogs,
}: AdminBlogsClientProps) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | number | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<BlogFormValues>({
        defaultValues,
    });

    // Watch selected files to manage object URL safely
    const selectedFiles = watch("file");

    useEffect(() => {
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);

            // Cleanup memory leak
            return () => URL.revokeObjectURL(url);
        } else {
            setPreviewUrl("");
        }
    }, [selectedFiles]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const titleValue = e.target.value;
        setValue("title", titleValue);
        if (!editId) {
            setValue("slug", generateSlug(titleValue));
        }
    };

    const openNew = () => {
        reset(defaultValues);
        setEditId(null);
        setExistingImageUrl("");
        setOpen(true);
    };

    const openEdit = (blog: Blog) => {
        reset({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.description,
            content: "",
            file: null,
        });

        setEditId(blog._id);
        setExistingImageUrl(blog.image);
        setOpen(true);
    };

    const handleDelete = async (id: string | number) => {
        if (!confirm("Are you sure you want to delete this blog?")) return;

        const res = await deleteBlogAction(id);
        if (res.success) {
            toast.success(res.message || "Blog deleted");
        } else {
            toast.error(res.message || "Failed to delete blog");
        }
    };

    const onSubmit = async (data: BlogFormValues) => {
        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("slug", data.slug || generateSlug(data.title));
            formData.append("excerpt", data.excerpt);
            formData.append("content", data.content);
            formData.append("description", data.excerpt || data.content);
            formData.append("category", "general");

            if (data.file && data.file.length > 0) {
                formData.append("image", data.file[0]);
            }

            let res;
            if (editId) {
                res = await updateBlogAction(editId, formData);
            } else {
                res = await createBlogAction(formData);
            }

            if (res.success) {
                toast.success(res.message);
                setOpen(false);
                reset(defaultValues);
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error("Something went wrong");
        }
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
        <div className="p-4 sm:p-6">
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blogs</h1>

                <div className="bg-black text-white px-3 sm:px-4 py-2 rounded-lg  text-sm hover:bg-gray-800 transition">
                    <button
                        onClick={openNew}
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Blog
                    </button>
                </div>
            </div>

            {/* BLOG LIST */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {initialBlogs.map((blog) => (
                    <div
                        key={blog.id}
                        className="bg-white border rounded-2xl overflow-hidden shadow-sm"
                    >
                        {blog.image ? (
                            <Image
                                src={fullUrl(blog.image)}
                                alt={blog.title}
                                width={400}
                                height={200}
                                className="w-full h-40 sm:h-52 object-cover"
                            />
                        ) : (
                            <div className="w-full h-40 sm:h-52 bg-gray-100 flex items-center justify-center">
                                <ImageIcon className="w-10 h-10 text-gray-400" />
                            </div>
                        )}

                        <div className="p-5">
                            <h2 className="font-bold text-lg line-clamp-1">
                                {blog.title}
                            </h2>

                            <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                                {blog.slug}
                            </p>

                            <p className="text-sm text-gray-700 mt-3 line-clamp-3">
                                {blog.description}
                            </p>

                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => openEdit(blog)}
                                    className="p-2 rounded hover:bg-gray-100 text-gray-600 hover:text-black"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => handleDelete(blog._id)}
                                    className="p-2 rounded text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl w-[95vw] sm:w-full z-[100] max-h-[85vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editId ? "Edit Blog" : "Add Blog"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* IMAGE UPLOAD */}
                        <div>
                            <label className="text-sm font-medium">
                                Upload Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("file")}
                                className="mt-2 block text-sm w-full"
                            />

                            {(previewUrl || existingImageUrl) && (
                                <Image
                                    src={previewUrl || fullUrl(existingImageUrl)}
                                    alt="Preview"
                                    width={128}
                                    height={128}
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mt-3 border"
                                />
                            )}
                        </div>

                        {/* TITLE */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Title</label>
                            <input
                                type="text"
                                placeholder="Blog Title"
                                {...register("title", { required: "Title is required" })}
                                onChange={handleTitleChange}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                            />
                            {errors.title && (
                                <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>
                            )}
                        </div>

                        {/* SLUG */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Slug</label>
                            <input
                                type="text"
                                placeholder="Slug"
                                {...register("slug")}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                            />
                        </div>

                        {/* EXCERPT */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Excerpt</label>
                            <textarea
                                placeholder="Short Description"
                                {...register("excerpt")}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                rows={2}
                            />
                        </div>

                        {/* CONTENT */}
                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Content</label>
                            <textarea
                                placeholder="Blog full content..."
                                {...register("content")}
                                className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black"
                                rows={5}
                            />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 disabled:opacity-50"
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}