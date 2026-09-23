import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { imageSelect } from "@/lib/queries";
import { AdminHeader, btn } from "@/components/admin/form";
import { ConfirmButton } from "@/components/admin/ActionForm";
import { deleteStory } from "@/app/admin/actions";
import { StoryForm } from "../StoryForm";

export default async function EditStory({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ created?: string }> }) {
  const { id } = await params;
  const [story, trips] = await Promise.all([
    prisma.story.findUnique({ where: { id }, include: { coverImage: { select: { id: true, ...imageSelect } } } }),
    prisma.trip.findMany({ select: { id: true, title: true }, orderBy: { startDate: "desc" } }),
  ]);
  if (!story) notFound();
  return (
    <>
      <AdminHeader title={story.title}>
        <Link href={`/stories/${story.slug}`} target="_blank" className={btn.ghost}>View ↗</Link>
        <ConfirmButton action={deleteStory.bind(null, story.id)} label="Delete" confirmText={`Delete “${story.title}”?`} />
      </AdminHeader>
      {(await searchParams).created && <p className="mb-6 rounded-md border border-forest/40 bg-moss/20 px-4 py-3 text-sm">Story created.</p>}
      <StoryForm story={story} trips={trips} />
    </>
  );
}
