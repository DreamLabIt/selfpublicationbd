import { API_KEY, BACKEND_URL } from "@/utils/api";
import { Book } from "@/components/site/BookCard";
import BookListClient from "./BookListClient";
import { BookListProps } from "@/types";

export default async function BookList({ category, searchParams }: BookListProps) {
  const q = searchParams?.q || "";
  const baseUrl = (BACKEND_URL || "").replace(/\/$/, "");
  const endpoint =
    category && category !== "all"
      ? `/api/books?category=${category}&featured=true`
      : "/api/books";

  const fullUrl = q
    ? `${baseUrl}${endpoint}&q=${encodeURIComponent(q)}`
    : `${baseUrl}${endpoint}`;

  let books: Book[] = [];

  try {
    const res = await fetch(fullUrl, {
      headers: {
        "x-api-key": API_KEY || "",
      },
      next: { revalidate: 60 },
    });

    if (res.ok) {
      const data = await res.json();
      books = Array.isArray(data) ? data : data?.data || data?.books || [];
    } else {
      console.error("Server API Failed with Status:", res.status);
    }
  } catch (error) {
    console.error("Server Fetch Error:", error);
    books = [];
  }

  return <BookListClient category={category} books={books} q={q} />;
}