"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

const categories = ["Photo Studio", "Film Stage", "Podcast Lounge", "Music Suite", "Workshop"];
const amenityOptions = [
  "WiFi", "Air Conditioning", "Soundproofing", "Lighting Kit",
  "Green Screen", "Parking", "Makeup Room", "Backdrops",
];

export default function AddStudioPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/add-studio");
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

    const studio = {
      title: fd.get("title"),
      category: fd.get("category"),
      hourlyRate: Number(fd.get("hourlyRate")),
      securityDeposit: Number(fd.get("securityDeposit")),
      maxCapacity: Number(fd.get("maxCapacity")),
      location: fd.get("location"),
      image: fd.get("image"),
      amenities: fd.getAll("amenities"),
      overview: fd.get("overview"),
      ownerName: user.name,
      ownerEmail: user.email,
    };

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(studio),
      });
      if (!res.ok) throw new Error("Failed to add studio");
      toast.success("Studio listed successfully!");
      router.push("/my-listings");
    } catch {
      toast.error("Could not add the studio. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-8">Add New Studio</h1>
      <form onSubmit={handleSubmit} className="card bg-base-100 shadow-xl border border-base-200 p-6 grid gap-4 sm:grid-cols-2">
        <label className="form-control sm:col-span-2">
          <span className="label-text mb-1">Studio Title</span>
          <input name="title" required placeholder="Sunlit Cyc Wall Photo Studio" className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Category</span>
          <select name="category" required defaultValue="" className="select select-bordered w-full">
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Location / Address</span>
          <input name="location" required placeholder="Gulshan 2, Dhaka" className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Hourly Rate ($)</span>
          <input name="hourlyRate" type="number" min="1" required className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Security Deposit ($)</span>
          <input name="securityDeposit" type="number" min="0" required className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Max Capacity</span>
          <input name="maxCapacity" type="number" min="1" required className="input input-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Image URL</span>
          <input name="image" type="url" required placeholder="https://images.unsplash.com/photo-1783067091773-fc175ae0dbfb?w=800&auto=format&fit=crop&q=70" className="input input-bordered w-full" />
        </label>

        <div className="sm:col-span-2">
          <span className="label-text mb-2 block">Amenities</span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {amenityOptions.map((a) => (
              <label key={a} className="label cursor-pointer justify-start gap-2">
                <input type="checkbox" name="amenities" value={a} className="checkbox checkbox-primary checkbox-sm" />
                <span className="label-text">{a}</span>
              </label>
            ))}
          </div>
        </div>

        <label className="form-control sm:col-span-2">
          <span className="label-text mb-1">Detailed Overview</span>
          <textarea name="overview" required rows={4} placeholder="Describe the space, equipment, and rules" className="textarea textarea-bordered w-full" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Host Name</span>
          <input value={user.name} readOnly className="input input-bordered w-full bg-base-200" />
        </label>

        <label className="form-control">
          <span className="label-text mb-1">Host Email</span>
          <input value={user.email} readOnly className="input input-bordered w-full bg-base-200" />
        </label>

        <button type="submit" disabled={loading} className="btn btn-primary sm:col-span-2 mt-2">
          {loading ? <span className="loading loading-spinner"></span> : "Add Studio"}
        </button>
      </form>
    </div>
  );
}