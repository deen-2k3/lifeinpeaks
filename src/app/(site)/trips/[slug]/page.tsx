import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Markdown } from "@/components/Markdown";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MemoryCard } from "@/components/MemoryCard";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";
import { JsonLd, SectionHeading } from "@/components/ui";
import { ArrowLeft, ArrowRight } from "@/components/icons";
import { getAdjacentTrips, getPhotos, getTripBySlug } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { absoluteImage, breadcrumbs, pageMetadata } from "@/lib/seo";
import { formatDate, formatMonthYear, plural, siteUrl, tripDays } from "@/lib/utils";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    return (await prisma.trip.findMany({ where: { published: true }, select: { slug: true } })).map((t) => ({ slug: t.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params) {
  const trip = await getTripBySlug((await params).slug);
  if (!trip) return {};
  return pageMetadata({
    title: trip.seoTitle || `${trip.title} — ${trip.tagline ?? "Travel photography & story"}`,
    description: trip.seoDescription || trip.excerpt,
    path: `/trips/${trip.slug}`,
    image: trip.coverImage,
    type: "article",
  });
}

export default async function TripPage({ params }: Params) {
  const trip = await getTripBySlug((await params).slug);
  if (!trip) notFound();

  const [photos, adjacent] = await Promise.all([getPhotos({ tripId: trip.id, take: 30 }), getAdjacentTrips(trip.startDate)]);
  const days = tripDays(trip.startDate, trip.endDate);
  const facts = [days && plural(days, "Day"), trip.places.length && plural(trip.places.length, "Place"), plural(trip._count.photos, "Photo")].filter(Boolean);

  return (
    <article>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "TouristTrip",
            name: trip.title,
            description: trip.excerpt ?? trip.tagline,
            image: absoluteImage(trip.coverImage),
            url: siteUrl(`/trips/${trip.slug}`),
            itinerary: trip.places.map((p) => ({ "@type": "Place", name: p, address: { "@type": "PostalAddress", addressRegion: trip.region, addressCountry: trip.country } })),
          },
          breadcrumbs([
            { name: "Journeys", path: "/journeys" },
            { name: trip.title, path: `/trips/${trip.slug}` },
          ]),
        ]}
      />

      <Hero
        image={trip.coverImage}
        alt={`${trip.title}, ${trip.region}`}
        size="tall"
        align="bottom"
        eyebrow={`${trip.region}, ${trip.country} · ${formatMonthYear(trip.startDate)}`}
        title={trip.title}
        subtitle={<span className="not-italic font-sans text-sm uppercase tracking-[0.3em] text-fog">{facts.join("  •  ")}</span>}
      />

      <section className="container-page grid gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_minmax(0,42rem)_1fr]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            {trip.tagline && <p className="font-display text-3xl italic leading-snug text-mist">“{trip.tagline}”</p>}
            <dl className="mt-8 space-y-5 text-sm">
              <div>
                <dt className="eyebrow">When</dt>
                <dd className="mt-1 text-fog">
                  {formatDate(trip.startDate)}
                  {trip.endDate && ` – ${formatDate(trip.endDate)}`}
                </dd>
              </div>
              {trip.places.length > 0 && (
                <div>
                  <dt className="eyebrow">Places</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {trip.places.map((p) => (
                      <Link key={p} href={`/search?q=${encodeURIComponent(p)}`} className="rounded-full border border-line/10 px-3 py-1 text-xs text-fog transition hover:border-sand hover:text-mist">
                        {p}
                      </Link>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </Reveal>
        </aside>

        <div>
          <p className="eyebrow">My Story</p>
          {trip.story ? (
            <div className="mt-6">
              <Markdown>{trip.story}</Markdown>
            </div>
          ) : (
            <p className="mt-6 text-lg text-fog">{trip.excerpt}</p>
          )}
        </div>
      </section>

      {photos.items.length > 0 && (
        <section className="border-t border-line/5 bg-coal py-20 sm:py-28" aria-labelledby="gallery">
          <div className="container-page">
            <SectionHeading eyebrow="Gallery" title={<span id="gallery">Through the lens</span>}>
              {plural(trip._count.photos, "photograph")} from {trip.title}.
            </SectionHeading>
            <PhotoGallery initial={photos.items} nextCursor={photos.nextCursor} query={`trip=${trip.id}`} />
          </div>
        </section>
      )}

      {trip.memories.length > 0 && (
        <section className="container-page py-20 sm:py-28">
          <SectionHeading eyebrow="Little moments" title="From this trip" />
          <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {trip.memories.map((m, i) => (
              <MemoryCard key={m.id} memory={{ ...m, trip: null }} index={i} />
            ))}
          </div>
        </section>
      )}

      {trip.stories.length > 0 && (
        <section className="container-page py-20 sm:py-28">
          <SectionHeading eyebrow="Read more" title="Stories from this journey" />
          <div className="grid gap-8 md:grid-cols-2">
            {trip.stories.map((s) => (
              <Link key={s.slug} href={`/stories/${s.slug}`} className="group grid grid-cols-[120px_1fr] items-center gap-5 sm:grid-cols-[180px_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-ash">
                  {s.coverImage && <Picture image={s.coverImage} alt={s.title} fill sizes="180px" imgClassName="transition duration-1000 group-hover:scale-105" />}
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-stone">{formatDate(s.publishedAt)}</p>
                  <h3 className="mt-1 font-display text-2xl leading-tight transition group-hover:text-sand sm:text-3xl">{s.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <nav className="grid border-t border-line/5 sm:grid-cols-2" aria-label="More journeys">
        {adjacent.prev ? (
          <Link href={`/trips/${adjacent.prev.slug}`} className="group flex items-center gap-5 border-line/5 p-8 transition hover:bg-line/[.02] sm:border-r sm:p-12">
            <ArrowLeft className="shrink-0 text-stone transition group-hover:-translate-x-1 group-hover:text-sand" />
            <span>
              <span className="eyebrow block">Earlier journey</span>
              <span className="mt-1 block font-display text-3xl">{adjacent.prev.title}</span>
            </span>
          </Link>
        ) : <span />}
        {adjacent.next && (
          <Link href={`/trips/${adjacent.next.slug}`} className="group flex items-center justify-end gap-5 p-8 text-right transition hover:bg-line/[.02] sm:p-12">
            <span>
              <span className="eyebrow block">Next journey</span>
              <span className="mt-1 block font-display text-3xl">{adjacent.next.title}</span>
            </span>
            <ArrowRight className="shrink-0 text-stone transition group-hover:translate-x-1 group-hover:text-sand" />
          </Link>
        )}
      </nav>
    </article>
  );
}
