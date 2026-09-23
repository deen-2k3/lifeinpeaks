import type { Metadata } from "next";
import { imageUrl, type ImageAsset } from "@/lib/images";
import { siteUrl } from "@/lib/utils";

/** Consistent per-page metadata: title, description, canonical and Open Graph image. */
export function pageMetadata({
  title,
  description,
  path,
  image,
  type = "website",
  publishedTime,
}: {
  title: string;
  description?: string | null;
  path: string;
  image?: ImageAsset | null;
  type?: "website" | "article";
  publishedTime?: Date;
}): Metadata {
  const og = image ? [{ url: imageUrl(image, 1600, "webp"), width: 1600, height: Math.round((1600 * image.height) / image.width), alt: title }] : undefined;
  return {
    title,
    description: description ?? undefined,
    alternates: { canonical: path },
    openGraph: {
      title,
      description: description ?? undefined,
      url: siteUrl(path),
      type,
      images: og,
      ...(publishedTime ? { publishedTime: publishedTime.toISOString() } : {}),
    },
    twitter: { card: "summary_large_image", title, description: description ?? undefined, images: og?.map((o) => o.url) },
  };
}

export function absoluteImage(image?: ImageAsset | null) {
  if (!image) return undefined;
  const u = imageUrl(image, 1600, "webp");
  return u.startsWith("http") ? u : siteUrl(u);
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: siteUrl(it.path) })),
  };
}
