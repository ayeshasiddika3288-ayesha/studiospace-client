import Link from "next/link";
import { FiAperture, FiUsers, FiShield } from "react-icons/fi";

const values = [
  {
    icon: FiAperture,
    title: "Built for creators",
    text: "Photographers, filmmakers, podcasters, and musicians need the right room, not just any room. We list spaces made for production.",
  },
  {
    icon: FiUsers,
    title: "Community of hosts",
    text: "Studio owners earn from their idle hours while creators get access to professional spaces without long contracts.",
  },
  {
    icon: FiShield,
    title: "Transparent and safe",
    text: "Clear hourly pricing, visible security deposits, and double-booking protection keep every reservation fair.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center">About StudioSpace</h1>
      <p className="text-center opacity-80 mt-3 mb-10 max-w-2xl mx-auto">
        StudioSpace is a peer-to-peer marketplace where hosts list creative
        workspaces and creators book them by the hour. Our mission is to make
        professional studios accessible to every creator.
      </p>

      <div className="grid gap-6 sm:grid-cols-3">
        {values.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="card bg-base-100 border border-base-200 shadow-sm p-6 gap-3 h-full"
          >
            <Icon size={30} className="text-primary" />
            <h2 className="font-semibold text-lg">{title}</h2>
            <p className="text-sm opacity-80">{text}</p>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link href="/studios" className="btn btn-primary">
          Explore Studios
        </Link>
      </div>
    </div>
  );
}