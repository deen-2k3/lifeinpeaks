import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "@/lib/session";

export async function getSession() {
  const store = await cookies();
  const session = await verifySession(store.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { id: true, email: true, name: true } });
  return user;
}

/** Guard for admin server components and server actions. Middleware is the first line; this is the second. */
export async function requireAdmin() {
  const user = await getSession();
  if (!user) redirect("/admin/login");
  return user;
}

export async function startSession(userId: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, await signSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

// Constant-time-ish behaviour for unknown emails: always run one bcrypt compare.
let dummyHash: Promise<string> | undefined;

export async function verifyCredentials(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  dummyHash ??= bcrypt.hash("not-a-real-password", 12);
  const ok = await bcrypt.compare(password, user?.passwordHash ?? (await dummyHash));
  return ok && user ? user : null;
}

export function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

// Simple in-memory login throttle (per server instance). Use a shared store (Redis) if you scale out.
const attempts = new Map<string, { count: number; until: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX = 5;

export function isThrottled(key: string) {
  const a = attempts.get(key);
  return !!a && a.count >= MAX && a.until > Date.now();
}
export function recordFailure(key: string) {
  const a = attempts.get(key);
  if (!a || a.until < Date.now()) attempts.set(key, { count: 1, until: Date.now() + WINDOW });
  else a.count++;
}
export function clearFailures(key: string) {
  attempts.delete(key);
}
