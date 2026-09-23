import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/images";
import { imageSelect } from "@/lib/queries";
import { AdminHeader, btn } from "@/components/admin/form";
import { formatMonthYear } from "@/lib/utils";

export default async function AdminTrips() {
  const trips = await prisma.trip.findMany({
    orderBy: { startDate: "desc" },
    include: { coverImage: { select: imageSelect }, _count: { select: { photos: true } } },
  });
  return (
    <>
      <AdminHeader title="Trips">
        <Link href="/admin/trips/new" className={btn.primary}>+ New trip</Link>
      </AdminHeader>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {trips.map((t) => (
          <li key={t.id}>
            <Link href={`/admin/trips/${t.id}`} className="flex gap-4 rounded-md border border-line/5 bg-coal p-3 transition hover:border-line/15">
              <span className="h-20 w-28 shrink-0 overflow-hidden rounded-sm bg-ash">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {t.coverImage && <img src={imageUrl(t.coverImage, 480)} alt="" className="size-full object-cover" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-2xl">{t.title}</span>
                <span className="block text-xs text-stone">{t.region} · {formatMonthYear(t.startDate)} · {t._count.photos} photos</span>
                <span className="mt-1 flex gap-2 text-[0.65rem] uppercase tracking-wider">
                  {!t.published && <span className="text-ember">Draft</span>}
                  {t.featured && <span className="text-sand">Featured</span>}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {!trips.length && <p className="text-stone">No trips yet.</p>}
    </>
  );
}
