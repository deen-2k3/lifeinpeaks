"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { clearFailures, endSession, isThrottled, recordFailure, startSession, verifyCredentials } from "@/lib/auth";

export async function login(_: { error?: string }, form: FormData): Promise<{ error?: string }> {
  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");
  const next = String(form.get("next") ?? "/admin");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const key = `${ip}:${email.toLowerCase()}`;

  if (isThrottled(key)) return { error: "Too many attempts. Please wait 15 minutes and try again." };
  if (!email || !password) return { error: "Email and password are required." };

  const user = await verifyCredentials(email, password);
  if (!user) {
    recordFailure(key);
    return { error: "Incorrect email or password." };
  }
  clearFailures(key);
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await startSession(user.id);
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}
