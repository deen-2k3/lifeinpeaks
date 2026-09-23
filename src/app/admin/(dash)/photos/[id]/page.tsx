import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { imageUrl } from "@/lib/images";
import { imageSelect } from "@/lib/queries";
import { ActionForm, ConfirmButton } from "@/components/admin/ActionForm";
import { AdminHeader, Checkbox, Field, Fieldset, Select, TextArea } from "@/components/admin/form";
import { deletePhoto, savePhoto } from "@/app/admin/actions";

export default async function EditPhoto({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [photo, trips, categories, stories] = await Promise.all([
    prisma.photo.findUnique({ where: { id }, include: { image: { select: { ...imageSelect, originalName: true, bytes: true } }, categories: { select: { id: true } }, stories: { select: { id: true } } } }),
    prisma.trip.findMany({ select: { id: true, title: true }, orderBy: { startDate: "desc" } }),
    prisma.category.findMany({ orderBy: [{ group: "asc" }, { sortOrder: "asc" }] }),
    prisma.story.findMany({ select: { id: true, title: true }, orderBy: { publishedAt: "desc" } }),
  ]);
  if (!photo) notFound();
  const has = (ids: { id: string }[], id: string) => ids.some((x) => x.id === id);
  const local = (d: Date | null) => (d ? new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "");

  return (
    <>
      <AdminHeader title={photo.title ?? "Untitled photo"}>
        <ConfirmButton action={deletePhoto.bind(null, photo.id)} label="Delete photo" confirmText="Delete this photo and all its files permanently?" />
      </AdminHeader>
      <div className="grid gap-8 xl:grid-cols-[1fr_1.1fr]">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(photo.image, 1600)} alt={photo.alt ?? ""} className="w-full rounded-sm" style={{ aspectRatio: `${photo.image.width}/${photo.image.height}` }} />
          <p className="mt-2 text-xs text-stone">
            {photo.image.width} × {photo.image.height}px · {photo.image.originalName} · {photo.image.bytes ? `${(photo.image.bytes / 1048576).toFixed(1)} MB original` : ""}
          </p>
        </div>
        <ActionForm action={savePhoto.bind(null, photo.id)} submitLabel="Save photo">
          <Fieldset title="Caption">
            <Field label="Title" name="title" defaultValue={photo.title ?? ""} />
            <TextArea label="Description / caption" name="description" rows={3} defaultValue={photo.description ?? ""} />
            <Field label="Alt text" name="alt" defaultValue={photo.alt ?? ""} hint="Describe the image for screen readers and search engines." />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Location" name="location" defaultValue={photo.location ?? ""} placeholder="Chandratal, Spiti" />
              <Field label="Date taken" name="takenAt" type="datetime-local" defaultValue={local(photo.takenAt)} />
            </div>
          </Fieldset>
          <Fieldset title="Camera">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Camera" name="camera" defaultValue={photo.camera ?? ""} />
              <Field label="Lens" name="lens" defaultValue={photo.lens ?? ""} />
              <Field label="Focal length" name="focalLength" defaultValue={photo.focalLength ?? ""} placeholder="35mm" />
              <Field label="Aperture" name="aperture" defaultValue={photo.aperture ?? ""} placeholder="f/8" />
              <Field label="ISO" name="iso" defaultValue={photo.iso ?? ""} placeholder="100" />
              <Field label="Shutter speed" name="shutterSpeed" defaultValue={photo.shutterSpeed ?? ""} placeholder="1/250s" />
            </div>
          </Fieldset>
          <Fieldset title="Organise">
            <Select label="Trip" name="tripId" defaultValue={photo.tripId} options={trips.map((t) => ({ value: t.id, label: t.title }))} />
            {(["PORTFOLIO", "MOUNTAIN"] as const).map((g) => (
              <div key={g}>
                <p className="mb-2 text-sm text-fog">{g === "PORTFOLIO" ? "Portfolio categories" : "Mountain categories"}</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {categories.filter((c) => c.group === g).map((c) => (
                    <Checkbox key={c.id} label={c.name} name="categories" value={c.id} defaultChecked={has(photo.categories, c.id)} />
                  ))}
                </div>
              </div>
            ))}
            {stories.length > 0 && (
              <div>
                <p className="mb-2 text-sm text-fog">Show in stories</p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  {stories.map((s) => <Checkbox key={s.id} label={s.title} name="stories" value={s.id} defaultChecked={has(photo.stories, s.id)} />)}
                </div>
              </div>
            )}
            <div className="flex gap-6">
              <Checkbox label="Published" name="published" defaultChecked={photo.published} />
              <Checkbox label="Featured" name="featured" defaultChecked={photo.featured} />
            </div>
          </Fieldset>
        </ActionForm>
      </div>
    </>
  );
}
