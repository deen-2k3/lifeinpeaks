import type { Metadata } from "next";
import { CategoryFilter } from "@/components/CategoryFilter";
import { Hero } from "@/components/Hero";
import { PhotoGallery } from "@/components/PhotoGallery";
import { getCategories, getPhotos } from "@/lib/queries";

export const revalidate = 300;

type Props = { searchParams: Promise<{ category?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: "Mountain Photography — Himalayas, Treks & Snow",
    description: "Himalayan and mountain photography: treks, snow, sunrises, sunsets, valleys, lakes, mountain roads, wildlife and camping under the stars.",
    alternates: { canonical: category ? `/mountains?category=${category}` : "/mountains" },
  };
}

export default async function MountainsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const [categories, photos, hero] = await Promise.all([
    getCategories("MOUNTAIN"),
    getPhotos({ group: "MOUNTAIN", category, take: 30 }),
    getPhotos({ group: "MOUNTAIN", category: "himalayas", featured: true, take: 1 }),
  ]);
  const query = `group=MOUNTAIN${category ? `&category=${encodeURIComponent(category)}` : ""}`;
  const heroImage = hero.items[0]?.image ?? photos.items[0]?.image ?? null;

  return (
    <>
      <Hero image={heroImage} alt="Snow-covered Himalayan peaks" size="medium" eyebrow="A cinematic gallery" title="Mountains" subtitle="“The mountains are calling, and I keep answering.”" />
      <section className="container-page pb-32 pt-10">
        <CategoryFilter basePath="/mountains" categories={categories} active={category} />
        <PhotoGallery key={category ?? "all"} initial={photos.items} nextCursor={photos.nextCursor} query={query} emptyText="No mountain photographs in this category yet." />
      </section>
    </>
  );
}
