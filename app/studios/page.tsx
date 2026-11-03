import Link from "next/link";
import StudioCard from "@/components/StudioCard";
import { categories } from "@/lib/constants";
import type { Studio } from "@/lib/types";

type SearchParams = { category?: string; search?: string; sort?: string };

async function getStudios(query: URLSearchParams): Promise<Studio[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/studios?${query.toString()}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function StudiosPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category, search, sort } = await searchParams;

  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (search) query.set("search", search);
  if (sort) query.set("sort", sort);

  const studios = await getStudios(query);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center">Explore Studios</h1>
      <p className="text-center opacity-70 mt-2 mb-8">
        Find the right creative space for your next project
      </p>

      <form
        action="/studios"
        method="GET"
        className="flex flex-wrap gap-3 justify-center mb-10"
      >
        <input
          name="search"
          defaultValue={search || ""}
          placeholder="Search by studio name"
          className="input input-bordered w-full sm:w-64"
        />
        <select
          name="category"
          defaultValue={category || ""}
          className="select select-bordered w-full sm:w-48"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={sort || ""}
          className="select select-bordered w-full sm:w-44"
        >
          <option value="">Newest first</option>
          <option value="rating">Top rated</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Apply
        </button>
      </form>

      {studios.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl font-semibold mb-2">No studios found</p>
          <p className="opacity-70 mb-5">
            Try a different search or clear your filters.
          </p>
          <Link href="/studios" className="btn btn-primary">
            Clear Filters
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {studios.map((studio) => (
            <StudioCard key={studio._id} studio={studio} />
          ))}
        </div>
      )}
    </div>
  );
}