import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { v2 as cloudinary } from "cloudinary";
import { generateVariants, variantWidths, type ImageAnalysis } from "./process";

export type StoredImage = { key: string; variants: number[]; width?: number; height?: number };

export interface StorageProvider {
  readonly name: string;
  store(buffer: Buffer, originalName: string, analysis: ImageAnalysis): Promise<StoredImage>;
  remove(key: string): Promise<void>;
}

export const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? "./storage");
export const VARIANTS_DIR = path.join(UPLOAD_DIR, "variants");
const ORIGINALS_DIR = path.join(UPLOAD_DIR, "originals");

function newKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${crypto.randomBytes(9).toString("base64url")}`;
}

/**
 * Local disk: originals are kept untouched in /originals (never served publicly),
 * optimised renditions go to /variants and are served by /media/[...key] with immutable caching.
 * Put a CDN (Cloudflare, CloudFront…) in front of /media and set NEXT_PUBLIC_MEDIA_BASE_URL.
 */
class LocalProvider implements StorageProvider {
  readonly name = "local";

  async store(buffer: Buffer, originalName: string, analysis: ImageAnalysis): Promise<StoredImage> {
    const key = newKey();
    const widths = variantWidths(analysis.width);
    const dir = path.join(VARIANTS_DIR, key);
    await fs.mkdir(dir, { recursive: true });
    const ext = path.extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, "") || ".jpg";
    const originalPath = path.join(ORIGINALS_DIR, `${key}${ext}`);
    await fs.mkdir(path.dirname(originalPath), { recursive: true });
    await fs.writeFile(originalPath, buffer);

    const variants = await generateVariants(buffer, widths);
    await Promise.all(variants.map((v) => fs.writeFile(path.join(dir, `${v.width}.${v.format}`), v.data)));
    return { key, variants: widths };
  }

  async remove(key: string) {
    await fs.rm(path.join(VARIANTS_DIR, key), { recursive: true, force: true });
    const origDir = path.join(ORIGINALS_DIR, path.dirname(key));
    const base = path.basename(key);
    const files = await fs.readdir(origDir).catch(() => [] as string[]);
    await Promise.all(files.filter((f) => f.startsWith(base + ".")).map((f) => fs.rm(path.join(origDir, f), { force: true })));
  }
}

/**
 * Cloudinary: the untouched original is uploaded; resizing and AVIF/WebP conversion happen
 * on Cloudinary's CDN via URL transformations (see lib/images.ts).
 */
class CloudinaryProvider implements StorageProvider {
  readonly name = "cloudinary";

  constructor() {
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }

  store(buffer: Buffer): Promise<StoredImage> {
    const folder = process.env.CLOUDINARY_FOLDER ?? "lifeinpeaks";
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: "image", use_filename: false, unique_filename: true }, (err, res) => {
          if (err || !res) return reject(err ?? new Error("Cloudinary upload failed"));
          resolve({ key: res.public_id, variants: [], width: res.width, height: res.height });
        })
        .end(buffer);
    });
  }

  async remove(key: string) {
    await cloudinary.uploader.destroy(key, { invalidate: true });
  }
}

const cache = new Map<string, StorageProvider>();

export function getProvider(name = process.env.STORAGE_PROVIDER ?? "local"): StorageProvider {
  let p = cache.get(name);
  if (!p) {
    if (name === "cloudinary") p = new CloudinaryProvider();
    else if (name === "local") p = new LocalProvider();
    else throw new Error(`Unknown STORAGE_PROVIDER "${name}"`);
    cache.set(name, p);
  }
  return p;
}
