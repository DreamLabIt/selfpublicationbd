import React from "react";
import AdminSidebarWrapper from "./Sidebar/AdminSidebarWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      <AdminSidebarWrapper />

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div>
            <div className="text-xs text-slate-500">Welcome back,</div>
            <div className="font-bold text-slate-800">Admin Panel</div>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}