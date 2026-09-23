"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, LazyMotion, domAnimation, m, type PanInfo } from "framer-motion";
import { imageUrl } from "@/lib/images";
import type { PhotoDTO } from "@/lib/queries";
import { useFavorites } from "@/lib/favorites";
import { cn, formatDate } from "@/lib/utils";
import { Picture } from "./Picture";
import { CalendarIcon, CameraIcon, ChevronLeft, ChevronRight, CloseIcon, HeartIcon, InfoIcon, PinIcon } from "./icons";

type Props = {
  photos: PhotoDTO[];
  index: number | null;
  onChange: (i: number | null) => void;
  /** Called when the viewer nears the end so the gallery can fetch more. */
  onNearEnd?: () => void;
};

export function PhotoLightbox({ photos, index, onChange, onNearEnd }: Props) {
  const open = index !== null && !!photos[index];
  const photo = open ? photos[index!] : null;
  const [dir, setDir] = useState(0);
  const [info, setInfo] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const { has, toggle } = useFavorites();

  const go = useCallback(
    (d: number) => {
      if (index === null) return;
      const next = index + d;
      if (next < 0 || next >= photos.length) return;
      setDir(d);
      onChange(next);
    },
    [index, photos.length, onChange],
  );
  const close = useCallback(() => onChange(null), [onChange]);

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key.toLowerCase() === "i") setInfo((v) => !v);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      prevFocus?.focus?.();
    };
  }, [open, go, close]);

  // Preload neighbours for instant next/previous.
  useEffect(() => {
    if (index === null) return;
    const w = typeof window !== "undefined" ? Math.min(2400, window.innerWidth * (window.devicePixelRatio || 1)) : 1600;
    [index + 1, index - 1].forEach((i) => {
      const p = photos[i];
      if (p) new window.Image().src = imageUrl(p.image, w, "webp");
    });
    if (index >= photos.length - 3) onNearEnd?.();
  }, [index, photos, onNearEnd]);

  function onDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x < -70 || info.velocity.x < -400) go(1);
    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1);
    else if (info.offset.y > 120) close();
  }

  const exif = photo ? [photo.camera, photo.lens, photo.focalLength, photo.aperture, photo.shutterSpeed, photo.iso && `ISO ${photo.iso}`].filter(Boolean) : [];

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {open && photo && (
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label={photo.title ?? "Photo viewer"}
            className="surface-dark fixed inset-0 z-[75] flex flex-col bg-[#0c261d]/[.98] text-mist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-4 px-3 pt-[max(.5rem,env(safe-area-inset-top))] sm:px-6">
              <span className="text-xs tabular-nums tracking-[0.2em] text-stone">
                {index! + 1} / {photos.length}
              </span>
              <div className="flex items-center">
                <button onClick={() => toggle(photo.id)} className={cn("grid size-11 place-items-center rounded-full transition", has(photo.id) ? "text-ember" : "text-fog hover:text-mist")} aria-label={has(photo.id) ? "Remove from favourites" : "Add to favourites"} aria-pressed={has(photo.id)}>
                  <HeartIcon filled={has(photo.id)} />
                </button>
                <button onClick={() => setInfo((v) => !v)} className={cn("grid size-11 place-items-center rounded-full transition", info ? "text-sand" : "text-fog hover:text-mist")} aria-label="Photo details" aria-pressed={info}>
                  <InfoIcon />
                </button>
                <button ref={closeRef} onClick={close} className="grid size-11 place-items-center rounded-full text-fog hover:text-mist" aria-label="Close">
                  <CloseIcon />
                </button>
              </div>
            </div>

            <div className="relative flex min-h-0 flex-1">
              {/* Stage */}
              <div className="relative flex min-w-0 flex-1 items-center justify-center overflow-hidden">
                <AnimatePresence initial={false} custom={dir} mode="popLayout">
                  <m.div
                    key={photo.id}
                    custom={dir}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 60 }),
                      center: { opacity: 1, x: 0 },
                      exit: (d: number) => ({ opacity: 0, x: d * -60 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    drag
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.35}
                    onDragEnd={onDragEnd}
                    className="touch-none select-none"
                    style={{ width: `min(calc(100vw - 1rem), calc((100dvh - 11rem) * ${photo.image.width / photo.image.height}))` }}
                  >
                    <Picture image={photo.image} alt={photo.alt} priority sizes="100vw" imgClassName="pointer-events-none" />
                  </m.div>
                </AnimatePresence>

                {index! > 0 && (
                  <button onClick={() => go(-1)} className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-mist backdrop-blur transition hover:bg-black/60 sm:grid" aria-label="Previous photo">
                    <ChevronLeft />
                  </button>
                )}
                {index! < photos.length - 1 && (
                  <button onClick={() => go(1)} className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-mist backdrop-blur transition hover:bg-black/60 sm:grid" aria-label="Next photo">
                    <ChevronRight />
                  </button>
                )}
              </div>

              {/* Details panel */}
              <AnimatePresence>
                {info && (
                  <m.aside
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-x-0 bottom-0 z-10 max-h-[60%] overflow-y-auto rounded-t-2xl border-t border-line/10 bg-coal/95 p-6 backdrop-blur-lg md:static md:max-h-none md:w-80 md:rounded-none md:border-l md:border-t-0"
                  >
                    <h2 className="font-display text-3xl leading-tight">{photo.title ?? "Untitled"}</h2>
                    {photo.description && <p className="mt-3 leading-relaxed text-fog">{photo.description}</p>}
                    <dl className="mt-6 space-y-3 text-sm">
                      {photo.location && <Row icon={<PinIcon width={16} />} label="Location">{photo.location}</Row>}
                      {photo.takenAt && <Row icon={<CalendarIcon width={16} />} label="Date">{formatDate(photo.takenAt)}</Row>}
                      {exif.length > 0 && <Row icon={<CameraIcon width={16} />} label="Camera">{exif.join(" · ")}</Row>}
                    </dl>
                    {photo.categories.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {photo.categories.map((c) => (
                          <span key={c} className="rounded-full border border-line/10 px-3 py-1 text-xs text-fog">{c}</span>
                        ))}
                      </div>
                    )}
                    {photo.trip && (
                      <Link href={`/trips/${photo.trip.slug}`} onClick={close} className="mt-6 inline-block text-sm text-sand hover:underline">
                        From the journey: {photo.trip.title} →
                      </Link>
                    )}
                  </m.aside>
                )}
              </AnimatePresence>
            </div>

            {/* Caption */}
            <div className="flex min-h-20 flex-col items-center justify-center px-6 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 text-center">
              {photo.title && <p className="font-display text-xl italic">{photo.title}</p>}
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone">
                {[photo.location, photo.takenAt && formatDate(photo.takenAt)].filter(Boolean).join("  ·  ")}
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 text-stone" aria-hidden>{icon}</span>
      <div>
        <dt className="text-[0.65rem] uppercase tracking-[0.2em] text-stone">{label}</dt>
        <dd className="mt-0.5 text-mist/90">{children}</dd>
      </div>
    </div>
  );
}
