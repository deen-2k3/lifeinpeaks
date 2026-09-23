import { cache } from "react";
import type { CategoryGroup, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { imageUrl, type ImageAsset } from "@/lib/images";
import { formatMonthYear } from "@/lib/utils";

export const imageSelect = {
  key: true,
  provider: true,
  width: true,
  height: true,
  variants: true,
  blurDataUrl: true,
  color: true,
} satisfies Prisma.ImageSelect;

const photoInclude = {
  image: { select: imageSelect },
  trip: { select: { slug: true, title: true } },
  categories: { select: { slug: true, name: true, group: true } },
} satisfies Prisma.PhotoInclude;

type PhotoRow = Prisma.PhotoGetPayload<{ include: typeof photoInclude }>;

/** Serializable photo shape passed to client components (galleries, lightbox). */
export type PhotoDTO = {
  id: string;
  title: string | null;
  description: string | null;
  alt: string;
  location: string | null;
  takenAt: string | null;
  camera: string | null;
  lens: string | null;
  focalLength: string | null;
  aperture: string | null;
  iso: string | null;
  shutterSpeed: string | null;
  image: ImageAsset;
  trip: { slug: string; title: string } | null;
  categories: string[];
};

export function toPhotoDTO(p: PhotoRow): PhotoDTO {
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    alt: p.alt || p.title || [p.location, "photograph"].filter(Boolean).join(" "),
    location: p.location,
    takenAt: p.takenAt?.toISOString() ?? null,
    camera: p.camera,
    lens: p.lens,
    focalLength: p.focalLength,
    aperture: p.aperture,
    iso: p.iso,
    shutterSpeed: p.shutterSpeed,
    image: p.image,
    trip: p.trip,
    categories: p.categories.map((c) => c.name),
  };
}

// ───────────── Photos ─────────────

export type PhotoQuery = {
  category?: string;
  group?: CategoryGroup;
  tripId?: string;
  ids?: string[];
  cursor?: string;
  take?: number;
  featured?: boolean;
};

export async function getPhotos(q: PhotoQuery = {}) {
  const take = Math.min(q.take ?? 30, 60);
  const where: Prisma.PhotoWhereInput = { published: true };
  if (q.tripId) where.tripId = q.tripId;
  if (q.ids) where.id = { in: q.ids };
  if (q.featured) where.featured = true;
  if (q.category) where.categories = { some: { slug: q.category, ...(q.group ? { group: q.group } : {}) } };
  else if (q.group) where.categories = { some: { group: q.group } };

  const rows = await prisma.photo.findMany({
    where,
    include: photoInclude,
    orderBy: q.tripId ? [{ takenAt: "asc" }, { createdAt: "asc" }] : [{ featured: "desc" }, { takenAt: "desc" }, { id: "desc" }],
    take: take + 1,
    ...(q.cursor ? { cursor: { id: q.cursor }, skip: 1 } : {}),
  });
  const hasMore = rows.length > take;
  const items = rows.slice(0, take).map(toPhotoDTO);
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null };
}

export const getCategories = cache((group: CategoryGroup) =>
  prisma.category.findMany({
    where: { group, photos: { some: { published: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { slug: true, name: true },
  }),
);

// ───────────── Trips ─────────────

const tripCardSelect = {
  id: true,
  slug: true,
  title: true,
  region: true,
  country: true,
  tagline: true,
  excerpt: true,
  startDate: true,
  endDate: true,
  places: true,
  latitude: true,
  longitude: true,
  coverImage: { select: imageSelect },
  _count: { select: { photos: { where: { published: true } } } },
} satisfies Prisma.TripSelect;

export type TripCardData = Prisma.TripGetPayload<{ select: typeof tripCardSelect }>;

export const getTrips = cache((opts: { featured?: boolean; take?: number } = {}) =>
  prisma.trip.findMany({
    where: { published: true, ...(opts.featured ? { featured: true } : {}) },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    select: tripCardSelect,
    take: opts.take,
  }),
);

export function toMapTrips(trips: TripCardData[]) {
  return trips
    .filter((t) => t.latitude != null && t.longitude != null)
    .map((t) => ({
      slug: t.slug,
      title: t.title,
      region: t.region,
      date: t.startDate.toISOString().slice(0, 7),
      label: formatMonthYear(t.startDate),
      photos: t._count.photos,
      lat: t.latitude!,
      lng: t.longitude!,
      cover: t.coverImage ? imageUrl(t.coverImage, 480) : null,
    }));
}

export const getTripBySlug = cache((slug: string) =>
  prisma.trip.findFirst({
    where: { slug, published: true },
    include: {
      coverImage: { select: imageSelect },
      stories: { where: { published: true }, select: { slug: true, title: true, excerpt: true, publishedAt: true, coverImage: { select: imageSelect } } },
      memories: { where: { published: true }, include: { image: { select: imageSelect } }, orderBy: { date: "asc" } },
      _count: { select: { photos: { where: { published: true } } } },
    },
  }),
);

export async function getAdjacentTrips(startDate: Date) {
  const [prev, next] = await Promise.all([
    prisma.trip.findFirst({ where: { published: true, startDate: { lt: startDate } }, orderBy: { startDate: "desc" }, select: { slug: true, title: true, region: true } }),
    prisma.trip.findFirst({ where: { published: true, startDate: { gt: startDate } }, orderBy: { startDate: "asc" }, select: { slug: true, title: true, region: true } }),
  ]);
  return { prev, next };
}

// ───────────── Stories ─────────────

const storyCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  location: true,
  publishedAt: true,
  content: true,
  tags: true,
  coverImage: { select: imageSelect },
  trip: { select: { slug: true, title: true } },
} satisfies Prisma.StorySelect;

export type StoryCardData = Prisma.StoryGetPayload<{ select: typeof storyCardSelect }>;

export const getStories = cache((take?: number) =>
  prisma.story.findMany({ where: { published: true, publishedAt: { lte: new Date() } }, orderBy: { publishedAt: "desc" }, select: storyCardSelect, take }),
);

export const getStoryBySlug = cache((slug: string) =>
  prisma.story.findFirst({
    where: { slug, published: true },
    include: {
      coverImage: { select: imageSelect },
      trip: { select: { slug: true, title: true, region: true } },
      photos: { where: { published: true }, include: photoInclude, orderBy: { takenAt: "asc" } },
    },
  }),
);

// ───────────── Memories ─────────────

export const getMemories = cache((take?: number) =>
  prisma.memory.findMany({
    where: { published: true },
    orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    include: { image: { select: imageSelect }, trip: { select: { slug: true, title: true } } },
    take,
  }),
);

export type MemoryData = Awaited<ReturnType<typeof getMemories>>[number];

// ───────────── Search ─────────────

export async function searchAll(q: string) {
  const term = q.trim().slice(0, 80);
  if (term.length < 2) return { trips: [], stories: [], photos: [], memories: [], categories: [] };
  const ci = { contains: term, mode: "insensitive" as const };

  const [trips, stories, photos, memories, categories] = await Promise.all([
    prisma.trip.findMany({
      where: { published: true, OR: [{ title: ci }, { region: ci }, { tagline: ci }, { excerpt: ci }, { places: { has: term } }, { country: ci }] },
      select: tripCardSelect,
      take: 8,
    }),
    prisma.story.findMany({
      where: { published: true, OR: [{ title: ci }, { excerpt: ci }, { location: ci }, { tags: { has: term.toLowerCase() } }, { content: ci }, { trip: { title: ci } }] },
      select: storyCardSelect,
      take: 8,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.photo.findMany({
      where: {
        published: true,
        OR: [{ title: ci }, { description: ci }, { location: ci }, { trip: { title: ci } }, { categories: { some: { name: ci } } }],
      },
      include: photoInclude,
      take: 24,
      orderBy: { takenAt: "desc" },
    }),
    prisma.memory.findMany({
      where: { published: true, OR: [{ caption: ci }, { title: ci }, { location: ci }, { trip: { title: ci } }] },
      include: { image: { select: imageSelect }, trip: { select: { slug: true, title: true } } },
      take: 8,
    }),
    prisma.category.findMany({ where: { name: ci }, select: { slug: true, name: true, group: true }, take: 6 }),
  ]);
  return { trips, stories, photos: photos.map(toPhotoDTO), memories, categories };
}
