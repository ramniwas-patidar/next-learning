import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getUserById, type PublicUser } from "@/lib/users";

export const SESSION_COOKIE_NAME = "session_token";

const SESSION_SECRET =
  process.env.SESSION_SECRET ?? "dev-only-insecure-secret-change-me";

function sign(value: string): string {
  const signature = createHmac("sha256", SESSION_SECRET)
    .update(value)
    .digest("hex");
  return `${value}.${signature}`;
}

function verify(signedValue: string): string | null {
  const separatorIndex = signedValue.lastIndexOf(".");
  if (separatorIndex === -1) return null;

  const value = signedValue.slice(0, separatorIndex);
  const signature = signedValue.slice(separatorIndex + 1);
  const expected = createHmac("sha256", SESSION_SECRET)
    .update(value)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const givenBuf = Buffer.from(signature, "hex");

  if (expectedBuf.length !== givenBuf.length) return null;
  return timingSafeEqual(expectedBuf, givenBuf) ? value : null;
}

export function createSessionCookieValue(userId: string): string {
  return sign(userId);
}

export async function getCurrentUser(): Promise<PublicUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!raw) return null;

  const userId = verify(raw);
  if (!userId) return null;

  return getUserById(userId) ?? null;
}
