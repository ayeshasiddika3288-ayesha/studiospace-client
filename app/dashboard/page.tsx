"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

type Booking = {
  _id: string;
  studioId: string;
  studioTitle: string;
  userName: string;
  userEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

const badgeClass: Record<Booking["status"], string> = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/dashboard");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (!user?.email) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings?hostEmail=${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => toast.error("Could not load booking requests"))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const updateStatus = async (id: string, status: "Confirmed" | "Completed") => {
    setUpdatingId(id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b))
      );
      toast.success(`Booking marked as ${status}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update booking");
    } finally {
      setUpdatingId("");
    }
  };

  if (isPending || !user || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const count = (s: Booking["status"]) =>
    bookings.filter((b) => b.status === s).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Host Dashboard</h1>
      <p className="opacity-70 mb-8">Manage booking requests for your studios</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-10">
        {[
          { label: "Total Requests", value: bookings.length },
          { label: "Pending", value: count("Pending") },
          { label: "Confirmed", value: count("Confirmed") },
          { label: "Completed", value: count("Completed") },
        ].map((s) => (
          <div key={s.label} className="card bg-base-100 border border-base-200 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-primary">{s.value}</p>
            <p className="text-sm opacity-70">{s.label}</p>
          </div>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No booking requests yet</p>
          <p className="opacity-70 mb-5">
            Requests will show up here when creators book your studios.
          </p>
          <Link href="/add-studio" className="btn btn-primary">
            Add New Studio
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Guest</th>
                <th>Date and time</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="font-semibold">{b.studioTitle}</td>
                  <td>
                    <p>{b.userName}</p>
                    <p className="text-xs opacity-70">{b.userEmail}</p>
                  </td>
                  <td>
                    {b.date}
                    <br />
                    <span className="text-xs opacity-70">
                      {b.startTime} - {b.endTime}
                    </span>
                  </td>
                  <td>${Number(b.totalPrice).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${badgeClass[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="text-right">
                    {b.status === "Pending" && (
                      <button
                        onClick={() => updateStatus(b._id, "Confirmed")}
                        disabled={updatingId === b._id}
                        className="btn btn-sm btn-success"
                      >
                        Confirm
                      </button>
                    )}
                    {b.status === "Confirmed" && (
                      <button
                        onClick={() => updateStatus(b._id, "Completed")}
                        disabled={updatingId === b._id}
                        className="btn btn-sm btn-info"
                      >
                        Mark Completed
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}