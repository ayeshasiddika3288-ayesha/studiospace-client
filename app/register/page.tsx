"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import GoogleButton from "@/components/GoogleButton";

const validatePassword = (password: string) => {
  if (!/[A-Z]/.test(password)) return "Password must have an uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must have a lowercase letter";
  if (password.length < 6) return "Password must be at least 6 characters";
  return "";
};

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const photo = formData.get("photo") as string;
    const password = formData.get("password") as string;

    const error = validatePassword(password);
    setPasswordError(error);
    if (error) {
      toast.error(error);
      return;
    }

    setLoading(true);
    const { error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
      image: photo || undefined,
    });
    setLoading(false);

    if (authError) {
      toast.error(authError.message || "Registration failed");
      return;
    }
    toast.success("Account created! Please login.");
    router.push("/login");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md bg-base-100 shadow-xl border border-base-200">
        <form onSubmit={handleRegister} className="card-body gap-3">
          <h1 className="text-3xl font-bold text-center">Create your account</h1>
          <p className="text-center text-sm opacity-70">
            Join StudioSpace to host and book creative studios
          </p>

          <label className="form-control">
            <span className="label-text mb-1">Name</span>
            <input name="name" type="text" required placeholder="Your full name" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Email</span>
            <input name="email" type="email" required placeholder="you@example.com" className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Photo URL</span>
            <input name="photo" type="url" placeholder="https://..." className="input input-bordered w-full" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">Password</span>
            <input name="password" type="password" required placeholder="Min 6 chars, upper and lower case" className="input input-bordered w-full" />
            {passwordError && (
              <span className="text-error text-sm mt-1">{passwordError}</span>
            )}
          </label>

          <button type="submit" disabled={loading} className="btn btn-primary mt-2">
            {loading ? <span className="loading loading-spinner"></span> : "Register"}
          </button>

          <GoogleButton />

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="link link-primary font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}