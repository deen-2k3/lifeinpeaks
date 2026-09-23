/**
 * Seeds the database with sample trips, photos, stories and memories.
 *   npm run db:seed            – only if the database is empty
 *   npm run db:seed -- --reset – wipe ALL content (and local image files) first
 *
 * Placeholder photographs are downloaded from Unsplash once (cached in .seed-cache/)
 * and pushed through the real image pipeline, exactly like an admin upload.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import bcrypt from "bcryptjs";
import type { CategoryGroup, Image } from "@prisma/client";
import { prisma } from "../src/lib/prisma";
import { saveImage } from "../src/lib/storage";
import { UPLOAD_DIR } from "../src/lib/storage/providers";
import { slugify } from "../src/lib/utils";
import { CATEGORIES, EXTRA_IMAGES, KITS, MEMORIES, PHOTOS, SETTINGS, STORIES, TRIPS } from "./seed-data";

const CACHE = path.resolve(".seed-cache");
const reset = process.argv.includes("--reset");

async function download(id: string) {
  const file = path.join(CACHE, `${id}.jpg`);
  try {
    return await fs.readFile(file);
  } catch {}
  const res = await fetch(`https://images.unsplash.com/photo-${id}?w=2400&q=85&fm=jpg`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(CACHE, { recursive: true });
  await fs.writeFile(file, buf);
  return buf;
}

async function applyCrop(buf: Buffer, crop?: "pano" | "square") {
  if (!crop) return buf;
  const { width = 0, height = 0 } = await sharp(buf).metadata();
  const ratio = crop === "pano" ? 3 : 1;
  const w = Math.min(width, Math.round(height * ratio));
  const h = Math.round(w / ratio);
  return sharp(buf).extract({ left: Math.round((width - w) / 2), top: Math.round((height - h) / 2), width: w, height: h }).jpeg({ quality: 92 }).toBuffer();
}

async function pool<T>(items: T[], size: number, fn: (t: T) => Promise<void>) {
  let i = 0;
  await Promise.all(Array.from({ length: size }, async () => {
    while (i < items.length) await fn(items[i++]);
  }));
}

async function main() {
  if (reset) {
    console.log("⚠ Resetting all content…");
    await prisma.$transaction([
      prisma.memory.deleteMany(),
      prisma.photo.deleteMany(),
      prisma.story.deleteMany(),
      prisma.trip.deleteMany(),
      prisma.category.deleteMany(),
      prisma.settings.deleteMany(),
      prisma.image.deleteMany(),
    ]);
    if ((process.env.STORAGE_PROVIDER ?? "local") === "local") await fs.rm(UPLOAD_DIR, { recursive: true, force: true });
  } else if ((await prisma.trip.count()) > 0) {
    console.log("Database already has content — skipping sample data. Use `npm run db:seed -- --reset` to start over.");
    await ensureAdmin();
    return;
  }

  // Categories
  const cats = new Map<string, string>();
  for (const group of ["PORTFOLIO", "MOUNTAIN"] as CategoryGroup[]) {
    for (const [i, name] of CATEGORIES[group].entries()) {
      const c = await prisma.category.create({ data: { name, slug: slugify(name), group, sortOrder: i } });
      cats.set(`${group}:${name}`, c.id);
    }
  }
  console.log(`✔ ${cats.size} categories`);

  // Images
  const jobs = new Map<string, { id: string; crop?: "pano" | "square" }>();
  for (const p of PHOTOS) jobs.set(p.ref, { id: p.unsplash, crop: p.crop });
  for (const [k, id] of Object.entries(EXTRA_IMAGES)) jobs.set(`extra:${k}`, { id });
  const bySource = new Map<string, Image>();
  const images = new Map<string, Image>();
  let done = 0;
  await pool([...jobs.entries()], 3, async ([ref, job]) => {
    const sourceKey = `${job.id}:${job.crop ?? ""}`;
    try {
      let img = bySource.get(sourceKey);
      if (!img) {
        const buf = await applyCrop(await download(job.id), job.crop);
        img = (await saveImage(buf, `${ref}.jpg`)).image;
        bySource.set(sourceKey, img);
      }
      images.set(ref, img);
    } catch (e) {
      console.warn(`  ! skipped ${ref} (${(e as Error).message})`);
    }
    process.stdout.write(`\r  processing images ${++done}/${jobs.size}`);
  });
  console.log(`\n✔ ${bySource.size} images optimised`);

  // Trips
  const trips = new Map<string, string>();
  for (const t of TRIPS) {
    const trip = await prisma.trip.create({
      data: {
        slug: t.slug,
        title: t.title,
        region: t.region,
        tagline: t.tagline,
        excerpt: t.excerpt,
        story: t.story,
        startDate: new Date(t.start),
        endDate: new Date(t.end),
        places: t.places,
        latitude: t.lat,
        longitude: t.lng,
        featured: t.featured,
        coverImageId: images.get(t.cover)?.id,
        seoDescription: `${t.excerpt}`.slice(0, 300),
      },
    });
    trips.set(t.slug, trip.id);
  }
  console.log(`✔ ${trips.size} trips`);

  // Photos
  const photos = new Map<string, string>();
  for (const p of PHOTOS) {
    const img = images.get(p.ref);
    if (!img) continue;
    const categories = [...p.portfolio.map((n) => cats.get(`PORTFOLIO:${n}`)), ...(p.mountain ?? []).map((n) => cats.get(`MOUNTAIN:${n}`))].filter(Boolean) as string[];
    const photo = await prisma.photo.create({
      data: {
        imageId: img.id,
        title: p.title,
        description: p.description,
        alt: `${p.title} — ${p.location}`,
        location: p.location,
        takenAt: new Date(p.date),
        featured: !!p.featured,
        tripId: p.trip ? trips.get(p.trip) : undefined,
        categories: { connect: categories.map((id) => ({ id })) },
        ...(p.kit ? KITS[p.kit] : {}),
      },
    });
    photos.set(p.ref, photo.id);
  }
  console.log(`✔ ${photos.size} photos`);

  // Stories
  for (const s of STORIES) {
    await prisma.story.create({
      data: {
        slug: s.slug,
        title: s.title,
        excerpt: s.excerpt,
        content: s.content,
        location: s.location,
        tags: s.tags,
        publishedAt: new Date(s.date),
        coverImageId: images.get(s.cover)?.id,
        tripId: s.trip ? trips.get(s.trip) : undefined,
        photos: { connect: s.photos.map((r) => photos.get(r)).filter(Boolean).map((id) => ({ id: id! })) },
      },
    });
  }
  console.log(`✔ ${STORIES.length} stories`);

  // Memories
  let memCount = 0;
  for (const m of MEMORIES) {
    const img = images.get(m.img);
    if (!img) continue;
    await prisma.memory.create({ data: { caption: m.caption, title: m.title, location: m.location, date: new Date(m.date), imageId: img.id, tripId: trips.get(m.trip) } });
    memCount++;
  }
  console.log(`✔ ${memCount} memories`);

  // Site settings
  const data = { ...SETTINGS, heroImageId: images.get("uk-edge")?.id, quoteImageId: images.get("uk-fog")?.id, profileImageId: images.get("extra:profile")?.id };
  await prisma.settings.upsert({ where: { id: 1 }, create: { id: 1, ...data }, update: data });
  console.log("✔ site settings");

  await ensureAdmin();
}

async function ensureAdmin() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    if (!(await prisma.user.count())) console.log("ℹ No admin yet — set ADMIN_EMAIL/ADMIN_PASSWORD in .env and re-run, or use `npm run admin:create`.");
    return;
  }
  if (await prisma.user.findUnique({ where: { email } })) return;
  if (password.length < 10) return console.log("✖ ADMIN_PASSWORD must be at least 10 characters — admin not created.");
  await prisma.user.create({ data: { email, passwordHash: await bcrypt.hash(password, 12) } });
  console.log(`✔ admin account ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
