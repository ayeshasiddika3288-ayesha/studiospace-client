"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/profile");
    }
  }, [isPending, user, router]);

  if (isPending || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "");
    const image = String(fd.get("image") || "");

    setSaving(true);
    const { error } = await authClient.updateUser({
      name,
      image: image || undefined,
    });
    setSaving(false);

    if (error) {
      toast.error(error.message || "Could not update profile");
      return;
    }
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">My Profile</h1>
      <div className="card bg-base-100 shadow-xl border border-base-200">
        <form onSubmit={handleSubmit} className="card-body gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.image || "https://i.ibb.co/2kR5zq0/user.png"}
                  alt={user.name}
                />
              </div>
            </div>
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-sm opacity-70">{user.email}</p>
          </div>

          <label className="form-control">
            <span className="label-text mb-1">Name</span>
            <input
              name="name"
              required
              defaultValue={user.name}
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Email</span>
            <input
              value={user.email}
              readOnly
              className="input input-bordered w-full bg-base-200"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Photo URL</span>
            <input
              name="image"
              type="url"
              defaultValue={user.image ?? ""}
              placeholder="https://..."
              className="input input-bordered w-full"
            />
          </label>

          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}