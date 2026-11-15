import Link from "next/link";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { getCurrentUser } from "@/lib/session";
import { getOrdersByUserId } from "@/lib/orders";

export const instant = false;

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = getOrdersByUserId(user.id);

  return (
    <div className="flex flex-1 flex-col bg-[#F6F7F7] font-sans">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1D1D1D]">
          My Orders
        </h1>

        {orders.length === 0 ? (
          <p className="mt-6 text-sm text-[#636E6E]">
            You haven&apos;t placed any orders yet.{" "}
            <Link
              href="/products"
              className="font-semibold text-[#108474] hover:underline"
            >
              Browse products
            </Link>
            .
          </p>
        ) : (
          <div className="mt-6 flex flex-col gap-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex flex-col gap-2 rounded-lg border border-black/10 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1D1D1D]">
                    Order #{order.id.slice(0, 8)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-[#636E6E]">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className="text-sm text-[#636E6E]">
                  {order.items.length} item(s)
                </p>
                <p className="text-lg font-extrabold text-[#1D1D1D]">
                  ${order.total.toFixed(2)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
