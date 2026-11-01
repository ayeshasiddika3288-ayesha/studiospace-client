import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import type { Studio } from "@/lib/types";

export default function StudioCard({ studio }: { studio: Studio }) {
  return (
    <div className="card bg-base-100 shadow-md border border-base-200 h-full">
      <figure className="relative h-56">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={studio.image}
          alt={studio.title}
          className="h-56 w-full object-cover"
        />
        <span className="badge badge-primary absolute top-3 left-3">
          {studio.category}
        </span>
        <span className="badge badge-neutral absolute top-3 right-3 gap-1">
          <FaStar className="text-yellow-400" />
          {studio.rating ? studio.rating.toFixed(1) : "New"}
        </span>
      </figure>
      <div className="card-body gap-2">
        <h3 className="card-title text-lg line-clamp-1">{studio.title}</h3>
        <p className="flex items-center gap-1 text-sm opacity-80 line-clamp-1">
          <FiMapPin className="shrink-0" /> {studio.location}
        </p>
        <p className="text-xl font-bold text-primary">
          ${studio.hourlyRate} <span className="text-sm font-normal">/ hr</span>
        </p>
        <div className="card-actions mt-auto">
          <Link href={`/studios/${studio._id}`} className="btn btn-primary btn-sm w-full">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}