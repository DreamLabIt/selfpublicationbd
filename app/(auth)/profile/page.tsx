"use client";

import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { user, loading, hasToken } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasToken) {
    return <div>Please login first.</div>;
  }

  if (!user) {
    return <div>User data not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="space-y-3 rounded-lg border p-5">
        <p>
          <strong>Name:</strong> {user.name || "N/A"}
        </p>

        <p>
          <strong>Email:</strong> {user.email || "N/A"}
        </p>

        {"phone" in user && (
          <p>
            <strong>Phone:</strong> {String(user.phone)}
          </p>
        )}

        {"role" in user && (
          <p>
            <strong>Role:</strong> {String(user.role)}
          </p>
        )}

        {"address" in user && (
          <p>
            <strong>Address:</strong> {String(user.address)}
          </p>
        )}
      </div>
    </div>
  );
}