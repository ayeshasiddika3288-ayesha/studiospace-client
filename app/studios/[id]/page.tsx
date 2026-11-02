import { notFound } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { FiMapPin, FiUsers, FiShield, FiCheck } from "react-icons/fi";
import type { Studio } from "@/lib/types";
import BookingModal from "@/components/BookingModal";

async function getStudio(id: string): Promise<Studio | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/studios/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StudioDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studio = await getStudio(id);
  if (!studio) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="w-full h-72 sm:h-96 object-cover rounded-box"
        />

        <div>
          <span className="badge badge-primary mb-2">{studio.category}</span>
          <h1 className="text-3xl font-bold">{studio.title}</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm opacity-80">
            <span className="flex items-center gap-1">
              <FiMapPin /> {studio.location}
            </span>
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-400" />
              {studio.rating ? studio.rating.toFixed(1) : "New"}
            </span>
            <span className="flex items-center gap-1">
              <FiUsers /> Up to {studio.maxCapacity} people
            </span>
          </div>
        </div>

        <section>
          <h2 className="text-xl font-semibold mb-2">Overview</h2>
          <p className="opacity-80 leading-relaxed">{studio.overview}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">Amenities</h2>
          {studio.amenities?.length ? (
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {studio.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <FiCheck className="text-primary" /> {a}
                </li>
              ))}
            </ul>
          ) : (
            <p className="opacity-70 text-sm">No amenities listed.</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Reviews</h2>
          <div className="rounded-box border border-base-200 p-6 text-center opacity-80">
            No reviews yet. Be the first to book and share your experience.
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-24 h-fit">
        <div className="card bg-base-100 shadow-xl border border-base-200">
          <div className="card-body gap-3">
            <p className="text-3xl font-bold text-primary">
              ${studio.hourlyRate}{" "}
              <span className="text-base font-normal">/ hr</span>
            </p>
            <p className="flex items-center gap-2 text-sm">
              <FiShield /> Security deposit: ${studio.securityDeposit}
            </p>

            <div className="divider my-1"></div>
            <div>
              <p className="text-sm opacity-70">Hosted by</p>
              <p className="font-semibold">{studio.ownerName}</p>
              <p className="text-sm opacity-70">{studio.ownerEmail}</p>
            </div>

            <BookingModal studio={studio} />
          </div>
        </div>
      </aside>
    </div>
  );
}