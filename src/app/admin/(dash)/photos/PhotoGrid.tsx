"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { imageUrl, type ImageAsset } from "@/lib/images";
import { bulkPhotos } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type Row = { id: string; title: string | null; location: string | null; published: boolean; featured: boolean; trip: string | null; image: ImageAsset };

export function PhotoGrid({ photos, trips, categories }: { photos: Row[]; trips: { id: string; title: string }[]; categories: { id: string; name: string; group: string }[] }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [op, setOp] = useState("");
  const [state, action, pending] = useActionState(bulkPhotos, {});
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  const ctl = "rounded-sm border border-line/10 bg-coal px-3 py-2 text-sm";

  return (
    <form
      action={(fd) => {
        if (op === "delete" && !confirm(`Permanently delete ${selected.length} photo(s) and their files?`)) return;
        action(fd);
        setSelected([]);
      }}
    >
      {selected.map((id) => <input key={id} type="hidden" name="ids" value={id} />)}
      <div className={cn("sticky top-0 z-10 my-6 flex flex-wrap items-center gap-3 border-y border-line/5 bg-ink/95 py-3 backdrop-blur", !selected.length && "opacity-60")}>
        <span className="text-sm text-fog">{selected.length} selected</span>
        <button type="button" className="text-xs text-stone hover:text-mist" onClick={() => setSelected(selected.length === photos.length ? [] : photos.map((p) => p.id))}>
          {selected.length === photos.length ? "Select none" : "Select all"}
        </button>
        <select name="op" value={op} onChange={(e) => setOp(e.target.value)} className={ctl}>
          <option value="">Bulk action…</option>
          <option value="trip">Assign to trip</option>
          <option value="category">Add category</option>
          <option value="location">Set location</option>
          <option value="feature">Mark featured</option>
          <option value="unfeature">Unmark featured</option>
          <option value="publish">Publish</option>
          <option value="unpublish">Unpublish</option>
          <option value="delete">Delete</option>
        </select>
        {op === "trip" && (
          <select name="tripId" className={ctl}>
            <option value="">— No trip —</option>
            {trips.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        )}
        {op === "category" && (
          <select name="categoryId" className={ctl}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.group === "MOUNTAIN" ? "Mountains › " : ""}{c.name}</option>)}
          </select>
        )}
        {op === "location" && <input name="location" placeholder="e.g. Spiti Valley, Himachal" className={ctl} />}
        <button disabled={!selected.length || !op || pending} className="rounded-full bg-mist px-4 py-2 text-sm text-ink disabled:opacity-40">{pending ? "Working…" : "Apply"}</button>
        {state.message && <span className={cn("text-sm", state.ok ? "text-pine" : "text-ember")}>{state.message}</span>}
      </div>

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {photos.map((p) => {
          const on = selected.includes(p.id);
          return (
            <li key={p.id} className={cn("group relative overflow-hidden rounded-sm border bg-coal", on ? "border-sand" : "border-line/5")}>
              <Link href={`/admin/photos/${p.id}`} className="block aspect-square overflow-hidden bg-ash">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl(p.image, 480)} alt={p.title ?? ""} loading="lazy" className="size-full object-cover transition group-hover:scale-105" />
              </Link>
              <label className="absolute left-2 top-2 grid size-7 cursor-pointer place-items-center rounded bg-black/60">
                <input type="checkbox" checked={on} onChange={() => toggle(p.id)} className="size-4 accent-[#dcc7a6]" aria-label="Select photo" />
              </label>
              <div className="p-2 text-xs">
                <p className="truncate text-mist">{p.title ?? <span className="text-stone">Untitled</span>}</p>
                <p className="truncate text-stone">{p.trip ?? "—"}{!p.published && " · draft"}{p.featured && " · ★"}</p>
              </div>
            </li>
          );
        })}
      </ul>
      {!photos.length && <p className="mt-6 text-stone">No photos match.</p>}
    </form>
  );
}
