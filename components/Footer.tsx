"use client";

import Link from "next/link";
import toast from "react-hot-toast";
import { FiAperture } from "react-icons/fi";
import {
  FaXTwitter,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa6";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Explore Studios", href: "/studios" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "About Us", href: "/about" },
];

const categories = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
];

const socials = [
  { icon: FaXTwitter, label: "X", href: "https://x.com/yourhandle" },
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com/yourpage" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com/yourhandle" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com/in/yourname" },
];

export default function Footer() {
  const handleSubscribe = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Thanks for subscribing to StudioSpace updates!");
    e.currentTarget.reset();
  };

  return (
    <footer className="bg-base-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <FiAperture className="text-primary" size={28} />
            StudioSpace
          </Link>
          <p className="mt-4 text-sm opacity-80">
            Our mission is to make creative spaces accessible to every creator.
            Discover, book, and shoot in studios built for your craft.
          </p>
          <div className="flex gap-3 mt-5">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="btn btn-circle btn-sm btn-outline"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="link link-hover">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Popular Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/studios?category=${encodeURIComponent(cat)}`}
                  className="link link-hover"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
          <p className="text-sm opacity-80 mb-3">
            Get new studio listings and creator tips in your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="join w-full">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className="input input-bordered join-item w-full"
            />
            <button type="submit" className="btn btn-primary join-item">
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-base-300 py-4 px-4 text-center text-sm opacity-80">
        © 2026 StudioSpace. All rights reserved. | Terms of Service | Privacy Policy
      </div>
    </footer>
  );
}