import type { Metadata } from "next";
import Link from "next/link";
import { MemoryAlbum } from "@/components/MemoryCard";
import { PhotoGallery } from "@/components/PhotoGallery";
import { StoryCard } from "@/components/StoryCard";
import { TripGrid } from "@/components/TripCard";
import { PageIntro } from "@/components/ui";
import { searchAll } from "@/lib/queries";

type Props = { searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search", robots: { index: false, follow: true } };
}

function Group({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  if (!count) return null;
  return (
    <section className="mb-20">
      <h2 className="mb-8 flex items-baseline gap-3 font-display text-4xl">
        {title} <span className="text-base text-stone">{count}</span>
      </h2>
      {children}
    </section>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim();
  const r = await searchAll(q);
  const total = r.trips.length + r.stories.length + r.photos.length + r.memories.length;

  return (
    <>
      <PageIntro eyebrow="Search" title={q ? `“${q}”` : "Search"}>
        <form action="/search" className="flex max-w-xl items-center gap-3 border-b border-line/15 pb-2 focus-within:border-sand">
          <input name="q" defaultValue={q} placeholder="Search trips, places, stories, photos…" className="w-full bg-transparent py-2 text-lg text-mist placeholder:text-stone/60 focus:outline-none" />
          <button className="text-xs uppercase tracking-[0.2em] text-sand">Search</button>
        </form>
        {q && <p className="mt-4 text-sm text-stone">{total ? `${total} results` : "Nothing found. Try a place, a season or a feeling — “snow”, “sunrise”, “Ladakh”."}</p>}
      </PageIntro>
      <div className="container-page pb-24">
        {r.categories.length > 0 && (
          <div className="mb-16 flex flex-wrap gap-2">
            {r.categories.map((c) => (
              <Link key={c.group + c.slug} href={`/${c.group === "MOUNTAIN" ? "mountains" : "photography"}?category=${c.slug}`} className="rounded-full border border-line/10 px-4 py-2 text-sm text-fog hover:border-sand hover:text-mist">
                {c.name} · {c.group === "MOUNTAIN" ? "Mountains" : "Portfolio"}
              </Link>
            ))}
          </div>
        )}
        <Group title="Journeys" count={r.trips.length}><TripGrid trips={r.trips} /></Group>
        <Group title="Photographs" count={r.photos.length}><PhotoGallery initial={r.photos} /></Group>
        <Group title="Stories" count={r.stories.length}>
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">{r.stories.map((s, i) => <StoryCard key={s.id} story={s} index={i} />)}</div>
        </Group>
        <Group title="Memories" count={r.memories.length}><MemoryAlbum memories={r.memories} /></Group>
      </div>
    </>
  );
}
