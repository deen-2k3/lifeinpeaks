"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { imageUrl, type ImageAsset } from "@/lib/images";
import { CloseIcon, SearchIcon } from "./icons";

type Hit = { href: string; title: string; kind: string; meta?: string; image?: ImageAsset | null };

const SUGGESTIONS = ["Ladakh", "Himachal", "Sunrise", "Snow", "Camping", "Lakes"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => input.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setHits([]);
      return;
    }
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`, { signal: ctrl.signal });
        if (res.ok) setHits((await res.json()).hits);
      } catch {
        /* aborted */
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim().length < 2) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            className="surface-dark fixed inset-0 z-[70] bg-ink/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          >
            <div className="container-page pt-[max(1.5rem,env(safe-area-inset-top))]" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-end">
                <button onClick={onClose} className="grid size-11 place-items-center rounded-full text-fog hover:text-mist" aria-label="Close search">
                  <CloseIcon />
                </button>
              </div>
              <form onSubmit={submit} className="mx-auto mt-6 max-w-3xl sm:mt-12">
                <label className="eyebrow" htmlFor="site-search">Search the journal</label>
                <div className="mt-4 flex items-center gap-3 border-b border-line/15 pb-3 focus-within:border-sand">
                  <SearchIcon className="shrink-0 text-stone" width={24} height={24} />
                  <input
                    ref={input}
                    id="site-search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Ladakh, sunrise, campfire…"
                    autoComplete="off"
                    className="w-full bg-transparent font-display text-3xl text-mist placeholder:text-stone/60 focus:outline-none sm:text-5xl"
                  />
                </div>
              </form>
              <div className="mx-auto mt-8 max-h-[65dvh] max-w-3xl overflow-y-auto pb-10 no-scrollbar">
                {q.trim().length < 2 ? (
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => setQ(s)} className="rounded-full border border-line/10 px-4 py-2 text-sm text-fog transition hover:border-sand hover:text-mist">
                        {s}
                      </button>
                    ))}
                  </div>
                ) : hits.length === 0 ? (
                  <p className="text-stone">{loading ? "Searching…" : "Nothing found — try another place or feeling."}</p>
                ) : (
                  <ul className="divide-y divide-line/5">
                    {hits.map((h) => (
                      <li key={h.kind + h.href + h.title}>
                        <Link href={h.href} onClick={onClose} className="group flex items-center gap-4 py-3">
                          <span className="relative size-14 shrink-0 overflow-hidden rounded-sm bg-ash">
                            {h.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={imageUrl(h.image, 480)} alt="" className="size-full object-cover transition duration-500 group-hover:scale-110" loading="lazy" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="eyebrow block !text-[0.62rem]">{h.kind}</span>
                            <span className="block truncate font-display text-xl text-mist group-hover:text-sand">{h.title}</span>
                            {h.meta && <span className="block truncate text-sm text-stone">{h.meta}</span>}
                          </span>
                        </Link>
                      </li>
                    ))}
                    <li className="pt-5">
                      <button onClick={submit} className="text-sm text-sand hover:underline">See all results for “{q.trim()}” →</button>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
