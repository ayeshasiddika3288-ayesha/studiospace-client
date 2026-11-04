import Link from "next/link";
import {
  FiCamera, FiFilm, FiMic, FiMusic, FiPenTool,
  FiSearch, FiClock, FiCheckCircle, FiVideo,
  FiShield, FiUserCheck, FiTool, FiHeadphones,
} from "react-icons/fi";
import HeroSlider from "@/components/HeroSlider";
import StudioCard from "@/components/StudioCard";
import type { Studio } from "@/lib/types";
import { API_URL } from "@/lib/api";

async function getFeaturedStudios(): Promise<Studio[]> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(
        `${API_URL}/api/studios?limit=6`,
        { cache: "no-store" }
      );
      if (res.ok) return res.json();
    } catch {
      // try again below
    }
    await new Promise((resolve) => setTimeout(resolve, 800));
  }
  return [];
}

const categories = [
  { name: "Photo Studio", label: "Photo Studios", icon: FiCamera },
  { name: "Film Stage", label: "Sound Stages", icon: FiFilm },
  { name: "Podcast Lounge", label: "Podcast Rooms", icon: FiMic },
  { name: "Music Suite", label: "Music Suites", icon: FiMusic },
  { name: "Workshop", label: "Art Workshops", icon: FiPenTool },
];

const steps = [
  { icon: FiSearch, title: "1. Discover Spaces", text: "Browse studios by category, location, and price." },
  { icon: FiClock, title: "2. Select Shoot Hours", text: "Pick your date and the exact hours you need." },
  { icon: FiCheckCircle, title: "3. Book Instantly", text: "Reserve your slot with transparent pricing." },
  { icon: FiVideo, title: "4. Create & Produce", text: "Show up, set up, and focus on your craft." },
];

const guarantees = [
  { icon: FiShield, title: "Liability Protection", text: "Every booking is covered so hosts and creators can work worry-free." },
  { icon: FiUserCheck, title: "Verified Profiles", text: "Hosts and creators are identity-checked before they can book or list." },
  { icon: FiTool, title: "Equipment Safety", text: "Gear in every listing is inspected and kept in working condition." },
  { icon: FiHeadphones, title: "24/7 Host Support", text: "Our support team is always a message away, day or night." },
];

export default async function HomePage() {
  const studios = await getFeaturedStudios();

  return (
    <div>
      <HeroSlider />

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">Featured Studios</h2>
        <p className="text-center opacity-70 mt-2 mb-10">
          Hand-picked spaces creators love to book
        </p>
        {studios.length === 0 ? (
          <div className="text-center py-10">
            <p className="mb-4">No studios listed yet. Be the first to host one!</p>
            <Link href="/add-studio" className="btn btn-primary">
              Add New Studio
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {studios.map((studio) => (
              <StudioCard key={studio._id} studio={studio} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Browse by Studio Category</h2>
          <p className="text-center opacity-70 mt-2 mb-10">
            Choose the kind of space your project needs
          </p>
          <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {categories.map(({ name, label, icon: Icon }) => (
              <Link
                key={name}
                href={`/studios?category=${encodeURIComponent(name)}`}
                className="card bg-base-100 shadow hover:shadow-lg hover:-translate-y-1 transition items-center text-center p-6 gap-3"
              >
                <Icon size={32} className="text-primary" />
                <span className="font-semibold">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="how-booking-works" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center">How Booking Works</h2>
        <p className="text-center opacity-70 mt-2 mb-10">
          From idea to the shoot in four simple steps
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card bg-base-100 border border-base-200 shadow-sm p-6 text-center items-center gap-3 h-full">
              <Icon size={32} className="text-primary" />
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="text-sm opacity-80">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-base-200 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center">Host Guarantee & Creator Support</h2>
          <p className="text-center opacity-70 mt-2 mb-10">
            We back every booking so you can focus on creating
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {guarantees.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card bg-base-100 shadow-sm p-6 text-center items-center gap-3 h-full">
                <Icon size={32} className="text-primary" />
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm opacity-80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}