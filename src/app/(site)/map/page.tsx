import type { Metadata } from "next";
import { TravelMap } from "@/components/TravelMap";
import { PageIntro } from "@/components/ui";
import { getTrips, toMapTrips } from "@/lib/queries";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Travel Map",
  description: "An interactive map of every place I've travelled to and photographed across India — from Ladakh and Himachal to Sikkim, Meghalaya, Rajasthan and Goa.",
  alternates: { canonical: "/map" },
};

export default async function MapPage() {
  const trips = await getTrips();
  const mapTrips = toMapTrips(trips);
  const regions = new Set(trips.map((t) => t.region)).size;
  return (
    <>
      <PageIntro eyebrow={`${mapTrips.length} journeys · ${regions} regions`} title="The Map So Far">
        Tap a light to open the journey. The dotted line follows the order I travelled them in.
      </PageIntro>
      <section className="container-page pb-32">
        <TravelMap trips={mapTrips} />
      </section>
    </>
  );
}
