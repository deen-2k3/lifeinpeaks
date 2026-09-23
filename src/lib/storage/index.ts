import { prisma } from "@/lib/prisma";
import { analyzeImage, type ExifData } from "./process";
import { getProvider } from "./providers";

export { ACCEPTED_TYPES, MAX_UPLOAD_BYTES } from "./process";

/** Analyse, optimise and store an uploaded image, then record it in the database. */
export async function saveImage(buffer: Buffer, originalName: string) {
  const analysis = await analyzeImage(buffer);
  const provider = getProvider();
  const stored = await provider.store(buffer, originalName, analysis);
  const image = await prisma.image.create({
    data: {
      key: stored.key,
      provider: provider.name,
      width: stored.width ?? analysis.width,
      height: stored.height ?? analysis.height,
      variants: stored.variants,
      blurDataUrl: analysis.blurDataUrl,
      color: analysis.color,
      originalName: originalName.slice(0, 200),
      bytes: buffer.length,
    },
  });
  return { image, exif: analysis.exif as ExifData };
}

/** Delete an image (files + row) if nothing references it any more. */
export async function deleteImageIfOrphan(id: string | null | undefined) {
  if (!id) return false;
  const img = await prisma.image.findUnique({
    where: { id },
    include: { _count: { select: { memories: true, tripCovers: true, storyCovers: true } }, photo: { select: { id: true } } },
  });
  if (!img) return false;
  const settings = await prisma.settings.findFirst({ where: { OR: [{ heroImageId: id }, { profileImageId: id }, { quoteImageId: id }] } });
  const c = img._count;
  if (img.photo || settings || c.memories || c.tripCovers || c.storyCovers) return false;
  await getProvider(img.provider).remove(img.key).catch((e) => console.error("[storage] remove failed", e));
  await prisma.image.delete({ where: { id } });
  return true;
}
