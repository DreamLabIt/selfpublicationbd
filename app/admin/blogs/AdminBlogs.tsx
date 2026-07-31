"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
    createBlogAction,
    updateBlogAction,
    deleteBlogAction,
} from "@/app/actions/blog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Image as ImageIcon } from "lucide-react";
import { BACKEND_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
// import RichEditor from "@/components/admin/RichEditor";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

interface Blog {
    _id: string;
    id?: string;
    image?: string;
    cover_image?: string;
    title: string;
    slug: string;
    excerpt?: string;
    description?: string;
    content?: string;
    order?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

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

const generateSlug = (text: string) => {
    if (!text) return "";

    return text
        .trim()
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

export default function AdminBlogs({ initialBlogs = [] }: AdminBlogsClientProps) {
    const [open, setOpen] = useState(false);
    const [editId, setEditId] = useState<string | number | null>(null);
    const [existingImageUrl, setExistingImageUrl] = useState<string>("");
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const router = useRouter();

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

    const selectedFiles = useWatch({ control, name: "file" });
    const titleValue = useWatch({ control, name: "title" });

    // Manage file object preview
    useEffect(() => {
        if (selectedFiles && selectedFiles.length > 0) {
            const file = selectedFiles[0];
            const objectUrl = URL.createObjectURL(file);

            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPreviewUrl(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        } else {
            setPreviewUrl("");
        }
    }, [selectedFiles]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (!editId) {
            setValue("slug", generateSlug(val), { shouldValidate: true });
        }
    };

    const openNew = () => {
        reset(defaultValues);
        setEditId(null);
        setExistingImageUrl("");
        setPreviewUrl("");
        setOpen(true);
    };

    const openEdit = (blog: Blog) => {
        reset({
            title: blog.title || "",
            slug: blog.slug || "",
            excerpt: blog.excerpt || blog.description || "",
            content: blog.content || "",
            file: null,
        });

        setEditId(blog._id || blog.id || null);
        setExistingImageUrl(blog.cover_image || blog.image || "");
        setPreviewUrl("");
        setOpen(true);
    };

    const deleteBlog = async (id: string | number) => {
        const confirmDelete = confirm("Delete this blog?");
        if (!confirmDelete) return;

        const res = await deleteBlogAction(id);
        if (res.success) {
            toast.success(res.message || "Blog deleted");
            router.refresh();
        } else {
            toast.error(res.message || "Failed to delete blog");
        }
    };

    const onSubmit = async (data: BlogFormValues) => {
        try {
            const formData = new FormData();

            const rawSlug = data.slug && data.slug.trim() !== "" ? data.slug : data.title;
            let finalSlug = generateSlug(rawSlug);

            if (!finalSlug || finalSlug.trim() === "") {
                finalSlug = "blog-untitled";
            }

            formData.append("title", data.title);
            formData.append("slug", finalSlug);
            formData.append("excerpt", data.excerpt || "");
            formData.append("content", data.content || "");
            formData.append("description", data.excerpt || data.content || "");
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
                toast.success(res.message || (editId ? "Blog updated" : "Blog created"));
                setOpen(false);
                reset(defaultValues);
                setPreviewUrl("");
                setExistingImageUrl("");
                router.refresh();
            } else {
                toast.error(res.message || "Operation failed");
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
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blogs</h1>

                <div className="bg-black text-white px-4 py-2 rounded-lg  hover:bg-gray-800 transition">
                    <button
                        onClick={openNew}
                        className="flex items-center gap-2 text-sm"
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
                        const imageUrl = blog.image;
                        const blogId = blog._id || blog.id || "";
                        return (
                            <div
                                key={blogId}
                                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
                            >
                                {/* IMAGE */}
                                {imageUrl ? (
                                    <div className="relative w-full h-40 sm:h-52">
                                        <Image
                                            src={fullUrl(imageUrl)}
                                            alt={blog.title}
                                            fill
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
                                    <h2 className="font-bold text-lg ">
                                        {blog.title}
                                    </h2>

                                    {/* ACTIONS */}
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={() => openEdit(blog)}
                                            className="p-2 rounded hover:bg-gray-100"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <button
                                            onClick={() => deleteBlog(blogId)}
                                            className="p-2 rounded text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* MODAL */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-2xl w-[95vw] sm:w-full z-100 max-h-[85vh] overflow-y-auto">
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
                                className="block w-full text-sm file:mr-2 file:rounded file:bg-gray-200 file:px-1 file:text-black file:cursor-pointer file:border hover:file:bg-gray-300 mb-2"
                            />

                            {(previewUrl || existingImageUrl) && (() => {
                                const modalImg = previewUrl || existingImageUrl;
                                const full = fullUrl(modalImg);
                                return (
                                    <Image
                                        src={full}
                                        alt={titleValue || "Blog Image"}
                                        width={500}
                                        height={300}
                                        className="w-full border border-gray-300 h-40 rounded sm:h-52 object-cover"
                                        unoptimized={full.startsWith("blob:")}
                                    />
                                );
                            })()}
                        </div>

                        {/* TITLE */}
                        <input
                            type="text"
                            placeholder="Blog Title"
                            {...register("title", {
                                required: "Title is required",
                                onChange: handleTitleChange
                            })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        />

                        {/* SLUG */}
                        <input
                            type="text"
                            placeholder="slug-url-path"
                            {...register("slug", { required: true })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50"
                        />

                        {/* EXCERPT */}
                        <textarea
                            placeholder="Short Description"
                            {...register("excerpt")}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            rows={3}
                        />

                        {/* CONTENT (Rich Text Editor) */}
                        <div>
                            <label className="text-sm font-medium mb-1 block">Content</label>
                            {/* <Controller
                                name="content"
                                control={control}
                                render={({ field }) => (
                                    <RichEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            /> */}
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-2">
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
                                    disabled={isSubmitting}
                                >
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