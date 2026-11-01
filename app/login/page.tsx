"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }

    toast.success("Welcome back!");
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    const safeRedirect =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";
    router.push(safeRedirect);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <form onSubmit={handleLogin} className="card-body gap-3">
          <h1 className="text-3xl font-bold text-center">Welcome back</h1>
          <p className="text-center text-sm opacity-70">
            Login to manage your studios and bookings
          </p>

          <label className="form-control">
            <span className="label-text mb-1">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Password</span>
            <input name="password" type="password" required placeholder="Your password" className="input input-bordered w-full" />
          </label>

          <button
            type="button"
            onClick={() => toast("Password reset is coming soon")}
            className="link link-hover text-sm text-right"
          >
            Forgot Password?
          </button>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? <span className="loading loading-spinner"></span> : "Login"}
          </button>

          <p className="text-center text-sm">
            New to StudioSpace?{" "}
            <Link href="/register" className="link link-primary font-medium">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}