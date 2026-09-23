import type { Story } from "@prisma/client";
import { ActionForm } from "@/components/admin/ActionForm";
import { Checkbox, Field, Fieldset, Select, TextArea } from "@/components/admin/form";
import { ImageField } from "@/components/admin/ImageField";
import type { ImageAsset } from "@/lib/images";
import { saveStory } from "@/app/admin/actions";

export function StoryForm({ story, trips }: { story?: (Story & { coverImage: (ImageAsset & { id: string }) | null }) | null; trips: { id: string; title: string }[] }) {
  return (
    <ActionForm action={saveStory.bind(null, story?.id ?? null)} submitLabel={story ? "Save story" : "Create story"}>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Fieldset title="Story">
          <Field label="Title" name="title" required defaultValue={story?.title} placeholder="The Road to Spiti" />
          <TextArea label="Excerpt" name="excerpt" rows={2} defaultValue={story?.excerpt ?? ""} hint="One or two sentences shown on cards." />
          <TextArea
            label="Story (Markdown)"
            name="content"
            rows={28}
            required
            defaultValue={story?.content ?? ""}
            hint="## Headings, **bold**, *italic*, > quotes, - lists, [links](https://…), ![image](url). Photos assigned to this story (from the photo editor) appear in a gallery below it."
          />
        </Fieldset>
        <div className="space-y-6">
          <Fieldset title="Cover">
            <ImageField name="coverImageId" label="Cover photograph" initial={story?.coverImage} />
          </Fieldset>
          <Fieldset title="Details">
            <Field label="Location" name="location" defaultValue={story?.location ?? ""} placeholder="Spiti Valley, Himachal Pradesh" />
            <Field label="Publish date" name="publishedAt" type="date" defaultValue={story?.publishedAt.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10)} hint="Future dates are hidden until that day." />
            <Select label="Related trip" name="tripId" defaultValue={story?.tripId} options={trips.map((t) => ({ value: t.id, label: t.title }))} />
            <Field label="Tags" name="tags" defaultValue={story?.tags.join(", ")} placeholder="himalaya, road trip, spiti" />
            <Checkbox label="Published" name="published" defaultChecked={story?.published ?? true} />
          </Fieldset>
          <Fieldset title="SEO">
            <Field label="URL slug" name="slug" defaultValue={story?.slug} placeholder="the-road-to-spiti" hint="Leave empty to generate from the title." />
            <Field label="SEO title" name="seoTitle" defaultValue={story?.seoTitle ?? ""} />
            <TextArea label="Meta description" name="seoDescription" rows={3} defaultValue={story?.seoDescription ?? ""} maxLength={300} />
          </Fieldset>
        </div>
      </div>
    </ActionForm>
  );
}
