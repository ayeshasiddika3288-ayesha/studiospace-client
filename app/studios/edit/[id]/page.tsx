"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { categories, amenityOptions } from "@/lib/constants";
import type { Studio } from "@/lib/types";

export default function EditStudioPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace(`/login?redirect=/studios/edit/${id}`);
    }
  }, [isPending, user, router, id]);

  useEffect(() => {
    if (!user) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data: Studio) => {
        if (data.ownerEmail !== user.email) {
          toast.error("You can only edit your own listings");
          router.replace("/my-listings");
          return;
        }
        setStudio(data);
      })
      .catch(() => {
        toast.error("Studio not found");
        router.replace("/my-listings");
      })
      .finally(() => setLoading(false));
  }, [user, id, router]);

  if (isPending || !user || loading || !studio) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const updated = {
      title: fd.get("title"),
      category: fd.get("category"),
      hourlyRate: Number(fd.get("hourlyRate")),
      securityDeposit: Number(fd.get("securityDeposit")),
      maxCapacity: Number(fd.get("maxCapacity")),
      location: fd.get("location"),
      image: fd.get("image"),
      amenities: fd.getAll("amenities"),
      overview: fd.get("overview"),
    };

    setSaving(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error();
      toast.success("Studio updated successfully!");
      router.push("/my-listings");
    } catch {
      toast.error("Could not update the studio. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Update Studio</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl border border-base-200 p-6 grid gap-4 sm:grid-cols-2">
        <label className="form-control sm:col-span-2">
          <span className="label-text mb-1">Studio Title</span>
          <input name="title" required defaultValue={studio.title} className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Category</span>
          <select name="category" required defaultValue={studio.category} className="select select-bordered w-full">
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Location / Address</span>
          <input name="location" required defaultValue={studio.location} className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Hourly Rate ($)</span>
          <input name="hourlyRate" type="number" min="1" required defaultValue={studio.hourlyRate} className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Security Deposit ($)</span>
          <input name="securityDeposit" type="number" min="0" required defaultValue={studio.securityDeposit} className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Max Capacity</span>
          <input name="maxCapacity" type="number" min="1" required defaultValue={studio.maxCapacity} className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Image URL</span>
          <input name="image" type="url" required defaultValue={studio.image} className="input input-bordered w-full" />
        </label>

        <div className="sm:col-span-2">
          <span className="label-text mb-2 block">Amenities</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {amenityOptions.map((a) => (
              <label key={a} className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  name="amenities"
                  value={a}
                  defaultChecked={studio.amenities?.includes(a)}
                  className="checkbox checkbox-primary checkbox-sm"
                />
                <span className="label-text">{a}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="form-control sm:col-span-2">
          <span className="label-text mb-1">Detailed Overview</span>
          <textarea name="overview" required rows={4} defaultValue={studio.overview} className="textarea textarea-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Host Name</span>
          <input value={studio.ownerName} readOnly className="input input-bordered w-full bg-base-200" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Host Email</span>
          <input value={studio.ownerEmail} readOnly className="input input-bordered w-full bg-base-200" />
        </label>

        <button type="submit" disabled={saving} className="btn btn-primary sm:col-span-2 mt-2">
          {saving ? <span className="loading loading-spinner"></span> : "Update Studio"}
        </button>
      </form>
    </div>
  );
}