import Image from "next/image";
import { Eye } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BACKEND_URL } from "@/utils/api";
import ShareButtons from "@/components/site/ShareButtons";
import Description from "@/components/site/Description";
import { PageProps } from "@/types";
import { getBlogBySlugAction } from "@/app/actions/blog";

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "";
  if (
    imagePath.startsWith("blob:") ||
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://")
  ) {
    return imagePath;
  }

  const baseUrl = BACKEND_URL ? BACKEND_URL.replace(/\/$/, "") : "";
  const cleanPath = imagePath.replace(/^\//, "");

  if (cleanPath.startsWith("api/v1/")) {
    return `${baseUrl}/${cleanPath}`;
  }

  return `${baseUrl}/api/v1/${cleanPath}`;
};


export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const res = await getBlogBySlugAction(id);
  const blog = res.data;

  if (!res.success || !blog) {
    return {
      title: "Blog Not Found",
    };
  }

  const rawImage = blog.image || blog.cover_image;
  const rawDescription = blog.description || blog.excerpt || blog.content || "";
  const fullImageUrl = getImageUrl(typeof rawImage === "string" ? rawImage : undefined);

  return {
    title: blog.title,
    description: rawDescription,
    openGraph: {
      title: blog.title,
      description: rawDescription,
      images: fullImageUrl ? [fullImageUrl] : [],
    },
  };
}

export default async function BlogDetails({ params }: PageProps) {
  const { id } = await params;
  const res = await getBlogBySlugAction(id);
  const blog = res.data;

  if (!res.success || !blog) {
    notFound();
  }

  const rawImage = blog.image || blog.cover_image;
  const imageUrl = getImageUrl(typeof rawImage === "string" ? rawImage : undefined);
  const contentBody = blog.content || blog.description || blog.excerpt || "";

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {blog.category && (
        <div className="text-xs font-bold tracking-wider text-brand-red uppercase">
          {blog.category}
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2 leading-tight">
        {blog.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-3 text-xs text-brand-navy/60">
          {(blog as { author?: string }).author && (
            <span>{(blog as { author?: string }).author}</span>
          )}
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {(blog as { views?: number }).views ?? 0} reads
          </span>
        </div>
      </div>

      {/* Image Render */}
      {imageUrl && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-brand-light/40">
          <Image
            src={imageUrl}
            alt={blog.title || "Blog Image"}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      <article className="mt-8 prose max-w-none text-brand-navy">
        <Description description={contentBody} />
      </article>

      <div className="mt-12 pt-8 border-t border-brand-light">
        <ShareButtons title={blog.title} />
      </div>
    </main>
  );
}