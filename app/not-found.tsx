import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-5 text-center px-4 py-12">
      <svg
        viewBox="0 0 200 170"
        className="w-60 h-48"
        role="img"
        aria-label="Clapperboard illustration"
      >
        <rect
          x="20"
          y="62"
          width="160"
          height="92"
          rx="8"
          className="fill-base-200 stroke-primary"
          strokeWidth="4"
        />
        <g transform="rotate(-14 20 58)">
          <rect x="20" y="34" width="160" height="24" rx="5" className="fill-primary" />
          <polygon points="46,34 62,34 52,58 36,58" className="fill-base-100" />
          <polygon points="84,34 100,34 90,58 74,58" className="fill-base-100" />
          <polygon points="122,34 138,34 128,58 112,58" className="fill-base-100" />
        </g>
        <rect x="20" y="58" width="160" height="14" className="fill-primary" />
        <text
          x="100"
          y="124"
          textAnchor="middle"
          fontSize="44"
          fontWeight="700"
          className="fill-primary"
        >
          404
        </text>
      </svg>
      <h1 className="text-3xl font-bold">Cut! This scene is missing</h1>
      <p className="opacity-70 max-w-md">
        The page you are looking for does not exist or has been moved off the set.
      </p>
      <Link href="/" className="btn btn-primary">
        Return to Home
      </Link>
    </div>
  );
}