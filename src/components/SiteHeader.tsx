import Link from "next/link";
import { display } from "@/lib/fonts";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

const NAV_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Audio", href: "/products?category=Audio" },
  { label: "Wearables", href: "/products?category=Wearables" },
  { label: "Accessories", href: "/products?category=Accessories" },
];

export default async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <div className="w-full">
      <div className="flex h-9 items-center justify-center bg-[#108474] px-4 text-center text-xs font-semibold tracking-wide text-white">
        FREE SHIPPING ON ORDERS OVER $100 &middot; 30-DAY RETURNS
      </div>
      <header className="sticky top-0 z-10 border-b border-black/10 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
          <Link
            href="/products"
            className={`${display.className} text-2xl font-extrabold tracking-tight text-[#1D1D1D]`}
          >
            AURA
          </Link>

          <nav className="hidden items-center gap-8 sm:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-semibold uppercase tracking-wide text-[#1D1D1D] transition-colors hover:text-[#108474]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            {user ? (
              <>
                <Link
                  href="/orders"
                  className="text-sm font-semibold uppercase tracking-wide text-[#1D1D1D] transition-colors hover:text-[#108474]"
                >
                  Orders
                </Link>
                <Link
                  href="/account"
                  className="text-sm font-semibold uppercase tracking-wide text-[#1D1D1D] transition-colors hover:text-[#108474]"
                >
                  Hi, {user.name.split(" ")[0]}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold uppercase tracking-wide text-[#1D1D1D] transition-colors hover:text-[#108474]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold uppercase tracking-wide text-[#1D1D1D] transition-colors hover:text-[#108474]"
                >
                  Sign Up
                </Link>
              </>
            )}

            <Link
              href="/products"
              className="flex items-center gap-2 rounded-md bg-[#1D1D1D] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#108474]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="h-4 w-4"
              >
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Cart
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
}
