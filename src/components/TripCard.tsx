import Link from "next/link";
import type { TripCardData } from "@/lib/queries";
import { cn, formatMonthYear, plural } from "@/lib/utils";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";

export function TripCard({ trip, size = "normal", index = 0 }: { trip: TripCardData; size?: "large" | "normal"; index?: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08} className="h-full">
      <Link href={`/trips/${trip.slug}`} className="surface-dark group relative block h-full overflow-hidden rounded-sm bg-ash">
        <div className={cn("relative", size === "large" ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[4/5]")}>
          {trip.coverImage && (
            <Picture
              image={trip.coverImage}
              alt={`${trip.title}, ${trip.region}`}
              fill
              sizes={size === "large" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
              imgClassName="transition-transform duration-[1.6s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent transition-opacity duration-700 group-hover:from-black/90" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <div className="flex items-center gap-3 text-[0.68rem] uppercase tracking-[0.24em] text-fog">
              <span>{trip.region}</span>
              <span className="h-px w-6 bg-line/30" />
              <span>{formatMonthYear(trip.startDate)}</span>
            </div>
            <h3 className={cn("mt-3 font-display font-medium leading-none text-mist", size === "large" ? "text-5xl sm:text-6xl" : "text-4xl")}>{trip.title}</h3>
            {trip.tagline && <p className="mt-3 max-w-md font-display text-lg italic text-mist/80">“{trip.tagline}”</p>}
            <div className="mt-5 grid grid-rows-[0fr] transition-all duration-700 group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                {trip.excerpt && <p className="max-w-md pb-4 text-sm leading-relaxed text-fog">{trip.excerpt}</p>}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-fog">
              <span>{plural(trip._count.photos, "photo")}</span>
              <span className="uppercase tracking-[0.2em] text-sand opacity-0 transition duration-500 group-hover:opacity-100">Open journey →</span>
            </div>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export function TripGrid({ trips, featuredFirst }: { trips: TripCardData[]; featuredFirst?: boolean }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
      {trips.map((t, i) => (
        <div key={t.id} className={cn(featuredFirst && i === 0 && "sm:col-span-2 lg:row-span-1")}>
          <TripCard trip={t} index={i} size={featuredFirst && i === 0 ? "large" : "normal"} />
        </div>
      ))}
    </div>
  );
}
