import type { Metadata } from "next";
import { Timeline } from "@/components/Timeline";
import { EmptyState, PageIntro } from "@/components/ui";
import { getTrips } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Travel Timeline",
  description: "Year by year, every journey — a visual timeline of mountain trips and travels across India.",
  alternates: { canonical: "/timeline" },
};

export default async function TimelinePage() {
  const trips = await getTrips();
  return (
    <>
      <PageIntro eyebrow="Year by year" title="Timeline">
        Looking back is half the fun of going.
      </PageIntro>
      <section className="container-page pb-24">{trips.length ? <Timeline trips={trips} /> : <EmptyState>No journeys yet.</EmptyState>}</section>
    </>
  );
}
