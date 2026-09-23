// Client-safe helpers for building responsive image URLs.
// Every stored image is described by an ImageAsset; the provider decides how URLs are built,
// so switching storage later does not break images that were uploaded earlier.

export type ImageAsset = {
  key: string;
  provider: string;
  width: number;
  height: number;
  variants: number[];
  blurDataUrl: string | null;
  color: string | null;
};

export type ImageFormat = "avif" | "webp";

/** Widths generated for every upload (never upscaled beyond the original). */
export const IMAGE_WIDTHS = [480, 960, 1600, 2400];

const MEDIA_BASE = (process.env.NEXT_PUBLIC_MEDIA_BASE_URL ?? "").replace(/\/$/, "");
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";

export function widthsFor(img: ImageAsset): number[] {
  if (img.provider === "local") return img.variants.length ? img.variants : [img.width];
  const w = IMAGE_WIDTHS.filter((x) => x <= img.width);
  return w.length ? w : [img.width];
}

function closestWidth(img: ImageAsset, target: number) {
  const widths = widthsFor(img);
  return widths.find((w) => w >= target) ?? widths[widths.length - 1];
}

export function imageUrl(img: ImageAsset, width: number, format: ImageFormat = "webp") {
  if (img.provider === "cloudinary") {
    return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_${format},q_auto,c_limit,w_${width}/${img.key}`;
  }
  return `${MEDIA_BASE}/media/${img.key}/${closestWidth(img, width)}.${format}`;
}

export function srcSet(img: ImageAsset, format: ImageFormat) {
  return widthsFor(img)
    .map((w) => `${imageUrl(img, w, format)} ${w}w`)
    .join(", ");
}

export function aspectRatio(img: Pick<ImageAsset, "width" | "height">) {
  return img.width / img.height;
}

export function orientation(img: Pick<ImageAsset, "width" | "height">) {
  const r = aspectRatio(img);
  if (r >= 2) return "panorama";
  if (r > 1.1) return "landscape";
  if (r < 0.9) return "portrait";
  return "square";
}
