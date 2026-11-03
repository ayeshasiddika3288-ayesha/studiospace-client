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
  studioImage: string;
  date: string;
  startTime: string;
  endTime: string;
  hours: number;
  totalPrice: number;
  status: "Pending" | "Confirmed" | "Completed" | "Cancelled";
};

const badgeClass: Record<Booking["status"], string> = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!isPending && !user) {
      router.replace("/login?redirect=/my-bookings");
    }
  }, [isPending, user, router]);

  useEffect(() => {
    if (!user?.email) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bookings?userEmail=${encodeURIComponent(user.email)}`
    )
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => toast.error("Could not load your bookings"))
      .finally(() => setLoading(false));
  }, [user?.email]);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${cancelTarget._id}/cancel`,
        { method: "PATCH", credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancelTarget._id ? { ...b, status: "Cancelled" } : b
        )
      );
      toast.success("Booking cancelled");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel booking");
    } finally {
      setCancelling(false);
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
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No bookings yet</p>
          <p className="opacity-70 mb-5">Find a studio and reserve your first slot.</p>
          <Link href="/studios" className="btn btn-primary">
            Explore Studios
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-box border border-base-200">
          <table className="table">
            <thead>
              <tr>
                <th>Studio</th>
                <th>Date</th>
                <th>Time</th>
                <th>Total</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td>
                    <Link
                      href={`/studios/${b.studioId}`}
                      className="flex items-center gap-3 hover:underline"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={b.studioImage}
                        alt={b.studioTitle}
                        className="h-12 w-16 rounded object-cover"
                      />
                      <span className="font-semibold">{b.studioTitle}</span>
                    </Link>
                  </td>
                  <td>{b.date}</td>
                  <td>
                  {b.startTime} - {b.endTime} ({parseFloat(Number(b.hours).toFixed(2))} hr)
                  </td>
                  <td>${Number(b.totalPrice).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${badgeClass[b.status]}`}>{b.status}</span>
                  </td>
                  <td className="text-right">
                    {b.status === "Pending" && (
                      <button
                        onClick={() => setCancelTarget(b)}
                        className="btn btn-sm btn-outline btn-error"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={`modal ${cancelTarget ? "modal-open" : ""}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">Cancel this booking?</h3>
          <p className="py-4">
            Your pending request for{" "}
            <span className="font-semibold">{cancelTarget?.studioTitle}</span> on{" "}
            {cancelTarget?.date} will be cancelled.
          </p>
          <div className="modal-action">
            <button
              className="btn"
              onClick={() => setCancelTarget(null)}
              disabled={cancelling}
            >
              Keep Booking
            </button>
            <button
              className="btn btn-error"
              onClick={handleCancel}
              disabled={cancelling}
            >
              {cancelling ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Yes, Cancel"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}