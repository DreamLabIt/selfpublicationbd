import { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_KEY, BACKEND_URL } from "@/utils/api";
import BookDetails from "@/components/site/BookDetails";
import { PageProps } from "@/types";

const baseUrl = (BACKEND_URL || "").replace(/\/$/, "");

async function getBookData(id: string) {
    try {
        if (!baseUrl) {
            console.error("BACKEND_URL is undefined!");
            return null;
        }

        const url = `${baseUrl}/api/books/${id}`;
        const res = await fetch(url, {
            headers: {
                "x-api-key": API_KEY || "",
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 }
        });

        if (!res.ok) {
            console.error(`API Error Status: ${res.status}`);
            return null;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            console.error(`Expected JSON but got HTML/Text`);
            return null;
        }
        const data = await res.json();
        return data?.data || data?.book || data;
    } catch (err) {
        console.error("Error fetching book data:", err);
        return null;
    }
}

async function getRelatedBooks(id: string) {
    try {
        if (!baseUrl) return [];

        const res = await fetch(`${baseUrl}/api/books/${id}/related`, {
            headers: {
                "x-api-key": API_KEY || "",
                "Content-Type": "application/json",
            },
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : data?.data || data?.books || [];
    } catch (err) {
        console.error("Error fetching related books:", err);
        return [];
    }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { id } = await params;
    const book = await getBookData(id);

    if (!book) {
        return { title: "Book Not Found | Self Publication BD" };
    }

    const plainDescription = (book.description || "Best books and eBooks platform in Bangladesh")
        .replace(/<[^>]+>/g, "")
        .slice(0, 160);

    const coverImage = book.cover_image?.startsWith("/")
        ? `${baseUrl}${book.cover_image}`
        : book.cover_image;

    return {
        title: `${book.title || "Book"} | Self Publication BD`,
        description: plainDescription,
        openGraph: {
            title: book.title,
            description: plainDescription,
            images: coverImage ? [{ url: coverImage }] : [],
        },
    };
}

export default async function BookDetailsPage({ params }: PageProps) {
    const { id } = await params;

    const [book, related] = await Promise.all([
        getBookData(id),
        getRelatedBooks(id),
    ]);

    if (!book) {
        notFound();
    }

    return <BookDetails initialBook={book} initialRelated={related} />;
}