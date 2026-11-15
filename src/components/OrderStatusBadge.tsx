import type { OrderStatus } from "@/lib/orders";

const STYLES: Record<OrderStatus, string> = {
  pending: "bg-[#FBC210]/20 text-[#8a6300]",
  completed: "bg-[#108474]/10 text-[#108474]",
  cancelled: "bg-[#F04438]/10 text-[#F04438]",
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${STYLES[status]}`}
    >
      {status}
    </span>
  );
}
