import type { Metadata } from "next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PageIntro } from "@/components/ui";
import { getCategories, getPhotos } from "@/lib/queries";

export const revalidate = 300;

type Props = { searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: "Photography Portfolio",
    description: "Travel and landscape photography portfolio — mountains, people, streets, wildlife, architecture, food and sunsets from across India and the Himalaya.",
    alternates: { canonical: category ? `/photography?category=${category}` : "/photography" },
  };
}

export default async function PhotographyPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [categories, photos] = await Promise.all([
    getCategories("PORTFOLIO"),
    getPhotos(category ? { category, group: "PORTFOLIO", take: 30 } : { take: 30 }),
  ]);
  const query = category ? `group=PORTFOLIO&category=${encodeURIComponent(category)}` : "";

  return (
    <>
      <PageIntro eyebrow="Portfolio" title="Photography">
        Light, land and people — photographs I keep coming back to. Tap any frame to see it large, with the story and settings behind it.
      </PageIntro>
      <section className="container-page pb-32">
        <CategoryFilter basePath="/photography" categories={categories} active={category} />
        <PhotoGallery key={category ?? "all"} initial={photos.items} nextCursor={photos.nextCursor} query={query} />
      </section>
    </>
  );
}
