import sharp from "sharp";
import exifr from "exifr";
import { IMAGE_WIDTHS, type ImageFormat } from "@/lib/images";

export type ExifData = {
  camera?: string;
  lens?: string;
  focalLength?: string;
  aperture?: string;
  iso?: string;
  shutterSpeed?: string;
  takenAt?: Date;
  latitude?: number;
  longitude?: number;
};

export type ImageAnalysis = {
  width: number;
  height: number;
  blurDataUrl: string;
  color: string;
  exif: ExifData;
};

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/tiff"];
export const MAX_UPLOAD_BYTES = 60 * 1024 * 1024;

// Large photos are decoded once per variant; keep sharp's cache small to limit memory on small servers.
sharp.cache({ memory: 200 });

function formatShutter(t?: number) {
  if (!t) return undefined;
  return t >= 1 ? `${t}s` : `1/${Math.round(1 / t)}s`;
}

async function readExif(buffer: Buffer): Promise<ExifData> {
  try {
    const e = await exifr.parse(buffer, {
      pick: ["Make", "Model", "LensModel", "FocalLength", "FNumber", "ISO", "ExposureTime", "DateTimeOriginal", "latitude", "longitude"],
      gps: true,
    });
    if (!e) return {};
    const make = (e.Make as string | undefined)?.trim();
    const model = (e.Model as string | undefined)?.trim();
    const camera = model ? (make && !model.toLowerCase().startsWith(make.toLowerCase().split(" ")[0]) ? `${make} ${model}` : model) : make;
    return {
      camera,
      lens: e.LensModel,
      focalLength: e.FocalLength ? `${Math.round(e.FocalLength)}mm` : undefined,
      aperture: e.FNumber ? `f/${e.FNumber}` : undefined,
      iso: e.ISO ? String(e.ISO) : undefined,
      shutterSpeed: formatShutter(e.ExposureTime),
      takenAt: e.DateTimeOriginal instanceof Date ? e.DateTimeOriginal : undefined,
      latitude: typeof e.latitude === "number" ? e.latitude : undefined,
      longitude: typeof e.longitude === "number" ? e.longitude : undefined,
    };
  } catch {
    return {};
  }
}

export async function analyzeImage(buffer: Buffer): Promise<ImageAnalysis> {
  const meta = await sharp(buffer).metadata();
  if (!meta.width || !meta.height) throw new Error("Unreadable image");
  // EXIF orientations 5-8 are rotated 90°, so the displayed size is swapped.
  const rotated = (meta.orientation ?? 1) >= 5;
  const width = rotated ? meta.height : meta.width;
  const height = rotated ? meta.width : meta.height;

  const [tiny, stats, exif] = await Promise.all([
    sharp(buffer).rotate().resize(20, 20, { fit: "inside" }).webp({ quality: 40 }).toBuffer(),
    sharp(buffer).rotate().resize(64, 64, { fit: "inside" }).stats(),
    readExif(buffer),
  ]);
  const { r, g, b } = stats.dominant;
  const hex = (n: number) => n.toString(16).padStart(2, "0");

  return {
    width,
    height,
    blurDataUrl: `data:image/webp;base64,${tiny.toString("base64")}`,
    color: `#${hex(r)}${hex(g)}${hex(b)}`,
    exif,
  };
}

export function variantWidths(originalWidth: number) {
  const w = IMAGE_WIDTHS.filter((x) => x <= originalWidth);
  return w.length ? w : [originalWidth];
}

/** Produces AVIF + WebP renditions for every responsive width. Metadata is stripped. */
export async function generateVariants(buffer: Buffer, widths: number[]) {
  const base = sharp(buffer, { failOn: "none" }).rotate();
  const jobs: Promise<{ width: number; format: ImageFormat; data: Buffer }>[] = [];
  for (const width of widths) {
    const resized = base.clone().resize({ width, withoutEnlargement: true });
    jobs.push(resized.clone().avif({ quality: 52, effort: 3 }).toBuffer().then((data) => ({ width, format: "avif" as const, data })));
    jobs.push(resized.clone().webp({ quality: 80, effort: 4 }).toBuffer().then((data) => ({ width, format: "webp" as const, data })));
  }
  return Promise.all(jobs);
}
