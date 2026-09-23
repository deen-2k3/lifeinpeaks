import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { imageSelect } from "@/lib/queries";
import { AdminHeader } from "@/components/admin/form";
import { ConfirmButton } from "@/components/admin/ActionForm";
import { deleteMemory } from "@/app/admin/actions";
import { MemoryForm } from "../MemoryForm";

export default async function EditMemory({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [memory, trips] = await Promise.all([
    prisma.memory.findUnique({ where: { id }, include: { image: { select: { id: true, ...imageSelect } } } }),
    prisma.trip.findMany({ select: { id: true, title: true }, orderBy: { startDate: "desc" } }),
  ]);
  if (!memory) notFound();
  return (
    <>
      <AdminHeader title="Edit memory">
        <ConfirmButton action={deleteMemory.bind(null, memory.id)} label="Delete" confirmText="Delete this memory?" />
      </AdminHeader>
      <MemoryForm memory={memory} trips={trips} />
    </>
  );
}
