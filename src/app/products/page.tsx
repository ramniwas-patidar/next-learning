import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import SiteHeader from "@/components/SiteHeader";
import StarRating from "@/components/StarRating";
import { getDiscountPercent, type Product } from "@/lib/products";
import { display } from "@/lib/fonts";

export const instant = false;

async function getBaseUrl() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getProducts(): Promise<Product[]> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  return res.json();
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getProducts();
  const filtered = category
    ? products.filter((product) => product.category === category)
    : products;

  return (
    <div className="flex flex-1 flex-col bg-[#F6F7F7] font-sans">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="mb-8 flex flex-col gap-1">
          <h1
            className={`${display.className} text-3xl font-extrabold tracking-tight text-[#1D1D1D] sm:text-4xl`}
          >
            {category ? category : "Shop All"}
          </h1>
          <p className="text-sm font-medium text-[#636E6E]">
            {filtered.length} products
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {filtered.map((product) => {
            const discount = getDiscountPercent(product);
            return (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-black/10 bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-[#F6F7F7]">
                  {discount > 0 && (
                    <span className="absolute left-3 top-3 z-10 rounded bg-[#F04438] px-2 py-1 text-[11px] font-bold text-white">
                      {discount}% OFF
                    </span>
                  )}
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-[#108474]">
                    {product.category}
                  </span>
                  <h2 className="text-sm font-bold leading-snug text-[#1D1D1D] sm:text-base">
                    {product.name}
                  </h2>
                  <p className="line-clamp-1 text-xs text-[#636E6E]">
                    {product.tagline}
                  </p>
                  <StarRating
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                  />
                  <div className="mt-auto flex items-center gap-2 pt-1">
                    <span className="text-base font-extrabold text-[#1D1D1D]">
                      ${product.price.toFixed(2)}
                    </span>
                    {discount > 0 && (
                      <span className="text-xs font-medium text-[#7B7B7B] line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className="mt-2 w-full rounded-md bg-[#1D1D1D] px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-white transition-colors group-hover:bg-[#108474]">
                    View Product
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
