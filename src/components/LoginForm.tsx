"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Something went wrong");
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-4 rounded-lg border border-black/10 bg-white p-8"
    >
      <h1 className="text-2xl font-extrabold text-[#1D1D1D]">Log In</h1>

      {error && (
        <p className="rounded bg-[#F04438]/10 px-3 py-2 text-sm font-medium text-[#F04438]">
          {error}
        </p>
      )}

      <label className="flex flex-col gap-1 text-sm font-semibold text-[#1D1D1D]">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-black/15 px-3 py-2 text-sm font-normal text-[#1D1D1D] outline-none focus:border-[#108474]"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm font-semibold text-[#1D1D1D]">
        Password
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-md border border-black/15 px-3 py-2 text-sm font-normal text-[#1D1D1D] outline-none focus:border-[#108474]"
        />
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 rounded-md bg-[#1D1D1D] py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#108474] disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="text-center text-sm text-[#636E6E]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#108474] hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
