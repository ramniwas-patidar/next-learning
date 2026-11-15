"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="text-sm font-semibold uppercase tracking-wide text-[#1D1D1D] transition-colors hover:text-[#108474] disabled:opacity-60"
    >
      {loading ? "..." : "Logout"}
    </button>
  );
}
