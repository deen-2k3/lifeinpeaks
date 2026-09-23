import type { Metadata } from "next";
import { Markdown } from "@/components/Markdown";
import { Picture } from "@/components/Picture";
import { Reveal } from "@/components/Reveal";
import { Statistics } from "@/components/Statistics";
import { ButtonLink, JsonLd } from "@/components/ui";
import { getSettings, instagramUrl } from "@/lib/settings";
import { absoluteImage } from "@/lib/seo";
import { siteUrl } from "@/lib/utils";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  return {
    title: "About — The person behind the lens",
    description: s.aboutIntro || `About the traveller and photographer behind ${s.siteName}.`,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  const s = await getSettings();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Person",
          name: s.ownerName || s.siteName,
          description: s.aboutIntro,
          image: absoluteImage(s.profileImage),
          url: siteUrl("/about"),
          jobTitle: "Travel & landscape photographer",
          sameAs: [instagramUrl(s.instagramUsername), s.facebookUrl, s.youtubeUrl].filter(Boolean),
        }}
      />
      <div className="surface-dark bg-ink">
      <section className="container-page grid gap-12 pb-24 pt-[calc(var(--header-h)+3rem)] md:grid-cols-[0.85fr_1.15fr] md:gap-20 md:pt-[calc(var(--header-h)+6rem)]">
        <div className="md:sticky md:top-28 md:self-start">
          <div className="rise relative aspect-[4/5] overflow-hidden rounded-sm bg-ash">
            {s.profileImage && <Picture image={s.profileImage} alt={`Portrait of ${s.ownerName || "the photographer"}`} fill priority sizes="(min-width: 768px) 40vw, 100vw" />}
          </div>
          {s.ownerName && <p className="mt-4 text-[0.68rem] uppercase tracking-[0.24em] text-stone">{s.ownerName}</p>}
        </div>
        <div>
          <p className="eyebrow rise">About me</p>
          <h1 className="rise mt-4 font-display text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[0.95]" style={{ animationDelay: "120ms" }}>
            {s.aboutHeading}
          </h1>
          {s.aboutIntro && (
            <p className="rise mt-8 font-display text-[clamp(1.5rem,3vw,2.2rem)] italic leading-snug text-mist/90" style={{ animationDelay: "240ms" }}>
              “{s.aboutIntro}”
            </p>
          )}
          <Reveal className="mt-14">
            <Statistics stats={s.stats} />
          </Reveal>
          {s.aboutBio && (
            <div className="mt-14">
              <Markdown>{s.aboutBio}</Markdown>
            </div>
          )}
          <div className="mt-14 flex flex-wrap gap-3">
            <ButtonLink href="/journeys">See the journeys</ButtonLink>
            <ButtonLink href="/contact" variant="ghost">Say hello</ButtonLink>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
