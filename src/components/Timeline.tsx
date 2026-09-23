import Link from "next/link";
import type { TripCardData } from "@/lib/queries";
import { formatMonthYear, plural, tripDays } from "@/lib/utils";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";

export function Timeline({ trips }: { trips: TripCardData[] }) {
  const years = new Map<number, TripCardData[]>();
  for (const t of [...trips].sort((a, b) => +b.startDate - +a.startDate)) {
    const y = t.startDate.getUTCFullYear();
    years.set(y, [...(years.get(y) ?? []), t]);
  }

  return (
    <div className="relative">
      <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-sand/60 via-line/10 to-transparent sm:left-1/2" aria-hidden />
      {[...years.entries()].map(([year, list]) => (
        <section key={year} className="relative pb-16" aria-labelledby={`y-${year}`}>
          <Reveal className="relative mb-10 flex items-center gap-4 pl-8 sm:justify-center sm:pl-0">
            <span className="absolute left-0 top-1/2 size-[15px] -translate-y-1/2 rounded-full border border-sand bg-ink sm:left-1/2 sm:-translate-x-1/2" />
            <h2 id={`y-${year}`} className="bg-ink px-4 font-display text-6xl text-mist sm:text-7xl">{year}</h2>
          </Reveal>
          <ol className="space-y-10">
            {list.map((t, i) => {
              const days = tripDays(t.startDate, t.endDate);
              const right = i % 2 === 1;
              return (
                <li key={t.id} className="relative pl-8 sm:grid sm:grid-cols-2 sm:gap-16 sm:pl-0">
                  <span className="absolute left-[4px] top-8 size-[7px] rounded-full bg-sand sm:left-1/2 sm:-translate-x-1/2" aria-hidden />
                  <Reveal className={right ? "sm:col-start-2" : "sm:text-right"}>
                    <Link href={`/trips/${t.slug}`} className="group block">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-ash">
                        {t.coverImage && (
                          <Picture image={t.coverImage} alt={t.title} fill sizes="(min-width: 640px) 45vw, 90vw" imgClassName="transition-transform duration-[1.4s] group-hover:scale-105" />
                        )}
                      </div>
                      <p className="mt-4 text-[0.68rem] uppercase tracking-[0.22em] text-stone">
                        {formatMonthYear(t.startDate)}{days ? ` · ${plural(days, "day")}` : ""} · {plural(t._count.photos, "photo")}
                      </p>
                      <h3 className="mt-1 font-display text-4xl text-mist transition group-hover:text-sand">{t.title}</h3>
                      {t.tagline && <p className="mt-1 font-display text-lg italic text-fog">{t.tagline}</p>}
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
