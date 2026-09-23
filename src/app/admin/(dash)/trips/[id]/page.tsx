import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/images";
import { imageSelect } from "@/lib/queries";
import { AdminHeader, btn } from "@/components/admin/form";
import { ConfirmButton } from "@/components/admin/ActionForm";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { deleteTrip } from "@/app/admin/actions";
import { TripForm } from "../TripForm";

export default async function EditTrip({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: { coverImage: { select: { id: true, ...imageSelect } }, photos: { include: { image: { select: imageSelect } }, orderBy: { takenAt: "asc" } } },
  });
  if (!trip) notFound();
  const created = (await searchParams).created;

  return (
    <>
      <AdminHeader title={trip.title}>
        <Link href={`/trips/${trip.slug}`} target="_blank" className={btn.ghost}>View ↗</Link>
        <ConfirmButton action={deleteTrip.bind(null, trip.id)} label="Delete" confirmText={`Delete “${trip.title}”? Its photos stay in the library.`} />
      </AdminHeader>
      {created && <p className="mb-6 rounded-md border border-forest/40 bg-moss/20 px-4 py-3 text-sm">Trip created. Now add photos below.</p>}
      <TripForm trip={trip} />

      <section className="mt-12">
        <h2 className="mb-4 font-display text-3xl">Photos in this trip ({trip.photos.length})</h2>
        <ImageUploader tripId={trip.id} />
        <ul className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-8">
          {trip.photos.map((p) => (
            <li key={p.id}>
              <Link href={`/admin/photos/${p.id}`} className="block aspect-square overflow-hidden rounded-sm bg-ash">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl(p.image, 480)} alt={p.title ?? ""} className="size-full object-cover transition hover:scale-105" loading="lazy" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
