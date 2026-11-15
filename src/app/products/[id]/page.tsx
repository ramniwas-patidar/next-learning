import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import StarRating from "@/components/StarRating";
import BuyNowButton from "@/components/BuyNowButton";
import { getDiscountPercent, type Product } from "@/lib/products";
import { display } from "@/lib/fonts";

export const instant = false;

async function getBaseUrl() {
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  return `${protocol}://${host}`;
}

async function getProduct(id: string): Promise<Product | null> {
  const baseUrl = await getBaseUrl();
  const res = await fetch(`${baseUrl}/api/products/${id}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch product");
  }

  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const discount = getDiscountPercent(product);

  return (
    <div className="flex flex-1 flex-col bg-[#F6F7F7] font-sans">
      <SiteHeader />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-[#636E6E]">
          <Link href="/products" className="hover:text-[#108474]">
            All Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category}`}
            className="hover:text-[#108474]"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#1D1D1D]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg border border-black/10 bg-white">
            {discount > 0 && (
              <span className="absolute left-4 top-4 z-10 rounded bg-[#F04438] px-2.5 py-1 text-xs font-bold text-white">
                {discount}% OFF
              </span>
            )}
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
              priority
            />
          </div>

          <div className="flex flex-col gap-4">
            <span className="w-fit text-xs font-bold uppercase tracking-wide text-[#108474]">
              {product.category}
            </span>

            <h1
              className={`${display.className} text-2xl font-extrabold tracking-tight text-[#1D1D1D] sm:text-3xl`}
            >
              {product.name}
            </h1>

            <p className="text-sm font-medium text-[#636E6E]">
              {product.tagline}
            </p>

            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
            />

            <div className="flex items-center gap-3 border-y border-black/10 py-4">
              <span className="text-3xl font-extrabold text-[#1D1D1D]">
                ${product.price.toFixed(2)}
              </span>
              {discount > 0 && (
                <>
                  <span className="text-base font-medium text-[#7B7B7B] line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="rounded bg-[#F04438]/10 px-2 py-1 text-xs font-bold text-[#F04438]">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed text-[#1D1D1D]/80">
              {product.description}
            </p>

            <p className="text-xs font-semibold text-[#108474]">
              {product.stock > 0
                ? `${product.stock} in stock`
                : "Out of stock"}
            </p>

            <BuyNowButton productId={product.id} disabled={product.stock === 0} />

            <Link
              href="/products"
              className="text-sm font-semibold text-[#636E6E] hover:text-[#108474]"
            >
              &larr; Back to all products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
