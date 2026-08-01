import Image from "next/image";
import { Eye } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BACKEND_URL } from "@/utils/api";
import ShareButtons from "@/components/site/ShareButtons";
import Description from "@/components/site/Description";
import { PageProps } from "@/types";
import { getBlogBySlugAction } from "@/app/actions/blog";

export interface BlogData {
  _id: string;
  image?: string;
  cover_image?: string;
  title: string;
  description?: string;
  content?: string;
  category?: string;
  author?: string;
  views?: number;
}

export interface BlogResponse {
  data: BlogData;
}

const stripHtml = (html: string = "") => {
  return html.replace(/<[^>]*>?/gm, "").replace(/&nbsp;/g, " ").trim();
};

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
  const blog = res?.data as BlogResponse | BlogData | undefined;
  const blogData: BlogData | undefined =
    blog && "data" in blog && blog.data ? blog.data : (blog as BlogData);

  if (!res?.success || !blogData || !blogData.title) {
    return {
      title: "Blog Not Found",
    };
  }

  const rawImage = blogData.image || blogData.cover_image;
  const rawDescription = blogData.description || blogData.content || "";
  const cleanDescription = stripHtml(rawDescription).slice(0, 160);
  const fullImageUrl = getImageUrl(
    typeof rawImage === "string" ? rawImage : undefined
  );

  return {
    title: blogData.title,
    description: cleanDescription,
    openGraph: {
      title: blogData.title,
      description: cleanDescription,
      images: fullImageUrl ? [{ url: fullImageUrl }] : [],
    },
  };
}

export default async function BlogDetails({ params }: PageProps) {
  const { id } = await params;
  const res = await getBlogBySlugAction(id);
  const blog = res?.data as BlogResponse | BlogData | undefined;
  const blogData: BlogData | undefined =
    blog && "data" in blog && blog.data ? blog.data : (blog as BlogData);

  if (!res?.success || !blogData || !blogData.title) {
    notFound();
  }

  const rawImage = blogData.image || blogData.cover_image;
  const imageUrl = getImageUrl(
    typeof rawImage === "string" ? rawImage : undefined
  );
  const contentBody = blogData.description || blogData.content || "";

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {blogData.category && (
        <div className="text-xs font-bold tracking-wider text-brand-red uppercase">
          {blogData.category}
        </div>
      )}

      <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2 leading-tight">
        {blogData.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-3 text-xs text-brand-navy/60">
          {blogData.author && <span>{blogData.author}</span>}
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {blogData.views ?? 0} reads
          </span>
        </div>
      </div>

      {imageUrl && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-brand-light/40">
          <Image
            src={imageUrl}
            alt={blogData.title || "Blog Image"}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      <article className="mt-8 prose prose-slate max-w-none text-brand-navy/85 leading-relaxed text-base wrap-break-word">
        <Description description={contentBody} />
      </article>

      <div className="mt-12 pt-8 border-t border-brand-light">
        <ShareButtons title={blogData.title} />
      </div>
    </main>
  );
}
