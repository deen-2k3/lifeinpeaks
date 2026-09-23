"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export type ContactState = { ok: boolean; message: string; errors?: Record<string, string> };

const schema = z.object({
  name: z.string().trim().min(2, "Please tell me your name").max(100),
  email: z.string().trim().email("That email doesn't look right").max(200),
  message: z.string().trim().min(10, "A few more words, please").max(5000),
});

const recent = new Map<string, number[]>();

export async function sendMessage(_: ContactState, form: FormData): Promise<ContactState> {
  // Honeypot: bots fill every field.
  if (form.get("website")) return { ok: true, message: "Thanks! Your message is on its way." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const times = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  if (times.length >= 5) return { ok: false, message: "You've sent a few messages already — please try again later." };

  const parsed = schema.safeParse(Object.fromEntries(form));
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[String(issue.path[0])] ??= issue.message;
    return { ok: false, message: "Please check the highlighted fields.", errors };
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    recent.set(ip, [...times, now]);
    return { ok: true, message: "Thank you! I'll write back soon — probably from somewhere with bad Wi-Fi." };
  } catch (e) {
    console.error("[contact]", e);
    return { ok: false, message: "Something went wrong. Please try again in a moment." };
  }
}
