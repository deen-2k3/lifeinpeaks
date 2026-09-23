"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PhotoDTO } from "@/lib/queries";
import { orientation } from "@/lib/images";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";
import { Picture } from "./Picture";
import { PhotoLightbox } from "./PhotoLightbox";
import { HeartIcon } from "./icons";

type Props = {
  initial: PhotoDTO[];
  nextCursor?: string | null;
  /** Query string for /api/photos used to fetch further pages, e.g. "group=MOUNTAIN&category=snow" */
  query?: string;
  emptyText?: string;
};

/**
 * Justified photo gallery: every photo keeps its original aspect ratio (landscape,
 * portrait, square, panorama). Loads further pages on scroll and opens a lightbox.
 */
export function PhotoGallery({ initial, nextCursor = null, query = "", emptyText = "No photographs here yet." }: Props) {
  const [photos, setPhotos] = useState(initial);
  const [cursor, setCursor] = useState(nextCursor);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const { has, toggle } = useFavorites();

  // Reset when the server sends a different set (e.g. category filter changed).
  useEffect(() => {
    setPhotos(initial);
    setCursor(nextCursor);
  }, [initial, nextCursor]);

  const loadMore = useCallback(async () => {
    if (!cursor || loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/photos?${query}${query ? "&" : ""}cursor=${cursor}`);
      if (!res.ok) throw new Error();
      const data: { items: PhotoDTO[]; nextCursor: string | null } = await res.json();
      setPhotos((p) => [...p, ...data.items.filter((n) => !p.some((x) => x.id === n.id))]);
      setCursor(data.nextCursor);
    } catch {
      /* keep the button visible for a manual retry */
    } finally {
      setLoading(false);
    }
  }, [cursor, loading, query]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el || !cursor) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [cursor, loadMore]);

  if (!photos.length) return <p className="py-16 text-center text-stone">{emptyText}</p>;

  return (
    <>
      <div className="justified">
        {photos.map((p, i) => {
          const ar = p.image.width / p.image.height;
          const fav = has(p.id);
          return (
            <div key={p.id} className="j-item group" style={{ "--ar": ar } as React.CSSProperties} data-pano={orientation(p.image) === "panorama"}>
              <span className="j-ratio" />
              <button
                type="button"
                onClick={() => setActive(i)}
                className="absolute inset-0 overflow-hidden rounded-[2px] bg-ash focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sand"
                aria-label={`Open ${p.title ?? "photo"}${p.location ? `, ${p.location}` : ""}`}
              >
                <Picture
                  image={p.image}
                  alt={p.alt}
                  fill
                  sizes={ar >= 2 ? "(min-width: 1024px) 70vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 60vw"}
                  imgClassName="transition-transform duration-[1.4s] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.04]"
                />
                <span className="surface-dark pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-left opacity-0 transition duration-500 group-hover:opacity-100">
                  {p.title && <span className="block font-display text-lg leading-tight text-mist">{p.title}</span>}
                  {p.location && <span className="mt-0.5 block text-[0.65rem] uppercase tracking-[0.2em] text-fog">{p.location}</span>}
                </span>
              </button>
              <button
                type="button"
                onClick={() => toggle(p.id)}
                className={cn(
                  "surface-dark absolute right-2 top-2 grid size-10 place-items-center rounded-full bg-black/35 backdrop-blur transition duration-300",
                  fav ? "text-ember opacity-100" : "text-mist opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100",
                )}
                aria-label={fav ? "Remove from favourites" : "Add to favourites"}
                aria-pressed={fav}
              >
                <HeartIcon filled={fav} width={18} height={18} />
              </button>
            </div>
          );
        })}
      </div>

      <div ref={sentinel} className="flex justify-center pt-12">
        {cursor && (
          <button onClick={loadMore} disabled={loading} className="min-h-12 rounded-full border border-line/15 px-8 text-xs uppercase tracking-[0.2em] text-fog transition hover:border-sand hover:text-mist disabled:opacity-50">
            {loading ? "Loading…" : "Load more photographs"}
          </button>
        )}
      </div>

      <PhotoLightbox photos={photos} index={active} onChange={setActive} onNearEnd={cursor ? loadMore : undefined} />
    </>
  );
}
