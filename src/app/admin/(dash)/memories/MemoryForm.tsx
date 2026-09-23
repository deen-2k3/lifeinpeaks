import type { Memory } from "@prisma/client";
import { ActionForm } from "@/components/admin/ActionForm";
import { Checkbox, Field, Fieldset, Select, TextArea } from "@/components/admin/form";
import { ImageField } from "@/components/admin/ImageField";
import type { ImageAsset } from "@/lib/images";
import { saveMemory } from "@/app/admin/actions";

export function MemoryForm({ memory, trips }: { memory?: (Memory & { image: ImageAsset & { id: string } }) | null; trips: { id: string; title: string }[] }) {
  return (
    <ActionForm action={saveMemory.bind(null, memory?.id ?? null)} submitLabel={memory ? "Save memory" : "Add memory"} className="max-w-2xl">
      <Fieldset title="Memory">
        <ImageField name="imageId" label="Photograph" initial={memory?.image} required />
        <TextArea label="Caption" name="caption" rows={3} required defaultValue={memory?.caption} placeholder="We stopped the car just because the clouds looked unreal." />
        <Field label="Short title (optional)" name="title" defaultValue={memory?.title ?? ""} placeholder="Roadside stop" />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Location" name="location" defaultValue={memory?.location ?? ""} />
          <Field label="Date" name="date" type="date" defaultValue={memory?.date?.toISOString().slice(0, 10) ?? ""} />
        </div>
        <Select label="From trip" name="tripId" defaultValue={memory?.tripId} options={trips.map((t) => ({ value: t.id, label: t.title }))} />
        <Checkbox label="Published" name="published" defaultChecked={memory?.published ?? true} />
      </Fieldset>
    </ActionForm>
  );
}
