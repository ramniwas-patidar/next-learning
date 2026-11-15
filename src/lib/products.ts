export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  category: string;
  image: string;
  stock: number;
  rating: number;
  reviewCount: number;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Aurora Wireless Headphones",
    tagline: "Active noise cancellation, all-day comfort",
    description:
      "Over-ear headphones with active noise cancellation and 30-hour battery life.",
    price: 149.99,
    originalPrice: 199.99,
    category: "Audio",
    image: "https://picsum.photos/seed/aurora-headphones/600/600",
    stock: 24,
    rating: 4.5,
    reviewCount: 312,
  },
  {
    id: "2",
    name: "Pulse Smartwatch",
    tagline: "Heart-rate tracking that keeps up with you",
    description:
      "Fitness-focused smartwatch with heart-rate tracking and a 7-day battery.",
    price: 199.99,
    originalPrice: 249.99,
    category: "Wearables",
    image: "https://picsum.photos/seed/pulse-smartwatch/600/600",
    stock: 15,
    rating: 4.2,
    reviewCount: 158,
  },
  {
    id: "3",
    name: "Nimbus Mechanical Keyboard",
    tagline: "Hot-swappable switches, satisfying click",
    description:
      "Compact 75% mechanical keyboard with hot-swappable switches and RGB backlight.",
    price: 89.99,
    originalPrice: 109.99,
    category: "Accessories",
    image: "https://picsum.photos/seed/nimbus-keyboard/600/600",
    stock: 40,
    rating: 4.8,
    reviewCount: 540,
  },
  {
    id: "4",
    name: "Drift Portable Speaker",
    tagline: "360-degree sound, built for the outdoors",
    description:
      "Waterproof Bluetooth speaker with 360-degree sound and 12-hour playback.",
    price: 59.99,
    originalPrice: 79.99,
    category: "Audio",
    image: "https://picsum.photos/seed/drift-speaker/600/600",
    stock: 32,
    rating: 4.3,
    reviewCount: 201,
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getDiscountPercent(product: Product): number {
  return Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
}
