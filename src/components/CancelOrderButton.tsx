"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CancelOrderButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCancel() {
    if (!window.confirm("Cancel this order?")) return;

    setLoading(true);
    setError(null);

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not cancel order");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="rounded bg-[#F04438]/10 px-3 py-2 text-sm font-medium text-[#F04438]">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleCancel}
        disabled={loading}
        className="w-fit rounded-md border border-[#F04438] px-4 py-2 text-xs font-bold uppercase tracking-wide text-[#F04438] transition-colors hover:bg-[#F04438] hover:text-white disabled:opacity-60"
      >
        {loading ? "Cancelling..." : "Cancel Order"}
      </button>
    </div>
  );
}
