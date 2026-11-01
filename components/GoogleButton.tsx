"use client";

import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function GoogleButton() {
  const handleGoogle = async () => {
    const redirect = new URLSearchParams(window.location.search).get("redirect");
    const callbackURL =
      redirect && redirect.startsWith("/") && !redirect.startsWith("//")
        ? redirect
        : "/";

    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL,
    });
    if (error) toast.error(error.message || "Google login failed");
  };

  return (
    <>
      <div className="divider text-sm">OR</div>
      <button
        type="button"
        onClick={handleGoogle}
        className="btn btn-outline w-full"
      >
        <FcGoogle size={22} /> Continue with Google
      </button>
    </>
  );
}