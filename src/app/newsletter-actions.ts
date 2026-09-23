"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type NewsletterState = { ok?: boolean; message?: string };

export async function subscribe(_: NewsletterState, form: FormData): Promise<NewsletterState> {
  if (form.get("company")) return { ok: true, message: "Thanks for subscribing!" }; // honeypot
  const parsed = z.string().trim().toLowerCase().email().max(200).safeParse(form.get("email"));
  if (!parsed.success) return { ok: false, message: "Please enter a valid email address." };
  try {
    await prisma.subscriber.upsert({ where: { email: parsed.data }, create: { email: parsed.data }, update: {} });
    return { ok: true, message: "You're on the list — see you on the trail!" };
  } catch (e) {
    console.error("[newsletter]", e);
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
