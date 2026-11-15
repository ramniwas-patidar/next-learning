"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "@/lib/users";

export default function AccountView({ user }: { user: PublicUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setSaving(true);

    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password: password || undefined,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Could not update profile");
      return;
    }

    setPassword("");
    setMessage("Profile updated");
    router.refresh();
  }

  async function handleDelete() {
    if (!window.confirm("Delete your account? This cannot be undone.")) {
      return;
    }

    setDeleting(true);
    await fetch(`/api/users/${user.id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg border border-black/10 bg-white p-8">
      <div>
        <h1 className="text-2xl font-extrabold text-[#1D1D1D]">My Account</h1>
        <p className="text-sm text-[#636E6E]">
          Member since {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

      {error && (
        <p className="rounded bg-[#F04438]/10 px-3 py-2 text-sm font-medium text-[#F04438]">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded bg-[#108474]/10 px-3 py-2 text-sm font-medium text-[#108474]">
          {message}
        </p>
      )}

      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm font-semibold text-[#1D1D1D]">
          Name
          <input
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="rounded-md border border-black/15 px-3 py-2 text-sm font-normal text-[#1D1D1D] outline-none focus:border-[#108474]"
          />
        </label>

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
          New Password{" "}
          <span className="font-normal text-[#636E6E]">(optional)</span>
          <input
            type="password"
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Leave blank to keep current password"
            className="rounded-md border border-black/15 px-3 py-2 text-sm font-normal text-[#1D1D1D] outline-none focus:border-[#108474]"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-[#1D1D1D] py-2.5 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#108474] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="rounded-md border border-[#F04438] py-2.5 text-sm font-bold uppercase tracking-wide text-[#F04438] transition-colors hover:bg-[#F04438] hover:text-white disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
}
