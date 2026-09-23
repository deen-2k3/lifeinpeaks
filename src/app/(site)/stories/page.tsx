import type { Metadata } from "next";
import { StoryCard } from "@/components/StoryCard";
import { EmptyState, PageIntro } from "@/components/ui";
import { getStories } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Stories From The Road — Travel Stories from India",
  description: "A mountain travel blog: travel stories from India and the Himalaya — Spiti roads, sunrises above the clouds and why the mountains keep calling.",
  alternates: { canonical: "/stories" },
};

export default async function StoriesPage() {
  const [first, ...rest] = await getStories();
  return (
    <>
      <PageIntro eyebrow="Journal" title="Stories From The Road">
        Longer notes, written somewhere between the trip and the next one.
      </PageIntro>
      <section className="container-page pb-32">
        {!first ? (
          <EmptyState>No stories yet.</EmptyState>
        ) : (
          <>
            <StoryCard story={first} layout="row" />
            <div className="mt-20 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((s, i) => (
                <StoryCard key={s.id} story={s} index={i} />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
