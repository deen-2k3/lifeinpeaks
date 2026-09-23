import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { imageSelect } from "@/lib/queries";
import { AdminHeader } from "@/components/admin/form";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { PhotoGrid } from "./PhotoGrid";

const PAGE = 60;

export default async function AdminPhotos({ searchParams }: { searchParams: Promise<{ trip?: string; category?: string; q?: string; page?: string }> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const where: Prisma.PhotoWhereInput = {};
  if (sp.trip === "none") where.tripId = null;
  else if (sp.trip) where.tripId = sp.trip;
  if (sp.category) where.categories = { some: { id: sp.category } };
  if (sp.q) where.OR = [{ title: { contains: sp.q, mode: "insensitive" } }, { location: { contains: sp.q, mode: "insensitive" } }];

  const [photos, total, trips, categories] = await Promise.all([
    prisma.photo.findMany({ where, include: { image: { select: imageSelect }, trip: { select: { title: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE, take: PAGE }),
    prisma.photo.count({ where }),
    prisma.trip.findMany({ select: { id: true, title: true }, orderBy: { startDate: "desc" } }),
    prisma.category.findMany({ select: { id: true, name: true, group: true }, orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
  ]);
  const pages = Math.ceil(total / PAGE);
  const qs = (p: number) => `?${new URLSearchParams({ ...(sp.trip ? { trip: sp.trip } : {}), ...(sp.category ? { category: sp.category } : {}), ...(sp.q ? { q: sp.q } : {}), page: String(p) })}`;

  return (
    <>
      <AdminHeader title={`Photos (${total})`} />
      <ImageUploader />

      <form className="mt-8 flex flex-wrap items-end gap-3 text-sm">
        <input name="q" defaultValue={sp.q} placeholder="Search title or location" className="rounded-sm border border-line/10 bg-coal px-3 py-2" />
        <select name="trip" defaultValue={sp.trip ?? ""} className="rounded-sm border border-line/10 bg-coal px-3 py-2">
          <option value="">All trips</option>
          <option value="none">Not in a trip</option>
          {trips.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
        </select>
        <select name="category" defaultValue={sp.category ?? ""} className="rounded-sm border border-line/10 bg-coal px-3 py-2">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.group === "MOUNTAIN" ? "Mountains › " : ""}{c.name}</option>)}
        </select>
        <button className="rounded-full border border-line/15 px-4 py-2 hover:border-sand">Filter</button>
        {(sp.q || sp.trip || sp.category) && <Link href="/admin/photos" className="py-2 text-stone hover:text-mist">Reset</Link>}
      </form>

      <PhotoGrid
        photos={photos.map((p) => ({ id: p.id, title: p.title, location: p.location, published: p.published, featured: p.featured, trip: p.trip?.title ?? null, image: p.image }))}
        trips={trips}
        categories={categories}
      />

      {pages > 1 && (
        <nav className="mt-8 flex gap-2 text-sm">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Link key={p} href={qs(p)} className={p === page ? "rounded-full bg-mist px-3 py-1 text-ink" : "rounded-full px-3 py-1 text-fog hover:bg-line/5"}>{p}</Link>
          ))}
        </nav>
      )}
    </>
  );
}
