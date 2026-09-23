import fs from "node:fs/promises";
import path from "node:path";
import { VARIANTS_DIR } from "@/lib/storage/providers";

// Serves optimised renditions from local storage. Filenames are content-addressed (a new upload
// always gets a new key), so responses are cached forever by browsers and any CDN in front.
const TYPES: Record<string, string> = { ".avif": "image/avif", ".webp": "image/webp", ".jpg": "image/jpeg" };

export async function GET(_: Request, { params }: { params: Promise<{ key: string[] }> }) {
  const parts = (await params).key;
  if (parts.some((p) => !/^[\w.-]+$/.test(p) || p.startsWith("."))) return new Response("Bad request", { status: 400 });
  const file = path.join(VARIANTS_DIR, ...parts);
  if (!file.startsWith(VARIANTS_DIR + path.sep)) return new Response("Bad request", { status: 400 });
  const type = TYPES[path.extname(file)];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": type, "Content-Length": String(data.length), "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=60" } });
  }
}
