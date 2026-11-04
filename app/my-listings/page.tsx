"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/lib/types";
import { API_URL, ensureServerSession } from "@/lib/api";

export default function MyListingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/my-listings");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (!user?.email) return;
    fetch(
      `${API_URL}/api/studios?ownerEmail=${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then((data) => setStudios(data))
      .catch(() => toast.error("Could not load your listings"))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await ensureServerSession();
      const res = await fetch(
        `${API_URL}/api/studios/${deleteTarget._id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (!res.ok) throw new Error();
      setStudios((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      toast.success("Studio deleted successfully");
      setDeleteTarget(null);
    } catch {
      toast.error("Could not delete the studio");
    } finally {
      setDeleting(false);
    }
  };

  if (isPending || !user || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <h1 className="text-3xl font-bold">My Studio Listings</h1>
        <Link href="/add-studio" className="btn btn-primary">
          Add New Studio
        </Link>
      </div>

      {studios.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">You have not listed any studio yet</p>
          <p className="opacity-70 mb-5">List your space and start welcoming creators.</p>
          <Link href="/add-studio" className="btn btn-primary">
            Add Your First Studio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Category</th>
                <th>Rate</th>
                <th>Location</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studios.map((studio) => (
                <tr key={studio._id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={studio.image}
                        alt={studio.title}
                        className="h-12 w-16 rounded object-cover"
                      />
                      <span className="font-semibold">{studio.title}</span>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-outline">{studio.category}</span>
                  </td>
                  <td>${studio.hourlyRate} / hr</td>
                  <td>{studio.location}</td>
                  <td>
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/studios/edit/${studio._id}`}
                        className="btn btn-sm btn-outline btn-primary"
                      >
                        Update
                      </Link>
                      <button
                        onClick={() => setDeleteTarget(studio)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={`modal ${deleteTarget ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Delete this studio?</h3>
          <p className="py-4">
            <span className="font-semibold">{deleteTarget?.title}</span> will be
            permanently removed. This action cannot be undone.
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </button>
            <button
              className="btn btn-error"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? <span className="loading loading-spinner"></span> : "Yes, Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}