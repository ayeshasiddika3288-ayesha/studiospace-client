// Browser requests go through the Next.js proxy (same origin) so the JWT cookie
// is first-party. Server-side rendering calls the Express API directly.
export const API_URL =
  typeof window === "undefined" ? process.env.NEXT_PUBLIC_API_URL : "";

let ready: Promise<void> | null = null;

// Makes sure the Express server has set its HTTPOnly JWT cookie for this user.
export function ensureServerSession(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      const res = await fetch("/api/token");
      if (!res.ok) throw new Error("No active session");
      const { token } = await res.json();
      await fetch(`${API_URL}/api/jwt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ token }),
      });
    })().catch(() => {
      ready = null;
    });
  }
  return ready;
}

export function resetServerSession() {
  ready = null;
}
