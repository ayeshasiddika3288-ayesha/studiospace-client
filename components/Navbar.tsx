"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiAperture, FiMenu, FiMoon, FiSun } from "react-icons/fi";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const userLinks = [
  { label: "My Profile", href: "/profile" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Add New Studio", href: "/add-studio" },
  { label: "My Studio Listings", href: "/my-listings" },
  { label: "My Bookings", href: "/my-bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");
  }, []);

  // Give the Express server an HTTPOnly JWT cookie for the logged-in user
  useEffect(() => {
    if (!user?.email) return;
    (async () => {
      try {
        const res = await fetch("/api/token");
        if (!res.ok) return;
        const { token } = await res.json();
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jwt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ token }),
        });
      } catch {
        // server cookie will be retried on next page load
      }
    })();
  }, [user?.email]);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/");
        },
      },
    });
  };

  const linkClass = (href: string) =>
    `font-medium ${
      pathname === href ? "text-primary border-b-2 border-primary" : ""
    }`;

  return (
    <header className="sticky top-0 z-50 bg-base-100 shadow-sm">
      <div className="navbar max-w-7xl mx-auto px-2 sm:px-4">
        <div className="navbar-start w-auto shrink-0 lg:w-1/2">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm px-2">
              <FiMenu size={22} />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-56 p-2 shadow"
            >
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 whitespace-nowrap text-lg font-bold sm:text-2xl"
          >
            <FiAperture className="text-primary" size={24} />
            StudioSpace
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass(link.href)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="navbar-end w-auto flex-1 justify-end gap-1 sm:gap-2 lg:w-1/2 lg:flex-none">
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm sm:btn-md"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>

          {isPending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : user ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring ring-primary ring-offset-2 bg-primary text-primary-content flex items-center justify-center">
                  {user.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.image} alt={user.name} />
                  ) : (
                    <span className="text-lg font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-60 p-2 shadow"
              >
                <li className="menu-title text-base">
                  {user.name}
                  <span className="block text-xs font-normal normal-case opacity-70">
                    {user.email}
                  </span>
                </li>
                {userLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="btn btn-outline btn-primary btn-xs sm:btn-sm"
              >
                Login
              </Link>
              <Link href="/register" className="btn btn-primary btn-xs sm:btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}