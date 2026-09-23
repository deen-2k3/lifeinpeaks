import Link from "next/link";
import type { TripCardData } from "@/lib/queries";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";
import { ArrowRight, PinIcon } from "./icons";

export function DestinationCard({ trip, index = 0 }: { trip: TripCardData; index?: number }) {
  return (
    <Reveal delay={index * 0.08} className="min-w-0">
      <Link
        href={`/trips/${trip.slug}`}
        className="group block overflow-hidden rounded-md bg-snow shadow-[0_18px_40px_-28px_rgba(23,34,29,.55)] ring-1 ring-line/5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_50px_-26px_rgba(23,34,29,.6)]"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ash">
          {trip.coverImage && (
            <Picture
              image={trip.coverImage}
              alt={`${trip.title}, ${trip.region}`}
              fill
              sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
              imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
            />
          )}
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <PinIcon width={20} height={20} className="shrink-0 fill-forest text-forest [&>circle]:fill-snow" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[0.98rem] font-semibold text-mist">{trip.title}</h3>
            <p className="truncate text-[0.8rem] text-fog">{trip.tagline ?? trip.region}</p>
          </div>
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-forest text-snow transition group-hover:bg-cta">
            <ArrowRight width={16} height={16} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}
