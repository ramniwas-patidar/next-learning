import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import CancelOrderButton from "@/components/CancelOrderButton";
import { getCurrentUser } from "@/lib/session";
import { getOrderForUser } from "@/lib/orders";

export const instant = false;

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;
  const order = getOrderForUser(user.id, id);

  if (!order) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col bg-[#F6F7F7] font-sans">
      <SiteHeader />

      <main className="mx-auto w-full max-w-2xl flex-1 px-6 py-10">
        <Link
          href="/orders"
          className="text-sm font-medium text-[#636E6E] hover:text-[#108474]"
        >
          &larr; All orders
        </Link>

        <div className="mt-4 flex flex-col gap-6 rounded-lg border border-black/10 bg-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-extrabold text-[#1D1D1D]">
                Order #{order.id.slice(0, 8)}
              </h1>
              <p className="text-xs text-[#636E6E]">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex flex-col divide-y divide-black/10">
            {order.items.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-[#1D1D1D]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#636E6E]">
                    Qty {item.quantity} &times; ${item.price.toFixed(2)}
                  </p>
                </div>
                <p className="text-sm font-bold text-[#1D1D1D]">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-4">
            <span className="text-sm font-semibold text-[#1D1D1D]">
              Total
            </span>
            <span className="text-xl font-extrabold text-[#1D1D1D]">
              ${order.total.toFixed(2)}
            </span>
          </div>

          {order.status === "pending" && (
            <CancelOrderButton orderId={order.id} />
          )}
        </div>
      </main>
    </div>
  );
}
