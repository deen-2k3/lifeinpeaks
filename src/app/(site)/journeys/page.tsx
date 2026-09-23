import type { Metadata } from "next";
import { TripGrid } from "@/components/TripCard";
import { EmptyState, PageIntro, TextLink } from "@/components/ui";
import { getTrips } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Journeys",
  description: "Travel journeys through the Himalaya and across India — Himachal, Uttarakhand, Ladakh, Sikkim and more, told in photographs and stories.",
  alternates: { canonical: "/journeys" },
};

export default async function JourneysPage() {
  const trips = await getTrips();
  return (
    <>
      <PageIntro eyebrow={`${trips.length} journeys`} title="Journeys">
        Every trip starts as a vague idea and a full tank. These are the ones that turned into something more.
        <div className="mt-6">
          <TextLink href="/timeline">See them on a timeline</TextLink>
        </div>
      </PageIntro>
      <section className="container-page pb-32">
        {trips.length ? <TripGrid trips={trips} featuredFirst /> : <EmptyState>No journeys yet — the first one is being planned.</EmptyState>}
      </section>
    </>
  );
}
