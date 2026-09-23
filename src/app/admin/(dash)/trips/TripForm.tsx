import type { Trip } from "@prisma/client";
import { ActionForm } from "@/components/admin/ActionForm";
import { Checkbox, Field, Fieldset, TextArea } from "@/components/admin/form";
import { ImageField } from "@/components/admin/ImageField";
import type { ImageAsset } from "@/lib/images";
import { saveTrip } from "@/app/admin/actions";

export const ymd = (d?: Date | null) => (d ? d.toISOString().slice(0, 10) : "");

export function TripForm({ trip }: { trip?: (Trip & { coverImage: (ImageAsset & { id: string }) | null }) | null }) {
  return (
    <ActionForm action={saveTrip.bind(null, trip?.id ?? null)} submitLabel={trip ? "Save trip" : "Create trip"}>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Fieldset title="Journey">
            <Field label="Destination / title" name="title" required defaultValue={trip?.title} placeholder="Himachal Pradesh" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="State / region" name="region" required defaultValue={trip?.region} placeholder="Himachal Pradesh" />
              <Field label="Country" name="country" defaultValue={trip?.country ?? "India"} />
            </div>
            <Field label="Tagline" name="tagline" defaultValue={trip?.tagline ?? ""} placeholder="Where the mountains taught me to slow down." />
            <TextArea label="Short description" name="excerpt" rows={3} defaultValue={trip?.excerpt ?? ""} hint="Shown on cards and used as the default meta description." />
            <TextArea
              label="My story (Markdown)"
              name="story"
              rows={22}
              defaultValue={trip?.story ?? ""}
              hint="Use ## headings for sections (Why I went, Places visited, People I met, Food, Adventures, Funny moments, Difficult moments, Favourite memories). **bold**, *italic*, > quotes and - lists work."
            />
          </Fieldset>
        </div>
        <div className="space-y-6">
          <Fieldset title="Cover">
            <ImageField name="coverImageId" label="Cover photograph" initial={trip?.coverImage} />
          </Fieldset>
          <Fieldset title="Dates & places">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Start date" name="startDate" type="date" required defaultValue={ymd(trip?.startDate)} />
              <Field label="End date" name="endDate" type="date" defaultValue={ymd(trip?.endDate)} />
            </div>
            <TextArea label="Places visited" name="places" rows={3} defaultValue={trip?.places.join(", ")} hint="Comma or line separated — e.g. Manali, Kasol, Tosh" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Map latitude" name="latitude" type="number" step="any" defaultValue={trip?.latitude ?? ""} placeholder="32.24" />
              <Field label="Map longitude" name="longitude" type="number" step="any" defaultValue={trip?.longitude ?? ""} placeholder="77.19" />
            </div>
            <p className="-mt-2 text-xs text-stone">Tip: right-click a spot in Google Maps to copy its coordinates.</p>
          </Fieldset>
          <Fieldset title="Visibility">
            <Checkbox label="Published" name="published" defaultChecked={trip?.published ?? true} />
            <Checkbox label="Featured on the homepage" name="featured" defaultChecked={trip?.featured} />
            <Field label="Sort order" name="sortOrder" type="number" defaultValue={trip?.sortOrder ?? 0} hint="Lower numbers appear first; ties are sorted by date." />
          </Fieldset>
          <Fieldset title="SEO">
            <Field label="URL slug" name="slug" defaultValue={trip?.slug} placeholder="himachal-2026" hint="Leave empty to generate from the title and year." />
            <Field label="SEO title" name="seoTitle" defaultValue={trip?.seoTitle ?? ""} />
            <TextArea label="Meta description" name="seoDescription" rows={3} defaultValue={trip?.seoDescription ?? ""} maxLength={300} />
          </Fieldset>
        </div>
      </div>
    </ActionForm>
  );
}
