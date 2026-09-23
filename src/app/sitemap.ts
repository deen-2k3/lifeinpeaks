import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const statics = ["", "/journeys", "/photography", "/mountains", "/stories", "/memories", "/map", "/timeline", "/about", "/contact"].map((p) => ({
    url: siteUrl(p),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  try {
    const [trips, stories] = await Promise.all([
      prisma.trip.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
      prisma.story.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...statics,
      ...trips.map((t) => ({ url: siteUrl(`/trips/${t.slug}`), lastModified: t.updatedAt, priority: 0.9 })),
      ...stories.map((s) => ({ url: siteUrl(`/stories/${s.slug}`), lastModified: s.updatedAt, priority: 0.8 })),
    ];
  } catch {
    return statics;
  }
}
