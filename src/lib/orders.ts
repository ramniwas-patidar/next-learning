import { randomUUID } from "node:crypto";
import { getProductById } from "@/lib/products";

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "completed" | "cancelled";

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
};

// Pinned to globalThis so the in-memory store survives Next.js dev mode
// bundling Route Handlers and Server Components as separate module graphs,
// which would otherwise each get their own empty `orders` array.
const globalForOrders = globalThis as unknown as { __orders?: Order[] };
const orders: Order[] =
  globalForOrders.__orders ?? (globalForOrders.__orders = []);

export function getOrdersByUserId(userId: string): Order[] {
  return orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getOrderForUser(
  userId: string,
  orderId: string
): Order | undefined {
  return orders.find(
    (order) => order.id === orderId && order.userId === userId
  );
}

export function createOrder(
  userId: string,
  requestedItems: { productId: string; quantity: number }[]
): Order {
  if (requestedItems.length === 0) {
    throw new Error("EMPTY_ORDER");
  }

  const items: OrderItem[] = requestedItems.map(({ productId, quantity }) => {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("INVALID_QUANTITY");
    }

    const product = getProductById(productId);
    if (!product) {
      throw new Error("PRODUCT_NOT_FOUND");
    }

    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity,
    };
  });

  const rawTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = Math.round(rawTotal * 100) / 100;

  const order: Order = {
    id: randomUUID(),
    userId,
    items,
    total,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  return order;
}

export function updateOrderStatus(
  userId: string,
  orderId: string,
  status: OrderStatus
): Order | undefined {
  const order = orders.find(
    (o) => o.id === orderId && o.userId === userId
  );
  if (!order) return undefined;
  order.status = status;
  return order;
}

export function deleteOrder(userId: string, orderId: string): boolean {
  const index = orders.findIndex(
    (o) => o.id === orderId && o.userId === userId
  );
  if (index === -1) return false;
  orders.splice(index, 1);
  return true;
}
