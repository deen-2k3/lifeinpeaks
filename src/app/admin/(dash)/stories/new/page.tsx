import { prisma } from "@/lib/prisma";
import { AdminHeader } from "@/components/admin/form";
import { StoryForm } from "../StoryForm";

export default async function NewStory() {
  const trips = await prisma.trip.findMany({ select: { id: true, title: true }, orderBy: { startDate: "desc" } });
  return (
    <>
      <AdminHeader title="New story" />
      <StoryForm trips={trips} />
    </>
  );
}
