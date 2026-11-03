import Link from "next/link";
import { FiSearch, FiClock, FiCheckCircle, FiVideo } from "react-icons/fi";

const steps = [
  {
    icon: FiSearch,
    title: "1. Discover Spaces",
    text: "Browse photo studios, sound stages, podcast rooms, music suites, and art workshops. Filter by category and search by name.",
  },
  {
    icon: FiClock,
    title: "2. Select Shoot Hours",
    text: "Open a studio, check the hourly rate and security deposit, then pick the date and exact hours you need.",
  },
  {
    icon: FiCheckCircle,
    title: "3. Book Instantly",
    text: "Send your booking request. The host confirms it, and overlapping slots are blocked automatically so nobody gets double-booked.",
  },
  {
    icon: FiVideo,
    title: "4. Create & Produce",
    text: "Arrive, set up, and focus on your craft. Track every reservation from your My Bookings page.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center">How StudioSpace Works</h1>
      <p className="text-center opacity-70 mt-2 mb-10">
        From finding a space to wrapping your shoot in four simple steps
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {steps.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="card bg-base-100 border border-base-200 shadow-sm p-6 gap-3 h-full"
          >
            <Icon size={32} className="text-primary" />
            <h2 className="font-semibold text-xl">{title}</h2>
            <p className="opacity-80">{text}</p>
          </div>
        ))}
      </div>

      <div className="card bg-base-200 p-8 mt-12 text-center items-center gap-3">
        <h2 className="text-2xl font-bold">Own a creative space?</h2>
        <p className="opacity-80 max-w-xl">
          List it on StudioSpace, set your own hourly rate, and approve bookings
          from your host dashboard.
        </p>
        <Link href="/add-studio" className="btn btn-primary">
          Host Your Space
        </Link>
      </div>
    </div>
  );
}