import { getAllBlogsAdminAction } from "@/app/actions/blog";
import AdminBlogsClient from "./AdminBlogs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin - Blog Management",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminBlogsPage() {
  const res = await getAllBlogsAdminAction();
  const blogsData = res.data;
  // console.log("blogsData", blogsData);

  return (
    <AdminBlogsClient
      initialBlogs={blogsData as any}
      errorMessage={!res.success ? res.message : undefined}
    />
  );
}