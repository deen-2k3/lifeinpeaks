import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import { imageSelect } from "@/lib/queries";

export type Stat = { label: string; value: string };

/** Site-wide editable content (singleton row). Falls back to defaults if the DB has not been seeded. */
export const getSettings = cache(async () => {
  const s = await prisma.settings.findUnique({ where: { id: 1 } });
  const ids = [s?.heroImageId, s?.profileImageId, s?.quoteImageId].filter(Boolean) as string[];
  const images = ids.length ? await prisma.image.findMany({ where: { id: { in: ids } }, select: { id: true, ...imageSelect } }) : [];
  const byId = (id?: string | null) => images.find((i) => i.id === id) ?? null;

  return {
    siteName: s?.siteName || siteConfig.name,
    tagline: s?.tagline || siteConfig.tagline,
    intro: s?.intro || "",
    heroEyebrow: s?.heroEyebrow ?? "Collecting moments,",
    heroTitle: s?.heroTitle || "Chasing Mountains.",
    heroText: s?.heroText || "",
    heroAside: s?.heroAside ?? "",
    quote: s?.quote ?? "",
    quoteImageId: s?.quoteImageId ?? null,
    quoteImage: byId(s?.quoteImageId),
    twitterUrl: s?.twitterUrl || "",
    pinterestUrl: s?.pinterestUrl || "",
    aboutHeading: s?.aboutHeading || "The person behind the lens.",
    aboutIntro: s?.aboutIntro || "",
    aboutBio: s?.aboutBio || "",
    ownerName: s?.ownerName || "",
    stats: (Array.isArray(s?.stats) ? s!.stats : []) as Stat[],
    instagramUsername: s?.instagramUsername || "",
    facebookUrl: s?.facebookUrl || "",
    youtubeUrl: s?.youtubeUrl || "",
    contactEmail: s?.contactEmail || "",
    seoDescription: s?.seoDescription || siteConfig.description,
    heroImageId: s?.heroImageId ?? null,
    profileImageId: s?.profileImageId ?? null,
    heroImage: byId(s?.heroImageId),
    profileImage: byId(s?.profileImageId),
  };
});

export type SiteSettings = Awaited<ReturnType<typeof getSettings>>;

export const instagramUrl = (username: string) => (username ? `https://instagram.com/${username.replace(/^@/, "")}` : "");
