import { NextResponse } from "next/server";
import { createUser, getAllUsers } from "@/lib/users";
import { createSessionCookieValue, SESSION_COOKIE_NAME } from "@/lib/session";

export async function GET() {
  return NextResponse.json(getAllUsers());
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { name, email, password } = body ?? {};

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "name, email and password are required" },
      { status: 400 }
    );
  }

  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  try {
    const user = createUser({ name, email, password });
    const token = createSessionCookieValue(user.id);

    const response = NextResponse.json(user, { status: 201 });
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "EMAIL_TAKEN") {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 409 }
      );
    }
    throw error;
  }
}
