import Image from "next/image";
import Link from "next/link";
import { Eye } from "lucide-react";
import { API_KEY, BACKEND_URL } from "@/utils/api";
import { BlogItem } from "@/types";

async function getBlogs(): Promise<BlogItem[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/blogs`, {
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
      throw new Error("Failed to fetch blogs");
    }

    return await response.json();
  } catch (error) {
    console.error("Blog Fetch Error:", error);
    return [];
  }
}

function getImageUrl(image: string) {

  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${BACKEND_URL}${image}`;
}

export default async function BlogPage() {
  const items = await getBlogs();

  return (
    <main>

      <section className="bg-hero-grad py-10 sm:py-13">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1">
          <p className="text-xs font-bold tracking-wider text-brand-red uppercase">
            INSIGHTS
          </p>

          <h1 className="pt-1 text-3xl sm:text-5xl font-bold text-brand-navy leading-tight">
            Blog & Insights
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <div className="text-center py-20 text-brand-navy">
            No blogs found.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((blog) => (
              <article
                key={blog.id}
                className="group bg-white border border-brand-light rounded-2xl overflow-hidden shadow-sm hover:shadow-soft hover:-translate-y-1 transition-all duration-300"
              >
                <Link href={`/blog/${blog.id}`}>
                  <div className="relative aspect-video bg-brand-light/40 overflow-hidden">
                    <Image
                      src={getImageUrl(blog.cover_image)}
                      alt={blog.title}
                      fill
                      unoptimized
                      sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="p-5 pb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                      {blog.category}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-brand-navy line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="mt-2 text-sm text-brand-navy/70 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    <div className="mt-4 flex items-center justify-between text-xs text-brand-navy/60">
                      <span className="font-medium">
                        {blog.author}
                      </span>

                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        {blog.views ?? 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}