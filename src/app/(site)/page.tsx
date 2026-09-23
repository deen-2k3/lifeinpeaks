import { Reveal } from "@/components/Reveal";
import { MemoryAlbum } from "@/components/MemoryCard";
import { StoryCard } from "@/components/StoryCard";
import { TravelMap } from "@/components/TravelMap";
import { InstagramSection } from "@/components/InstagramSection";
import { Statistics } from "@/components/Statistics";
import { Picture } from "@/components/Picture";
import { DestinationCard } from "@/components/DestinationCard";
import { HomeHero } from "@/components/home/HomeHero";
import { FeatureStrip } from "@/components/home/FeatureStrip";
import { QuoteBand } from "@/components/home/QuoteBand";
import { FrameStrip } from "@/components/home/FrameStrip";
import { JsonLd, SectionHeading, TextLink } from "@/components/ui";
import { siteConfig } from "@/config/site";
import { getMemories, getPhotos, getStories, getTrips, toMapTrips } from "@/lib/queries";
import { getSettings, instagramUrl } from "@/lib/settings";
import { siteUrl } from "@/lib/utils";

export const revalidate = 300;

export default async function HomePage() {
  const [settings, featured, allTrips, frames, memories, stories] = await Promise.all([
    getSettings(),
    getTrips({ featured: true, take: 3 }),
    getTrips(),
    getPhotos({ take: 6, featured: true }),
    getMemories(6),
    getStories(3),
  ]);
  const destinations = featured.length ? featured : allTrips.slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: settings.siteName,
          url: siteUrl(),
          description: settings.seoDescription,
          potentialAction: { "@type": "SearchAction", target: `${siteUrl("/search")}?q={query}`, "query-input": "required name=query" },
          sameAs: [instagramUrl(settings.instagramUsername), settings.facebookUrl, settings.youtubeUrl, settings.twitterUrl, settings.pinterestUrl].filter(Boolean),
        }}
      />

      {/* 1. Hero */}
      <HomeHero
        image={settings.heroImage}
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        text={settings.heroText}
        aside={settings.heroAside}
        pillars={siteConfig.pillars}
      />

      {/* 2. What this is about */}
      <FeatureStrip />

      {/* 3. Featured destinations */}
      {destinations.length > 0 && (
        <section className="bg-ink pb-24 pt-16 sm:pb-28 sm:pt-20" aria-labelledby="destinations">
          <div className="container-page">
            <SectionHeading eyebrow="Featured destinations" title={<span id="destinations">Places That Make You Feel Alive</span>} action={{ href: "/journeys", label: "View All Destinations" }} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
              {destinations.map((t, i) => (
                <DestinationCard key={t.id} trip={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Quote */}
      <QuoteBand quote={settings.quote} image={settings.quoteImage} signature={settings.siteName} />

      {/* 5. Stories in frames */}
      {frames.items.length > 0 && (
        <section className="bg-coal pb-20 pt-14 sm:pb-24 sm:pt-16" aria-labelledby="frames">
          <div className="container-page">
            <SectionHeading eyebrow="Moments from the trail" title={<span id="frames">Stories in Frames</span>} action={{ href: "/photography", label: "View Gallery" }} />
            <FrameStrip photos={frames.items} />
          </div>
        </section>
      )}

      {/* 6. Little moments */}
      {memories.length > 0 && (
        <section className="bg-ink py-24 sm:py-28" aria-labelledby="moments">
          <div className="container-page">
            <SectionHeading eyebrow="The in-between" title={<span id="moments">Little Moments</span>} action={{ href: "/memories", label: "Open the Album" }}>
              Not every photograph needs to be perfect. Some just need to remember.
            </SectionHeading>
            <MemoryAlbum memories={memories} />
          </div>
        </section>
      )}

      {/* 7. Travel map */}
      {allTrips.length > 0 && (
        <section className="bg-coal py-24 sm:py-28" aria-labelledby="map">
          <div className="container-page">
            <SectionHeading eyebrow="Where I've been" title={<span id="map">The Map So Far</span>} action={{ href: "/map", label: "Explore the Map" }} />
            <Reveal>
              <TravelMap trips={toMapTrips(allTrips)} compact />
            </Reveal>
          </div>
        </section>
      )}

      {/* 8. Stories */}
      {stories.length > 0 && (
        <section className="bg-ink py-24 sm:py-28" aria-labelledby="stories">
          <div className="container-page">
            <SectionHeading eyebrow="Journal" title={<span id="stories">Stories From The Road</span>} action={{ href: "/stories", label: "Read All Stories" }} />
            <div className="grid gap-12 md:grid-cols-3 md:gap-8">
              {stories.map((s, i) => (
                <StoryCard key={s.id} story={s} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 9. Instagram */}
      <div className="bg-coal">
        <InstagramSection username={settings.instagramUsername} />
      </div>

      {/* 10. About */}
      <section className="bg-ink py-24 sm:py-28" aria-labelledby="about">
        <div className="container-page grid items-center gap-12 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-ash">
              {settings.profileImage && <Picture image={settings.profileImage} alt={`Portrait of ${settings.ownerName || "the photographer"}`} fill sizes="(min-width: 768px) 40vw, 100vw" />}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[0.7rem] uppercase tracking-[0.42em] text-mist/70">About the photographer</p>
            <h2 id="about" className="mt-4 font-display text-[clamp(2.2rem,4.6vw,3.6rem)] font-semibold leading-[1.05] text-heading">{settings.aboutHeading}</h2>
            <p className="mt-6 font-display text-2xl italic leading-snug text-fog">“{settings.aboutIntro}”</p>
            {settings.intro && (
              <div className="mt-6 space-y-3 leading-relaxed text-fog">
                {settings.intro.split(/\n+/).filter(Boolean).map((l, i) => (
                  <p key={i}>{l}</p>
                ))}
              </div>
            )}
            <div className="mt-10">
              <Statistics stats={settings.stats} />
            </div>
            <TextLink href="/about" className="mt-10">More about me</TextLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
