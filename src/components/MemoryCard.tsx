import Link from "next/link";
import type { MemoryData } from "@/lib/queries";
import { cn, formatDate } from "@/lib/utils";
import { Picture } from "./Picture";
import { Reveal } from "./Reveal";

// Small, deterministic tilt so the album feels hand-arranged (same on server and client).
const tilts = ["-rotate-[1.4deg]", "rotate-[1deg]", "-rotate-[0.6deg]", "rotate-[1.6deg]", "rotate-[0.4deg]", "-rotate-[1.2deg]"];

export function MemoryCard({ memory, index = 0 }: { memory: MemoryData; index?: number }) {
  return (
    <Reveal delay={(index % 4) * 0.06} className="mb-8 break-inside-avoid">
      <figure className={cn("group bg-white p-3 pb-5 text-charcoal ring-1 ring-charcoal/5 shadow-[0_24px_50px_-24px_rgba(11,29,38,.45)] transition duration-700 hover:rotate-0 hover:scale-[1.02] sm:p-4 sm:pb-6", tilts[index % tilts.length])}>
        <div className="overflow-hidden">
          <Picture image={memory.image} alt={memory.title ?? memory.caption} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw" />
        </div>
        <figcaption className="px-1 pt-4">
          <p className="font-display text-[1.35rem] italic leading-snug text-charcoal/90">“{memory.caption}”</p>
          <p className="mt-3 flex flex-wrap gap-x-3 text-[0.68rem] uppercase tracking-[0.2em] text-charcoal/60">
            {memory.location && <span>{memory.location}</span>}
            {memory.date && <span>{formatDate(memory.date)}</span>}
          </p>
          {memory.trip && (
            <Link href={`/trips/${memory.trip.slug}`} className="mt-2 inline-block text-xs text-olive underline decoration-charcoal/20 underline-offset-4 hover:decoration-charcoal">
              From {memory.trip.title}
            </Link>
          )}
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function MemoryAlbum({ memories }: { memories: MemoryData[] }) {
  return (
    <div className="columns-1 gap-8 sm:columns-2 lg:columns-3">
      {memories.map((m, i) => (
        <MemoryCard key={m.id} memory={m} index={i} />
      ))}
    </div>
  );
}
