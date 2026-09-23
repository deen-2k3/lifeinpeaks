import { prisma } from "@/lib/prisma";
import { ActionForm, ConfirmButton } from "@/components/admin/ActionForm";
import { AdminHeader, Field, Select } from "@/components/admin/form";
import { createCategory, deleteCategory, updateCategory } from "@/app/admin/actions";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({ orderBy: [{ group: "asc" }, { sortOrder: "asc" }, { name: "asc" }], include: { _count: { select: { photos: true } } } });
  return (
    <>
      <AdminHeader title="Categories" />
      <p className="-mt-4 mb-8 max-w-2xl text-sm text-stone">
        Portfolio categories filter the Photography page; Mountain categories filter the Mountains page. A photo can belong to both.
      </p>
      <div className="grid gap-10 xl:grid-cols-2">
        {(["PORTFOLIO", "MOUNTAIN"] as const).map((g) => (
          <section key={g}>
            <h2 className="mb-4 font-display text-3xl">{g === "PORTFOLIO" ? "Photography portfolio" : "Mountains"}</h2>
            <ul className="space-y-2">
              {categories.filter((c) => c.group === g).map((c) => (
                <li key={c.id} className="flex items-start gap-2 rounded-md border border-line/5 bg-coal p-3">
                  <ActionForm action={updateCategory.bind(null, c.id)} submitLabel="Save" className="flex-1 [&>div:last-child]:static [&>div:last-child]:mx-0 [&>div:last-child]:border-0 [&>div:last-child]:bg-transparent [&>div:last-child]:p-0">
                    <div className="grid grid-cols-[1fr_1fr_80px] gap-2">
                      <Field label="Name" name="name" defaultValue={c.name} />
                      <Field label="Slug" name="slug" defaultValue={c.slug} />
                      <Field label="Order" name="sortOrder" type="number" defaultValue={c.sortOrder} />
                    </div>
                    <p className="text-xs text-stone">{c._count.photos} photos</p>
                  </ActionForm>
                  <ConfirmButton action={deleteCategory.bind(null, c.id)} label="✕" confirmText={`Delete category “${c.name}”? Photos are kept.`} className="mt-7 grid size-9 place-items-center rounded-full text-stone hover:bg-ember hover:text-ink" />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="mt-12 max-w-xl">
        <h2 className="mb-4 font-display text-3xl">Add a category</h2>
        <ActionForm action={createCategory} submitLabel="Add category">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name" name="name" required placeholder="Waterfalls" />
            <Select label="Group" name="group" empty={false} options={[{ value: "PORTFOLIO", label: "Photography portfolio" }, { value: "MOUNTAIN", label: "Mountains" }]} />
          </div>
        </ActionForm>
      </section>
    </>
  );
}
