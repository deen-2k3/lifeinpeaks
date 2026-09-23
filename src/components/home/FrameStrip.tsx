"use client";

import { useState } from "react";
import type { PhotoDTO } from "@/lib/queries";
import { Picture } from "../Picture";
import { PhotoLightbox } from "../PhotoLightbox";

/** "Stories in Frames" – a row of photographs that open in the lightbox. */
export function FrameStrip({ photos }: { photos: PhotoDTO[] }) {
  const [active, setActive] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {photos.map((p, i) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="group relative block aspect-[1/1] w-full overflow-hidden rounded-md bg-ash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              aria-label={`Open ${p.title ?? "photo"}`}
            >
              <Picture image={p.image} alt={p.alt} fill sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw" imgClassName="transition-transform duration-[1.2s] group-hover:scale-[1.07]" />
            </button>
          </li>
        ))}
      </ul>
      <PhotoLightbox photos={photos} index={active} onChange={setActive} />
    </>
  );
}
