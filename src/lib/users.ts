import { randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type PublicUser = Omit<User, "passwordHash">;

// Pinned to globalThis so the in-memory store survives Next.js dev mode
// bundling Route Handlers and Server Components as separate module graphs,
// which would otherwise each get their own empty `users` array.
const globalForUsers = globalThis as unknown as { __users?: User[] };
const users: User[] = globalForUsers.__users ?? (globalForUsers.__users = []);

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  const derivedBuf = scryptSync(password, salt, 64);
  const storedBuf = Buffer.from(hash, "hex");
  return (
    derivedBuf.length === storedBuf.length &&
    timingSafeEqual(derivedBuf, storedBuf)
  );
}

function toPublicUser(user: User): PublicUser {
  const { passwordHash: _passwordHash, ...publicUser } = user;
  return publicUser;
}

export function getAllUsers(): PublicUser[] {
  return users.map(toPublicUser);
}

export function getUserById(id: string): PublicUser | undefined {
  const user = users.find((u) => u.id === id);
  return user ? toPublicUser(user) : undefined;
}

export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(input: {
  name: string;
  email: string;
  password: string;
}): PublicUser {
  if (getUserByEmail(input.email)) {
    throw new Error("EMAIL_TAKEN");
  }

  const user: User = {
    id: randomUUID(),
    name: input.name,
    email: input.email,
    passwordHash: hashPassword(input.password),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  return toPublicUser(user);
}

export function updateUser(
  id: string,
  input: { name?: string; email?: string; password?: string }
): PublicUser | undefined {
  const user = users.find((u) => u.id === id);
  if (!user) return undefined;

  if (
    input.email &&
    input.email.toLowerCase() !== user.email.toLowerCase() &&
    getUserByEmail(input.email)
  ) {
    throw new Error("EMAIL_TAKEN");
  }

  if (input.name !== undefined) user.name = input.name;
  if (input.email !== undefined) user.email = input.email;
  if (input.password) user.passwordHash = hashPassword(input.password);

  return toPublicUser(user);
}

export function deleteUser(id: string): boolean {
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

export function verifyCredentials(
  email: string,
  password: string
): PublicUser | null {
  const user = getUserByEmail(email);
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return toPublicUser(user);
}
