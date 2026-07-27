import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/auth";
import { getEbookSubscriptionsAction } from "@/app/actions/profile";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const userRes = await getUserProfile();

  if (!userRes || !userRes.success || !userRes.data) {
    redirect("/login");
  }

  const user = userRes.data as {
    name: string;
    email: string;
    role: string;
    phone?: string;
  };

  if (user.role !== "customer") {
    redirect("/admin");
  }

  const subscriptions = await getEbookSubscriptionsAction();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-2xl bg-[#0B1E8A] text-white flex items-center justify-center text-2xl font-bold uppercase shadow-md">
          {user.name?.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#08145A]">{user.name}</h1>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>
      <ProfileClient user={user} subscriptions={subscriptions} />
    </div>
  );
}