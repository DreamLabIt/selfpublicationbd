import Image from "next/image";
import { Eye } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_KEY, BACKEND_URL } from "@/utils/api";
import ShareButtons from "@/components/site/ShareButtons";
import Description from "@/components/site/Description";
import { Blog, PageProps } from "@/types";

function getBaseUrl() {
  const url = BACKEND_URL;
  return url.replace(/\/api\/?$/, "").replace(/\/$/, "");
}

function getImageUrl(image: string) {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  return `${getBaseUrl()}${image}`;
}

async function getBlog(id: string): Promise<Blog | null> {
  try {
    const cleanBaseUrl = getBaseUrl();
    const targetUrl = `${cleanBaseUrl}/api/blogs/${id}`;

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY || "",
      },
      next: {
        revalidate: 3600,
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch blog. Status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data || data;
  } catch (error) {
    console.error("Fetch Blog Error:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: [getImageUrl(blog.cover_image)],
    },
  };
}

export default async function BlogDetails({ params }: PageProps) {
  const { id } = await params;
  const blog = await getBlog(id);

  if (!blog) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-xs font-bold tracking-wider text-brand-red uppercase">
        {blog.category}
      </div>

      <h1 className="text-3xl md:text-4xl font-bold text-brand-navy mt-2 leading-tight">
        {blog.title}
      </h1>

      <div className="flex items-center justify-between flex-wrap gap-3 mt-3">
        <div className="flex items-center gap-3 text-xs text-brand-navy/60">
          <span>{blog.author}</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> {blog.views ?? 0} reads
          </span>
        </div>
      </div>

      {blog.cover_image && (
        <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-brand-light/40">
          <Image
            src={getImageUrl(blog.cover_image)}
            alt={blog.title}
            fill
            priority
            unoptimized
            className="object-cover"
          />
        </div>
      )}

      <article className="mt-8 prose max-w-none text-brand-navy ">
        <Description description={blog.content} />
      </article>

      <div className="mt-12 pt-8 border-t border-brand-light">
        <ShareButtons title={blog.title} />
      </div>
    </main>
  );
}
