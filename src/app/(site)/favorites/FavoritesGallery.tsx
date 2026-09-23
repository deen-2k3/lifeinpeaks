"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PhotoGallery } from "@/components/PhotoGallery";
import { useFavorites } from "@/lib/favorites";
import type { PhotoDTO } from "@/lib/queries";

export function FavoritesGallery() {
  const { ids, clear } = useFavorites();
  const [photos, setPhotos] = useState<PhotoDTO[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    if (!key) {
      setPhotos([]);
      return;
    }
    const ctrl = new AbortController();
    fetch(`/api/photos?ids=${key}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d: { items: PhotoDTO[] }) => {
        const order = key.split(",");
        setPhotos(d.items.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, [key]);

  if (photos === null) return <p className="py-16 text-center text-stone">Loading your favourites…</p>;
  if (!photos.length)
    return (
      <div className="py-16 text-center">
        <p className="text-fog">You haven't saved any photographs yet.</p>
        <Link href="/photography" className="mt-4 inline-block text-sm uppercase tracking-[0.18em] text-sand hover:underline">Browse the portfolio →</Link>
      </div>
    );

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button onClick={() => confirm("Remove all favourites?") && clear()} className="text-xs uppercase tracking-[0.18em] text-stone hover:text-ember">Clear all</button>
      </div>
      <PhotoGallery initial={photos} />
    </>
  );
}
