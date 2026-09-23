import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/Hero";
import { Markdown } from "@/components/Markdown";
import { PhotoGallery } from "@/components/PhotoGallery";
import { StoryCard } from "@/components/StoryCard";
import { JsonLd, SectionHeading, TextLink } from "@/components/ui";
import { getSettings } from "@/lib/settings";
import { getStories, getStoryBySlug, toPhotoDTO } from "@/lib/queries";
import { prisma } from "@/lib/prisma";
import { absoluteImage, breadcrumbs, pageMetadata } from "@/lib/seo";
import { excerptOf, formatDate, readingTime, siteUrl } from "@/lib/utils";

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  try {
    return (await prisma.story.findMany({ where: { published: true }, select: { slug: true } })).map((s) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Params) {
  const story = await getStoryBySlug((await params).slug);
  if (!story) return {};
  return pageMetadata({
    title: story.seoTitle || story.title,
    description: story.seoDescription || story.excerpt || excerptOf(story.content),
    path: `/stories/${story.slug}`,
    image: story.coverImage,
    type: "article",
    publishedTime: story.publishedAt,
  });
}

export default async function StoryPage({ params }: Params) {
  const story = await getStoryBySlug((await params).slug);
  if (!story) notFound();
  const [settings, others] = await Promise.all([getSettings(), getStories(4)]);
  const more = others.filter((s) => s.slug !== story.slug).slice(0, 3);
  const minutes = readingTime(story.content);

  return (
    <article>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: story.title,
            description: story.excerpt ?? excerptOf(story.content),
            image: absoluteImage(story.coverImage),
            datePublished: story.publishedAt.toISOString(),
            dateModified: story.updatedAt.toISOString(),
            author: { "@type": "Person", name: settings.ownerName || settings.siteName, url: siteUrl("/about") },
            publisher: { "@type": "Organization", name: settings.siteName },
            mainEntityOfPage: siteUrl(`/stories/${story.slug}`),
            keywords: story.tags.join(", "),
            ...(story.location ? { contentLocation: { "@type": "Place", name: story.location } } : {}),
          },
          breadcrumbs([
            { name: "Stories", path: "/stories" },
            { name: story.title, path: `/stories/${story.slug}` },
          ]),
        ]}
      />

      <Hero
        image={story.coverImage}
        alt={story.title}
        size="tall"
        align="bottom"
        eyebrow={[formatDate(story.publishedAt), story.location, `${minutes} min read`].filter(Boolean).join("  ·  ")}
        title={<span className="block max-w-5xl">{story.title}</span>}
        subtitle={story.excerpt ? <span className="block max-w-2xl">{story.excerpt}</span> : undefined}
      />

      <div className="container-page py-20 sm:py-28">
        <div className="mx-auto max-w-2xl">
          <Markdown>{story.content}</Markdown>

          <footer className="mt-16 flex flex-wrap items-center gap-2 border-t border-line/10 pt-8">
            {story.tags.map((t) => (
              <Link key={t} href={`/search?q=${encodeURIComponent(t)}`} className="rounded-full border border-line/10 px-3 py-1 text-xs text-fog transition hover:border-sand hover:text-mist">
                #{t}
              </Link>
            ))}
            {story.trip && (
              <TextLink href={`/trips/${story.trip.slug}`} className="ml-auto">
                Journey: {story.trip.title}
              </TextLink>
            )}
          </footer>
        </div>
      </div>

      {story.photos.length > 0 && (
        <section className="border-t border-line/5 bg-coal py-20 sm:py-28">
          <div className="container-page">
            <SectionHeading eyebrow="Photography" title="Frames from this story" />
            <PhotoGallery initial={story.photos.map(toPhotoDTO)} />
          </div>
        </section>
      )}

      {more.length > 0 && (
        <section className="container-page py-20 sm:py-28">
          <SectionHeading eyebrow="Keep reading" title="More stories" action={{ href: "/stories", label: "All stories" }} />
          <div className="grid gap-12 md:grid-cols-3 md:gap-8">
            {more.map((s, i) => (
              <StoryCard key={s.id} story={s} index={i} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
