"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const validatePassword = (password: string) => {
  if (!/[A-Z]/.test(password)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must have a lowercase letter";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [passwordError, setPasswordError] = useState("");

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

  const handleChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const currentPassword = String(fd.get("currentPassword") || "");
    const newPassword = String(fd.get("newPassword") || "");
    const confirmPassword = String(fd.get("confirmPassword") || "");

    const validation = validatePassword(newPassword);
    if (validation) {
      setPasswordError(validation);
      toast.error(validation);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirm password do not match");
      toast.error("Passwords do not match");
      return;
    }
    setPasswordError("");

    setChanging(true);
    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setChanging(false);

    if (error) {
      toast.error(error.message || "Could not change password");
      return;
    }
    toast.success("Password changed successfully!");
    form.reset();
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-3xl font-bold text-center">My Profile</h1>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <form onSubmit={handleSubmit} className="card-body gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="avatar">
              <div className="w-24 rounded-full ring ring-primary ring-offset-2 bg-primary text-primary-content flex items-center justify-center">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name} />
                ) : (
                  <span className="text-4xl font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </span>
                )}
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

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <form onSubmit={handleChangePassword} className="card-body gap-4">
          <h2 className="text-xl font-bold">Change Password</h2>

          <label className="form-control">
            <span className="label-text mb-1">Current Password</span>
            <input
              name="currentPassword"
              type="password"
              required
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">New Password</span>
            <input
              name="newPassword"
              type="password"
              required
              placeholder="Min 6 chars, upper and lower case"
              className="input input-bordered w-full"
            />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Confirm New Password</span>
            <input
              name="confirmPassword"
              type="password"
              required
              className="input input-bordered w-full"
            />
            {passwordError && (
              <span className="text-error text-sm mt-1">{passwordError}</span>
            )}
          </label>

          <button type="submit" disabled={changing} className="btn btn-primary">
            {changing ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Change Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}