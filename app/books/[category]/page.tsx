import BookList from "@/components/site/BookList";
import { Suspense } from "react";
import { PageProp } from "@/types";

export default async function BookListPage({ params }: PageProp) {
  const resolvedParams = await params;
  const category = resolvedParams.category || "all";

  return (
    <Suspense
      fallback={
        <div className="text-center text-brand-navy/60 py-20">Loading...</div>
      }
    >
      <BookList category={category} />
    </Suspense>
  );
}