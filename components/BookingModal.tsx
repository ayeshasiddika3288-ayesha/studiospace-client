
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import type { Studio } from "@/lib/types";
import { API_URL, ensureServerSession } from "@/lib/api";

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};

export default function BookingModal({ studio }: { studio: Studio }) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  const hours =
    startTime && endTime && endTime > startTime
      ? Math.round(
          ((toMinutes(endTime) - toMinutes(startTime)) / 60) * 100
        ) / 100
      : 0;

  const total = Math.round(hours * studio.hourlyRate * 100) / 100;

  const handleOpen = () => {
    if (!user) {
      toast.error("Please login to book a studio");
      router.push(`/login?redirect=/studios/${studio._id}`);
      return;
    }

    setOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (endTime <= startTime) {
      setFormError("End time must be after start time");
      return;
    }

    setLoading(true);

    try {
      await ensureServerSession();

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          studioId: studio._id,
          date,
          startTime,
          endTime,
          userEmail: user?.email,
          userName: user?.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Booking failed");
        toast.error(data.message || "Booking failed");
        return;
      }

      toast.success("Booking request sent! Status: Pending");
      setOpen(false);
      router.push("/my-bookings");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={handleOpen} className="btn btn-primary mt-2">
        Book Workspace Now
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget && !loading) {
                setOpen(false);
              }
            }}
          >
            <div className="relative z-[10000] max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-base-100 p-6 shadow-2xl">
              <h3 className="text-xl font-bold">
                Book {studio.title}
              </h3>

              <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                <label className="form-control">
                  <span className="label-text mb-1">Date</span>
                  <input
                    type="date"
                    min={today}
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input input-bordered w-full"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="form-control">
                    <span className="label-text mb-1">Start time</span>
                    <input
                      type="time"
                      required
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </label>

                  <label className="form-control">
                    <span className="label-text mb-1">End time</span>
                    <input
                      type="time"
                      required
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </label>
                </div>

                <div className="rounded-box bg-base-200 p-3 text-sm space-y-1">
                  <p>
                    Duration:{" "}
                    <span className="font-semibold">{hours} hr</span>
                  </p>

                  <p>
                    Total price:{" "}
                    <span className="font-semibold text-primary">
                      ${total}
                    </span>
                  </p>

                  <p className="opacity-70">
                    Refundable security deposit: $
                    {studio.securityDeposit}
                  </p>
                </div>

                {formError && (
                  <p className="text-error text-sm">{formError}</p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    className="btn"
                    onClick={() => setOpen(false)}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      "Confirm Booking"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
