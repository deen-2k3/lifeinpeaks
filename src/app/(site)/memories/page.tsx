import type { Metadata } from "next";
import { MemoryAlbum } from "@/components/MemoryCard";
import { EmptyState, PageIntro } from "@/components/ui";
import { getMemories } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Little Moments",
  description: "Sunrises with friends, campfire nights, roadside chai and first snowfall — the small, happy moments from years of travelling.",
  alternates: { canonical: "/memories" },
};

export default async function MemoriesPage() {
  const memories = await getMemories();
  return (
    <>
      <PageIntro eyebrow="A personal album" title="Little Moments">
        The ones that never make it into the portfolio — blurry, happy, and absolutely unforgettable.
      </PageIntro>
      <section className="container-page pb-32">
        {memories.length ? <MemoryAlbum memories={memories} /> : <EmptyState>The album is empty for now.</EmptyState>}
      </section>
    </>
  );
}
