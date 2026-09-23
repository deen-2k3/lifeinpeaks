import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form";
import { MemoryForm } from "../MemoryForm";

export default async function NewMemory() {
  const trips = await prisma.trip.findMany({ select: { id: true, title: true }, orderBy: { startDate: "desc" } });
  return (
    <>
      <AdminHeader title="Add a memory" />
      <MemoryForm trips={trips} />
    </>
  );
}
