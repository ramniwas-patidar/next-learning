"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BuyNowButton({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleBuy() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ productId, quantity }] }),
    });

    if (res.status === 401) {
      router.push("/login");
      return;
    }

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not place order");
      return;
    }

    const order = await res.json();
    router.push(`/orders/${order.id}`);
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="rounded bg-[#F04438]/10 px-3 py-2 text-sm font-medium text-[#F04438]">
          {error}
        </p>
      )}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-md border border-black/15">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={disabled}
            className="px-3 py-2.5 text-sm font-bold text-[#1D1D1D] disabled:opacity-40"
          >
            &minus;
          </button>
          <span className="w-8 text-center text-sm font-semibold text-[#1D1D1D]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            disabled={disabled}
            className="px-3 py-2.5 text-sm font-bold text-[#1D1D1D] disabled:opacity-40"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleBuy}
          disabled={disabled || loading}
          className="flex-1 rounded-md bg-[#1D1D1D] py-3 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#108474] disabled:cursor-not-allowed disabled:bg-[#CCCCCC] sm:flex-none sm:px-12"
        >
          {disabled ? "Out of Stock" : loading ? "Placing Order..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
