'use client';

import { useAuth } from "@/context/AuthContext";
import AdminSidebar from "./AdminSidebar";
export default function AdminSidebarWrapper() {
  const { admin, logout } = useAuth();
  return (
    <AdminSidebar
      onLogout={logout}
      userDisplayName={admin?.name || admin?.email || "Admin"}
    />
  );
}