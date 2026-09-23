"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CategoryGroup } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, requireAdmin, verifyCredentials } from "@/lib/auth";
import { deleteImageIfOrphan } from "@/lib/storage";
import { slugify } from "@/lib/utils";
import type { ActionState } from "@/components/admin/ActionForm";

// ───────────── helpers ─────────────

const s = (f: FormData, k: string) => {
  const v = f.get(k);
  return typeof v === "string" ? v.trim() : "";
};
const opt = (f: FormData, k: string) => s(f, k) || null;
const bool = (f: FormData, k: string) => f.get(k) === "on";
const date = (f: FormData, k: string) => (s(f, k) ? new Date(s(f, k)) : null);
const num = (f: FormData, k: string) => (s(f, k) === "" ? null : Number(s(f, k)));
const list = (f: FormData, k: string) => s(f, k).split(/[,\n]/).map((x) => x.trim()).filter(Boolean);

function refresh() {
  revalidatePath("/", "layout");
}

class FormError extends Error {}

function fail(e: unknown): ActionState {
  if (e instanceof FormError) return { ok: false, message: e.message };
  if (e instanceof z.ZodError) return { ok: false, message: e.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(" · ") };
  if (typeof e === "object" && e && "code" in e && (e as { code: string }).code === "P2002") return { ok: false, message: "That slug is already used — choose another." };
  console.error("[admin]", e);
  return { ok: false, message: "Something went wrong while saving." };
}

async function uniqueSlug(model: "trip" | "story", wanted: string, exceptId?: string) {
  const base = slugify(wanted) || "untitled";
  for (let i = 0; i < 50; i++) {
    const slug = i ? `${base}-${i + 1}` : base;
    const clash = model === "trip" ? await prisma.trip.findUnique({ where: { slug } }) : await prisma.story.findUnique({ where: { slug } });
    if (!clash || clash.id === exceptId) return slug;
  }
  return `${base}-${Date.now()}`;
}

const validDate = z.date().refine((d) => !isNaN(+d), "invalid date");

// ───────────── Trips ─────────────

const tripSchema = z.object({
  title: z.string().min(2).max(120),
  region: z.string().min(2).max(120),
  country: z.string().min(2).max(80),
  startDate: validDate,
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
});

export async function saveTrip(id: string | null, _: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  let savedId = id;
  try {
    const base = tripSchema.parse({
      title: s(f, "title"),
      region: s(f, "region"),
      country: s(f, "country") || "India",
      startDate: date(f, "startDate") ?? new Date(NaN),
      latitude: num(f, "latitude"),
      longitude: num(f, "longitude"),
    });
    const existing = id ? await prisma.trip.findUnique({ where: { id } }) : null;
    const data = {
      ...base,
      slug: await uniqueSlug("trip", s(f, "slug") || `${base.title}-${base.startDate.getUTCFullYear()}`, id ?? undefined),
      tagline: opt(f, "tagline"),
      excerpt: opt(f, "excerpt"),
      story: opt(f, "story"),
      endDate: date(f, "endDate"),
      places: list(f, "places"),
      featured: bool(f, "featured"),
      published: bool(f, "published"),
      sortOrder: num(f, "sortOrder") ?? 0,
      seoTitle: opt(f, "seoTitle"),
      seoDescription: opt(f, "seoDescription"),
      coverImageId: opt(f, "coverImageId"),
    };
    if (id) await prisma.trip.update({ where: { id }, data });
    else savedId = (await prisma.trip.create({ data })).id;
    if (existing?.coverImageId && existing.coverImageId !== data.coverImageId) await deleteImageIfOrphan(existing.coverImageId);
    refresh();
  } catch (e) {
    return fail(e);
  }
  if (!id) redirect(`/admin/trips/${savedId}?created=1`);
  return { ok: true, message: "Trip saved." };
}

export async function deleteTrip(id: string) {
  await requireAdmin();
  const trip = await prisma.trip.delete({ where: { id } });
  await deleteImageIfOrphan(trip.coverImageId);
  refresh();
  redirect("/admin/trips");
}

// ───────────── Photos ─────────────

export async function savePhoto(id: string, _: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const takenAt = date(f, "takenAt");
    if (takenAt && isNaN(+takenAt)) throw new FormError("Date taken is not a valid date.");
    await prisma.photo.update({
      where: { id },
      data: {
        title: opt(f, "title"),
        description: opt(f, "description"),
        alt: opt(f, "alt"),
        location: opt(f, "location"),
        takenAt,
        camera: opt(f, "camera"),
        lens: opt(f, "lens"),
        focalLength: opt(f, "focalLength"),
        aperture: opt(f, "aperture"),
        iso: opt(f, "iso"),
        shutterSpeed: opt(f, "shutterSpeed"),
        featured: bool(f, "featured"),
        published: bool(f, "published"),
        trip: opt(f, "tripId") ? { connect: { id: s(f, "tripId") } } : { disconnect: true },
        categories: { set: f.getAll("categories").map((c) => ({ id: String(c) })) },
        stories: { set: f.getAll("stories").map((c) => ({ id: String(c) })) },
      },
    });
    refresh();
    return { ok: true, message: "Photo saved." };
  } catch (e) {
    return fail(e);
  }
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  const photo = await prisma.photo.delete({ where: { id } });
  await deleteImageIfOrphan(photo.imageId);
  refresh();
  redirect("/admin/photos");
}

/** Bulk actions from the photo grid: assign trip / category, publish, delete. */
export async function bulkPhotos(_: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  const ids = f.getAll("ids").map(String);
  if (!ids.length) return { ok: false, message: "Select at least one photo." };
  const op = s(f, "op");
  try {
    if (op === "delete") {
      for (const id of ids) {
        const p = await prisma.photo.delete({ where: { id } });
        await deleteImageIfOrphan(p.imageId);
      }
    } else if (op === "trip") {
      await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { tripId: opt(f, "tripId") } });
    } else if (op === "category" && s(f, "categoryId")) {
      await Promise.all(ids.map((id) => prisma.photo.update({ where: { id }, data: { categories: { connect: { id: s(f, "categoryId") } } } })));
    } else if (op === "publish" || op === "unpublish") {
      await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { published: op === "publish" } });
    } else if (op === "feature" || op === "unfeature") {
      await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { featured: op === "feature" } });
    } else if (op === "location") {
      await prisma.photo.updateMany({ where: { id: { in: ids } }, data: { location: opt(f, "location") } });
    } else return { ok: false, message: "Choose an action." };
    refresh();
    return { ok: true, message: `Updated ${ids.length} photo${ids.length > 1 ? "s" : ""}.` };
  } catch (e) {
    return fail(e);
  }
}

// ───────────── Stories ─────────────

export async function saveStory(id: string | null, _: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  let savedId = id;
  try {
    const title = z.string().min(2).max(160).parse(s(f, "title"));
    const content = z.string().min(1, "Write something first").parse(s(f, "content"));
    const publishedAt = date(f, "publishedAt") ?? new Date();
    if (isNaN(+publishedAt)) throw new FormError("Publish date is not a valid date.");
    const existing = id ? await prisma.story.findUnique({ where: { id } }) : null;
    const data = {
      title,
      content,
      slug: await uniqueSlug("story", s(f, "slug") || title, id ?? undefined),
      excerpt: opt(f, "excerpt"),
      location: opt(f, "location"),
      tags: list(f, "tags").map((t) => t.toLowerCase().replace(/^#/, "")),
      publishedAt,
      published: bool(f, "published"),
      seoTitle: opt(f, "seoTitle"),
      seoDescription: opt(f, "seoDescription"),
      coverImageId: opt(f, "coverImageId"),
      tripId: opt(f, "tripId"),
    };
    if (id) await prisma.story.update({ where: { id }, data });
    else savedId = (await prisma.story.create({ data })).id;
    if (existing?.coverImageId && existing.coverImageId !== data.coverImageId) await deleteImageIfOrphan(existing.coverImageId);
    refresh();
  } catch (e) {
    return fail(e);
  }
  if (!id) redirect(`/admin/stories/${savedId}?created=1`);
  return { ok: true, message: "Story saved." };
}

export async function deleteStory(id: string) {
  await requireAdmin();
  const story = await prisma.story.delete({ where: { id } });
  await deleteImageIfOrphan(story.coverImageId);
  refresh();
  redirect("/admin/stories");
}

// ───────────── Memories ─────────────

export async function saveMemory(id: string | null, _: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  let savedId = id;
  try {
    const caption = z.string().min(2, "Caption is required").max(400).parse(s(f, "caption"));
    const imageId = z.string().min(1, "Please upload a photograph").parse(s(f, "imageId"));
    const existing = id ? await prisma.memory.findUnique({ where: { id } }) : null;
    const data = { caption, imageId, title: opt(f, "title"), location: opt(f, "location"), date: date(f, "date"), tripId: opt(f, "tripId"), published: bool(f, "published") };
    if (id) await prisma.memory.update({ where: { id }, data });
    else savedId = (await prisma.memory.create({ data })).id;
    if (existing && existing.imageId !== imageId) await deleteImageIfOrphan(existing.imageId);
    refresh();
  } catch (e) {
    return fail(e);
  }
  if (!id) redirect(`/admin/memories/${savedId}?created=1`);
  return { ok: true, message: "Memory saved." };
}

export async function deleteMemory(id: string) {
  await requireAdmin();
  const m = await prisma.memory.delete({ where: { id } });
  await deleteImageIfOrphan(m.imageId);
  refresh();
  redirect("/admin/memories");
}

// ───────────── Categories ─────────────

export async function createCategory(_: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const name = z.string().min(2).max(60).parse(s(f, "name"));
    const group = z.enum(["PORTFOLIO", "MOUNTAIN"]).parse(s(f, "group")) as CategoryGroup;
    await prisma.category.create({ data: { name, group, slug: slugify(name), sortOrder: num(f, "sortOrder") ?? 99 } });
    refresh();
    return { ok: true, message: `Added “${name}”.` };
  } catch (e) {
    return fail(e);
  }
}

export async function updateCategory(id: string, _: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const name = z.string().min(2).max(60).parse(s(f, "name"));
    await prisma.category.update({ where: { id }, data: { name, slug: slugify(s(f, "slug") || name), sortOrder: num(f, "sortOrder") ?? 0 } });
    refresh();
    return { ok: true, message: "Saved." };
  } catch (e) {
    return fail(e);
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id } });
  refresh();
  redirect("/admin/categories");
}

// ───────────── Settings / About ─────────────

export async function saveSettings(_: ActionState, f: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    let stats: { label: string; value: string }[] = [];
    try {
      stats = z.array(z.object({ label: z.string().max(40), value: z.string().max(40) })).parse(JSON.parse(s(f, "stats") || "[]")).filter((x) => x.label && x.value);
    } catch {
      return { ok: false, message: "Statistics could not be read." };
    }
    const prev = await prisma.settings.findUnique({ where: { id: 1 } });
    const data = {
      siteName: z.string().min(1).max(60).parse(s(f, "siteName")),
      tagline: s(f, "tagline"),
      intro: s(f, "intro"),
      heroImageId: opt(f, "heroImageId"),
      heroEyebrow: s(f, "heroEyebrow"),
      heroTitle: s(f, "heroTitle"),
      heroText: s(f, "heroText"),
      heroAside: s(f, "heroAside"),
      quote: s(f, "quote"),
      quoteImageId: opt(f, "quoteImageId"),
      twitterUrl: s(f, "twitterUrl"),
      pinterestUrl: s(f, "pinterestUrl"),
      aboutHeading: s(f, "aboutHeading"),
      aboutIntro: s(f, "aboutIntro"),
      aboutBio: s(f, "aboutBio"),
      ownerName: s(f, "ownerName"),
      profileImageId: opt(f, "profileImageId"),
      stats,
      instagramUsername: s(f, "instagramUsername").replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, ""),
      facebookUrl: s(f, "facebookUrl"),
      youtubeUrl: s(f, "youtubeUrl"),
      contactEmail: s(f, "contactEmail"),
      seoDescription: s(f, "seoDescription"),
    };
    await prisma.settings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
    for (const k of ["heroImageId", "profileImageId", "quoteImageId"] as const) {
      if (prev?.[k] && prev[k] !== data[k]) await deleteImageIfOrphan(prev[k]);
    }
    refresh();
    return { ok: true, message: "Settings saved — the site is updated." };
  } catch (e) {
    return fail(e);
  }
}

export async function changePassword(_: ActionState, f: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const next = s(f, "newPassword");
  if (next.length < 10) return { ok: false, message: "Use at least 10 characters." };
  if (next !== s(f, "confirmPassword")) return { ok: false, message: "The new passwords don't match." };
  if (!(await verifyCredentials(me.email, s(f, "currentPassword")))) return { ok: false, message: "Current password is incorrect." };
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash: await hashPassword(next) } });
  return { ok: true, message: "Password changed." };
}

// ───────────── Messages ─────────────

export async function toggleMessageRead(id: string) {
  await requireAdmin();
  const m = await prisma.contactMessage.findUnique({ where: { id } });
  if (m) await prisma.contactMessage.update({ where: { id }, data: { read: !m.read } });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  await requireAdmin();
  await prisma.contactMessage.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

export async function deleteSubscriber(id: string) {
  await requireAdmin();
  await prisma.subscriber.delete({ where: { id } });
  revalidatePath("/admin/messages");
}
