import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ACCEPTED_TYPES, MAX_UPLOAD_BYTES, saveImage } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 120;

/**
 * Upload one image. `mode=photo` also creates a gallery Photo (with camera metadata read from EXIF);
 * `mode=image` only stores the asset (for covers, memories, profile picture…).
 */
export async function POST(req: NextRequest) {
  if (!(await getSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file received" }, { status: 400 });
  if (!ACCEPTED_TYPES.includes(file.type)) return NextResponse.json({ error: `Unsupported file type (${file.type || "unknown"}). Use JPEG, PNG, WebP, AVIF or TIFF.` }, { status: 415 });
  if (file.size > MAX_UPLOAD_BYTES) return NextResponse.json({ error: "File is larger than 60 MB" }, { status: 413 });

  try {
    const { image, exif } = await saveImage(Buffer.from(await file.arrayBuffer()), file.name);
    const imageDto = { id: image.id, key: image.key, provider: image.provider, width: image.width, height: image.height, variants: image.variants, blurDataUrl: image.blurDataUrl, color: image.color };

    if (form.get("mode") !== "photo") return NextResponse.json({ image: imageDto });

    const tripId = (form.get("tripId") as string) || null;
    const categoryIds = form.getAll("categoryIds").map(String).filter(Boolean);
    const baseTitle = file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
    const photo = await prisma.photo.create({
      data: {
        imageId: image.id,
        title: baseTitle.length > 2 && !/^(img|dsc|pxl|p)\s?\d+/i.test(baseTitle) ? baseTitle : null,
        camera: exif.camera,
        lens: exif.lens,
        focalLength: exif.focalLength,
        aperture: exif.aperture,
        iso: exif.iso,
        shutterSpeed: exif.shutterSpeed,
        takenAt: exif.takenAt,
        tripId: tripId && (await prisma.trip.count({ where: { id: tripId } })) ? tripId : null,
        categories: categoryIds.length ? { connect: categoryIds.map((id) => ({ id })) } : undefined,
      },
    });
    revalidatePath("/", "layout");
    return NextResponse.json({ image: imageDto, photo: { id: photo.id } });
  } catch (e) {
    console.error("[upload]", e);
    return NextResponse.json({ error: "Could not process this image. Is the file corrupted?" }, { status: 500 });
  }
}
